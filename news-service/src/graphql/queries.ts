import { CryptoNews } from "../models/crypto-news";
import { CryptoNewsInfo } from "../models/crypto-news-info";
import { getCryptoNewsByCryptocurrencyId } from "../services/news-service";
import { getCryptoNewsInfoForCryptocurrency } from "../services/news-service";

const queries = {
    cryptoNews: async (args: { cryptocurrencyId: string, limit?: number, offset?: number }, context: any ): Promise<CryptoNews[]> => {
        return await getCryptoNewsByCryptocurrencyId(args.cryptocurrencyId, args.limit, args.offset);
    },

    cryptoNewsInfo: async (args: { cryptocurrencyId: string }, context: any): Promise<CryptoNewsInfo> => {
        return await getCryptoNewsInfoForCryptocurrency(args.cryptocurrencyId);
    }

}

export default queries;