import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

export function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
      fetch
    }),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            articlesPage: {
              keyArgs: false,
              merge(existing = { totalCount: 0, items: [] as any[] }, incoming, { args }) {
                const offset = args?.offset ?? 0;

                const mergedItems = existing.items ? existing.items.slice(0) : [];
                const incomingItems = incoming?.items ?? [];

                for (let i = 0; i < incomingItems.length; i++) {
                  mergedItems[offset + i] = incomingItems[i];
                }
                return {
                  totalCount: incoming?.totalCount ?? existing.totalCount,
                  items: mergedItems
                };
              }
            }
          }
        }
      }
    })
  });
}
