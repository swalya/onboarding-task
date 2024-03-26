import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

import resolvers from "@/graphql/Resolvers";
import typeDefs from "@/graphql/Schemas";

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(apolloServer, {
  context: async (request, response) => ({ request, response }),
});

export default handler;