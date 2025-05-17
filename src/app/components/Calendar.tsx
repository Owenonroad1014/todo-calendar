import { Todo } from "../types/todo";
import { useState, useEffect } from "react";

interface CalendarProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (todo: Todo) => void;
}

export function Calendar({ todos, onToggle, onDelete }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // 格式化時間的函數
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

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

  if (!mounted) {
    return (
      <div className="min-h-[500px] bg-white rounded-lg shadow animate-pulse" />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex items-center justify-between p-1.5 sm:p-3 border-b">
        <button
          onClick={goToPreviousMonth}
          className="p-1 sm:p-2 hover:bg-gray-100 rounded-full text-lg sm:text-xl"
        >
          ←
        </button>
        <h2 className="text-lg sm:text-xl font-semibold">
          {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
        </h2>
        <button
          onClick={goToNextMonth}
          className="p-1 sm:p-2 hover:bg-gray-100 rounded-full text-lg sm:text-xl"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
          <div
            key={day}
            className="bg-gray-50 p-1 sm:p-2 text-center font-medium text-gray-700 text-sm sm:text-base"
          >
            {day}
          </div>
        ))}

        {calendarDays.map(({ date, isCurrentMonth, todos }, index) => (
          <div
            key={index}
            className={`bg-white p-1.5 sm:p-3 min-h-[90px] sm:min-h-[120px] ${
              isCurrentMonth ? "text-gray-900" : "text-gray-400"
            } hover:bg-gray-50 transition-colors`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-sm sm:text-base text-gray-800">
                {date.getDate()}
              </div>
              {todos.length > 0 && mounted && (
                <div className="text-xs sm:text-sm px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                  {todos.length}
                </div>
              )}
            </div>
            <div className="space-y-1.5 overflow-y-auto max-h-[65px] sm:max-h-[85px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {mounted &&
                todos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`text-xs sm:text-sm p-1.5 sm:p-2 rounded-md shadow-sm ${
                      todo.completed
                        ? "bg-green-50 border border-green-200 text-green-800 line-through"
                        : "bg-blue-50 border border-blue-200 text-blue-800"
                    } hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start gap-1.5">
                      <button
                        onClick={() => onToggle(todo.id)}
                        className={`flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded border ${
                          todo.completed
                            ? "bg-green-500 border-green-500"
                            : "border-blue-400"
                        } relative`}
                      >
                        {todo.completed && (
                          <svg
                            className="absolute inset-0 w-full h-full text-white p-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{todo.title}</div>
                        {todo.dueDate && (
                          <div className="text-xs text-gray-600 mt-0.5">
                            {formatTime(new Date(todo.dueDate))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => onDelete(todo)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                      >
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
