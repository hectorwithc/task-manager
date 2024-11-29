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

export default function AllTodos() {
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

      {!todos.isLoading ? (
        <div>
          {todos.data?.map((todo) => <div key={todo.id}>{todo.name}</div>)}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
