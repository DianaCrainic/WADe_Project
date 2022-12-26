import { Cryptocurrency } from "../models/cryptocurrency";
import { CreateCryptocurrencyInput } from "../models/create-cryptocurrency-input";
import { UpdateCryptocurrencyInput } from "../models/update-cryptocurrency-input";

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