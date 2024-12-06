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
import PagnationComponent from "~/components/custom/PagnationComponent";

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

export default function TodoList({
  type,
  startingPage,
}: {
  type: TodoCategoryType;
  startingPage: number;
}) {
  const utils = api.useUtils();
  const [loadingData, setLoadingData] = useState(false);

  const todos = api.todo.getTodos.useQuery({
    type: type,
    page: startingPage,
    pageSize: 10,
  });
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

  /*
  function selectTodo(input: TodoCategoryType) {
    if (input === type) return;

    window.location.href = `/?type=${input}`;
  }
  */

  /*
  function removeTodoFromList(id: number) {
    const updatedTodos = todosData?.filter((todo) => todo.id !== id);

    setTodosData(updatedTodos);
  }
  */

  async function handleTodoCategoryChange(input: TodoCategoryType) {
    if (loadingData) return;

    window.history.pushState(
      null,
      "",
      new URL(`/?type=${input}&page=1`, window.location.href),
    );

    setLoadingData(true);

    const data = await utils.client.todo.getTodos.query({
      type: input,
      pageSize: 10,
      page: 1,
    });
    setTodosData(data);

    setLoadingData(false);
  }

  async function handlePageChange(input: number) {
    if (input < 1) return;

    if (loadingData) return;

    window.history.pushState(
      null,
      "",
      new URL(`/?type=${type}&page=${input}`, window.location.href),
    );

    setLoadingData(true);

    const data = await utils.client.todo.getTodos.query({
      type: type,
      pageSize: 10,
      page: input,
    });
    setTodosData(data);

    setLoadingData(false);
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
            onTodoCategoryChange={handleTodoCategoryChange}
          />
        </div>
        <div className="hidden space-x-1 md:flex">
          <Button
            variant={type === "all" ? "secondary" : "ghost"}
            onClick={() => handleTodoCategoryChange("all")}
          >
            All ({allTodosCount})
          </Button>
          <Button
            variant={type === "uncompleted" ? "secondary" : "ghost"}
            onClick={() => handleTodoCategoryChange("uncompleted")}
          >
            Uncompleted ({uncompletedTodosCount})
          </Button>
          <Button
            variant={type === "completed" ? "secondary" : "ghost"}
            onClick={() => handleTodoCategoryChange("completed")}
          >
            Completed ({completedTodosCount})
          </Button>
          <Button
            variant={type === "archived" ? "secondary" : "ghost"}
            onClick={() => handleTodoCategoryChange("archived")}
          >
            Archived
          </Button>
          <Button
            variant={type === "deleted" ? "secondary" : "ghost"}
            onClick={() => handleTodoCategoryChange("deleted")}
          >
            Deleted
          </Button>
        </div>
        <div className="mx-2 md:mx-0">
          <CreateTodo
            onCreateTodo={() => {
              void todos.refetch();

              setAllTodosCount(allTodosCount + 1);
              setUncompletedTodosCount(uncompletedTodosCount + 1);
            }}
          />
        </div>
      </div>
      <div className="mt-4">
        {!todos.isLoading && !loadingData ? (
          <div className="mx-2 flex flex-col space-y-2 md:mx-0">
            {todosData?.map((todo) => (
              <div key={todo.id}>
                <Todo
                  todo={todo}
                  todoCategoryType={type}
                  startComplete={() => {
                    if (
                      todo.todoState === "ARCHIVED" ||
                      todo.todoState === "DELETED"
                    )
                      return;

                    setCompletedTodosCount(completedTodosCount + 1);
                    setUncompletedTodosCount(uncompletedTodosCount - 1);
                  }}
                  onComplete={() => {
                    if (type !== "uncompleted") return;

                    void todos.refetch();

                    //removeTodoFromList(todo.id);
                  }}
                  startUnComplete={() => {
                    if (
                      todo.todoState === "ARCHIVED" ||
                      todo.todoState === "DELETED"
                    )
                      return;

                    setUncompletedTodosCount(uncompletedTodosCount + 1);
                    setCompletedTodosCount(completedTodosCount - 1);
                  }}
                  onUnComplete={() => {
                    if (type !== "completed") return;

                    void todos.refetch();

                    //removeTodoFromList(todo.id);
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
                    void todos.refetch();

                    //removeTodoFromList(todo.id);
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

                    void todos.refetch();

                    //removeTodoFromList(todo.id);
                  }}
                  startRemove={() => {
                    if (todo.todoState === "ARCHIVED") return;

                    setAllTodosCount(allTodosCount - 1);

                    if (todo.isCompleted) {
                      setCompletedTodosCount(completedTodosCount - 1);
                    } else {
                      setUncompletedTodosCount(uncompletedTodosCount - 1);
                    }
                  }}
                  onRemove={() => {
                    void todos.refetch();

                    //removeTodoFromList(todo.id);
                  }}
                  startUnRemove={() => {
                    if (todo.todoState === "ARCHIVED") return;

                    setAllTodosCount(allTodosCount + 1);

                    if (todo.isCompleted) {
                      setCompletedTodosCount(completedTodosCount + 1);
                    } else {
                      setUncompletedTodosCount(uncompletedTodosCount + 1);
                    }
                  }}
                  onUnRemove={() => {
                    if (type !== "deleted") return;

                    void todos.refetch();

                    //removeTodoFromList(todo.id);
                  }}
                  onDelete={() => {
                    void todos.refetch();

                    //removeTodoFromList(todo.id);
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
      <div className="py-4">
        <PagnationComponent
          startingPage={startingPage}
          pages={1000}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
