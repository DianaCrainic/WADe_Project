import { CryptoNews } from "../models/crypto-news";
import { getCryptoNewsByCryptocurrencyId, getAllCryptoNews, getCryptoNewsById } from "../services/news-service";

const queries = {
    cryptoNews: async (args: { cryptocurrencyId: string }, context: any ): Promise<CryptoNews[]> => {
        return await getCryptoNewsByCryptocurrencyId(args.cryptocurrencyId);
    },

    allCryptoNews: async (args: { limit?: number, offset?: number }, context: any): Promise<CryptoNews[]> => {
        return await getAllCryptoNews(args.limit, args.offset);
    },
    cryptoNewsById: async (args: { id: string }, context: any): Promise<CryptoNews> => {
        return await getCryptoNewsById(args.id);
    }
}

export default queries;