import { TRPCError } from "@trpc/server";
import { and, count, desc, eq } from "drizzle-orm";
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
              eq(model.isCompleted, false),
              eq(model.todoState, "DEFAULT"),
            ),
          orderBy: (model) => desc(model.createdAt),
        });
      } else if (input.type === "completed") {
        todos = await ctx.db.query.todos.findMany({
          where: (model, { eq, and }) =>
            and(
              eq(model.authorId, ctx.auth.userId),
              eq(model.isCompleted, true),
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
    .input(z.object({ id: z.number(), isCompleted: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(todos)
        .set({ isCompleted: input.isCompleted })
        .where(
          and(eq(todos.id, input.id), eq(todos.authorId, ctx.auth.userId)),
        );

      return { completed: input.isCompleted };
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

  removeTodo: protectedProcedure
    .input(z.object({ id: z.number(), isRemoved: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      if (input.isRemoved) {
        await ctx.db
          .update(todos)
          .set({ todoState: "DELETED" })
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

      return { removed: input.isRemoved };
    }),

  countTodos: protectedProcedure.query(async ({ ctx }) => {
    const allTodosCount = await ctx.db
      .select({ count: count() })
      .from(todos)
      .where(
        and(
          eq(todos.todoState, "DEFAULT"),
          eq(todos.authorId, ctx.auth.userId),
        ),
      );

    const uncompletedTodosCount = await ctx.db
      .select({ count: count() })
      .from(todos)
      .where(
        and(
          eq(todos.todoState, "DEFAULT"),
          eq(todos.authorId, ctx.auth.userId),
          eq(todos.isCompleted, false),
        ),
      );

    const completedTodosCount = await ctx.db
      .select({ count: count() })
      .from(todos)
      .where(
        and(
          eq(todos.todoState, "DEFAULT"),
          eq(todos.authorId, ctx.auth.userId),
          eq(todos.isCompleted, true),
        ),
      );

    return {
      all: allTodosCount,
      uncompleted: uncompletedTodosCount,
      completed: completedTodosCount,
    };
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
