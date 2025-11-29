import React from 'react';
import type { Entry } from '../utils/dbOperations';

interface CategorySummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: Entry[];
}

const CategorySummaryModal: React.FC<CategorySummaryModalProps> = ({ isOpen, onClose, entries }) => {
  if (!isOpen) return null;

  const categoryTimes: { [key: string]: number } = {};
  entries.forEach(entry => {
    if (entry.category) { // Only count if category is not null
      const categoryName = entry.category;
      const entryTotalMinutes = entry.hours * 60 + entry.minutes;
      categoryTimes[categoryName] = (categoryTimes[categoryName] || 0) + entryTotalMinutes;
    }
  });

  const formatTime = (totalMins: number) => {
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-100 w-full max-w-md rounded-3xl shadow-2xl transform transition-all">
        {/* Nagłówek modala */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-gray-200">
          <h2 className="text-xl ios-title text-black">Podsumowanie kategorii</h2>
          <button 
            onClick={onClose}
            className="text-blue-500 hover:text-blue-600 ios-button text-base"
          >
            Zamknij
          </button>
        </div>

        {/* Zawartość modala */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          {Object.entries(categoryTimes).sort().map(([categoryName, totalMins]) => (
            <div key={categoryName} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
              <span className="ios-button text-gray-700">{categoryName}: </span>
              <span className="ios-title text-gray-900">{formatTime(totalMins)}</span>
            </div>
          ))}
          {Object.keys(categoryTimes).length === 0 && (
            <p className="text-gray-500 text-center py-4">Brak wpisów z przypisanymi kategoriami w tym miesiącu.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategorySummaryModal;
