import React, { ComponentType } from "react";
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
} from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "@apollo/link-context";

const link = createUploadLink({
  uri: "http://localhost:3000/api/graphql",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "Apollo-Require-Preflight": "true",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache(),
});

export const withApollo = <P extends {}>(
  WrappedComponent: ComponentType<P>
) => {
  const WithApolloProvider: React.FC<P> = (props) => (
    <ApolloProvider client={client}>
      <WrappedComponent {...props} />
    </ApolloProvider>
  );

  return WithApolloProvider;
};
