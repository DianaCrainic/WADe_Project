import { buildSchema } from 'graphql';

const schema = buildSchema(`
    type Cryptocurrency {
        id: ID!
    }

    type CryptoNews {
        id: ID!
        title: String!
        body: String
        about: [Cryptocurrency!]!
    }

    input CryptocurrencyInput {
        id: ID!
    }

    input CreateCryptoNewsInput {
        title: String!
        body: String!
        about: [CryptocurrencyInput!]!
    }

    input UpdateCryptoNewsInput {
        id: ID!
        title: String
        body: String
        about: [CryptocurrencyInput!]
    }

    type Query {
        cryptoNews(cryptocurrencyId: ID!): [CryptoNews!]!
    }

    type Mutation {
        createCryptoNews(createCryptoNewsInput: CreateCryptoNewsInput!): CryptoNews!
        updateCryptoNews(updateCryptoNewsInput: UpdateCryptoNewsInput!): CryptoNews!
        removeCryptoNews(id: ID!): CryptoNews!
    }
`);

export default schema;