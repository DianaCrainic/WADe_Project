import { DistributionScheme } from "./DistributionScheme";
import { ProtectionScheme } from "./ProtectionScheme";

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