import { Component, OnInit, Output } from '@angular/core';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { subscribeToContracts } from './contractsServer';
import { subscribeToQuotes } from './quotesServer';
import type { ContractBook } from './types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Q-q!';
  columnDefs: ColDef[] = [
    { field: 'name' },
    {
      field: 'price',
      type: 'rightAligned',
    },
    { field: 'wma', type: 'rightAligned' },
  ];
  rowData = [{ name: 'ABC', price: 0, wma: 0 }];
  gridRef!: GridReadyEvent | null;
  @Output() onGridReady = (gridReadyEvent: any) =>
    (this.gridRef = gridReadyEvent);

  ngOnInit(): void {
    let cRef!: ContractBook;
    let cLengthRef!: number;
    cRef = {};
    cLengthRef = 0;
    this.gridRef = null;

    subscribeToContracts((contractsArr) => {
      contractsArr.forEach((c) => {
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
    });
    subscribeToQuotes((quotesArr) => {
      if (this.gridRef === null) return;

      quotesArr.forEach((q) => {
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
      this.gridRef.api.setRowData(
        Object.entries(cRef).map((c) => {
          return {
            name: c[1].n,
            price: c[1].cp.toFixed(4),
            wma:
              c[1].cp > 0
                ? ((c[1].wma.p * 100) / c[1].cp).toFixed(2) + '%'
                : '0',
          };
        })
      );
    });
  }
}
