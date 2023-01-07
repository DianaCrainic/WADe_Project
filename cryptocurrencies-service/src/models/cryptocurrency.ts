import { ProtectionScheme } from "./protection-scheme";
import { DistributionScheme } from "./distribution-scheme";

export interface Cryptocurrency {
    id: string;
    symbol: string;
    description?: string;
    blockReward?: string;
    blockTime?: number;
    totalCoins?: string;
    source?: string;
    website?: string;
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
}

export interface UpdateCryptocurrencyInput {
    id: string;
    description?: string;
    blockReward?: string;
    blockTime?: number;
    totalCoins?: string;
    source?: string;
    website?: string;
}