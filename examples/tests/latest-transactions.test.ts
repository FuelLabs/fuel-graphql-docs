/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { Client, cacheExchange, fetchExchange } from 'urql';
import 'isomorphic-fetch';
import { TESTNET_ENDPOINT } from '~/src/constants';

import { LATEST_TRANSACTIONS_QUERY } from '../queries';

const apolloClient = new ApolloClient({
  uri: TESTNET_ENDPOINT,
  cache: new InMemoryCache(),
});

const urqlClient = new Client({
  url: TESTNET_ENDPOINT,
  exchanges: [cacheExchange, fetchExchange],
});

describe('Latest transactions', () => {
  test('get latest transactions with ts', async () => {
    // LATEST_TRANSACTIONS_QUERY
    
    const getLatestTransactions = async () => {
      const response = await fetch(TESTNET_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: LATEST_TRANSACTIONS_QUERY,
        }),
      });
      const json: any = await response.json();
      console.log('TRANSACTIONS:', json.data.transactions);
      expect(json.data.transactions.nodes.length).toBeTruthy();
    };

    await getLatestTransactions();
  });

  test('get latest transactions with apollo', async () => {
    // LATEST_TRANSACTIONS_QUERY

    const getLatestTransactions = async () => {
      const response = await apolloClient.query({
        query: gql(LATEST_TRANSACTIONS_QUERY),
      });
      console.log('TRANSACTIONS:', response.data.transactions);
      expect(response.data.transactions.nodes.length).toBeTruthy();
    };

    await getLatestTransactions();
  });

  test('get latest transactions with urql', async () => {
    // LATEST_TRANSACTIONS_QUERY

    const getLatestTransactions = async () => {
      const response = await urqlClient
        .query(LATEST_TRANSACTIONS_QUERY, undefined)
        .toPromise();
      console.log('TRANSACTIONS:', response.data.transactions);
      expect(response.data.transactions.nodes.length).toBeTruthy();
    };

    await getLatestTransactions();
  });
});

export {};
