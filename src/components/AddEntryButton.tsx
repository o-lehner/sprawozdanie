import React from 'react';

interface AddEntryButtonProps {
  onAddEntry: () => void;
}

const AddEntryButton: React.FC<AddEntryButtonProps> = ({ onAddEntry }) => {
  return (
    <button
      onClick={onAddEntry}
      className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white ios-button text-lg py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m-4-4h8"/>
      </svg>
      Dodaj wpis
    </button>
  );
};

export default AddEntryButton;
