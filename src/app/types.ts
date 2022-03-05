export interface Contract {
  id: string;
  name: string;
}

export interface ContractToRemove {
  id: string;
  removed: true;
}

type ContractItem = Contract | ContractToRemove;

export type ContractList = ContractItem[];

export type Quote = {
  contractId: string;
  quote: {
    p: number; // price
    v: number; // volume
  };
};

export type QuoteList = Quote[];

export type ContractBook = {
  [i: string]: {
    n: string; //name
    q: { p: number; v: number }[]; //quote:{price,volume}
    pt: number; //pointer
    cp: number; //current price
    wma: { p: number; v: number }; //WMA:{price,volume} = Weighted Moving Average
  };
};
