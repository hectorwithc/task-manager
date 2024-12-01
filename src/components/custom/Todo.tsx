"use client";

import { type InferSelectModel } from "drizzle-orm";
import { type todos } from "~/server/db/schema";
import { Checkbox } from "~/components/ui/checkbox";
import { useState } from "react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Archive, ArchiveRestore } from "lucide-react";

export default function Todo({
  todo,
  onComplete,
  onUnComplete,
  onArchive,
  onUnArchive,
}: {
  todo: InferSelectModel<typeof todos>;
  onComplete: () => void;
  onUnComplete: () => void;
  onArchive: () => void;
  onUnArchive: () => void;
}) {
  const [isComplete, setIsComplete] = useState(todo.isComplete);
  const [isArchived, setIsArchived] = useState(todo.todoState === "ARCHIVED");

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
    }
  })

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
      <div className="flex flex-col w-full">
        <p
          className="text-xl"
          style={{ textDecoration: isComplete ? "line-through" : "none" }}
        >
          {todo.name}
        </p>
        <p className="text-muted-foreground">{todo.description}</p>
      </div>
      <div>
        <Button onClick={() => { archiveTodo.mutate({
          id: todo.id,
          isArchived: !isArchived
        }) }} size={"icon"} variant={(isArchived ? "secondary": "ghost")}>
          {isArchived ?
            <ArchiveRestore />
            :
            <Archive />
          }
        </Button>
      </div>
    </div>
  );
}
