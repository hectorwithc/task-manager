import { api } from "~/trpc/server";

export default async function AllTodos() {
  const todos = await api.todo.getTodos();

  return (
    <div>
      {todos ? (
        <div>
          {todos.map((todo) => (
            <div key={todo.id}>{todo.name}</div>
          ))}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
