export interface ConvertedCurrency {
    date: string,
    info: CurrencyInfo,
    query: Query,
    result: number,
    success: boolean,
}

export interface CurrencyInfo {
    rate: number,
    timestamp: number
}

export interface Query {
    amount: number,
    from: string,
    to: string
}