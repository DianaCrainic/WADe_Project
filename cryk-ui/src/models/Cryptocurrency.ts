export interface Cryptocurrency {
    id: number;
    symbol: string;
    description?: string;
    blockReward?: string;
    blockTime?: number;
    totalCoins?: string;
    source?: string;
    website?: string;
}