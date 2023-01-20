import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { createClient } from "urql";
import "isomorphic-fetch";

const apolloClient = new ApolloClient({
  uri: "https://node-beta-2.fuel.network/graphql",
  cache: new InMemoryCache(),
});

const urqlClient = createClient({
  url: "https://node-beta-2.fuel.network/graphql",
});

describe("Latest transactions", () => {
  test("get latest transactions with ts", async () => {
    const LATEST_TRANSACTIONS_QUERY = `
      query LatestTransactions {
          transactions(last: 5) {
            nodes {
              id
              inputs {
                __typename
                ... on InputCoin {
                  owner
                  utxoId
                  amount
                  assetId
                }
                ... on InputContract {
                  utxoId
                  contract {
                    id
                  }
                }
                ... on InputMessage {
                  messageId
                  sender
                  recipient
                  amount
                  data
                }
              }
              outputs {
                __typename
                ... on CoinOutput {
                  to
                  amount
                  assetId
                }
                ... on ContractOutput {
                  inputIndex
                  balanceRoot
                  stateRoot
                }
                ... on MessageOutput {
                  recipient
                  amount
                }
                ... on ChangeOutput {
                  to
                  amount
                  assetId
                }
                ... on VariableOutput {
                  to
                  amount
                  assetId
                }
                ... on ContractCreated {
                  contract {
                    id
                  }
                  stateRoot
                }
              }
              status {
                __typename
                ... on FailureStatus {
                  reason
                  programState {
                    returnType
                  }
                }
              }
            }
          }
        }`;

    const getLatestTransactions = async () => {
      let response = await fetch("https://node-beta-2.fuel.network/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: LATEST_TRANSACTIONS_QUERY,
        }),
      });
      let json = await response.json();
      console.log("TRANSACTIONS:", json.data.transactions);
      expect(json.data.transactions.nodes.length).toBeTruthy();
    };

    await getLatestTransactions();
  });

  test("get latest transactions with apollo", async () => {
    const LATEST_TRANSACTIONS_QUERY = `
      query LatestTransactions {
          transactions(last: 5) {
            nodes {
              id
              inputs {
                __typename
                ... on InputCoin {
                  owner
                  utxoId
                  amount
                  assetId
                }
                ... on InputContract {
                  utxoId
                  contract {
                    id
                  }
                }
                ... on InputMessage {
                  messageId
                  sender
                  recipient
                  amount
                  data
                }
              }
              outputs {
                __typename
                ... on CoinOutput {
                  to
                  amount
                  assetId
                }
                ... on ContractOutput {
                  inputIndex
                  balanceRoot
                  stateRoot
                }
                ... on MessageOutput {
                  recipient
                  amount
                }
                ... on ChangeOutput {
                  to
                  amount
                  assetId
                }
                ... on VariableOutput {
                  to
                  amount
                  assetId
                }
                ... on ContractCreated {
                  contract {
                    id
                  }
                  stateRoot
                }
              }
              status {
                __typename
                ... on FailureStatus {
                  reason
                  programState {
                    returnType
                  }
                }
              }
            }
          }
        }`;

    const getLatestTransactions = async () => {
      const response = await apolloClient.query({
        query: gql(LATEST_TRANSACTIONS_QUERY)
      });
      console.log("TRANSACTIONS:", response.data.transactions);
      expect(response.data.transactions.nodes.length).toBeTruthy();
    };

    await getLatestTransactions();
  });

  test("get latest transactions with urql", async () => {
    const LATEST_TRANSACTIONS_QUERY = `
      query LatestTransactions {
          transactions(last: 5) {
            nodes {
              id
              inputs {
                __typename
                ... on InputCoin {
                  owner
                  utxoId
                  amount
                  assetId
                }
                ... on InputContract {
                  utxoId
                  contract {
                    id
                  }
                }
                ... on InputMessage {
                  messageId
                  sender
                  recipient
                  amount
                  data
                }
              }
              outputs {
                __typename
                ... on CoinOutput {
                  to
                  amount
                  assetId
                }
                ... on ContractOutput {
                  inputIndex
                  balanceRoot
                  stateRoot
                }
                ... on MessageOutput {
                  recipient
                  amount
                }
                ... on ChangeOutput {
                  to
                  amount
                  assetId
                }
                ... on VariableOutput {
                  to
                  amount
                  assetId
                }
                ... on ContractCreated {
                  contract {
                    id
                  }
                  stateRoot
                }
              }
              status {
                __typename
                ... on FailureStatus {
                  reason
                  programState {
                    returnType
                  }
                }
              }
            }
          }
        }`;

    const getLatestTransactions = async () => {
      const response = await urqlClient.query(LATEST_TRANSACTIONS_QUERY, undefined).toPromise();
      console.log("TRANSACTIONS:", response.data.transactions);
      expect(response.data.transactions.nodes.length).toBeTruthy();
    };

    await getLatestTransactions();
  });
});

export {};