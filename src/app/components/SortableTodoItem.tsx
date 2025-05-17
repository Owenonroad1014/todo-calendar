// components/SortableTodoItem.tsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Todo } from '../types/todo';

interface SortableTodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (todo: Todo) => void;
}

export const SortableTodoItem = ({ todo, onToggle, onDelete }: SortableTodoItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer"
        />
        <div 
          className="flex flex-col cursor-move" 
          {...attributes}
          {...listeners}
        >
          <span className={`text-gray-800 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
            {todo.title}
          </span>
          {todo.dueDate && (
            <span className="text-sm text-gray-500">
              截止日期: {new Date(todo.dueDate).toLocaleString()}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={() => onDelete(todo)}
        className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
      >
        刪除
      </button>
    </div>
  );
};