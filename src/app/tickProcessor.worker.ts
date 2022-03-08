/** tickProcessor web-worker
 * Receive contracts from contractsServer, update ContractBook according received data (append/delete items).
 * Receive quotes from quotesServer, calculate each quote WMA current value and allocate it all in ContractBook object.
 * After processing every quotes parcel convert actual data to array and post it to AppComponent in high performance datagrid.

 * WMA = weighted moving average price for last 1000 values.
 */

import { Contract, ContractBook, Quote } from './types';
let quotesServer!: Worker;
let quotesArr!: any;
let contractsServer!: Worker;
let contractsArr!: any;

let cRef: ContractBook = {};

let cLengthRef!: number;
cLengthRef = 0;

if (typeof Worker !== 'undefined') {
  // contracts
  contractsServer = new Worker(
    new URL('./contractsServer.worker', import.meta.url)
  );
  contractsServer.onmessage = (evt: MessageEvent) => {
    contractsArr = evt.data;
    contractsArr.forEach((c: Contract) => {
      if ('removed' in c) {
        delete cRef[c.id];
        cLengthRef--;
      } else {
        if (!cRef[c.id]) {
          cRef[c.id] = {
            n: c.name,
            q: [{ p: 0, v: 0 }],
            pt: 0,
            cp: 0,
            wma: { p: 0, v: 0 },
          };
          cLengthRef++;
        }
      }
    });
  };
  contractsServer.onerror = (err) => {
    console.log(
      '! contractsServer Error ! ',
      `${err.filename}:${err.lineno} ${err.message}`
    );
  };

  // quotes
  quotesServer = new Worker(new URL('./quotesServer.worker', import.meta.url));
  quotesServer.onmessage = (evt: MessageEvent) => {
    quotesArr = evt.data;
    quotesArr.forEach((q: Quote) => {
      const i = q.contractId;
      if (!cRef[i]) return;

      const p = cRef[i].pt;
      let wmaV = 0;
      let wmaP = 0;
      if (p < 999) {
        wmaV =
          q.quote.v +
          cRef[i].wma.v -
          (!!cRef[i].q[p + 1] ? cRef[i].q[p + 1].v : 0);
        wmaP =
          (q.quote.p * q.quote.v +
            cRef[i].wma.p * cRef[i].wma.v -
            (!!cRef[i].q[p + 1]
              ? cRef[i].q[p + 1].p * cRef[i].q[p + 1].v
              : 0)) /
          wmaV;
        cRef[i].q[p + 1] = q.quote;
        cRef[i].pt++;
      } else {
        wmaV = q.quote.v + cRef[i].wma.v - cRef[i].q[0].v;
        wmaP =
          (q.quote.p * q.quote.v +
            cRef[i].wma.p * cRef[i].wma.v -
            cRef[i].q[0].p * cRef[i].q[0].v) /
          wmaV;
        cRef[i].q[0] = q.quote;
        cRef[i].pt = 0;
      }
      cRef[i].wma.p = wmaP;
      cRef[i].wma.v = wmaV;
      cRef[i].cp = q.quote.p;
    });
    // console.log('\n\ntick - cRef:', cRef);

    const cRow = Object.entries(cRef as ContractBook).map((c) => {
      return {
        name: c[1].n,
        price: c[1].cp.toFixed(4),
        wma:
          c[1].cp > 0 ? ((c[1].wma.p * 100) / c[1].cp).toFixed(2) + '%' : '0',
      };
    });
    // console.log('tick - cRow:', cRow);

    postMessage(cRow);
  };

  quotesServer.onerror = (err) => {
    console.log(
      '! quotesServer Error ! ',
      `${err.filename}:${err.lineno} ${err.message}`
    );
  };
}
