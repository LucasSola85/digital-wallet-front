export interface IWallet {
    _id:            string;
    number_wallet:  string;
    balance:       number;
    balance_crypto: number;
    transactions:  ITransaction[];
    owner:         IOwner;
    currency:      ICurrency;
    coin:          ICoin;
    created_at:     Date;
    updated_at:     Date;
    v:             number;
}

export interface ICoin {
    id:        string;
    name:      string;
    exchange:  number;
    currency:  string;
    status:    boolean;
    createAt:  Date;
    updatedAt: Date;
    v:         number;
}

export interface ICurrency {
    id:        string;
    currency:  string;
    symbol:    string;
    rate:      number;
    status:    boolean;
    createdAt: Date;
    updatedAt: Date;
    v:         number;
}

export interface IOwner {
    _id:       string;
    name:     string;
    lastname: string;
    email:    string;
    v:        number;
}

export interface ITransaction {
    _id:          string;
    wallet_id:    string;
    amount:      number;
    isCredit:    boolean;
    prev_balance: number;
    new_balance:  number;
    description: string;
    createdAt:   Date;
    updatedAt:   Date;
    v:           number;
}
