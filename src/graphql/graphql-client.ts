import { InMemoryCache, NormalizedCacheObject } from '@apollo/client/cache';
import {
  ApolloClient,
  DefaultOptions,
  HttpLink,
  ApolloLink
} from '@apollo/client/core';
import { WebSocketLink } from '@apollo/client/link/ws';
import { onError } from '@apollo/client/link/error';
import fetch from 'node-fetch';
import {
  ENTUR_BASEURL,
  ENTUR_WEBSOCKET_BASEURL,
  ET_CLIENT_NAME
} from '../config/env';
import WebSocket from 'ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { ReqRefDefaults, Request } from '@hapi/hapi';

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore'
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  }
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
  return function (headers: Request<ReqRefDefaults>) {
    const cache = new InMemoryCache();
    const httpLink = new HttpLink({
      uri: url,

      // node-fetch uses a different signature than the browser implemented fetch
      // But we use node-fetch's agent option in other parts of the project.
      // The functionality overlaps so this works as expected.
      fetch: fetch as unknown as WindowOrWorkerGlobalScope['fetch'],

      headers: {
        'ET-Client-Name': ET_CLIENT_NAME,
        'X-Correlation-Id': headers['correlationId']
      }
    });
    const errorLink = onError(error =>
      console.log('Apollo Error:', JSON.stringify(error))
    );
    const loggingLink = new ApolloLink((operation, forward) => {
      return forward(operation).map(response => {
        const context = operation.getContext();
        const operationNameGroup =
          operation.operationName == 'Trips' ? 'trips' : 'other';

        const log = {
          time: new Date(context.response.headers.get('date')).toISOString(),
          message: 'graphql call',
          url: context.response.url,
          code: context.response.status,
          rateLimitUsed: context.response.headers.get('rate-limit-used'),
          rateLimitAllowed: context.response.headers.get('rate-limit-allowed'),
          rateLimitGroup: operationNameGroup,
          correlationId: headers['correlationId'],
          requestId: headers['requestId'],
          installId: headers['installId'],
          appVersion: headers['appVersion']
        };
        console.log(JSON.stringify(log));
        return response;
      });
    });
    const link = ApolloLink.from([loggingLink, errorLink, httpLink]);

    return new ApolloClient({
      link,
      cache,
      defaultOptions
    });
  };
}

function createWebSocketClient(url: string) {
  const cache = new InMemoryCache({
    addTypename: false
  });

  const wsLink = new WebSocketLink(
    new SubscriptionClient(
      url,
      {
        reconnect: true,
        lazy: true
      },
      WebSocket
    )
  );

  const errorLink = onError(error =>
    console.log('Apollo Error:', JSON.stringify(error))
  );
  const link = ApolloLink.from([errorLink, wsLink]);

  return new ApolloClient({
    link,
    cache,
    defaultOptions
  });
}

export const journeyPlannerClient = createClient(urlJourneyPlanner);
export const mobilityClient = createClient(urlMobility);
export const vehiclesClient = createClient(urlVehicles);
export const vehiclesSubscriptionClient = createWebSocketClient(urlVehiclesWss);

export type GraphQLClient = ApolloClient<NormalizedCacheObject>;
