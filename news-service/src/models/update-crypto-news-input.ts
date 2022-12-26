import { CryptocurrencyInput } from "./cryptocurrency-input";

export interface UpdateCryptoNewsInput {
    id: string;
    title?: string;
    body?: string;
    about?: CryptocurrencyInput[];
}