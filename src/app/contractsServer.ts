/**
 * Emulates a websocket subscription, executes the callback in random intervals
 *  and feeds contracts data
 */
import type { Contract, ContractList, ContractToRemove } from './types';

const maxContractsNumber = 10000; // max number of known Contracts
const parcelMaxContracts = 1000; // max number of Contracts in one parcel, up to 10000+
const maxContractsFlowDelay = 2000; // max delay between ContractsParcels, ms

export function subscribeToContracts(fn: (data: ContractList) => void) {
  let delay: number;
  let timeoutId: NodeJS.Timeout;

  function handleTimeout() {
    delay = Math.random() * maxContractsFlowDelay;
    const data = getRandomContracts();
    fn(data);
    timeoutId = setTimeout(handleTimeout, delay);
  }

  handleTimeout();

  return () => clearTimeout(timeoutId);
}

function getRandomContracts(): ContractList {
  const elementsCount = Math.ceil(Math.random() * parcelMaxContracts);
  return new Array(elementsCount).fill(null).map(() => {
    const rnd = Math.ceil(Math.random() * maxContractsNumber).toString();
    const el: Contract = {
      id: `id-${rnd}`,
      name: 'i-' + rnd,
    };

    if (Math.random() < 0.1) (el as unknown as ContractToRemove).removed = true;

    return el;
  });
}
