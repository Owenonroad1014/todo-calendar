// components/TodoForm.tsx
"use client";
import { useState } from 'react';

interface TodoFormProps {
  onSubmit: (todo: { title: string; dueDate?: Date }) => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    // 檢查日期是否小於現在
    if (dueDate) {
      const selectedDate = new Date(dueDate);
      const now = new Date();
      if (selectedDate < now) {
        alert('截止日期不能小於現在時間！');
        return;
      }
    }
    
    onSubmit({
      title: title.trim(),
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });
    setTitle('');
    setDueDate('');
  };

  // 取得現在時間作為最小日期
  const getMinDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          待辦事項
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="輸入待辦事項..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
          required
        />
      </div>
      
      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
          截止日期
        </label>
        <input
          id="dueDate"
          type="datetime-local"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          min={getMinDateTime()}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        新增待辦事項
      </button>
    </form>
  );
};