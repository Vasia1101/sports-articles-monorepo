import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";

async function main() {
  const app = express();

  app.use(cors({ origin: true, credentials: true }));
  app.use(bodyParser.json());

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  app.use("/graphql", expressMiddleware(server));

  const port = Number(process.env.PORT ?? 4000);
  app.listen(port, () => {
    console.log(`🚀 Backend ready: http://localhost:${port}/graphql`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
