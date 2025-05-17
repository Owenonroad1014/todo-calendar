// app/page.tsx
"use client";
import { useState, useCallback } from "react";
import { SearchAndFilter } from "./components/SearchAndFilter";
import { SortableList } from "./components/SortableList";
import { Todo } from "./types/todo";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [todos, setTodos] = useLocalStorage<Todo[]>("todos", []);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const title = formData.get("title") as string;
      const dueDateStr = formData.get("dueDate") as string;

      const newTodo: Todo = {
        id: uuidv4(),
        title,
        completed: false,
        dueDate: dueDateStr ? new Date(dueDateStr) : undefined,
      };

      setTodos((prev) => [...prev, newTodo]);
      (e.target as HTMLFormElement).reset();
    },
    [setTodos]
  );

  const handleToggle = useCallback(
    (id: string) => {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    },
    [setTodos]
  );

  const handleSort = useCallback(
    (oldIndex: number, newIndex: number) => {
      setTodos((prev) => {
        const copy = [...prev];
        const [removed] = copy.splice(oldIndex, 1);
        copy.splice(newIndex, 0, removed);
        return copy;
      });
    },
    [setTodos]
  );

  const handleDeleteTodo = useCallback((todo: Todo) => {
    setTodoToDelete(todo);
    setDeleteModalOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (todoToDelete) {
      setTodos((prev) => prev.filter((todo) => todo.id !== todoToDelete.id));
      setTodoToDelete(null);
    }
  }, [todoToDelete, setTodos]);

  const filteredTodos = todos
    .filter((todo) => {
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    })
    .filter((todo) =>
      todo.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Todo App</h1>

      <div className="mb-8">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <input
              type="text"
              name="title"
              placeholder="新增待辦事項..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
              text-white placeholder-gray-400"
              required
            />
            <input
              type="datetime-local"
              name="dueDate"
              min={new Date().toISOString().slice(0, 16)}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              新增
            </button>
          </div>
        </form>
      </div>

      <SearchAndFilter onSearch={setSearchQuery} onFilter={setFilter} />

      <SortableList
        todos={filteredTodos}
        onSortEnd={handleSort}
        onToggle={handleToggle}
        onDelete={handleDeleteTodo}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        todoTitle={todoToDelete?.title}
      />
    </main>
  );
}
