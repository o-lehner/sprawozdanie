import React from 'react';
import type { Entry } from '../utils/dbOperations';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

interface EntryListProps {
  entries: Entry[];
  onEdit: (entry: Entry) => void;
}

const EntryList: React.FC<EntryListProps> = ({ entries, onEdit }) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-xl ios-title">BRAK AKTYWNOŚCI</p>
        <p className="text-base mt-3">Kliknij przycisk poniżej, aby dodać nowe wpisy</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry: Entry) => (
        <div 
          key={entry.id} 
          onClick={() => onEdit(entry)}
          className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-start gap-4">
            {/* Treść zadania */}
            <div className="flex-1">
              <div className="flex justify-between items-center text-lg ios-title text-gray-900">
                <span>{entry.hours}h {entry.minutes}m</span>
                <span>{entry.category || 'Bez kategorii'}</span>
              </div>
              
              {/* Data */}
              <div className="text-sm text-gray-500 mt-2 ios-button">
                {format(new Date(entry.date), 'EEE dd MMM yyyy', { locale: pl })}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EntryList;
