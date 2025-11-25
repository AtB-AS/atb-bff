/* eslint no-console: 0 */
import {InMemoryCache} from '@apollo/client/cache';
import {
  ApolloClient,
  DefaultOptions,
  HttpLink,
  ApolloLink,
} from '@apollo/client/core';
import {GraphQLWsLink} from '@apollo/client/link/subscriptions';
import {onError} from '@apollo/client/link/error';
import {
  ENTUR_BASEURL,
  ENTUR_WEBSOCKET_BASEURL,
  ET_CLIENT_NAME,
} from '../config/env';
import WebSocket from 'ws';
import {createClient as createWsClient} from 'graphql-ws';
import {ReqRefDefaults, Request} from '@hapi/hapi';
import {logResponse} from '../utils/log-response';
import {Timer} from '../utils/timer';
import {fetchWithTimeout} from '../utils/fetch-client';

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
  ? `${ENTUR_BASEURL}/realtime/v2/vehicles/graphql`
  : 'https://api.entur.io/realtime/v2/vehicles/graphql';

const urlVehiclesWss = ENTUR_WEBSOCKET_BASEURL
  ? `${ENTUR_WEBSOCKET_BASEURL}/realtime/v2/vehicles/subscriptions`
  : 'wss://api.entur.io/realtime/v2/vehicles/subscriptions';

function createClient(url: string) {
  // The possibleTypes is empty to disable the in-memory cache
  const cache = new InMemoryCache({possibleTypes: {}});

  return function (request: Request<ReqRefDefaults>) {
    const httpLink = new HttpLink({
      uri: url,

      // node-fetch uses a different signature than the browser implemented fetch
      // But we use node-fetch's agent option in other parts of the project.
      // The functionality overlaps so this works as expected.
      fetch: fetchWithTimeout as unknown as WindowOrWorkerGlobalScope['fetch'],

      headers: {
        'ET-Client-Name': ET_CLIENT_NAME,
        'X-Correlation-Id': request['correlationId'] ?? '',
      },
    });
    const errorLink = onError(({operation, graphQLErrors, networkError}) => {
      let error = '';
      if (graphQLErrors) {
        graphQLErrors.forEach(({message, locations, path}) => {
          error += `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}\n`;
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
        url: context.response?.url,
        statusCode: context.response?.status,
        request,
        responseHeaders: context.response?.headers,
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
          request,
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

  const wsLink = new GraphQLWsLink(
    createWsClient({
      url,
      webSocketImpl: WebSocket,
      retryAttempts: 10,
      lazy: true,
    }),
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
export const mobilityClientDev = createClient(
  urlMobility.replace('staging', 'dev'),
);
export const vehiclesClient = createClient(urlVehicles);
export const vehiclesSubscriptionClient = createWebSocketClient(urlVehiclesWss);
