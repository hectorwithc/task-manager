"use client";

import { Skeleton } from "~/components/ui/skeleton";
import Todo from "~/components/custom/Todo";
import CreateTodo from "./CreateTodo";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { type todos as todosSchema } from "~/server/db/schema";
import { type InferSelectModel } from "drizzle-orm";
import { useEffect, useState } from "react";

export type TodoCategoryType =
  | "all"
  | "uncompleted"
  | "completed"
  | "archived"
  | "deleted";

export function toTodoCategoryType(input: string): TodoCategoryType {
  const validCategories: TodoCategoryType[] = [
    "all",
    "uncompleted",
    "completed",
    "archived",
    "deleted",
  ];
  return validCategories.includes(input as TodoCategoryType)
    ? (input as TodoCategoryType)
    : "all";
}

export default function TodoList({ type }: { type: TodoCategoryType }) {
  const todos = api.todo.getTodos.useQuery({ type: type });
  const [todosData, setTodosData] = useState<
    InferSelectModel<typeof todosSchema>[] | undefined
  >([]);

  useEffect(() => {
    setTodosData(todos.data);
  }, [todos.data]);

  function selectTodo(input: TodoCategoryType) {
    window.location.href = `/?type=${input}`;
  }

  function removeTodoFromList(id: number) {
    const updatedTodos = todosData?.filter((todo) => todo.id !== id);

    setTodosData(updatedTodos);
  }

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex space-x-1">
          <Button
            variant={type === "all" ? "secondary" : "ghost"}
            onClick={() => selectTodo("all")}
          >
            All
          </Button>
          <Button
            variant={type === "uncompleted" ? "secondary" : "ghost"}
            onClick={() => selectTodo("uncompleted")}
          >
            Uncompleted
          </Button>
          <Button
            variant={type === "completed" ? "secondary" : "ghost"}
            onClick={() => selectTodo("completed")}
          >
            Completed
          </Button>
          <Button
            variant={type === "archived" ? "secondary" : "ghost"}
            onClick={() => selectTodo("archived")}
          >
            Archived
          </Button>
          <Button
            variant={type === "deleted" ? "secondary" : "ghost"}
            onClick={() => selectTodo("deleted")}
          >
            Deleted
          </Button>
        </div>
        <CreateTodo todos={todos} />
      </div>
      <div className="mt-4">
        {!todos.isLoading ? (
          <div className="flex flex-col space-y-2">
            {todosData?.map((todo) => (
              <div key={todo.id}>
                <Todo
                  todo={todo}
                  onComplete={() => {
                    if (type !== "uncompleted") return;

                    removeTodoFromList(todo.id);
                  }}
                  onUnComplete={() => {
                    if (type !== "completed") return;

                    removeTodoFromList(todo.id);
                  }}
                  onArchive={() => {
                    removeTodoFromList(todo.id);
                  }}
                  onUnArchive={() => {
                    if (type !== "archived") return;

                    removeTodoFromList(todo.id);
                  }}
                />
              </div>
            ))}
            {todosData?.length == 0 && (
              <div className="mt-4">
                <p className="text-center text-muted-foreground">
                  No todos added yet...
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col space-y-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex space-x-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <div className="w-full space-y-1">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
