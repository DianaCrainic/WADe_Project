import { CreateCryptoNewsInput } from "../models/create-crypto-news-input";
import { CryptoNews } from "../models/crypto-news";
import { UpdateCryptoNewsInput } from "../models/update-crypto-news-input";
import { createCryptoNews, updateCryptoNewsById, removeCryptoNewsById } from "../services/news-service";

const mutations = {
    createCryptoNews: async ( args: { createCryptoNewsInput: CreateCryptoNewsInput}, context: any ): Promise<CryptoNews> => {
        return await createCryptoNews(args.createCryptoNewsInput);
    },

    updateCryptoNews: async (args: { updateCryptoNewsInput: UpdateCryptoNewsInput}, context: any ): Promise<CryptoNews> => {
        return await updateCryptoNewsById(args.updateCryptoNewsInput);
    },

    removeCryptoNews: async (args: {id: string}, context: any): Promise<CryptoNews> => {
        return await removeCryptoNewsById(args.id);
    }
};

export default mutations;