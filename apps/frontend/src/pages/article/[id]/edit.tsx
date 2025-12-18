import type { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Alert, Button, Card, CardContent, Container, Stack, TextField, Typography } from "@mui/material";

import { createApolloClient } from "@/lib/apollo";
import { ARTICLE } from "@/graphql/queries";
import { UPDATE_ARTICLE } from "@/graphql/mutations";

type Article = {
  id: string;
  title: string;
  content: string;
  createdAt?: string | null;
  imageUrl?: string | null;
};

type ArticleQueryData = { article: Article | null };
type ArticleQueryVars = { id: string };

type UpdateArticleResult = {
  updateArticle: { id: string; title: string; createdAt?: string | null };
};

type UpdateArticleVars = {
  id: string;
  input: { title: string; content: string; imageUrl?: string };
};

export default function EditArticlePage({ article }: { article: Article | null }) {
  const router = useRouter();

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

  const [title, setTitle] = useState(article.title);
  const [content, setContent] = useState(article.content);
  const [imageUrl, setImageUrl] = useState(article.imageUrl ?? "");
  const [touched, setTouched] = useState<{ title: boolean; content: boolean }>({ title: false, content: false });

  const titleError = useMemo(() => {
    if (!touched.title) return "";
    return title.trim().length === 0 ? "Title is required" : "";
  }, [title, touched.title]);

  const contentError = useMemo(() => {
    if (!touched.content) return "";
    return content.trim().length === 0 ? "Content is required" : "";
  }, [content, touched.content]);

  const [updateArticle, { loading, error }] =
    useMutation<UpdateArticleResult, UpdateArticleVars>(UPDATE_ARTICLE);

  const canSubmit = title.trim() && content.trim() && !titleError && !contentError;

  const onSubmit = async () => {
    setTouched({ title: true, content: true });
    if (!canSubmit) return;

    const input = {
      title: title.trim(),
      content: content.trim(),
      imageUrl: imageUrl.trim() ? imageUrl.trim() : undefined
    };

    const res = await updateArticle({
      variables: { id: article.id, input }
    });

    const id = res.data?.updateArticle?.id;
    if (id) await router.push(`/article/${id}`);
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <Typography variant="h4" fontWeight={800}>
          Edit article
        </Typography>
        <Button component={Link} href={`/article/${article.id}`} variant="outlined">
          Back
        </Button>
      </Stack>

      <Card variant="outlined" sx={{ mt: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error.message}</Alert>}

            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, title: true }))}
              error={Boolean(titleError)}
              helperText={titleError || " "}
              fullWidth
            />

            <TextField
              label="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, content: true }))}
              error={Boolean(contentError)}
              helperText={contentError || " "}
              fullWidth
              multiline
              minRows={6}
            />

            <TextField
              label="Image URL (optional)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              fullWidth
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button component={Link} href={`/article/${article.id}`} variant="text" disabled={loading}>
                Cancel
              </Button>
              <Button variant="contained" onClick={onSubmit} disabled={loading || !canSubmit}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </Stack>
          </Stack>
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
