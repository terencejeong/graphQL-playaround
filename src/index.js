import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import registerServiceWorker from './registerServiceWorker';
import App from './App';

import './style.css';

const GITHUB_BASE_URL = 'https://api.github.com/graphql';

const httpLink = new HttpLink({
  uri: GITHUB_BASE_URL,
  headers: {
    authorization: `bearer `,
  },
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    // do something with graphql error
    console.log(graphQLErrors);
  }

  if (networkError) {
    // do something with network error
    console.log(networkError);
  }
});

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: httpLink,
  cache,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />,
  </ApolloProvider>,
  document.getElementById('root')
);

registerServiceWorker();
