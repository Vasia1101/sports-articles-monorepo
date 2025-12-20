import "dotenv/config";
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";

async function main() {
  const app = express();

  const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? "http://localhost:3000";

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (origin === FRONTEND_ORIGIN) {
          return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
      },
      credentials: true
    })
  );
  app.use(express.json());

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  app.use("/graphql", expressMiddleware(server));

  const PORT = Number(process.env.PORT ?? 4000);
  const HOST =
    process.env.NODE_ENV === "production"
      ? "https://sports-articles-monorepo.onrender.com"
      : `http://localhost:${PORT}`;
  app.listen(PORT, () => {
    console.log(`Backend ready: ${HOST}/graphql`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
