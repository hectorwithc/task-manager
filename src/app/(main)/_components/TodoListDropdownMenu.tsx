"use client";

import * as React from "react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { type TodoCategoryType } from "./TodoList";

export function TodoListDropdownMenu({
  todoCategoryType,
}: {
  todoCategoryType: TodoCategoryType;
}) {
  const [position, setPosition] = React.useState(todoCategoryType.toString());

  function selectTodo(input: TodoCategoryType) {
    window.location.href = `/?type=${input}`;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {position.charAt(0).toUpperCase() + position.substring(1)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Todo Category</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuRadioItem value="all" onClick={() => selectTodo("all")}>
            All
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="uncompleted"
            onClick={() => selectTodo("uncompleted")}
          >
            Uncompleted
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="completed"
            onClick={() => selectTodo("completed")}
          >
            Completed
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="archived"
            onClick={() => selectTodo("archived")}
          >
            Archived
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="deleted"
            onClick={() => selectTodo("deleted")}
          >
            Deleted
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
