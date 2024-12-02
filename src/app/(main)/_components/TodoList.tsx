"use client";

import { Skeleton } from "~/components/ui/skeleton";
import Todo from "~/components/custom/Todo";
import CreateTodo from "./CreateTodo";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { type todos as todosSchema } from "~/server/db/schema";
import { type InferSelectModel } from "drizzle-orm";
import { useEffect, useState } from "react";
import { TodoListDropdownMenu } from "./TodoListDropdownMenu";

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

  const countTodos = api.todo.countTodos.useQuery();

  const [allTodosCount, setAllTodosCount] = useState(0);
  const [uncompletedTodosCount, setUncompletedTodosCount] = useState(0);
  const [completedTodosCount, setCompletedTodosCount] = useState(0);

  useEffect(() => {
    setTodosData(todos.data);
  }, [todos.data]);

  useEffect(() => {
    setAllTodosCount(countTodos.data?.all[0]?.count ?? 0);
    setUncompletedTodosCount(countTodos.data?.uncompleted[0]?.count ?? 0);
    setCompletedTodosCount(countTodos.data?.completed[0]?.count ?? 0);
  }, [countTodos.data]);

  function selectTodo(input: TodoCategoryType) {
    if (input === type) return;

    window.location.href = `/?type=${input}`;
  }

  function removeTodoFromList(id: number) {
    const updatedTodos = todosData?.filter((todo) => todo.id !== id);

    setTodosData(updatedTodos);
  }

  return (
    <div>
      <div className="flex justify-between">
        <div className="mx-2 md:mx-0 md:hidden">
          <TodoListDropdownMenu
            todoCategoryType={type}
            allTodosCount={allTodosCount}
            uncompletedTodosCount={uncompletedTodosCount}
            completedTodosCount={completedTodosCount}
          />
        </div>
        <div className="hidden space-x-1 md:flex">
          <Button
            variant={type === "all" ? "secondary" : "ghost"}
            onClick={() => selectTodo("all")}
          >
            All ({allTodosCount})
          </Button>
          <Button
            variant={type === "uncompleted" ? "secondary" : "ghost"}
            onClick={() => selectTodo("uncompleted")}
          >
            Uncompleted ({uncompletedTodosCount})
          </Button>
          <Button
            variant={type === "completed" ? "secondary" : "ghost"}
            onClick={() => selectTodo("completed")}
          >
            Completed ({completedTodosCount})
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
        <div className="mx-2 md:mx-0">
          <CreateTodo
            onCreateTodo={() => {
              setAllTodosCount(allTodosCount + 1);
              setUncompletedTodosCount(uncompletedTodosCount + 1);
            }}
            todos={todos}
          />
        </div>
      </div>
      <div className="mt-4">
        {!todos.isLoading ? (
          <div className="mx-2 flex flex-col space-y-2 md:mx-0">
            {todosData?.map((todo) => (
              <div key={todo.id}>
                <Todo
                  todo={todo}
                  todoCategoryType={type}
                  startComplete={() => {
                    setCompletedTodosCount(completedTodosCount + 1);
                    setUncompletedTodosCount(uncompletedTodosCount - 1);
                  }}
                  onComplete={() => {
                    if (type !== "uncompleted") return;

                    removeTodoFromList(todo.id);
                  }}
                  startUnComplete={() => {
                    setUncompletedTodosCount(uncompletedTodosCount + 1);
                    setCompletedTodosCount(completedTodosCount - 1);
                  }}
                  onUnComplete={() => {
                    if (type !== "completed") return;

                    removeTodoFromList(todo.id);
                  }}
                  startArchive={() => {
                    setAllTodosCount(allTodosCount - 1);

                    if (todo.isCompleted) {
                      setCompletedTodosCount(completedTodosCount - 1);
                    } else {
                      setUncompletedTodosCount(uncompletedTodosCount - 1);
                    }
                  }}
                  onArchive={() => {
                    removeTodoFromList(todo.id);
                  }}
                  startUnArchive={() => {
                    setAllTodosCount(allTodosCount + 1);

                    if (todo.isCompleted) {
                      setCompletedTodosCount(completedTodosCount + 1);
                    } else {
                      setUncompletedTodosCount(uncompletedTodosCount + 1);
                    }
                  }}
                  onUnArchive={() => {
                    if (type !== "archived") return;

                    removeTodoFromList(todo.id);
                  }}
                  startRemove={() => {
                    setAllTodosCount(allTodosCount - 1);

                    if (todo.isCompleted) {
                      setCompletedTodosCount(completedTodosCount - 1);
                    } else {
                      setUncompletedTodosCount(uncompletedTodosCount - 1);
                    }
                  }}
                  onRemove={() => {
                    removeTodoFromList(todo.id);
                  }}
                  startUnRemove={() => {
                    setAllTodosCount(allTodosCount + 1);

                    if (todo.isCompleted) {
                      setCompletedTodosCount(completedTodosCount + 1);
                    } else {
                      setUncompletedTodosCount(uncompletedTodosCount + 1);
                    }
                  }}
                  onUnRemove={() => {
                    if (type !== "deleted") return;

                    removeTodoFromList(todo.id);
                  }}
                  onDelete={() => {
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
          <div className="mx-2 flex flex-col space-y-6 md:mx-0">
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
