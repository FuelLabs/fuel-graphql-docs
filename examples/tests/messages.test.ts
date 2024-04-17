/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { Client, cacheExchange, fetchExchange } from 'urql';
import 'isomorphic-fetch';
import { TESTNET_ENDPOINT } from '~/src/constants';

import { MESSAGE_INFO_ARGS, MESSAGE_INFO_QUERY } from '../queries';

const apolloClient = new ApolloClient({
  uri: TESTNET_ENDPOINT,
  cache: new InMemoryCache(),
});

const urqlClient = new Client({
  url: TESTNET_ENDPOINT,
  exchanges: [cacheExchange, fetchExchange],
});

describe('Messages', () => {
  test('get messages with ts', async () => {
    // MESSAGE_INFO_QUERY

    // MESSAGE_INFO_ARGS

    const getMessages = async () => {
      const response = await fetch(TESTNET_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: MESSAGE_INFO_QUERY,
          variables: MESSAGE_INFO_ARGS,
        }),
      });
      const json: any = await response.json();
      console.log('MESSAGES:', json.data.messages);
      expect(json.data.messages.nodes).toBeTruthy();
    };

    await getMessages();
  });

  test('get messages with apollo', async () => {
    // MESSAGE_INFO_QUERY

    // MESSAGE_INFO_ARGS

    const getMessages = async () => {
      const response = await apolloClient.query({
        query: gql(MESSAGE_INFO_QUERY),
        variables: MESSAGE_INFO_ARGS,
      });
      console.log('MESSAGES:', response.data.messages);
      expect(response.data.messages.nodes).toBeTruthy();
    };

    await getMessages();
  });

  test('get messages with urql', async () => {
    // MESSAGE_INFO_QUERY

    // MESSAGE_INFO_ARGS

    const getMessages = async () => {
      const response = await urqlClient.query(MESSAGE_INFO_QUERY, MESSAGE_INFO_ARGS).toPromise();
      console.log('MESSAGES:', response.data.messages);
      expect(response.data.messages.nodes).toBeTruthy();
    };

    await getMessages();
  });
});

export {};
