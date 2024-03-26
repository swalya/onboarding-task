import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { CssBaseline, ThemeProvider } from "@mui/material";
import appTheme from "@/config/ThemeConfig";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import apolloClient from "@/graphql/ApolloClient";
import { ApolloProvider } from "@apollo/client";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={appTheme}>
        <DndProvider backend={HTML5Backend}>
          <CssBaseline />
          <Component {...pageProps} />
        </DndProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}