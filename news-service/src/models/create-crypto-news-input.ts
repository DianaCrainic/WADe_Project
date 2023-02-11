export interface CreateCryptoNewsInput {
    title: string;
    body: string;
    publishedAt: string;
    source?: string;
    about: string[];
}