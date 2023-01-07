import { Cryptocurrency } from "../models/cryptocurrency";
import { CreateCryptocurrencyInput, UpdateCryptocurrencyInput } from "../models/cryptocurrency";
import { createCryptocurrency, removeCryptocurrencyById, updateCryptocurrencyById } from "../services/cryptocurrency-service";

const mutations = {
    createCryptocurrency: async (args: { createCryptocurrencyInput: CreateCryptocurrencyInput }, context: any): Promise<Cryptocurrency> => {
        return await createCryptocurrency(args.createCryptocurrencyInput);
    },

    updateCryptocurrency: async (args: { updateCryptocurrencyInput: UpdateCryptocurrencyInput }, context: any): Promise<Cryptocurrency> => {
        return await updateCryptocurrencyById(args.updateCryptocurrencyInput);
    },

    removeCryptocurrency: async (args: { id: string }, context: any): Promise<Cryptocurrency> => {
        return await removeCryptocurrencyById(args.id);
    }
};

export default mutations;