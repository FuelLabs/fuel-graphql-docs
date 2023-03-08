import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { createClient } from "urql";
import "isomorphic-fetch";

const apolloClient = new ApolloClient({
  uri: "https://beta-3.fuel.network/graphql",
  cache: new InMemoryCache(),
});

const urqlClient = createClient({
  url: "https://beta-3.fuel.network/graphql",
});

describe("Latest blocks", () => {
  test("get latest blocks with ts", async () => {
    const LATEST_BLOCKS_QUERY = `query LatestBlocks {
      blocks(last: 5) {
        nodes {
          id
          transactions {
            id
            inputAssetIds
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
            gasPrice
          }
        }
      }
    }`;

    const getLatestBlocks = async () => {
      let response = await fetch("https://beta-3.fuel.network/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: LATEST_BLOCKS_QUERY,
        }),
      });
      let json = await response.json();
      console.log("BLOCKS:", json.data.blocks);
      expect(json.data.blocks.nodes.length).toBeTruthy();
    };

    await getLatestBlocks();
  });

  test("get latest blocks with apollo", async () => {
    const LATEST_BLOCKS_QUERY = `query LatestBlocks {
      blocks(last: 5) {
        nodes {
          id
          transactions {
            id
            inputAssetIds
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
            gasPrice
          }
        }
      }
    }`;

    const getLatestBlocks = async () => {
      const response = await apolloClient.query({
        query: gql(LATEST_BLOCKS_QUERY),
      });
      console.log("BLOCKS:", response.data.blocks);
      expect(response.data.blocks.nodes.length).toBeTruthy();
    };

    await getLatestBlocks();
  });

  test("get latest blocks with urql", async () => {
    const LATEST_BLOCKS_QUERY = `query LatestBlocks {
      blocks(last: 5) {
        nodes {
          id
          transactions {
            id
            inputAssetIds
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
            gasPrice
          }
        }
      }
    }`;

    const getLatestBlocks = async () => {
      const response = await urqlClient
        .query(LATEST_BLOCKS_QUERY, undefined)
        .toPromise();
      console.log("BLOCKS:", response.data.blocks);
      expect(response.data.blocks.nodes.length).toBeTruthy();
    };

    await getLatestBlocks();
  });
});

export {};
