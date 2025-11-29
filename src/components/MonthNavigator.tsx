import React from 'react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

interface MonthNavigatorProps {
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
}

const MonthNavigator: React.FC<MonthNavigatorProps> = ({ currentMonth, setCurrentMonth }) => {
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth((prev: Date) => {
      const newMonth = new Date(prev.getFullYear(), prev.getMonth());
      newMonth.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newMonth;
    });
  };

  return (
    <header className="bg-white px-6 py-5 flex items-center justify-between border-b border-gray-200">
      {/* Przycisk poprzedni miesiąc */}
      <button 
        onClick={() => navigateMonth('prev')} 
        className="text-blue-500 hover:text-blue-600 transition-colors p-2 -ml-2"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      
      {/* Tytuł z aktualnym miesiącem */}
      <h1 className="text-2xl ios-title text-gray-900 capitalize">
        {format(currentMonth, 'LLLL yyyy', { locale: pl })}
      </h1>
      
      {/* Przycisk następny miesiąc */}
      <button 
        onClick={() => navigateMonth('next')} 
        className="text-blue-500 hover:text-blue-600 transition-colors p-2 -mr-2"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </header>
  );
};

export default MonthNavigator;
