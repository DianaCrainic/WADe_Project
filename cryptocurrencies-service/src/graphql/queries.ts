import { Cryptocurrency, CryptocurrenciesInfo } from "../models/cryptocurrency";
import { getCryptocurrencyById, getCryptocurrencies, getCryptocurrenciesInfo } from "../services/cryptocurrency-service";

const queries = {
    cryptocurrency: async (args: { id: string }, context: any): Promise<Cryptocurrency> => {
        return await getCryptocurrencyById(args.id);
    },

    cryptocurrencies: async (args: { limit?: number, offset?: number, searchText?: string[], sortOrder?: "DESC" | "ASC", startDate?: undefined | string, endDate?: undefined | string }, context: any): Promise<Cryptocurrency[]> => {
        return await getCryptocurrencies(args.limit, args.offset, args.searchText, args.sortOrder, args.startDate, args.endDate);
    },

    cryptocurrenciesInfo: async (args: { searchText?: string[], startDate?: undefined | string, endDate?: undefined | string }, context: any): Promise<CryptocurrenciesInfo> => {
        return await getCryptocurrenciesInfo(args.searchText, args.startDate, args.endDate);
    }
};

export default queries;
