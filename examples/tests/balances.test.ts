/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { Client, cacheExchange, fetchExchange } from 'urql';
import 'isomorphic-fetch';
import { TESTNET_ENDPOINT } from '~/src/constants';

import { BALANCES_ARGS, BALANCES_QUERY } from '../queries';

const apolloClient = new ApolloClient({
  uri: TESTNET_ENDPOINT,
  cache: new InMemoryCache(),
});

const urqlClient = new Client({
  url: TESTNET_ENDPOINT,
  exchanges: [cacheExchange, fetchExchange],
});

describe('Balances', () => {
  test('get balances with ts', async () => {
    // BALANCES_QUERY

    // BALANCES_ARGS

    const getBalances = async () => {
      const response = await fetch(TESTNET_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: BALANCES_QUERY,
          variables: BALANCES_ARGS,
        }),
      });
      const json: any = await response.json();
      console.log('BALANCES:', json.data.balances);
      expect(json.data.balances.nodes).toBeTruthy();
    };

    await getBalances();
  });

  test('get balances with apollo', async () => {
    // BALANCES_QUERY

    // BALANCES_ARGS

    const getBalances = async () => {
      const response = await apolloClient.query({
        query: gql(BALANCES_QUERY),
        variables: BALANCES_ARGS,
      });
      console.log('BALANCES:', response.data.balances);
      expect(response.data.balances.nodes).toBeTruthy();
    };

    await getBalances();
  });

  test('get balances with urql', async () => {
    // BALANCES_QUERY

    // BALANCES_ARGS

    const getBalances = async () => {
      const response = await urqlClient
        .query(BALANCES_QUERY, BALANCES_ARGS)
        .toPromise();
      console.log('BALANCES:', response.data.balances);
      expect(response.data.balances.nodes).toBeTruthy();
    };

    await getBalances();
  });
});

export {};
