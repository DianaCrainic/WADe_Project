import { Cryptocurrency } from "../models/cryptocurrency";
import { CreateCryptocurrencyInput, UpdateCryptocurrencyInput } from "../models/cryptocurrency";

const mutations = {
    createCryptocurrency: (createCryptocurrencyInput: CreateCryptocurrencyInput): Cryptocurrency => {
        throw new Error("Not yet implemented");
    },

    updateCryptocurrency: (updateCryptocurrencyInput: UpdateCryptocurrencyInput): Cryptocurrency => {
        throw new Error("Not yet implemented");
    },

    removeCryptocurrency: (id: string): Cryptocurrency => {
        throw new Error("Not yet implemented");
    }
};

export default mutations;