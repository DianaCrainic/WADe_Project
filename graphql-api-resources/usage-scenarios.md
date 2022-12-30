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
        source
        website
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
    "id": "D0016a183-ba27-4f55-bb91-25a81e70754f"
}
```

#### Result

```json
{
    "data": {
        "cryptocurrency": {
            "id": "D0016a183-ba27-4f55-bb91-25a81e70754f",
            "symbol": "EDGE",
            "description": "EDGE: A I2P-Centric Gaming Crypto-Currency v.1.0",
            "blockReward": "100",
            "blockTime": 60,
            "totalCoins": "1000000",
            "source": "https://github.com/EDGE-dev/EDGE",
            "website": null,
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
        distributionScheme {
            description
        }
    }
}
```

#### Variables

```json
{
    "id": "D0016a183-ba27-4f55-bb91-25a81e70754f"
}
```

#### Result

```json
{
    "data": {
        "cryptocurrency": {
            "symbol": "EDGE",
            "description": "EDGE: A I2P-Centric Gaming Crypto-Currency v.1.0",
            "distributionScheme": {
                "description": "Dissemination via proof of work"
            }
        }
    }
}
```

### Retrieve cryptocurrencies in a paginated mode

#### Query

```graphql
# the first page of 10 cryptocurrencies is displayed by default
query GetPaginatedCryptocurrencies($limit: Int = 10, $offset: Int = 0) {
    cryptocurrencies(limit: $limit, offset: $offset) {
        symbol
        description
    }
}
```

#### Variables

```json
{
    "limit": 2,
    "offset": 2
}
```

#### Result

```json
{
    "data": {
        "cryptocurrencies": [
            {
                "symbol": "FIX",
                "description": "block range coin rewards and 27 million total coins."
            },
            {
                "symbol": "ICE",
                "description": "DoA, relaunched by someone else and dead again."
            }
        ]
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
        "id": "D0016a183-ba27-4f55-bb91-25a81e70754f",
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
            "id": "D0016a183-ba27-4f55-bb91-25a81e70754f",
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
        "id": "D0016a183-ba27-4f55-bb91-25a81e70754f",
        "description": "New description"
    }
}
```

#### Result

```json
{
    "data": {
        "updateCryptocurrency": {
            "id": "D0016a183-ba27-4f55-bb91-25a81e70754f",
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
    "id": "D0016a183-ba27-4f55-bb91-25a81e70754f"
}
```

#### Result

```json
{
    "data": {
        "removeCryptocurrency": {
            "id": "D0016a183-ba27-4f55-bb91-25a81e70754f",
            "symbol": "EDGE"
        }
    }
}
```

### Retrieve the news about a specific cryptocurrency

#### Query

```graphql
query GetNewsAboutCryptocurrency($id: ID!) {
    cryptoNews(cryptocurrencyId: $id) {
        id
        title
        body
        about {
            id
        }
    }
}
```

#### Variables

```json
{
    "id": "D0016a183-ba27-4f55-bb91-25a81e70754f"
}
```

#### Result

```json
{
    "data": {
        "cryptoNews": [
            {
                "id": "643f3c60-30ee-4cbc-ab75-dfd4a3467af5",
                "title": "Crypto news title",
                "body": "Crypto news body",
                "about": [
                    {
                        "id": "D0016a183-ba27-4f55-bb91-25a81e70754f"
                    }
                ]
            },
            {
                "id": "81f6ad2b-2363-4fae-bc26-c0af072de06f",
                "title": "Breaking news title",
                "body": "Breaking news body",
                "about": [
                    {
                        "id": "D0016a183-ba27-4f55-bb91-25a81e70754f"
                    }
                ]
            }
        ]
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
        about {
            id
        }
    }
}
```

#### Variables

```json
{
    "cryptoNews": {
        "title": "Crypto news title",
        "body": "Crypto news body",
        "about": [
            { 
                "id": "D0016a183-ba27-4f55-bb91-25a81e70754f" 
            }
        ]
    }
}
```

#### Result

```json
{
    "data": {
        "createCryptoNews": {
            "id": "643f3c60-30ee-4cbc-ab75-dfd4a3467af5",
            "title": "Crypto news title",
            "body": "Crypto news body",
            "about": [
                {
                    "id": "D0016a183-ba27-4f55-bb91-25a81e70754f"
                }
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
        about {
            id
        }
    }
}
```

#### Variables

```json
{
    "cryptoNews": {
        "id": "643f3c60-30ee-4cbc-ab75-dfd4a3467af5",
        "title": "New title"
    }
}
```

#### Result

```json
{
    "data": {
        "updateCryptoNews": {
            "id": "643f3c60-30ee-4cbc-ab75-dfd4a3467af5",
            "title": "New title",
            "body": "Crypto news body",
            "about": [
                {
                    "id": "D0016a183-ba27-4f55-bb91-25a81e70754f"
                }
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
        title
        body
    }
}
```

#### Variables

```json
{
    "id": "643f3c60-30ee-4cbc-ab75-dfd4a3467af5"
}
```

#### Result

```json
{
    "data": {
        "removeCryptoNews": {
            "id": "643f3c60-30ee-4cbc-ab75-dfd4a3467af5",
            "title": "New title",
            "body": "Crypto news body"
        }
    }
}
```
