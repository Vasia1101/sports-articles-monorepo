import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client/react";
import { createApolloClient } from "@/lib/apollo";
// MUI imports
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const client = createApolloClient();

const theme = createTheme({
  palette: { mode: "light" }
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
  );
}
