import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { todos } from "~/server/db/schema";

export const todoRouter = createTRPCRouter({
  getTodos: protectedProcedure.query(async ({ ctx }) => {
    const todos = await ctx.db.query.todos.findMany({
      where: (model, { eq }) => eq(model.authorId, ctx.auth.userId),
    });

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
      await ctx.db.delete(todos).where(eq(todos.id, input.id));

      return { deleted: true };
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
        .where(eq(todos.id, input.id));

      return { updated: true };
    }),
});
