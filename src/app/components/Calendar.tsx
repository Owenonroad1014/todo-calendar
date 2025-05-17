import { Todo } from "../types/todo";
import { useState } from "react";

interface CalendarProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (todo: Todo) => void;
}

export function Calendar({ todos, onToggle, onDelete }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // 獲取當月的天數
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  // 獲取當月第一天是星期幾
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  // 生成日曆網格
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const dayNumber = i - firstDayOfMonth + 1;
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      dayNumber
    );

    // 獲取該日期的所有待辦事項
    const dayTodos = todos.filter((todo) => {
      if (!todo.dueDate) return false;
      const todoDate = new Date(todo.dueDate);
      return (
        todoDate.getDate() === date.getDate() &&
        todoDate.getMonth() === date.getMonth() &&
        todoDate.getFullYear() === date.getFullYear()
      );
    });

    return {
      date,
      isCurrentMonth: dayNumber > 0 && dayNumber <= daysInMonth,
      todos: dayTodos,
    };
  });

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex items-center justify-between p-4 border-b">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          ←
        </button>
        <h2 className="text-xl font-semibold">
          {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
        </h2>
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
          <div
            key={day}
            className="bg-gray-50 p-2 text-center font-medium text-gray-700"
          >
            {day}
          </div>
        ))}

        {calendarDays.map(({ date, isCurrentMonth, todos }, index) => (
          <div
            key={index}
            className={`bg-white p-2 min-h-[100px] ${
              isCurrentMonth ? "text-gray-900" : "text-gray-400"
            }`}
          >
            <div className="font-medium mb-1 text-gray-800">
              {date.getDate()}
            </div>
            <div className="space-y-1">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`text-sm p-1 rounded ${
                    todo.completed
                      ? "bg-green-100 text-green-800 line-through"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      onClick={() => onToggle(todo.id)}
                      className="cursor-pointer flex-1 hover:text-blue-600"
                    >
                      {todo.title}
                    </span>
                    <button
                      onClick={() => onDelete(todo)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      ×
                    </button>
                  </div>
                  {todo.dueDate && (
                    <div className="text-xs text-gray-600">
                      {new Date(todo.dueDate).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
