// components/TodoList.tsx
"use client";
import React, { useState } from "react";
import { Todo } from "../types/todo";
import { DeleteConfirmModal } from "./DeleteConfirmModal";

interface TodoListProps {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

export const TodoList: React.FC<TodoListProps> = ({ todos, setTodos }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // 在刪除按鈕點擊時
  const handleDeleteClick = (todo: Todo) => {
    setTodoToDelete(todo);
    setIsDeleteModalOpen(true);
  };
  // 刪除待辦事項
  const deleteTodo = (id: string) => {
    if (id) {
      setTodos(todos.filter((todo) => todo.id !== id));
    }
  };

  if (todos.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">目前沒有待辦事項</div>
    );
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <div className="flex flex-col">
              <span
                className={`text-gray-800 ${
                  todo.completed ? "line-through text-gray-500" : ""
                }`}
              >
                {todo.title}
              </span>
              {todo.dueDate && (
                <span className="text-sm text-gray-500">
                  截止日期: {todo.dueDate.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => handleDeleteClick(todo)}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            刪除
          </button>

          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={() => {
              if (todoToDelete) {
                deleteTodo(todoToDelete.id);
              }
            }}
            todoTitle={todoToDelete?.title}
          />
        </div>
      ))}
    </div>
  );
};
