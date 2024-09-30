'use client';

import { ApolloProvider } from '@apollo/client';
import apolloClient from '@/utils/apolloClient';

const ClientApolloProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};

export default ClientApolloProvider;