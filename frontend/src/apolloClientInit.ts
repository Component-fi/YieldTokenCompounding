import {
    ApolloClient,
    InMemoryCache,
} from '@apollo/client'

export const clientInit = () => new ApolloClient({
    uri: "https://api.studio.thegraph.com/query/16955/ytc/v0.0.67",
    cache: new InMemoryCache()
})