import { Cryptocurrency } from "../models/cryptocurrency";

const queries = {
    cryptocurrency: (id: string): Cryptocurrency => {
        throw new Error("Not yet implemented");
    },

    cryptocurrencies: (limit: number, offset: number): Cryptocurrency[] => {
        return [];
    }
};

export default queries;