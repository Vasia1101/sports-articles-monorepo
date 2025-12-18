import type { GetServerSideProps } from "next";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { createApolloClient } from "@/lib/apollo";
import { ARTICLES } from "@/graphql/queries";

type Article = {
  id: string;
  title: string;
  createdAt?: string | null;
};

type ArticlesQueryData = {
  articles: Article[];
};

type ArticlesQueryVars = {
  offset: number;
  limit: number;
};


export default function Home(props: { initialData: ArticlesQueryData }) {
  const { data, loading, error } = useQuery<ArticlesQueryData, ArticlesQueryVars>(ARTICLES, {
    variables: { offset: 0, limit: 10 },
    fetchPolicy: "cache-first"
  });

  const items = data?.articles ?? props.initialData?.articles ?? [];

  const formatDate = (v?: string) =>
  v ? new Date(Number(v)).toLocaleDateString() : "";


  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>Sports Articles</h1>
        <Link href="/article/create">Create article</Link>
      </header>

      {error && <p style={{ color: "crimson" }}>Error: {error.message}</p>}
      {loading && items.length === 0 && <p>Loading...</p>}

      <ul style={{ listStyle: "none", padding: 0, marginTop: 16 }}>
        {items.map((a: any) => (
          <li key={a.id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12, marginBottom: 10 }}>
            <Link href={`/article/${a.id}`} style={{ fontWeight: 700 }}>
              {a.title}
            </Link>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              {formatDate(a.createdAt)}
            </div>
          </li>
        ))}
      </ul>
    </main>
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
