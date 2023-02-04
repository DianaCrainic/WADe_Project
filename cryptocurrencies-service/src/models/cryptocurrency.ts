import { ProtectionScheme } from "./protection-scheme";
import { DistributionScheme } from "./distribution-scheme";
import { PriceData } from "./price-data";

export interface Cryptocurrency {
    id: string;
    symbol: string;
    description?: string;
    blockReward?: string;
    blockTime?: number;
    totalCoins?: string;
    source?: string;
    website?: string;
    dateFounded?: string;
    priceHistory?: PriceData[];
    protectionScheme?: ProtectionScheme;
    distributionScheme?: DistributionScheme;
}

export interface CreateCryptocurrencyInput {
    symbol: string;
    description?: string;
    blockReward?: string;
    blockTime?: number;
    totalCoins?: string;
    source?: string;
    website?: string;
    dateFounded?: string;
}

export interface UpdateCryptocurrencyInput {
    id: string;
    description?: string;
    blockReward?: string;
    blockTime?: number;
    totalCoins?: string;
    dateFounded?: string;
    source?: string;
    website?: string;
}

export interface CryptocurrenciesInfo {
    totalCount: number;
}