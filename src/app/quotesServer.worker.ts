/** quotesServer web-worker
 * Emulates a websocket subscription, executes the callback in random intervals
 *  and feeds quotes data
 */

import type { QuoteList } from './types';

const maxContractsNumber = 10; // max number of known Contracts
const parcelMaxQuotes = 10; // max number of Quotes in one parcel, up to 10000+
const maxQuotesFlowDelay = 100; // max delay between QuotesParcels, ms

sendQuotes();

export function sendQuotes() {
  let delay;
  let timeoutId: NodeJS.Timeout;

  function handleTimeout() {
    delay = Math.random() * maxQuotesFlowDelay;
    const data = getRandomQuotes();
    postMessage(data);
    timeoutId = setTimeout(handleTimeout, delay);
  }

  handleTimeout();

  return () => clearTimeout(timeoutId);
}

function getRandomQuotes(): QuoteList {
  const elementsCount = Math.ceil(Math.random() * parcelMaxQuotes);
  return new Array(elementsCount).fill(null).map(() => {
    const rnd = Math.ceil(Math.random() * maxContractsNumber).toString();
    let rndPrice =
      Number(rnd) +
      (Math.random() * maxContractsNumber) / 10 -
      maxContractsNumber / 20;
    if (rndPrice < 0) {
      rndPrice = 0;
    }
    return {
      contractId: `id-${rnd}`,
      quote: {
        p: rndPrice,
        v: Math.ceil(Math.random() * 10000),
      },
    };
  });
}
