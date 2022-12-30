import { Cryptocurrency } from "../models/cryptocurrency";
import { getCryptocurrencyById } from "../services/cryptocurrency-service";

const queries = {
    cryptocurrency: async (args: { id: string }, context: any): Promise<Cryptocurrency> => {
        return await getCryptocurrencyById(args.id);
    },

    cryptocurrencies: (args: { limit?: number, offset?: number }, context: any): Cryptocurrency[] => {
        return [];
    }
};

export default queries;