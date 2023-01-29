import { createCryptoNews, getCryptoNewsByCryptocurrencyId, getCryptoNewsInfoForCryptocurrency, removeCryptoNewsById, updateCryptoNewsById } from "./services/news-service";

export const handler = async (event: any, context: any, callback: any) => {
    console.log("Received event {}", JSON.stringify(event, null, 2));

    switch (event.field) {
        case "cryptoNews":
            callback(null, await getCryptoNewsByCryptocurrencyId(event.arguments.cryptocurrencyId, event.arguments.limit, event.arguments.offset));
            break;
        case "cryptoNewsInfo":
            callback(null, await getCryptoNewsInfoForCryptocurrency(event.arguments.cryptocurrencyId));
            break;
        case "createCryptoNews":
            callback(null, await createCryptoNews(event.arguments.createCryptoNewsInput));
            break;
        case "updateCryptoNews":
            callback(null, await updateCryptoNewsById(event.arguments.updateCryptoNewsInput));
            break;
        case "removeCryptoNews":
            callback(null, await removeCryptoNewsById(event.arguments.id));
            break;
        default:
            callback(`Unknown field "${event.field}, unable to resolve`, null);
            break;
    }
}