import { buildSchema } from 'graphql';

const schema = buildSchema(`

    type CryptoNews {
        id: ID!
        title: String!
        body: String
        about: [ID!]!
    }

    type CryptoNewsInfo {
        totalCount: Int
    }

    input CreateCryptoNewsInput {
        title: String!
        body: String!
        about: [ID!]!
    }

    input UpdateCryptoNewsInput {
        id: ID!
        title: String
        body: String
        about: [ID!]
    }

    type Query {
        cryptoNews(cryptocurrencyId: ID!, limit: Int, offset: Int): [CryptoNews!]!
        cryptoNewsInfo(cryptocurrencyId: ID!): CryptoNewsInfo
    }

    type Mutation {
        createCryptoNews(createCryptoNewsInput: CreateCryptoNewsInput!): CryptoNews!
        updateCryptoNews(updateCryptoNewsInput: UpdateCryptoNewsInput!): CryptoNews!
        removeCryptoNews(id: ID!): CryptoNews!
    }
`);

export default schema;