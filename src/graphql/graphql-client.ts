import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient, { DefaultOptions } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';
import { ET_CLIENT_NAME } from '../config/env';

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore'
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all'
  }
};

const urlJourneyPlanner = 'https://api.entur.io/journey-planner/v2/graphql';

function createClient(url: string) {
  const cache = new InMemoryCache();
  const link = new HttpLink({
    uri: url,

    // node-fetch uses a different signature than the browser implemented fetch
    // But we use node-fetch's agent option in other parts of the project.
    // The functionallity overlaps so this works as expected.
    fetch: (fetch as unknown) as WindowOrWorkerGlobalScope['fetch'],

    headers: {
      'ET-Client-Name': ET_CLIENT_NAME
    }
  });

  return new ApolloClient({
    link,
    cache,
    defaultOptions
  });
}

export const journeyPlannerClient = createClient(urlJourneyPlanner);

export type GraphQLClient = ApolloClient<NormalizedCacheObject>;
