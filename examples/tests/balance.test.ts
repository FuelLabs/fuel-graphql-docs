/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { Client, cacheExchange, fetchExchange } from 'urql';
import 'isomorphic-fetch';
import { TESTNET_ENDPOINT } from '~/src/constants';

import { BALANCE_ARGS, BALANCE_QUERY } from '../queries';

const apolloClient = new ApolloClient({
  uri: TESTNET_ENDPOINT,
  cache: new InMemoryCache(),
});

const urqlClient = new Client({
  url: TESTNET_ENDPOINT,
  exchanges: [cacheExchange, fetchExchange],
});

describe('Balance', () => {
  test('get balance with ts', async () => {
    // BALANCE_QUERY

    // BALANCE_ARGS

    const getBalance = async () => {
      const response = await fetch(TESTNET_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: BALANCE_QUERY,
          variables: BALANCE_ARGS,
        }),
      });
      const json: any = await response.json();
      console.log('BALANCE:', json.data.balance);
      expect(json.data.balance.amount).toBeTruthy();
    };

    await getBalance();
  });

  test('get balance with apollo', async () => {
    // BALANCE_QUERY

    // BALANCE_ARGS

    const getBalance = async () => {
      const response = await apolloClient.query({
        query: gql(BALANCE_QUERY),
        variables: BALANCE_ARGS,
      });
      console.log('BALANCE:', response.data.balance);
      expect(response.data.balance.amount).toBeTruthy();
    };

    await getBalance();
  });

  test('get balance with urql', async () => {
    // BALANCE_QUERY

    // BALANCE_ARGS

    const getBalance = async () => {
      const response = await urqlClient.query(BALANCE_QUERY, BALANCE_ARGS).toPromise();
      console.log('BALANCE:', response.data.balance);
      expect(response.data.balance.amount).toBeTruthy();
    };

    await getBalance();
  });
});

export {};
