// components/SearchAndFilter.tsx
"use client";
import React, { useState } from 'react';
interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilter: (status: 'all' | 'active' | 'completed') => void;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  onSearch,
  onFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            onSearch(e.target.value);
          }}
          placeholder="搜尋待辦事項..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onFilter('all')}
          className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200
          text-black"
        >
          全部
        </button>
        <button
          onClick={() => onFilter('active')}
          className="px-4 py-2 bg-blue-100 rounded-md hover:bg-blue-200
          text-black"
        >
          進行中
        </button>
        <button
          onClick={() => onFilter('completed')}
          className="px-4 py-2 bg-green-100 rounded-md hover:bg-green-200
          text-black"
        >
          已完成
        </button>
      </div>
    </div>
  );
}