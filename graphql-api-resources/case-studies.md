## GraphQL case studies

### [The GitHub GraphQL API](https://github.blog/2016-09-14-the-github-graphql-api/)

> You may be wondering why we chose to start supporting GraphQL. Our API was designed to be RESTful and hypermedia-driven. We’re fortunate to have dozens of different open-source clients written in a plethora of languages. Businesses grew around these endpoints.
>
>Like most technology, REST is not perfect and has some drawbacks. Our ambition to change our API focused on solving two problems.
>
>The first was **scalability**. The REST API is responsible for over 60% of the requests made to our database tier. This is partly because, by its nature, hypermedia navigation requires a client to repeatedly communicate with a server so that it can get all the information it needs. Our responses were bloated and filled with all sorts of *_url hints in the JSON responses to help people continue to navigate through the API to get what they needed. Despite all the information we provided, we heard from integrators that our REST API also wasn’t very flexible. It sometimes required two or three separate calls to assemble a complete view of a resource. It seemed like our responses simultaneously sent too much data and didn’t include data that consumers needed.
>
>As we began to audit our endpoints in preparation for an APIv4, we encountered our second problem. We wanted to collect some meta-information about our endpoints. For example, we wanted to identify the OAuth scopes required for each endpoint. We wanted to be smarter about how our resources were paginated. We wanted assurances of type-safety for user-supplied parameters. We wanted to generate documentation from our code. We wanted to generate clients instead of manually supplying patches to our Octokit suite. We studied a variety of API specifications built to make some of this easier, but we found that none of the standards totally matched our requirements.
>
>And then we learned about GraphQL.

#### How to to fetch just a few attributes off of a user

##### Query

```graphql
{
  viewer {
    login
    bio
    location
    isBountyHunter
  }
}
```

##### Result

```json
{
  "data": {
    "viewer": {
      "login": "octocat",
      "bio": "I've been around the world, from London to the Bay.",
      "location": "San Francisco, CA",
      "isBountyHunter": true
    }
  }
}
```

#### How many repositories you’ve starred

##### Query

```graphql
{
  viewer {
    login
    starredRepositories {
      totalCount
    }
    repositories(first: 3) {
      edges {
        node {
          name
          stargazers {
            totalCount
          }
          forks {
            totalCount
          }
          watchers {
            totalCount
          }
          issues(states:[OPEN]) {
            totalCount
          }
        }
      }
    }
  }
}
```

##### Result

```json
{  
  "data":{  
    "viewer":{  
      "login": "octocat",
      "starredRepositories": {
        "totalCount": 131
      },
      "repositories":{
        "edges":[
          {
            "node":{
              "name":"octokit.rb",
              "stargazers":{
                "totalCount": 17
              },
              "forks":{
                "totalCount": 3
              },
              "watchers":{
                "totalCount": 3
              },
              "issues": {
                "totalCount": 1
              }
            }
          },
          {  
            "node":{  
              "name":"octokit.objc",
              "stargazers":{
                "totalCount": 2
              },
              "forks":{
                "totalCount": 0
              },
              "watchers":{
                "totalCount": 1
              },
              "issues": {
                "totalCount": 10
              }
            }
          },
          {
            "node":{
              "name":"octokit.net",
              "stargazers":{
                "totalCount": 19
              },
              "forks":{
                "totalCount": 7
              },
              "watchers":{
                "totalCount": 3
              },
              "issues": {
                "totalCount": 4
              }
            }
          }
        ]
      }
    }
  }
}
```

### [GraphQL at Circle](https://engineering.circle.com/graphql-at-circle-3af656c10b7e)

>At Circle we have many balances which we need to keep track of. Our customers hold balances with us, currently in US dollars 💵, British pound sterling 💷, and euros 💶. We also hold our own balances. Beyond these fiat currencies, Circle actively trades many cryptocurrencies. We need to have an up-to-date view in to each and every one of these balances. Beyond each balance, we also need a view in to the details of every currency we hold including properties such as currency symbol, subunits, and current market rate. Each type of balance (customer, Circle, exchange) is also queried from a different source; be it a database or internal API endpoint.
>
>This all leads to several questions:
>
>* How do we query our data efficiently when we need to hit multiple databases and internal API endpoints?
>
>* How do we ensure we are not over-fetching or under-fetching data?
>
>* How do we document all of the properties associated with accounts, balances, and currencies?
>
>Thankfully, GraphQL solves each of these issues! Instead of making many roundtrip API calls to get balances, currencies, etc. we can make one call to a GraphQL endpoint. Furthermore, we can pass a static query which asks for just the data we need, no more, no less. Finally, while building out our schema we can define each field so we end up with auto-generated documentation!

#### GraphQL schema

```js
module.exports = new graphql.GraphQLObjectType({
  name: ‘Account’,
  fields: {
    accountType: {
      type: AccountType,
      description: ‘One of AccountType ENUM’
    },
    currencyCode: {
      type: graphql.GraphQLString,
      description: ‘Currency code of balance’
    },
    currency: {
      type: Currency,
      description: ‘The currency this balance is denoted in’,
      resolve: (root) => {
        return controllers.currencies.get(root.currencyCode);
      }
    },
    balances: {
      type: new graphql.GraphQLList(Balance),
      description: ‘List of balance entries’,
      resolve: (root) => {
        let balances = [];
        if (!_.isUndefined(root.amount)) {
          balances[0] = {
            timestamp: root.timestamp,
            amount: root.amount
          };
        } else {
          balances = root.balances;
        }
        return balances;
      }
    }
  }
});
```

### [Coursera’s journey to GraphQL](https://www.apollographql.com/blog/community/courseras-journey-to-graphql-a5ad3b77f39a/?_ga=2.219732250.2037239107.1669496640-1493861424.1669496640)

>We’ve been running our GraphQL server in production at Coursera for over six months now, and while the road has certainly been bumpy at times, we’re really able to recognize the benefits that GraphQL provides. Developers have an easier time discovering data and writing queries, our site is more reliable due to the additional type-safety that GraphQL provides, and pages using GraphQL load data much faster.
>
>Just as importantly though, this migration didn’t come at a huge cost of developer productivity. Our frontend developers did have to learn how to use GraphQL, but we didn’t have to rewrite any backend APIs or run complex migrations to begin taking advantage of GraphQL — it was simply available for developers to use as they created new applications.
>
>Overall, we’ve been really happy with what GraphQL has provided our developers (and ultimately our users) and are really excited for what’s to come in the GraphQL ecosystem.