"use client";

import { type InferSelectModel } from "drizzle-orm";
import { type todos } from "~/server/db/schema";
import { Checkbox } from "~/components/ui/checkbox";
import { useState } from "react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Archive, ArchiveRestore, Trash, Trash2 } from "lucide-react";
import { type TodoCategoryType } from "~/app/(main)/_components/TodoList";

export default function Todo({
  todo,
  todoCategoryType,
  onComplete,
  onUnComplete,
  onArchive,
  onUnArchive,
  onRemove,
  onUnRemove,
  onDelete,
}: {
  todo: InferSelectModel<typeof todos>;
  todoCategoryType: TodoCategoryType;
  onComplete: () => void;
  onUnComplete: () => void;
  onArchive: () => void;
  onUnArchive: () => void;
  onRemove: () => void;
  onUnRemove: () => void;
  onDelete: () => void;
}) {
  const [isComplete, setIsComplete] = useState(todo.isComplete);
  const [isArchived, setIsArchived] = useState(todo.todoState === "ARCHIVED");
  const [isRemoved, setIsRemoved] = useState(todo.todoState === "DELETED");

  const completeTodo = api.todo.completeTodo.useMutation({
    onMutate: ({ isComplete }) => {
      setIsComplete(isComplete);
    },
    onSuccess: ({ completed }) => {
      if (completed) {
        onComplete();

        toast.success("Todo completed", {
          description: "Todo marked as completed",
          richColors: true,
        });
      } else {
        onUnComplete();

        toast.success("Todo uncompleted", {
          description: "Todo marked as uncompleted",
          richColors: true,
        });
      }
    },
  });

  const archiveTodo = api.todo.archiveTodo.useMutation({
    onMutate: ({ isArchived }) => {
      setIsArchived(isArchived);
    },
    onSuccess: ({ archived }) => {
      if (archived) {
        onArchive();

        toast.success("Todo archived", {
          description: "Todo marked as archived",
          richColors: true,
        });
      } else {
        onUnArchive();

        toast.success("Todo unarchived", {
          description: "Todo marked as unarchived",
          richColors: true,
        });
      }
    },
  });

  const removeTodo = api.todo.removeTodo.useMutation({
    onMutate: ({ isRemoved }) => {
      setIsRemoved(isRemoved);
    },
    onSuccess: ({ removed }) => {
      if (removed) {
        onRemove();

        toast.success("Todo deleted", {
          description: "Todo marked as deleted",
          richColors: true,
        });
      } else {
        onUnRemove();

        toast.success("Todo undeleted", {
          description: "Todo marked has been undeleted",
          richColors: true,
        });
      }
    },
  });

  const deleteTodo = api.todo.deleteTodo.useMutation({
    onSuccess: () => {
      onDelete();

      toast.success("Todo fully deleted", {
        description: "Todo has been deleted",
        richColors: true,
      });
    },
  });

  return (
    <div className="flex items-center space-x-2 rounded-md border-2 px-3 py-2">
      <Checkbox
        checked={isComplete}
        onCheckedChange={(checked) => {
          completeTodo.mutate({
            id: todo.id,
            isComplete: checked.valueOf() as boolean,
          });
        }}
      />
      <div className="flex w-full flex-col">
        <p
          className="text-xl"
          style={{ textDecoration: isComplete ? "line-through" : "none" }}
        >
          {todo.name}
        </p>
        <p className="text-muted-foreground">{todo.description}</p>
      </div>
      <div className="flex items-center justify-center space-x-1">
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
        {todoCategoryType !== "deleted" ? (
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
        ) : (
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
        )}
      </div>
    </div>
  );
}
