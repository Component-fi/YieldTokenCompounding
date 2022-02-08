import { gql } from "@apollo/client";


export const GET_YTC_VOLUME = gql`
    query GetAssets(
        $termId: String!
    ){
        days(first: 1000){
            year
            month
            day
            timestamps(first: 1000, orderBy: id){
                id
                entryTransactions(where:{term: $termId}){
                    yieldTokensReceived
                }
            }
        }
    }
`

export const GET_ASSETS = gql`
    query GetAssets{
        baseTokens{
            id
            name
            symbol
        }
    }
`

export const GET_PRINCIPAL_POOLS = gql`
    query AssetTermFixedRates($baseTokenId: String!){
        principalPools(where:{baseToken: $baseTokenId}){
            pToken{
                name
                term{
                    id
                    yToken{
                        decimals
                    }
                }
            }
            id,
        }
    }
`

export const GET_DAILY_FIXED_RATES = gql`
    query GetAssets(
        $principalPoolId: String!
    ){
        days(first: 1000){
            year
            month
            day
            timestamps(first: 1000, orderBy: id){
                id
                principalPoolState(where:{pool: $principalPoolId}){
                    fixedRate
                }
            }
        }
    }
`