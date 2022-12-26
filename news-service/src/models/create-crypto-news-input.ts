import { CryptocurrencyInput } from "./cryptocurrency-input";

export interface CreateCryptoNewsInput {
    title: string;
    body: string;
    about: CryptocurrencyInput[];
}