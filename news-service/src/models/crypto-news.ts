import { Cryptocurrency } from "./cryptocurrency"

export interface CryptoNews {
    id: string;
    title: string;
    body?: string;
    about: Cryptocurrency[];
}