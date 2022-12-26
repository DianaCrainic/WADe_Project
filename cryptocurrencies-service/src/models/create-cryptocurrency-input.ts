import { DistributionSchemeInput } from "./distribution-scheme-input";
import { ProtectionSchemeInput } from "./protection-scheme-input";

export interface CreateCryptocurrencyInput {
    id: string;
    symbol: string;
    description?: string;
    blockReward?: string;
    blockTime?: number;
    totalCoins?: string;
    source?: string;
    website?: string;
    protectionScheme?: ProtectionSchemeInput;
    distributionScheme?: DistributionSchemeInput;  
}