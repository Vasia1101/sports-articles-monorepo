import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client/react";
import { createApolloClient } from "@/lib/apollo";

const client = createApolloClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
