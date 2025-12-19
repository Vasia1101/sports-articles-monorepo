import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client/react";
import {
  Container,
  Stack,
  Typography,
  TextField,
  Button,
  Alert,
  Card,
  CardContent
} from "@mui/material";
import { CREATE_ARTICLE } from "@/graphql/mutations";

type CreateInput = {
  title: string;
  content: string;
  imageUrl?: string;
};

type CreateArticleResult = {
  createArticle: {
    id: string;
    title: string;
    createdAt?: string | null;
  };
};

type CreateArticleVars = {
  input: {
    title: string;
    content: string;
    imageUrl?: string;
  };
};
// move to helpers
const isValidUrl = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export default function CreateArticlePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [touched, setTouched] = useState<{ title: boolean; content: boolean }>({
    title: false,
    content: false
  });

  const titleError = useMemo(() => {
    if (!touched.title) return "";
    return title.trim().length === 0 ? "Title is required" : "";
  }, [title, touched.title]);

  const contentError = useMemo(() => {
    if (!touched.content) return "";
    return content.trim().length === 0 ? "Content is required" : "";
  }, [content, touched.content]);

  const [createArticle, { loading, error }] = useMutation<CreateArticleResult, CreateArticleVars>(
    CREATE_ARTICLE
  );

  const imageUrlError = useMemo(() => {
    const v = imageUrl.trim();
    if (!v) return "";
    return isValidUrl(v) ? "" : "Invalid image URL";
  }, [imageUrl]);

  const canSubmit =
    Boolean(title.trim()) &&
    Boolean(content.trim()) &&
    !titleError &&
    !contentError &&
    !imageUrlError;

  const onSubmit = async () => {
    setTouched({ title: true, content: true });
    if (!canSubmit) return;

    const input: CreateInput = {
      title: title.trim(),
      content: content.trim(),
      imageUrl: imageUrl.trim() ? imageUrl.trim() : undefined
    };

    const res = await createArticle({ variables: { input } });
    const id = res.data?.createArticle?.id as string | undefined;

    if (id) {
      await router.push(`/article/${id}`);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <Typography variant="h4" fontWeight={800}>
          Create article
        </Typography>
        <Button component={Link} href="/" variant="outlined">
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
              error={Boolean(imageUrlError)}
              helperText={imageUrlError || " "}
              onChange={(e) => setImageUrl(e.target.value)}
              fullWidth
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button component={Link} href="/" variant="text" disabled={loading}>
                Cancel
              </Button>
              <Button variant="contained" onClick={onSubmit} disabled={loading || !canSubmit}>
                {loading ? "Creating..." : "Create"}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
