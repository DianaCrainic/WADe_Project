import { Cryptocurrency } from "../models/cryptocurrency";
import { CreateCryptocurrencyInput, UpdateCryptocurrencyInput } from "../models/cryptocurrency";
import { removeCryptocurrencyById } from "../services/cryptocurrency-service";

const mutations = {
    createCryptocurrency: (createCryptocurrencyInput: CreateCryptocurrencyInput): Cryptocurrency => {
        throw new Error("Not yet implemented");
    },

    updateCryptocurrency: (updateCryptocurrencyInput: UpdateCryptocurrencyInput): Cryptocurrency => {
        throw new Error("Not yet implemented");
    },

    removeCryptocurrency: async (args: { id: string }, context: any): Promise<Cryptocurrency> => {
        return await removeCryptocurrencyById(args.id);
    }
};

export default mutations;