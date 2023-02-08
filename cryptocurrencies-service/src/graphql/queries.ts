import { Cryptocurrency, CryptocurrenciesInfo } from "../models/cryptocurrency";
import { getCryptocurrencyById, getCryptocurrencies, getCryptocurrenciesInfo } from "../services/cryptocurrency-service";

const queries = {
    cryptocurrency: async (args: { id: string }, context: any): Promise<Cryptocurrency> => {
        return await getCryptocurrencyById(args.id);
    },

    cryptocurrencies: async (args: { limit?: number, offset?: number, searchText?: string[] }, context: any): Promise<Cryptocurrency[]> => {
        return await getCryptocurrencies(args.limit, args.offset, args.searchText);
    },

    cryptocurrenciesInfo: async (args: { searchText?: string[] }, context: any): Promise<CryptocurrenciesInfo> => {
        return await getCryptocurrenciesInfo(args.searchText);
    }
};

export default queries;
