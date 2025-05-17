// types/todo.ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
}