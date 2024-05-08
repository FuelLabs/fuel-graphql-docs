/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { Client, cacheExchange, fetchExchange } from 'urql';
import 'isomorphic-fetch';
import { TESTNET_ENDPOINT } from '~/src/constants';

import { TRANSACTIONS_ARGS, TRANSACTIONS_QUERY } from '../queries';

const apolloClient = new ApolloClient({
  uri: TESTNET_ENDPOINT,
  cache: new InMemoryCache(),
});

const urqlClient = new Client({
  url: TESTNET_ENDPOINT,
  exchanges: [cacheExchange, fetchExchange],
});

describe('Transactions by owner', () => {
  test('get transactions with ts', async () => {
    // TRANSACTIONS_QUERY

    // TRANSACTIONS_ARGS

    const getTransactions = async () => {
      const response = await fetch(TESTNET_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: TRANSACTIONS_QUERY,
          variables: TRANSACTIONS_ARGS,
        }),
      });
      const json: any = await response.json();
      console.log('TRANSACTIONS:', json.data.transactionsByOwner);
      expect(Array.isArray(json.data.transactionsByOwner.nodes)).toBeTruthy();
    };

    await getTransactions();
  });

  test('get transactions with apollo', async () => {
    // TRANSACTIONS_QUERY

    // TRANSACTIONS_ARGS

    const getTransactions = async () => {
      const response = await apolloClient.query({
        query: gql(TRANSACTIONS_QUERY),
        variables: TRANSACTIONS_ARGS,
      });
      console.log('TRANSACTIONS:', response.data.transactionsByOwner);
      expect(Array.isArray(response.data.transactionsByOwner.nodes)).toBeTruthy();
    };

    await getTransactions();
  });

  test('get transactions with urql', async () => {
    // TRANSACTIONS_QUERY

    // TRANSACTIONS_ARGS

    const getTransactions = async () => {
      const response = await urqlClient
        .query(TRANSACTIONS_QUERY, TRANSACTIONS_ARGS)
        .toPromise();
      console.log('TRANSACTIONS:', response.data.transactionsByOwner);
      expect(Array.isArray(response.data.transactionsByOwner.nodes)).toBeTruthy();
    };

    await getTransactions();
  });
});

export {};
