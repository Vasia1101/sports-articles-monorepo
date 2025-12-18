import type { GetServerSideProps } from "next";
import Link from "next/link";
import { Container, Stack, Typography, Button, Card, CardContent } from "@mui/material";
import { createApolloClient } from "@/lib/apollo";
import { ARTICLE } from "@/graphql/queries";

type Article = {
  id: string;
  title: string;
  content: string;
  createdAt?: string | null;
  imageUrl?: string | null;
};

type ArticleQueryData = {
  article: Article | null;
};

type ArticleQueryVars = {
  id: string;
};

export default function ArticlePage({ article }: { article: Article | null }) {
  if (!article) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Article not found
        </Typography>
        <Button component={Link} href="/" variant="outlined">
          Back
        </Button>
      </Container>
    );
  }

  const formatDate = (v?: string | null) => {
    if (!v) return "";
    const n = Number(v);
    return Number.isFinite(n) ? new Date(n).toLocaleString() : v;
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <Button component={Link} href="/" variant="outlined">
          Back
        </Button>

        <Stack direction="row" spacing={1}>
          <Button component={Link} href={`/article/${article.id}/edit`} variant="contained">
            Edit
          </Button>
          {/* Delete and mutation*/}
          <Button component={Link} href={`/`} color="error" variant="outlined">
            Delete (soon)
          </Button>
        </Stack>
      </Stack>

      <Typography variant="h4" fontWeight={800} sx={{ mt: 3 }}>
        {article.title}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {formatDate(article.createdAt)}
      </Typography>

      {article.imageUrl && (
        <Card variant="outlined" sx={{ mt: 3, overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.imageUrl}
            alt={article.title}
            style={{ width: "100%", maxHeight: 420, objectFit: "cover", display: "block" }}
          />
        </Card>
      )}

      <Card variant="outlined" sx={{ mt: 3 }}>
        <CardContent>
          <Typography sx={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{article.content}</Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = String(ctx.params?.id ?? "");
  const client = createApolloClient();

  const { data } = await client.query<ArticleQueryData, ArticleQueryVars>({
  query: ARTICLE,
  variables: { id }
});


  return { props: { article: data?.article ?? null } };
};
