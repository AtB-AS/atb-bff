/* eslint no-console: 0 */
import {InMemoryCache, NormalizedCacheObject} from '@apollo/client/cache';
import {
  ApolloClient,
  DefaultOptions,
  HttpLink,
  ApolloLink,
} from '@apollo/client/core';
import {WebSocketLink} from '@apollo/client/link/ws';
import {onError} from '@apollo/client/link/error';
import fetch from 'node-fetch';
import {
  ENTUR_BASEURL,
  ENTUR_WEBSOCKET_BASEURL,
  ET_CLIENT_NAME,
} from '../config/env';
import WebSocket from 'ws';
import {SubscriptionClient} from 'subscriptions-transport-ws';
import {ReqRefDefaults, Request} from '@hapi/hapi';
import {logResponse} from '../utils/log-response';
import {Timer} from '../utils/timer';

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
};

const urlJourneyPlanner = ENTUR_BASEURL
  ? `${ENTUR_BASEURL}/journey-planner/v3/graphql`
  : 'https://api.entur.io/journey-planner/v3/graphql';

const urlMobility = ENTUR_BASEURL
  ? `${ENTUR_BASEURL}/mobility/v2/graphql`
  : 'https://api.entur.io/mobility/v2/graphql';

const urlVehicles = ENTUR_BASEURL
  ? `${ENTUR_BASEURL}/realtime/v1/vehicles/graphql`
  : 'https://api.entur.io/realtime/v1/vehicles/graphql';

const urlVehiclesWss = ENTUR_WEBSOCKET_BASEURL
  ? `${ENTUR_WEBSOCKET_BASEURL}/realtime/v1/vehicles/subscriptions`
  : 'wss://api.entur.io/realtime/v1/vehicles/subscriptions';

function createClient(url: string) {
  const cache = new InMemoryCache();
  return function (headers: Request<ReqRefDefaults>) {
    const httpLink = new HttpLink({
      uri: url,

      // node-fetch uses a different signature than the browser implemented fetch
      // But we use node-fetch's agent option in other parts of the project.
      // The functionality overlaps so this works as expected.
      fetch: fetch as unknown as WindowOrWorkerGlobalScope['fetch'],

      headers: {
        'ET-Client-Name': ET_CLIENT_NAME,
        'X-Correlation-Id': headers['correlationId'],
      },
    });
    const errorLink = onError(({operation, graphQLErrors, networkError}) => {
      let error = '';
      if (graphQLErrors) {
        graphQLErrors.forEach(({message, locations, path}) => {
          error += `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}\n`;
        });
      }
      if (networkError) {
        error = `[Network error]: ${networkError}`;
      }

      const context = operation.getContext();
      const timer = new Timer(operation.getContext().start);
      logResponse({
        operationName: operation.operationName,
        message: 'graphql call',
        url: context.response.url,
        statusCode: context.response.status,
        requestHeaders: headers,
        responseHeaders: context.response.headers,
        duration: timer?.getElapsedMs() || 0,
        error: error,
      });
    });
    const loggingLink = new ApolloLink((operation, forward) => {
      operation.setContext({start: new Date()});
      return forward(operation).map((response) => {
        const context = operation.getContext();
        const timer = new Timer(operation.getContext().start);

        logResponse({
          operationName: operation.operationName,
          message: 'graphql call',
          url: context.response.url,
          statusCode: context.response.status,
          requestHeaders: headers,
          responseHeaders: context.response.headers,
          duration: timer.getElapsedMs(),
        });

        return response;
      });
    });
    const link = ApolloLink.from([loggingLink, errorLink, httpLink]);

    return new ApolloClient({
      link,
      cache,
      defaultOptions,
    });
  };
}

function createWebSocketClient(url: string) {
  const cache = new InMemoryCache({
    addTypename: false,
  });

  const wsLink = new WebSocketLink(
    new SubscriptionClient(
      url,
      {
        reconnect: true,
        lazy: true,
        minTimeout: 10000,
      },
      WebSocket,
    ),
  );

  const errorLink = onError((error) =>
    console.log('Apollo Error:', JSON.stringify(error)),
  );
  const link = ApolloLink.from([errorLink, wsLink]);

  return new ApolloClient({
    link,
    cache,
    defaultOptions,
  });
}

export const journeyPlannerClient = createClient(urlJourneyPlanner);
export const mobilityClient = createClient(urlMobility);
export const vehiclesClient = createClient(urlVehicles);
export const vehiclesSubscriptionClient = createWebSocketClient(urlVehiclesWss);

export type GraphQLClient = ApolloClient<NormalizedCacheObject>;
