import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { createClient } from 'urql'
import 'isomorphic-fetch';

const apolloClient= new ApolloClient({
  uri: 'https://beta-4.fuel.network/graphql',
  cache: new InMemoryCache(),
})

const urqlClient= createClient({
  url: 'https://beta-4.fuel.network/graphql',
})

describe("Balances", () => {
  test("get balances with ts", async () => {
    const BALANCES_QUERY = `query Balances($filter: BalanceFilterInput) {
      balances(filter: $filter, first: 5) {
        nodes {
          amount
          assetId
        }
      }
    }`;

    const args = {
      filter: {
        owner:
          "0x707eb563fbfdecf5aae2fdc3cb8418aaaf2fe9bfc7ec219e1dfacc67b29d8fcf",
      },
    };

    const getBalances = async () => {
      let response = await fetch("https://beta-4.fuel.network/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: BALANCES_QUERY,
          variables: args,
        }),
      });
      let json = await response.json();
      console.log("BALANCES:", json.data.balances);
      expect(json.data.balances.nodes.length).toBeTruthy();
    }

    await getBalances();

  });

  test("get balances with apollo", async () => {
    const BALANCES_QUERY = `query Balances($filter: BalanceFilterInput) {
      balances(filter: $filter, first: 5) {
        nodes {
          amount
          assetId
        }
      }
    }`;

    const args = {
      filter: {
        owner:
          "0x707eb563fbfdecf5aae2fdc3cb8418aaaf2fe9bfc7ec219e1dfacc67b29d8fcf",
      },
    };

    const getBalances = async () => {
      const response = await apolloClient.query({
        query: gql(BALANCES_QUERY),
        variables: args,
      });
      console.log("BALANCES:", response.data.balances);
      expect(response.data.balances.nodes.length).toBeTruthy();
    };

    await getBalances();
    
  });


  test("get balances with urql", async () => {
    const BALANCES_QUERY = `query Balances($filter: BalanceFilterInput) {
      balances(filter: $filter, first: 5) {
        nodes {
          amount
          assetId
        }
      }
    }`;

    const args = {
      filter: {
        owner:
          "0x707eb563fbfdecf5aae2fdc3cb8418aaaf2fe9bfc7ec219e1dfacc67b29d8fcf",
      },
    };

    const getBalances = async () => {
      const response = await urqlClient.query(BALANCES_QUERY, args).toPromise();
      console.log("BALANCES:", response.data.balances);
      expect(response.data.balances.nodes.length).toBeTruthy();
    }

    await getBalances();
  });
});

export {};
