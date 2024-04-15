/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { Client, cacheExchange, fetchExchange } from 'urql';
import 'isomorphic-fetch';
import { TESTNET_ENDPOINT } from '~/src/constants';

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
    const BLOCK_BY_HEIGHT_QUERY = `
      query Block($height: U64) {
        block(height: $height) {
          id
        }
      }`;

    const args = { height: '3412' };

    const getBlock = async () => {
      const response = await fetch(TESTNET_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: BLOCK_BY_HEIGHT_QUERY,
          variables: args,
        }),
      });
      const json: any = await response.json();
      console.log('BLOCK:', json.data.block);
      expect(json.data.block.id).toBeTruthy();
    };

    await getBlock();
  });

  test('get block info with apollo', async () => {
    const BLOCK_BY_HEIGHT_QUERY = `
      query Block($height: U64) {
        block(height: $height) {
          id
        }
      }`;

    const args = { height: '3412' };

    const getBlock = async () => {
      const response = await apolloClient.query({
        query: gql(BLOCK_BY_HEIGHT_QUERY),
        variables: args,
      });
      console.log('BLOCK:', response.data.block);
      expect(response.data.block.id).toBeTruthy();
    };

    await getBlock();
  });

  test('get block info with urql', async () => {
    const BLOCK_BY_HEIGHT_QUERY = `
      query Block($height: U64) {
        block(height: $height) {
          id
        }
      }`;

    const args = { height: '3412' };

    const getBlock = async () => {
      const response = await urqlClient
        .query(BLOCK_BY_HEIGHT_QUERY, args)
        .toPromise();
      console.log('BLOCK:', response.data.block);
      expect(response.data.block.id).toBeTruthy();
    };

    await getBlock();
  });
});

export {};
