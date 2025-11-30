import React, { useState, useEffect } from 'react';
import dbOperations, { type Entry } from '../utils/dbOperations';

interface CategorySummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: Entry[];
  currentMonth: Date;
}

const CategorySummaryModal: React.FC<CategorySummaryModalProps> = ({ isOpen, onClose, entries, currentMonth }) => {
  const [showYearlySummary, setShowYearlySummary] = useState(
    () => localStorage.getItem('showYearlySummary') === 'true'
  );
  const [yearlyEntries, setYearlyEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('showYearlySummary', String(showYearlySummary));
    
    if (isOpen && showYearlySummary) {
      const fetchYearlyData = async () => {
        setIsLoading(true);
        const data = await dbOperations.getEntriesByServiceYear(currentMonth);
        setYearlyEntries(data);
        setIsLoading(false);
      };
      fetchYearlyData();
    }
  }, [showYearlySummary, isOpen, currentMonth]);

  if (!isOpen) return null;

  const categoryTimes: { [key: string]: number } = {};
  entries.forEach(entry => {
    if (entry.category) {
      const categoryName = entry.category;
      const entryTotalMinutes = entry.hours * 60 + entry.minutes;
      categoryTimes[categoryName] = (categoryTimes[categoryName] || 0) + entryTotalMinutes;
    }
  });
  
  const yearlyTotalMinutes = yearlyEntries.reduce((sum, entry) => sum + (entry.hours * 60) + entry.minutes, 0);

  const formatTime = (totalMins: number) => {
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-100 w-full max-w-md rounded-3xl shadow-2xl transform transition-all">
                <div className="px-6 py-5 flex items-center justify-between">
                  <h2 className="text-xl ios-title text-black">Podsumowanie</h2>
                  <button
                    onClick={onClose}
                    className="text-blue-500 hover:text-blue-600 ios-button text-base"
                  >
                    Zamknij
                  </button>
                </div>
                <div className="mx-6 border-b border-gray-300"></div>
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          <div className="pb-4 mb-4 border-b border-gray-300">
            {Object.entries(categoryTimes).length > 0 ? (
              Object.entries(categoryTimes).sort().map(([categoryName, totalMins]) => (
                <div key={categoryName} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <span className="ios-button text-gray-700 capitalize">{categoryName}: </span>
                  <span className="ios-title text-gray-900">{formatTime(totalMins)}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Brak wpisów z kategoriami w tym miesiącu.</p>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label htmlFor="yearly-summary-toggle" className="ios-button text-gray-700">
                Podsumowanie roczne
              </label>
                                          <label htmlFor="yearly-summary-toggle" className="relative inline-flex cursor-pointer items-center">
                                            <input
                                              type="checkbox"
                                              id="yearly-summary-toggle"
                                              className="sr-only peer"
                                              checked={showYearlySummary}
                                              onChange={() => setShowYearlySummary(prev => !prev)}
                                            />
                                            <div className="w-16 h-8 bg-gray-200 rounded-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:bg-blue-600 transition-all duration-300"></div>
                                            <div className="absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition-all duration-300 peer-checked:translate-x-[16px]"></div>
                                          </label>            </div>
            
            {showYearlySummary && (
              <div className="bg-white rounded-xl p-4 text-center">
                {isLoading ? (
                  <p className="ios-title text-gray-500">Ładowanie...</p>
                ) : (
                  <div>
                    <span className="ios-title text-2xl text-gray-900">{formatTime(yearlyTotalMinutes)}</span>

                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySummaryModal;
