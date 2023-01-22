import { buildSchema } from 'graphql';

const schema = buildSchema(`
    type ProtectionScheme {
        description: String
    }

    type DistributionScheme {
        description: String
    }

    type Cryptocurrency {
        id: ID!
        symbol: String!
        description: String
        blockReward: String
        blockTime: Int
        totalCoins: String
        dateFounded: String
        source: String
        website: String
        protectionScheme: ProtectionScheme
        distributionScheme: DistributionScheme
    }

    type CryptocurrenciesInfo {
        totalCount: Int
    }

    input CreateCryptocurrencyInput {
        symbol: String!
        description: String
        blockReward: String
        blockTime: Int
        totalCoins: String
        dateFounded: String
        source: String
        website: String
    }

    input UpdateCryptocurrencyInput {
        id: ID!
        description: String
        blockReward: String
        blockTime: Int
        totalCoins: String
        dateFounded: String
        source: String
        website: String
    }

    type Query {
        cryptocurrency(id: ID!): Cryptocurrency!
        cryptocurrencies(limit: Int, offset: Int): [Cryptocurrency!]!
        cryptocurrenciesInfo: CryptocurrenciesInfo
    }
    
    type Mutation {
        createCryptocurrency(createCryptocurrencyInput: CreateCryptocurrencyInput!): Cryptocurrency!
        updateCryptocurrency(updateCryptocurrencyInput: UpdateCryptocurrencyInput!): Cryptocurrency!
        removeCryptocurrency(id: ID!): Cryptocurrency!
    }
`);

export default schema;