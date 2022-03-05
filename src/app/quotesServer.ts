/**
 * Emulates a websocket subscription, executes the callback in random intervals
 *  and feeds quotes data
 */
import type { QuoteList } from './types';

const maxContractsNumber = 10000; // max number of known Contracts
const parcelMaxQuotes = 1000; // max number of Quotes in one parcel, up to 10000+
const maxQuotesFlowDelay = 100; // max delay between QuotesParcels, ms

export function subscribeToQuotes(fn: (data: QuoteList) => void) {
  let delay;
  let timeoutId: NodeJS.Timeout;

  function handleTimeout() {
    delay = Math.random() * maxQuotesFlowDelay;
    const data = getRandomQuotes();
    fn(data);
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
