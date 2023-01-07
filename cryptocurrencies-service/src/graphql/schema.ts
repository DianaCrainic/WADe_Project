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
        source: String
        website: String
        protectionScheme: ProtectionScheme
        distributionScheme: DistributionScheme
    }

    input CreateCryptocurrencyInput {
        symbol: String!
        description: String
        blockReward: String
        blockTime: Int
        totalCoins: String
        source: String
        website: String
    }

    input UpdateCryptoCurrencyInput {
        id: ID!
        description: String
        blockReward: String
        blockTime: Int
        totalCoins: String
        source: String
        website: String
    }

    type Query {
        cryptocurrency(id: ID!): Cryptocurrency!
        cryptocurrencies(limit: Int, offset: Int): [Cryptocurrency!]!
    }
    
    type Mutation {
        createCryptocurrency(createCryptocurrencyInput: CreateCryptocurrencyInput!): Cryptocurrency!
        updateCryptoCurrency(updateCryptoCurrencyInput: UpdateCryptoCurrencyInput!): Cryptocurrency!
        removeCryptocurrency(id: ID!): Cryptocurrency!
    }
`);

export default schema;