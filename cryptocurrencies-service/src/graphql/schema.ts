import { buildSchema } from 'graphql';

const schema = buildSchema(`
    type ProtectionScheme {
        id: ID!
        description: String
    }

    type DistributionScheme {
        id: ID!
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

    input ProtectionSchemeInput {
        id: ID!
    }

    input DistributionSchemeInput {
        id: ID!
    }

    input CreateCryptocurrencyInput {
        id: ID!
        symbol: String!
        description: String
        blockReward: String
        blockTime: Int
        totalCoins: String
        source: String
        website: String
        protectionScheme: ProtectionSchemeInput
        distributionScheme: DistributionSchemeInput
    }

    input UpdateCryptoCurrencyInput {
        id: ID!
        description: String
        blockReward: String
        blockTime: Int
        totalCoins: String
        source: String
        website: String
        protectionScheme: ProtectionSchemeInput
        distributionScheme: DistributionSchemeInput
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