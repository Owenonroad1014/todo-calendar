// components/SortableList.tsx
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Todo } from '../types/todo';
import dynamic from 'next/dynamic';

const SortableTodoItem = dynamic(
  () => import('./SortableTodoItem').then(mod => mod.SortableTodoItem),
  { ssr: false }
);

interface SortableListProps {
  todos: Todo[];
  onSortEnd: (oldIndex: number, newIndex: number) => void;
  onToggle: (id: string) => void;
  onDelete: (todo: Todo) => void;
}

export const SortableList: React.FC<SortableListProps> = ({ 
  todos, 
  onSortEnd,
  onToggle,
  onDelete 
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(event) => {
        const {active, over} = event;
        if (over && active.id !== over.id) {
          const oldIndex = todos.findIndex(t => t.id === active.id);
          const newIndex = todos.findIndex(t => t.id === over.id);
          onSortEnd(oldIndex, newIndex);
        }
      }}
    >
      <SortableContext
        items={todos}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {todos.map(todo => (
            <SortableTodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}