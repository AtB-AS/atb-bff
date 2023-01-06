import { InMemoryCache, NormalizedCacheObject } from '@apollo/client/cache';
import {
  ApolloClient,
  DefaultOptions,
  HttpLink,
  ApolloLink
} from '@apollo/client/core';

import { onError } from '@apollo/client/link/error';
import fetch from 'node-fetch';
import { ENTUR_BASEURL, ET_CLIENT_NAME } from '../config/env';

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

function createClient(url: string) {
  const cache = new InMemoryCache();
  const httpLink = new HttpLink({
    uri: url,

    // node-fetch uses a different signature than the browser implemented fetch
    // But we use node-fetch's agent option in other parts of the project.
    // The functionallity overlaps so this works as expected.
    fetch: (fetch as unknown) as WindowOrWorkerGlobalScope['fetch'],

    headers: {
      'ET-Client-Name': ET_CLIENT_NAME
    }
  });
  const errorLink = onError(error =>
    console.log('Apollo Error:', JSON.stringify(error))
  );
  const link = ApolloLink.from([errorLink, httpLink]);

  return new ApolloClient({
    link,
    cache,
    defaultOptions
  });
}

export const journeyPlannerClient = createClient(urlJourneyPlanner);

export type GraphQLClient = ApolloClient<NormalizedCacheObject>;
