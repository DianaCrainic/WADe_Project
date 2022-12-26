import { ProtectionSchemeInput } from "./protection-scheme-input";
import { DistributionSchemeInput } from "./distribution-scheme-input";

export interface UpdateCryptocurrencyInput {
    id: string;
    description?: string;
    blockReward?: string;
    blockTime?: number;
    totalCoins?: string;
    source?: string;
    website?: string;
    protectionScheme?: ProtectionSchemeInput;
    distributionScheme?: DistributionSchemeInput;  
}