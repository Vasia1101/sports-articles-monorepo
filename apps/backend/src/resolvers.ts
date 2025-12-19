import { PrismaClient } from "@prisma/client";
import { GraphQLError } from "graphql";
import { articleInputSchema } from "./validation";

const prisma = new PrismaClient();

const userError = (message: string, details?: unknown) =>
  new GraphQLError(message, {
    extensions: {
      code: "BAD_USER_INPUT",
      details
    }
  });

export const resolvers = {
  Query: {
    articles: async (_: unknown, args: { offset?: number; limit?: number }) => {
      const offset = Math.max(0, args.offset ?? 0);
      const limit = Math.min(20, args.limit ?? 10);

      return prisma.sportsArticle.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit
      });
    },

    article: async (_: unknown, args: { id: string }) => {
      return prisma.sportsArticle.findFirst({
        where: { id: args.id, deletedAt: null }
      });
    },

    articlesPage: async (_: unknown, args: { offset?: number; limit?: number }) => {
      const offset = args.offset ?? 0;
      const limit = args.limit ?? 10;

      const where = { deletedAt: null as any };

      const [items, totalCount] = await Promise.all([
        prisma.sportsArticle.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: offset,
          take: limit
        }),
        prisma.sportsArticle.count({ where })
      ]);

      return { items, totalCount };
    }
  },

  Mutation: {
    createArticle: async (_: unknown, args: { input: any }) => {
      const parsed = articleInputSchema.safeParse(args.input);
      if (!parsed.success) {
        throw userError("Validation failed", parsed.error.flatten());
      }

      return prisma.sportsArticle.create({
        data: parsed.data
      });
    },

    updateArticle: async (_: unknown, args: { id: string; input: any }) => {
      const parsed = articleInputSchema.safeParse(args.input);
      if (!parsed.success) {
        throw userError("Validation failed", parsed.error.flatten());
      }

      const existing = await prisma.sportsArticle.findFirst({
        where: { id: args.id, deletedAt: null }
      });

      if (!existing) {
        throw new GraphQLError("Article not found", {
          extensions: { code: "NOT_FOUND" }
        });
      }

      return prisma.sportsArticle.update({
        where: { id: args.id },
        data: parsed.data
      });
    },

    deleteArticle: async (_: unknown, args: { id: string }) => {
      const existing = await prisma.sportsArticle.findFirst({
        where: { id: args.id, deletedAt: null }
      });

      if (!existing) {
        throw new GraphQLError("Article not found", {
          extensions: { code: "NOT_FOUND" }
        });
      }

      await prisma.sportsArticle.update({
        where: { id: args.id },
        data: { deletedAt: new Date() }
      });

      return true;
    }
  }
};
