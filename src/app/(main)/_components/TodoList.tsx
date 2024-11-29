"use client";

import { api } from "~/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import CreateTodo from "./CreateTodo";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import Todo from "~/components/custom/Todo";
import { Skeleton } from "~/components/ui/skeleton";

export default function TodoList() {
  const [isOpen, setIsOpen] = useState(false);

  const todos = api.todo.getTodos.useQuery();

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>New Todo</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Todo</DialogTitle>
            <DialogDescription>Add a new todo to your list</DialogDescription>
            <CreateTodo
              todos={todos}
              closeDialog={() => {
                setIsOpen(false);
              }}
              className="w-full pt-4"
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <div className="mt-4">
        {!todos.isLoading ? (
          <div className="flex flex-col space-y-2">
            {todos.data?.map((todo) => (
              <div key={todo.id}>
                <Todo todo={todo} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col space-y-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex space-x-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <div className="w-full space-y-1">
                  <Skeleton className="h-6 w-[450px]" />
                  <Skeleton className="h-4 w-[400px]" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
