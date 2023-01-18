import { CryptoNews } from "../models/crypto-news";
import { getCryptoNewsByCryptocurrencyId } from "../services/news-service";

const queries = {
    cryptoNews: async (args: { cryptocurrencyId: string }, context: any ): Promise<CryptoNews[]> => {
        return await getCryptoNewsByCryptocurrencyId(args.cryptocurrencyId);
    }

}

export default queries;