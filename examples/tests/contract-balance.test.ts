/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { Client, cacheExchange, fetchExchange } from 'urql';
import 'isomorphic-fetch';
import { TESTNET_ENDPOINT } from '~/src/constants';

import { CONTRACT_BALANCE_ARGS, CONTRACT_BALANCE_QUERY } from '../queries';

const apolloClient = new ApolloClient({
  uri: TESTNET_ENDPOINT,
  cache: new InMemoryCache(),
});

const urqlClient = new Client({
  url: TESTNET_ENDPOINT,
  exchanges: [cacheExchange, fetchExchange],
});

describe('Contract Balance', () => {
  test('get contract balance with ts', async () => {
    // CONTRACT_BALANCE_QUERY

    // CONTRACT_BALANCE_ARGS

    const getContractBalance = async () => {
      const response = await fetch(TESTNET_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: CONTRACT_BALANCE_QUERY,
          variables: CONTRACT_BALANCE_ARGS,
        }),
      });
      const json: any = await response.json();
      console.log('CONTRACT BALANCE:', json.data.contractBalance);
      expect(json.data.contractBalance.amount).toBeTruthy();
    };

    await getContractBalance();
  });

  test('get contract balance with apollo', async () => {
    // CONTRACT_BALANCE_QUERY

    // CONTRACT_BALANCE_ARGS

    const getContractBalance = async () => {
      const response = await apolloClient.query({
        query: gql(CONTRACT_BALANCE_QUERY),
        variables: CONTRACT_BALANCE_ARGS,
      });
      console.log('CONTRACT BALANCE:', response.data.contractBalance);
      expect(response.data.contractBalance.amount).toBeTruthy();
    };

    await getContractBalance();
  });

  test('get contract balance with urql', async () => {
    // CONTRACT_BALANCE_QUERY

    // CONTRACT_BALANCE_ARGS

    const getContractBalance = async () => {
      const response = await urqlClient
        .query(CONTRACT_BALANCE_QUERY, CONTRACT_BALANCE_ARGS)
        .toPromise();
      console.log('CONTRACT BALANCE:', response.data.contractBalance);
      expect(response.data.contractBalance.amount).toBeTruthy();
    };

    await getContractBalance();
  });
});

export {};
