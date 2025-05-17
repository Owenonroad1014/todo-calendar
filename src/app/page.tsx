// app/page.tsx
"use client";
import { useState, useCallback } from "react";
import { SearchAndFilter } from "./components/SearchAndFilter";
import { SortableList } from "./components/SortableList";
import { Calendar } from "./components/Calendar";
import { Todo } from "./types/todo";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal";
import { v4 as uuidv4 } from "uuid";

type ViewMode = "list" | "calendar";

export default function Home() {
  const [todos, setTodos] = useLocalStorage<Todo[]>("todos", []);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");

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
      setDeleteModalOpen(false);
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
    <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold">待辦事項日曆</h1>
        <div className="flex gap-2 sm:gap-4">
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-sm sm:text-base ${
              viewMode === "list"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            列表視圖
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-sm sm:text-base ${
              viewMode === "calendar"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            日曆視圖
          </button>
        </div>
      </div>

      <div className="mb-4 sm:mb-8">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <input
              type="text"
              name="title"
              placeholder="新增待辦事項..."
              className="w-full sm:flex-1 px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              required
            />
            <div className="flex gap-2 sm:gap-4">
              <input
                type="datetime-local"
                name="dueDate"
                min={new Date().toISOString().slice(0, 16)}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                required
              />
              <button
                type="submit"
                className="px-4 sm:px-6 py-1.5 sm:py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm sm:text-base whitespace-nowrap"
              >
                新增
              </button>
            </div>
          </div>
        </form>
      </div>

      {viewMode === "list" && (
        <>
          <SearchAndFilter onSearch={setSearchQuery} onFilter={setFilter} />
          <SortableList
            todos={filteredTodos}
            onSortEnd={handleSort}
            onToggle={handleToggle}
            onDelete={handleDeleteTodo}
          />
        </>
      )}

      {viewMode === "calendar" && (
        <Calendar
          todos={filteredTodos}
          onToggle={handleToggle}
          onDelete={handleDeleteTodo}
        />
      )}

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        todoTitle={todoToDelete?.title}
      />
    </main>
  );
}
