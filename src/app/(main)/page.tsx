"use client";

import TodoList, {
  toTodoCategoryType,
  type TodoCategoryType,
} from "./_components/TodoList";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const selectedTodoType: TodoCategoryType = toTodoCategoryType(
    searchParams.get("type") as unknown as string,
  );

  return (
    <main>
      <TodoList type={selectedTodoType} />
    </main>
  );
}
