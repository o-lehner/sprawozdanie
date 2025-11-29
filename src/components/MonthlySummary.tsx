import React from 'react';
import type { Entry } from '../utils/dbOperations';

interface MonthlySummaryProps {
  entries: Entry[];
  onOpenCategorySummary: () => void; // New prop
}

const MonthlySummary: React.FC<MonthlySummaryProps> = ({ entries, onOpenCategorySummary }) => { // Destructure new prop
  const totalMinutes = entries.reduce((acc, entry) => acc + entry.hours * 60 + entry.minutes, 0);
  
  const formatTime = (totalMins: number) => { // Keep formatTime for overall total
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="text-base text-gray-600"> {/* Removed space-y-2 as it's just one line now */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2"> {/* New flex for "Ogólnie" and total time */}
            <span className="ios-button">Ogólnie: </span>
            <span className="ios-title text-gray-900">{formatTime(totalMinutes)}</span>
        </div>
        <button
            onClick={onOpenCategorySummary}
            className="text-blue-500 hover:text-blue-600 p-1 rounded-full ios-button"
            title="Pokaż podsumowanie kategorii"
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>
      </div>
    </div>
  );
};

export default MonthlySummary;
