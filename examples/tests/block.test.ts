/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { Client, cacheExchange, fetchExchange } from 'urql';
import 'isomorphic-fetch';
import { TESTNET_ENDPOINT } from '~/src/constants';

import { BLOCK_BY_HEIGHT_ARGS, BLOCK_BY_HEIGHT_QUERY } from '../queries';

const apolloClient = new ApolloClient({
  uri: TESTNET_ENDPOINT,
  cache: new InMemoryCache(),
});

const urqlClient = new Client({
  url: TESTNET_ENDPOINT,
  exchanges: [cacheExchange, fetchExchange],
});

describe('Block Info', () => {
  test('get block info with ts', async () => {
    // BLOCK_BY_HEIGHT_QUERY

    // BLOCK_BY_HEIGHT_ARGS

    const getBlock = async () => {
      const response = await fetch(TESTNET_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: BLOCK_BY_HEIGHT_QUERY,
          variables: BLOCK_BY_HEIGHT_ARGS,
        }),
      });
      const json: any = await response.json();
      console.log('BLOCK:', json.data.block);
      expect(json.data.block.id).toBeTruthy();
    };

    await getBlock();
  });

  test('get block info with apollo', async () => {
    // BLOCK_BY_HEIGHT_QUERY

    // BLOCK_BY_HEIGHT_ARGS

    const getBlock = async () => {
      const response = await apolloClient.query({
        query: gql(BLOCK_BY_HEIGHT_QUERY),
        variables: BLOCK_BY_HEIGHT_ARGS,
      });
      console.log('BLOCK:', response.data.block);
      expect(response.data.block.id).toBeTruthy();
    };

    await getBlock();
  });

  test('get block info with urql', async () => {
    // BLOCK_BY_HEIGHT_QUERY

    // BLOCK_BY_HEIGHT_ARGS

    const getBlock = async () => {
      const response = await urqlClient
        .query(BLOCK_BY_HEIGHT_QUERY, BLOCK_BY_HEIGHT_ARGS)
        .toPromise();
      console.log('BLOCK:', response.data.block);
      expect(response.data.block.id).toBeTruthy();
    };

    await getBlock();
  });
});

export {};
