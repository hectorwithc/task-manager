"use client";

import { type InferSelectModel } from "drizzle-orm";
import { type todos } from "~/server/db/schema";
import { Checkbox } from "~/components/ui/checkbox";
import { useState } from "react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Archive, ArchiveRestore, Trash, Trash2, X } from "lucide-react";
import { type TodoCategoryType } from "~/app/(main)/_components/TodoList";
import posthog from "posthog-js";

export default function Todo({
  todo,
  todoCategoryType,
  startComplete,
  onComplete,
  startUnComplete,
  onUnComplete,
  startArchive,
  onArchive,
  startUnArchive,
  onUnArchive,
  startRemove,
  onRemove,
  startUnRemove,
  onUnRemove,
  onDelete,
}: {
  todo: InferSelectModel<typeof todos>;
  todoCategoryType: TodoCategoryType;
  startComplete: () => void;
  onComplete: () => void;
  startUnComplete: () => void;
  onUnComplete: () => void;
  startArchive: () => void;
  onArchive: () => void;
  startUnArchive: () => void;
  onUnArchive: () => void;
  startRemove: () => void;
  onRemove: () => void;
  startUnRemove: () => void;
  onUnRemove: () => void;
  onDelete: () => void;
}) {
  const [isCompleted, setisCompleted] = useState(todo.isCompleted);
  const [isArchived, setIsArchived] = useState(todo.todoState === "ARCHIVED");
  const [isRemoved, setIsRemoved] = useState(todo.todoState === "DELETED");

  const completeTodo = api.todo.completeTodo.useMutation({
    onMutate: ({ isCompleted }) => {
      setisCompleted(isCompleted);

      if (isCompleted) {
        startComplete();
      } else {
        startUnComplete();
      }
    },
    onSuccess: ({ completed }) => {
      if (completed) {
        onComplete();

        toast.success("Todo completed", {
          description: "Todo marked as completed",
          richColors: true,
        });

        posthog.capture("todo-completed", { id: todo.id });
      } else {
        onUnComplete();

        toast.success("Todo uncompleted", {
          description: "Todo marked as uncompleted",
          richColors: true,
        });

        posthog.capture("todo-uncompleted", { id: todo.id });
      }
    },
    onError: (error) => {
      toast.error("Error", {
        description: error.message,
        richColors: true,
      });
    },
  });

  const archiveTodo = api.todo.archiveTodo.useMutation({
    onMutate: ({ isArchived }) => {
      setIsArchived(isArchived);

      if (isArchived) {
        startArchive();
      } else {
        startUnArchive();
      }
    },
    onSuccess: ({ archived }) => {
      if (archived) {
        onArchive();

        toast.success("Todo archived", {
          description: "Todo marked as archived",
          richColors: true,
        });

        posthog.capture("todo-archived", { id: todo.id });
      } else {
        onUnArchive();

        toast.success("Todo unarchived", {
          description: "Todo marked as unarchived",
          richColors: true,
        });

        posthog.capture("todo-unarchived", { id: todo.id });
      }
    },
    onError: (error) => {
      toast.error("Error", {
        description: error.message,
        richColors: true,
      });
    },
  });

  const removeTodo = api.todo.removeTodo.useMutation({
    onMutate: ({ isRemoved }) => {
      setIsRemoved(isRemoved);

      if (isRemoved) {
        startRemove();
      } else {
        startUnRemove();
      }
    },
    onSuccess: ({ removed }) => {
      if (removed) {
        onRemove();

        toast.success("Todo deleted", {
          description: "Todo moved to trash",
          richColors: true,
        });

        posthog.capture("todo-removed", { id: todo.id });
      } else {
        onUnRemove();

        toast.success("Todo undeleted", {
          description: "Todo moved from trash",
          richColors: true,
        });

        posthog.capture("todo-unremoved", { id: todo.id });
      }
    },
    onError: (error) => {
      toast.error("Error", {
        description: error.message,
        richColors: true,
      });
    },
  });

  const deleteTodo = api.todo.deleteTodo.useMutation({
    onSuccess: () => {
      onDelete();

      toast.success("Todo fully deleted", {
        description: "Todo has been deleted",
        richColors: true,
      });

      posthog.capture("todo-deleted", { id: todo.id });
    },
    onError: (error) => {
      toast.error("Error", {
        description: error.message,
        richColors: true,
      });
    },
  });

  return (
    <div className="flex items-center space-x-2 rounded-md border-2 px-3 py-2">
      <Checkbox
        checked={isCompleted}
        className="ml-1 mr-2 h-5 w-5 rounded-none"
        onCheckedChange={(checked) => {
          completeTodo.mutate({
            id: todo.id,
            isCompleted: checked.valueOf() as boolean,
          });
        }}
      />
      <div className="flex w-full flex-col">
        <p
          className="text-xl"
          style={{ textDecoration: isCompleted ? "line-through" : "none" }}
        >
          {todo.name}
        </p>
        <p className="text-muted-foreground">{todo.description}</p>
      </div>
      <div className="flex items-center justify-center space-x-1">
        {todoCategoryType !== "deleted" ? (
          <>
            <Button
              onClick={() => {
                archiveTodo.mutate({
                  id: todo.id,
                  isArchived: !isArchived,
                });
              }}
              size={"icon"}
              variant={isArchived ? "secondary" : "ghost"}
            >
              {isArchived ? <ArchiveRestore /> : <Archive />}
            </Button>
            <Button
              onClick={() => {
                removeTodo.mutate({
                  id: todo.id,
                  isRemoved: !isRemoved,
                });
              }}
              size={"icon"}
              variant={isRemoved ? "secondary" : "ghost"}
            >
              {isRemoved ? <Trash2 /> : <Trash />}
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => {
                removeTodo.mutate({
                  id: todo.id,
                  isRemoved: !isRemoved,
                });
              }}
              size={"icon"}
              variant={"ghost"}
            >
              <X />
            </Button>
            <Button
              onClick={() => {
                deleteTodo.mutate({
                  id: todo.id,
                });
              }}
              size={"icon"}
              variant={"ghost"}
            >
              <Trash2 />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
