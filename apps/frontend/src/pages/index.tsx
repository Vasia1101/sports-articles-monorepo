import type { GetServerSideProps } from "next";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { createApolloClient } from "@/lib/apollo";
import { ARTICLES } from "@/graphql/queries";

import { Container, Stack, Typography, Button, Card, CardContent } from "@mui/material";

type Article = { id: string; title: string; createdAt?: string | null };
type ArticlesQueryData = { articles: Article[] };
type ArticlesQueryVars = { offset: number; limit: number };

export default function Home(props: { initialData: ArticlesQueryData }) {
  const { data, loading, error } = useQuery<ArticlesQueryData, ArticlesQueryVars>(ARTICLES, {
    variables: { offset: 0, limit: 10 },
    fetchPolicy: "cache-first"
  });

  const items = data?.articles ?? props.initialData?.articles ?? [];

  const formatDate = (v?: string | null) => {
    if (!v) return "";
    const n = Number(v);
    return Number.isFinite(n) ? new Date(n).toLocaleDateString() : v;
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
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const client = createApolloClient();
  const { data } = await client.query({
    query: ARTICLES,
    variables: { offset: 0, limit: 10 }
  });

  return { props: { initialData: data } };
};
