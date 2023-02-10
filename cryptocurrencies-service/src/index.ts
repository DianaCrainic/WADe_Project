import { createCryptocurrency, getCryptocurrencies, getCryptocurrenciesInfo, getCryptocurrencyById, removeCryptocurrencyById, updateCryptocurrencyById } from "./services/cryptocurrency-service";

export const handler = async (event: any, context: any, callback: any) => {
    console.log("Received event {}", JSON.stringify(event, null, 2));

    switch (event.field) {
        case "cryptocurrency":
            callback(null, await getCryptocurrencyById(event.arguments.id));
            break;
        case "cryptocurrencies":
            callback(null, await getCryptocurrencies(event.arguments.limit, event.arguments.offset, event.arguments.searchText, event.arguments.sortOrder));
            break;
        case "cryptocurrenciesInfo":
            callback(null, await getCryptocurrenciesInfo(event.arguments.searchText));
            break;
        case "createCryptocurrency":
            callback(null, await createCryptocurrency(event.arguments.createCryptocurrencyInput));
            break;
        case "updateCryptocurrency":
            callback(null, await updateCryptocurrencyById(event.arguments.updateCryptocurrencyInput));
            break;
        case "removeCryptocurrency":
            callback(null, await removeCryptocurrencyById(event.arguments.id))
            break;
        default:
            callback(`Unknown field "${event.field}, unable to resolve`, null);
            break;
    }
};