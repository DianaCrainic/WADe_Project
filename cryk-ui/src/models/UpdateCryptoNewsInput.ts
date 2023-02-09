export interface UpdateCryptoNewsInput {
  id: string;
  title?: string;
  body?: string;
  publishedAt: string;
  source?: string;
  about?: string[];
}
