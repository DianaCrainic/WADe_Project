## GraphQL API usage scenarios

### Retrieve all details about a cryptocurrency with the given id

#### Query

```graphql
query GetAllDetailsAboutCryptocurrency($id: ID!) {
    cryptocurrency(id: $id) {
        id
        symbol
        description
        blockReward
        blockTime
        totalCoins
        dateFounded
        source
        website
        priceHistory {
            currency
            timestamp
            value
        }
        protectionScheme {
            description
        }
        distributionScheme {
            description
        }
    }
}
```

#### Variables

```json
{
    "id": "http://purl.org/net/bel-epa/doacc#D0016a183-ba27-4f55-bb91-25a81e70754f"
}
```

#### Result

```json
{
    "data": {
        "cryptocurrency": {
            "id": "http://purl.org/net/bel-epa/doacc#D0016a183-ba27-4f55-bb91-25a81e70754f",
            "symbol": "EDGE",
            "description": "EDGE: A I2P-Centric Gaming Crypto-Currency v.1.0",
            "blockReward": "100",
            "blockTime": 60,
            "totalCoins": "1000000",
            "dateFounded": "2015-06-07",
            "source": "https://github.com/EDGE-dev/EDGE",
            "website": null,
            "priceHistory": [
                {
                    "currency": "USD",
                    "timestamp": 1553299200000,
                    "value": 136.0995360201361
                },
                {
                    "currency": "USD",
                    "timestamp": 1553385600000,
                    "value": 137.19806866408575
                }
            ],
            "protectionScheme": {
                "description": "Interest"
            },
            "distributionScheme": {
                "description": "Dissemination via proof of work"
            }
        }
    }
}
```

### Retrieve some details about a cryptocurrency with the given id

#### Query

```graphql
query GetSomeDetailsAboutCryptocurrency($id: ID!) {
    cryptocurrency(id: $id) {
        symbol
        description
        dateFounded
        distributionScheme {
            description
        }
    }
}
```

#### Variables

```json
{
    "id": "http://purl.org/net/bel-epa/doacc#D0016a183-ba27-4f55-bb91-25a81e70754f"
}
```

#### Result

```json
{
    "data": {
        "cryptocurrency": {
            "symbol": "EDGE",
            "description": "EDGE: A I2P-Centric Gaming Crypto-Currency v.1.0",
            "dateFounded": "2015-06-07",
            "distributionScheme": {
                "description": "Dissemination via proof of work"
            }
        }
    }
}
```

### Retrieve cryptocurrencies in a paginated mode, with filtering (if existent) and ordering

#### Query

```graphql
# the first page of 10 cryptocurrencies is displayed by default
query GetPaginatedCryptocurrencies($limit: Int = 10, $offset: Int = 0, $searchText: [String], $sortOrder: String, $startDate: String, $endDate: String) {
    cryptocurrencies(limit: $limit, offset: $offset, searchText: $searchText, sortOrder: $sortOrder, startDate: $startDate, endDate: $endDate) {
        symbol
        description
        dateFounded
    }
}
```

#### Variables

```json
{
    "limit": 2,
    "offset": 2,
    "sortOrder": "DESC"
}
```

#### Result

```json
{
    "data": {
        "cryptocurrencies": [
            {
                "symbol": "FIX",
                "description": "block range coin rewards and 27 million total coins.",
                "dateFounded": "2015-06-07"
            },
            {
                "symbol": "ICE",
                "description": "DoA, relaunched by someone else and dead again.",
                "dateFounded": "2011-06-07"
            }
        ]
    }
}
```

### Retrieve additional information about cryptocurrencies (here the number of), based on existing (if any) filters

#### Query

```graphql
query GetNumberOfCryptocurrencies($searchText: [String], $startDate: String, $endDate: String) {
    cryptocurrenciesInfo(searchText: $searchText, startDate: $startDate, endDate: $endDate)
}
```

#### Variables

```json
{
    "searchText": [ "eth" ]
}
```

#### Result

```json
{
    "data": {
        "cryptocurrenciesInfo" : {
            "totalCount": 20
        }
    }
}
```

### Create a cryptocurrency

#### Mutation

```graphql
mutation CreateCryptocurrency($cryptocurrency: CreateCryptocurrencyInput!) {
    createCryptocurrency(createCryptocurrencyInput: $cryptocurrency) {
        id
        symbol
        description
    }
}
```

#### Variables

```json
{
    "cryptocurrency": {
        "symbol": "EDGE",
        "description": "EDGE: A I2P-Centric Gaming Crypto-Currency v.1.0"
    }
}
```

#### Result

```json
{
    "data": {
        "createCryptocurrency": {
            "id": "http://purl.org/net/bel-epa/doacc#D0016a183-ba27-4f55-bb91-25a81e70754f",
            "symbol": "EDGE",
            "description": "EDGE: A I2P-Centric Gaming Crypto-Currency v.1.0"
        }
    }
}
```

### Update an existing cryptocurrency

#### Mutation

```graphql
mutation UpdateCryptocurrency($cryptocurrency: UpdateCryptocurrencyInput!) {
    updateCryptocurrency(updateCryptocurrencyInput: $cryptocurrency) {
        id
        symbol
        description
    }
}
```

#### Variables

```json
{
    "cryptocurrency": {
        "id": "http://purl.org/net/bel-epa/doacc#D0016a183-ba27-4f55-bb91-25a81e70754f",
        "description": "New description"
    }
}
```

#### Result

```json
{
    "data": {
        "updateCryptocurrency": {
            "id": "http://purl.org/net/bel-epa/doacc#D0016a183-ba27-4f55-bb91-25a81e70754f",
            "symbol": "EDGE",
            "description": "New description"
        }
    }
}
```

### Remove an existing cryptocurrency

#### Mutation

```graphql
mutation RemoveCryptocurrency($id: ID!) {
    removeCryptocurrency(id: $id) {
        id
        symbol
    }
}
```

#### Variables

```json
{
    "id": "http://purl.org/net/bel-epa/doacc#D0016a183-ba27-4f55-bb91-25a81e70754f"
}
```

#### Result

```json
{
    "data": {
        "removeCryptocurrency": {
            "id": "http://purl.org/net/bel-epa/doacc#D0016a183-ba27-4f55-bb91-25a81e70754f",
            "symbol": "EDGE"
        }
    }
}
```

### Retrieve the news about a specific cryptocurrency, in a paginated manner

#### Query

```graphql
query GetNewsAboutCryptocurrency($id: ID!, $limit: Int, $offset: Int) {
    cryptoNews(cryptocurrencyId: $id, limit: $limit, offset: $offset) {
        id
        title
        body
        publishedAt
        source
        about
    }
}
```

#### Variables

```json
{
    "id": "http://purl.org/net/bel-epa/doacc#D0016a183-ba27-4f55-bb91-25a81e70754f",
    "limit": 2,
    "offset": 0
}
```

#### Result

```json
{
    "data": {
        "cryptoNews": [
            {
                "id": "http://schema.org/643f3c60-30ee-4cbc-ab75-dfd4a3467af5",
                "title": "Crypto news title",
                "body": "Crypto news body",
                "publishedAt": "2021-11-09T19:00:00Z",
                "source" : "https://a-beautiful-url.com",
                "about": [
                    "http://purl.org/net/bel-epa/doacc#D0016a183-ba27-4f55-bb91-25a81e70754f"
                ]
            },
            {
                "id": "http://schema.org/81f6ad2b-2363-4fae-bc26-c0af072de06f",
                "title": "Breaking news title",
                "body": "Breaking news body",
                "publishedAt": "2020-11-09T19:00:00Z",
                "source" : "https://a-beautiful-url.com",
                "about": [
                    "http://purl.org/net/bel-epa/doacc#D0016a183-ba27-4f55-bb91-25a81e70754f"
                ]
            }
        ]
    }
}
```

### Retrieve additional information about the news of a specific cryptocurrency (here the number of)

#### Query

```graphql
query GetNumberOfNewsForCryptocurrency($cryptocurrencyId: ID!) {
    cryptoNewsInfo(cryptocurrencyId: $cryptocurrencyId) {
        totalCount
    }
}
```

#### Variables

```json
{
    "id": "http://purl.org/net/bel-epa/doacc#D0016a183-ba27-4f55-bb91-25a81e70754f"
}
```

#### Result

```json
{
    "data": {
        "cryptoNewsInfo" : {
            "totalCount": 10
        }
    }
}
```

#### Create a piece of news

#### Mutation

```graphql
mutation CreateCryptoNews($cryptoNews: CreateCryptoNewsInput!) {
    createCryptoNews(createCryptoNewsInput: $cryptoNews) {
        id
        title
        body
        publishedAt
        source
        about
    }
}
```

#### Variables

```json
{
    "cryptoNews": {
        "title": "Crypto news title",
        "body": "Crypto news body",
        "publishedAt": "2020-11-09T19:00:00Z",
        "source" : "https://a-beautiful-url.com",
        "about": [
            "http://purl.org/net/bel-epa/doacc#D0016a183-ba27-4f55-bb91-25a81e70754f"
        ]
    }
}
```

#### Result

```json
{
    "data": {
        "createCryptoNews": {
            "id": "http://schema.org/643f3c60-30ee-4cbc-ab75-dfd4a3467af5",
            "title": "Crypto news title",
            "body": "Crypto news body",
            "publishedAt": "2020-11-09T19:00:00Z",
            "source" : "https://a-beautiful-url.com",
            "about": [
                "http://purl.org/net/bel-epa/doacc#D0016a183-ba27-4f55-bb91-25a81e70754f"
            ]
        }
    }
}
```

#### Update an existing piece of news

#### Mutation

```graphql
mutation UpdateCryptoNews($cryptoNews: UpdateCryptoNewsInput!) {
    updateCryptoNews(updateCryptoNewsInput: $cryptoNews) {
        id
        title
        body
        publishedAt
        source
        about
    }
}
```

#### Variables

```json
{
    "cryptoNews": {
        "id": "http://schema.org/643f3c60-30ee-4cbc-ab75-dfd4a3467af5",
        "title": "New title",
        "source" : "https://another-beautiful-url.com"
    }
}
```

#### Result

```json
{
    "data": {
        "updateCryptoNews": {
            "id": "http://schema.org/643f3c60-30ee-4cbc-ab75-dfd4a3467af5",
            "title": "New title",
            "body": "Crypto news body",
            "publishedAt": "2022-11-09T19:00:00Z", // new date & time
            "source" : "https://another-beautiful-url.com",
            "about": [
                "http://purl.org/net/bel-epa/doacc#D0016a183-ba27-4f55-bb91-25a81e70754f"
            ]
        }
    }
}
```

#### Remove an existing piece of news

#### Mutation

```graphql
mutation RemoveCryptoNews($id: ID!) {
    removeCryptoNews(id: $id) {
        id
    }
}
```

#### Variables

```json
{
    "id": "http://schema.org/643f3c60-30ee-4cbc-ab75-dfd4a3467af5"
}
```

#### Result

```json
{
    "data": {
        "removeCryptoNews": {
            "id": "http://schema.org/643f3c60-30ee-4cbc-ab75-dfd4a3467af5"
        }
    }
}
```
