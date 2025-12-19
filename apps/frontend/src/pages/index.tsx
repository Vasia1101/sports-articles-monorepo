import { useState } from "react";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { createApolloClient } from "@/lib/apollo";
import { ARTICLES_PAGE } from "@/graphql/queries";

import { Container, Stack, Typography, Button, Card, CardContent } from "@mui/material";

type Article = {
  id: string;
  title: string;
  createdAt?: string | null;
};

type ArticlesPage = { totalCount: number; items: Article[] };
type ArticlesQueryData = { articlesPage: ArticlesPage };
type ArticlesQueryVars = { offset: number; limit: number };

const LIMIT = 10;

export default function Home(props: { initialData: ArticlesPage }) {
  const [offset, setOffset] = useState(0);

  const { data, loading, error, fetchMore, networkStatus } = useQuery<
    ArticlesQueryData,
    ArticlesQueryVars
  >(ARTICLES_PAGE, {
    variables: { offset: 0, limit: LIMIT },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network"
  });

  const total = data?.articlesPage?.totalCount ?? props.initialData?.totalCount ?? 0;
  const items = data?.articlesPage?.items ?? props.initialData?.items ?? [];
  const hasMore = items.length < total;

  const formatDate = (v?: string | null) => {
    if (!v) return "";
    const n = Number(v);
    return Number.isFinite(n) ? new Date(n).toLocaleDateString() : v;
  };

  const isLoadingMore = networkStatus === 3;

  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    await fetchMore({
      variables: {
        offset: items.length,
        limit: LIMIT
      }
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Typography variant="h4" fontWeight={800}>
          Sports Articles
        </Typography>

        <Button component={Link} href="/article/create" variant="contained">
          Create article
        </Button>
      </Stack>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          Error: {error.message}
        </Typography>
      )}

      {loading && items.length === 0 && <Typography sx={{ mt: 2 }}>Loading...</Typography>}

      <Stack spacing={2} sx={{ mt: 3 }}>
        {items.map((a) => (
          <Card key={a.id} variant="outlined">
            <CardContent>
              <Typography
                component={Link}
                href={`/article/${a.id}`}
                variant="h6"
                sx={{ textDecoration: "none" }}
              >
                {a.title}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {formatDate(a.createdAt)}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
      <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
        <Button variant="outlined" onClick={loadMore} disabled={!hasMore || isLoadingMore}>
          {isLoadingMore ? "Loading..." : !hasMore ? "No more" : "Load more"}
        </Button>
      </Stack>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const client = createApolloClient();
  const { data } = await client.query<any>({
    query: ARTICLES_PAGE,
    variables: { offset: 0, limit: 10 }
  });

  return { props: { initialData: data.articlesPage } };
};
