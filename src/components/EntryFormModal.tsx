import React, { useState, useEffect } from 'react';
import type { Entry, Category } from '../utils/dbOperations';
import { DatePicker } from './ui/date-picker';
import { format } from 'date-fns';

interface EntryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<Entry, 'id'>) => void;
  onDelete: (id: number) => void;
  entryToEdit: Entry | null;
  categories: Category[];
  onAddCategory: (name: string) => void;
  onDeleteCategory: (id: number) => void; // Make sure this prop is passed down
}

const EntryFormModal: React.FC<EntryFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  entryToEdit,
  categories,
  onAddCategory,
  onDeleteCategory, // Destructure the prop here
}) => {
  const [hours, setHours] = useState<string>('0');
  const [minutes, setMinutes] = useState<string>('0');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [isManagingCategories, setIsManagingCategories] = useState(false); // New state for managing categories

  const handleDateChangeForPicker = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  useEffect(() => {
    if (entryToEdit) {
      setHours(entryToEdit.hours.toString());
      setMinutes(entryToEdit.minutes.toString());
      setSelectedCategory(entryToEdit.category || '');
      setSelectedDate(new Date(entryToEdit.date));
    } else {
      resetForm();
    }
  }, [entryToEdit, isOpen]);

  const resetForm = () => {
    setHours('0');
    setMinutes('0');
    setSelectedCategory('');
    setSelectedDate(new Date());
    setNewCategoryName('');
    setIsAddingCategory(false);
    setIsManagingCategories(false);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'hours' | 'minutes') => {
    const value = e.target.value;
    if (value === '') {
        if (type === 'hours') setHours('');
        else setMinutes('');
        return;
    }
    
    const num = parseInt(value);
    if (isNaN(num)) return;

    if (type === 'hours') {
      if (num >= 0 && num <= 99) setHours(num.toString());
    } else {
      if (num >= 0 && num <= 59) setMinutes(num.toString());
    }
  };

  const handleHoursAdjust = (amount: number) => {
    setHours(prev => {
      let h = parseInt(prev || '0');
      if (isNaN(h)) h = 0;
      h += amount;
      if (h < 0) h = 0;
      if (h > 99) h = 99; // Max 99 hours
      return h.toString();
    });
  };

  const handleMinutesAdjust = (amount: number) => {
    setMinutes(prev => {
      let m = parseInt(prev || '0');
      if (isNaN(m)) m = 0;
      m += amount;
      if (m < 0) m = 60 + (m % 60); // Wrap around downwards
      if (m >= 60) m = m % 60;     // Wrap around upwards
      return m.toString();
    });
  };

  const handleAddCategorySubmit = async () => {
    if (newCategoryName.trim() && !categories.some(cat => cat.name === newCategoryName.trim())) {
      await onAddCategory(newCategoryName.trim());
      setSelectedCategory(newCategoryName.trim());
      setNewCategoryName('');
      setIsAddingCategory(false);
    }
  };

  const handleDeleteCategoryClick = async (categoryId: number, categoryName: string) => {
    if (window.confirm(`Czy na pewno chcesz usunąć kategorię "${categoryName}"? Wpisy z tą kategorią zostaną oznaczone jako "Bez kategorii".`)) {
      await onDeleteCategory(categoryId);
      // If the currently selected category is the one being deleted, clear it
      if (selectedCategory === categoryName) {
        setSelectedCategory('');
      }
    }
  };

  const handleSave = () => {
    const h = parseInt(hours || '0');
    const m = parseInt(minutes || '0');

    if (h === 0 && m === 0) {
      alert('Czas nie może wynosić 0h 0m.');
      return;
    }

    const newEntry: Omit<Entry, 'id'> = {
      date: format(selectedDate, 'yyyy-MM-dd'),
      category: selectedCategory || null, // Ensure null for 'Bez kategorii'
      hours: h,
      minutes: m,
    };
    onSave(newEntry);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-100 w-full max-w-md rounded-3xl shadow-2xl transform transition-all">
        {/* Nagłówek modala */}
        <div className="px-6 py-5 flex items-center justify-between">
          <button 
            onClick={onClose}
            className="text-blue-500 hover:text-blue-600 ios-button text-base"
          >
            Anuluj
          </button>
          <span className="text-gray-400 text-sm opacity-0">Placeholder</span>
          <button 
            onClick={handleSave}
            className="text-blue-500 hover:text-blue-600 ios-button text-base"
          >
            Zapisz
          </button>
        </div>

        {/* Formularz zadania */}
        <div className="px-6 pb-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Tytuł NOWY WPIS */}
          <div>
            <h2 className="text-3xl ios-title text-black">
              {entryToEdit ? 'Edytuj wpis' : 'Nowy wpis'}
            </h2>
          </div>

          {/* Czas - godziny i minuty */}
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2 ios-button">Czas</label>
            <div className="bg-white rounded-2xl p-4">
              <div className="flex items-center justify-center gap-2">
                {/* Godziny */}
                <div className="text-center flex-1">
                  <label className="block text-xs text-gray-400 uppercase tracking-wide mb-3 ios-button">GODZINY</label>
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handleHoursAdjust(-1)}
                      className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 text-2xl font-bold transition-colors active:bg-gray-400"
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      id="hours" 
                      min="0" 
                      max="99" 
                      value={hours} 
                      onChange={(e) => handleTimeChange(e, 'hours')}
                      className="text-5xl ios-title text-center bg-transparent border-0 focus:outline-none w-16"
                    />
                    <button 
                      onClick={() => handleHoursAdjust(1)}
                      className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 text-2xl font-bold transition-colors active:bg-gray-400"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                {/* Minuty */}
                <div className="text-center flex-1">
                  <label className="block text-xs text-gray-400 uppercase tracking-wide mb-3 ios-button">MINUTY</label>
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handleMinutesAdjust(-5)}
                      className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 text-2xl font-bold transition-colors active:bg-gray-400"
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      id="minutes" 
                      min="0" 
                      max="59" 
                      value={minutes} 
                      onChange={(e) => handleTimeChange(e, 'minutes')}
                      className="text-5xl ios-title text-center bg-transparent border-0 focus:outline-none w-16"
                    />
                    <button 
                      onClick={() => handleMinutesAdjust(5)}
                      className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 text-2xl font-bold transition-colors active:bg-gray-400"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kategoria */}
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2 ios-button">Kategoria</label>
            <div className="bg-white rounded-2xl px-6 py-4">
              {!isAddingCategory && !isManagingCategories ? (
                <>
                  <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <select 
                      id="category" 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="flex-1 text-lg py-2 border-0 focus:outline-none focus:ring-0 bg-transparent"
                    >
                      <option value="">Wybierz</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <button 
                      onClick={() => setIsAddingCategory(true)}
                      className="text-blue-500 hover:text-blue-600 text-base flex items-center gap-2 ios-button"
                    >
                      <span>Dodaj kategorię</span>
                    </button>
                    <button 
                      onClick={() => setIsManagingCategories(true)}
                      className="text-gray-500 hover:text-gray-700 text-base ios-button"
                    >
                      Zarządzaj kategoriami
                    </button>
                  </div>
                </>
              ) : isAddingCategory ? (
                <div className="flex items-center gap-1">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Nazwa kategorii"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCategorySubmit()}
                    className="flex-1 min-w-0 text-lg py-2 border-0 focus:outline-none bg-transparent"
                  />
                  <button 
                    onClick={handleAddCategorySubmit}
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-blue-500 hover:text-blue-600 ios-button"
                    title="Dodaj kategorię"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => {setIsAddingCategory(false); setNewCategoryName('');}}
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-gray-500 hover:text-gray-600 ios-button"
                    title="Anuluj"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : ( // isManagingCategories is true
                <div>
                  <div className="pb-4">
                    {categories.length === 0 ? (
                      <p className="text-gray-500">Brak kategorii do zarządzania.</p>
                    ) : (
                      categories.map(cat => (
                        <div key={cat.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                          <span className="text-lg">{cat.name}</span>
                          <button 
                            onClick={() => handleDeleteCategoryClick(cat.id!, cat.name)}
                            className="text-red-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  <button 
                    onClick={() => setIsManagingCategories(false)}
                    className="text-blue-500 hover:text-blue-600 text-base mt-4 flex items-center gap-2 ios-button w-full justify-center"
                  >
                    Zakończ zarządzanie
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Data */}
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2 ios-button">Data</label>
            <div className="bg-white rounded-2xl p-3">
                <DatePicker
                    date={selectedDate}
                    setDate={handleDateChangeForPicker}
                />
            </div>
          </div>

          {/* Przycisk usuwania (tylko przy edycji) */}
          {entryToEdit && (
            <button
              onClick={() => onDelete(entryToEdit.id!)}
              className="w-full text-red-500 ios-button text-lg py-3 bg-white rounded-2xl hover:bg-red-50 transition-colors"
            >
              Usuń wpis
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EntryFormModal;
