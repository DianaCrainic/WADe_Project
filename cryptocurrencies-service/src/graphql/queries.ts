import { Cryptocurrency } from "../models/cryptocurrency";
import { getCryptocurrencies, getCryptocurrencyById } from "../services/cryptocurrency-service";

const queries = {
    cryptocurrency: async (args: { id: string }, context: any): Promise<Cryptocurrency> => {
        return await getCryptocurrencyById(args.id);
    },

    cryptocurrencies: async (args: { limit?: number, offset?: number }, context: any): Promise<Cryptocurrency[]> => {
        return await getCryptocurrencies(args.limit, args.offset);
    }
};

export default queries;