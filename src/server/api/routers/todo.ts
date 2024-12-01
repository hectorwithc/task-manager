import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { todos } from "~/server/db/schema";

export const todoRouter = createTRPCRouter({
  getTodos: protectedProcedure
    .input(
      z.object({
        type: z.enum([
          "all",
          "uncompleted",
          "completed",
          "archived",
          "deleted",
        ]),
        limit: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      let todos;

      if (input.type === "all") {
        todos = await ctx.db.query.todos.findMany({
          where: (model, { eq, and }) =>
            and(
              eq(model.authorId, ctx.auth.userId),
              eq(model.todoState, "DEFAULT"),
            ),
          orderBy: (model) => desc(model.createdAt),
        });
      } else if (input.type === "uncompleted") {
        todos = await ctx.db.query.todos.findMany({
          where: (model, { eq, and }) =>
            and(
              eq(model.authorId, ctx.auth.userId),
              eq(model.isComplete, false),
              eq(model.todoState, "DEFAULT"),
            ),
          orderBy: (model) => desc(model.createdAt),
        });
      } else if (input.type === "completed") {
        todos = await ctx.db.query.todos.findMany({
          where: (model, { eq, and }) =>
            and(
              eq(model.authorId, ctx.auth.userId),
              eq(model.isComplete, true),
              eq(model.todoState, "DEFAULT"),
            ),
          orderBy: (model) => desc(model.createdAt),
        });
      } else if (input.type === "archived") {
        todos = await ctx.db.query.todos.findMany({
          where: (model, { eq, and }) =>
            and(
              eq(model.authorId, ctx.auth.userId),
              eq(model.todoState, "ARCHIVED"),
            ),
          orderBy: (model) => desc(model.createdAt),
        });
      } else if (input.type === "deleted") {
        todos = await ctx.db.query.todos.findMany({
          where: (model, { eq, and }) =>
            and(
              eq(model.authorId, ctx.auth.userId),
              eq(model.todoState, "DELETED"),
            ),
          orderBy: (model) => desc(model.createdAt),
        });
      }

      return todos;
    }),

  createTodo: protectedProcedure
    .input(
      z.object({ name: z.string().min(1), description: z.string().optional() }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(todos).values({
        name: input.name,
        description: input.description,
        authorId: ctx.auth.userId,
      });

      return { created: true };
    }),

  deleteTodo: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(todos)
        .where(
          and(eq(todos.id, input.id), eq(todos.authorId, ctx.auth.userId)),
        );

      return { deleted: true };
    }),

  completeTodo: protectedProcedure
    .input(z.object({ id: z.number(), isComplete: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(todos)
        .set({ isComplete: input.isComplete })
        .where(
          and(eq(todos.id, input.id), eq(todos.authorId, ctx.auth.userId)),
        );

      return { completed: input.isComplete };
    }),

  archiveTodo: protectedProcedure
    .input(z.object({ id: z.number(), isArchived: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      if (input.isArchived) {
        await ctx.db
        .update(todos)
        .set({ todoState: "ARCHIVED" })
        .where(
          and(eq(todos.id, input.id), eq(todos.authorId, ctx.auth.userId)),
        );
      } else {
        await ctx.db
          .update(todos)
          .set({ todoState: "DEFAULT" })
          .where(
            and(eq(todos.id, input.id), eq(todos.authorId, ctx.auth.userId)),
          );
      }

      return { archived: input.isArchived };
    }),

  updateTodo: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(todos)
        .set({ name: input.name, description: input.description })
        .where(
          and(eq(todos.id, input.id), eq(todos.authorId, ctx.auth.userId)),
        );

      return { updated: true };
    }),
});
