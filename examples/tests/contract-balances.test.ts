/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { Client, cacheExchange, fetchExchange } from 'urql';
import 'isomorphic-fetch';
import { TESTNET_ENDPOINT } from '~/src/constants';

import { CONTRACT_BALANCES_ARGS, CONTRACT_BALANCES_QUERY } from '../queries';

const apolloClient = new ApolloClient({
  uri: TESTNET_ENDPOINT,
  cache: new InMemoryCache(),
});

const urqlClient = new Client({
  url: TESTNET_ENDPOINT,
  exchanges: [cacheExchange, fetchExchange],
});

describe('Contract balances', () => {
  test('get contract balances with ts', async () => {
    // CONTRACT_BALANCES_QUERY

    // CONTRACT_BALANCES_ARGS

    const getContractBalances = async () => {
      const response = await fetch(TESTNET_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: CONTRACT_BALANCES_QUERY,
          variables: CONTRACT_BALANCES_ARGS,
        }),
      });
      const json: any = await response.json();
      console.log('CONTRACT BALANCES:', json.data.contractBalances);
      expect(json.data.contractBalances.nodes).toBeTruthy();
    };

    await getContractBalances();
  });

  test('get contract balances with apollo', async () => {
    // CONTRACT_BALANCES_QUERY

    // CONTRACT_BALANCES_ARGS

    const getContractBalances = async () => {
      const response = await apolloClient.query({
        query: gql(CONTRACT_BALANCES_QUERY),
        variables: CONTRACT_BALANCES_ARGS,
      });
      console.log('CONTRACT BALANCES:', response.data.contractBalances);
      expect(response.data.contractBalances.nodes).toBeTruthy();
    };

    await getContractBalances();
  });

  test('get contract balances with urql', async () => {
    // CONTRACT_BALANCES_QUERY

    // CONTRACT_BALANCES_ARGS

    const getContractBalances = async () => {
      const response = await urqlClient
        .query(CONTRACT_BALANCES_QUERY, CONTRACT_BALANCES_ARGS)
        .toPromise();
      console.log('CONTRACT BALANCES:', response.data.contractBalances);
      expect(response.data.contractBalances.nodes).toBeTruthy();
    };

    await getContractBalances();
  });
});

export {};
