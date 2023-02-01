export interface CreateCryptocurrencyInput {
    symbol: string;
    description?: string;
    blockReward?: string;
    totalCoins?: string;
    source?: string;
    website?: string;
}