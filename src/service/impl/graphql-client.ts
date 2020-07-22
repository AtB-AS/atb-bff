import ApolloClient, { DefaultOptions } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import fetch from 'cross-fetch';

const link = new HttpLink({
  uri: 'https://api.entur.io/journey-planner/v2/graphql',
  fetch
});

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

export default new ApolloClient({
  link,
  cache: new InMemoryCache(),
  defaultOptions
});
