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

describe('Balance', () => {
  test('get balance with ts', async () => {
    const BALANCE_QUERY = `query Balance($address: Address, $assetId: AssetId) {
      balance(owner: $address, assetId: $assetId) {
        owner
        amount
        assetId
      }
    }`;

    const args = {
      address:
        '0xf65d6448a273b531ee942c133bb91a6f904c7d7f3104cdaf6b9f7f50d3518871',
      assetId:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
    };

    const getBalance = async () => {
      const response = await fetch(TESTNET_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: BALANCE_QUERY,
          variables: args,
        }),
      });
      const json: any = await response.json();
      console.log('BALANCE:', json.data.balance);
      expect(json.data.balance.amount).toBeTruthy();
    };

    await getBalance();
  });

  test('get balance with apollo', async () => {
    const BALANCE_QUERY = `query Balance($address: Address, $assetId: AssetId) {
      balance(owner: $address, assetId: $assetId) {
        owner
        amount
        assetId
      }
    }`;

    const args = {
      address:
        '0xf65d6448a273b531ee942c133bb91a6f904c7d7f3104cdaf6b9f7f50d3518871',
      assetId:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
    };

    const getBalance = async () => {
      const response = await apolloClient.query({
        query: gql(BALANCE_QUERY),
        variables: args,
      });
      console.log('BALANCE:', response.data.balance);
      expect(response.data.balance.amount).toBeTruthy();
    };

    await getBalance();
  });

  test('get balance with urql', async () => {
    const BALANCE_QUERY = `query Balance($address: Address, $assetId: AssetId) {
      balance(owner: $address, assetId: $assetId) {
        owner
        amount
        assetId
      }
    }`;

    const args = {
      address:
        '0xf65d6448a273b531ee942c133bb91a6f904c7d7f3104cdaf6b9f7f50d3518871',
      assetId:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
    };

    const getBalance = async () => {
      const response = await urqlClient.query(BALANCE_QUERY, args).toPromise();
      console.log('BALANCE:', response.data.balance);
      expect(response.data.balance.amount).toBeTruthy();
    };

    await getBalance();
  });
});

export {};
