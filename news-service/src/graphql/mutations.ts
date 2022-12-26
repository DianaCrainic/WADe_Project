import { CreateCryptoNewsInput } from "../models/create-crypto-news-input";
import { CryptoNews } from "../models/crypto-news";
import { UpdateCryptoNewsInput } from "../models/update-crypto-news-input";

const mutations = {
    createCryptoNews: (createCryptoNewsInput: CreateCryptoNewsInput): CryptoNews => {
        throw new Error("Not yet implemented");
    },

    updateCryptoNews: (updateCryptoNewsInput: UpdateCryptoNewsInput): CryptoNews => {
        throw new Error("Not yet implemented");
    },

    removeCryptoNews: (id: string): CryptoNews => {
        throw new Error("Not yet implemented");
    }
};

export default mutations;