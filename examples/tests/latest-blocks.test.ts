/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { Client, cacheExchange, fetchExchange } from 'urql';
import 'isomorphic-fetch';
import { TESTNET_ENDPOINT } from '~/src/constants';

import { LATEST_BLOCKS_QUERY } from '../queries';

const apolloClient = new ApolloClient({
  uri: TESTNET_ENDPOINT,
  cache: new InMemoryCache(),
});

const urqlClient = new Client({
  url: TESTNET_ENDPOINT,
  exchanges: [cacheExchange, fetchExchange],
});

describe('Latest blocks', () => {
  test('get latest blocks with ts', async () => {
    // LATEST_BLOCKS_QUERY

    const getLatestBlocks = async () => {
      const response = await fetch(TESTNET_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: LATEST_BLOCKS_QUERY,
        }),
      });
      const json: any = await response.json();
      console.log('BLOCKS:', json.data.blocks);
      expect(json.data.blocks.nodes.length).toBeTruthy();
    };

    await getLatestBlocks();
  });

  test('get latest blocks with apollo', async () => {
    // LATEST_BLOCKS_QUERY

    const getLatestBlocks = async () => {
      const response = await apolloClient.query({
        query: gql(LATEST_BLOCKS_QUERY),
      });
      console.log('BLOCKS:', response.data.blocks);
      expect(response.data.blocks.nodes.length).toBeTruthy();
    };

    await getLatestBlocks();
  });

  test('get latest blocks with urql', async () => {
    // LATEST_BLOCKS_QUERY

    const getLatestBlocks = async () => {
      const response = await urqlClient
        .query(LATEST_BLOCKS_QUERY, undefined)
        .toPromise();
      console.log('BLOCKS:', response.data.blocks);
      expect(response.data.blocks.nodes.length).toBeTruthy();
    };

    await getLatestBlocks();
  });
});

export {};
