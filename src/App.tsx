import { useState, useEffect } from 'react';
import dbOperations from './utils/dbOperations';
import type { Entry, Category } from './utils/dbOperations';
import MonthNavigator from './components/MonthNavigator';
import EntryList from './components/EntryList';
import MonthlySummary from './components/MonthlySummary';
import AddEntryButton from './components/AddEntryButton';
import EntryFormModal from './components/EntryFormModal';
import CategorySummaryModal from './components/CategorySummaryModal'; // New import

function App() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [entries, setEntries] = useState<Entry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [isCategorySummaryModalOpen, setIsCategorySummaryModalOpen] = useState(false); // New state

  const fetchEntriesAndCategories = async () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    const fetchedEntries = await dbOperations.getEntriesByMonth(year, month);
    setEntries(fetchedEntries);

    const fetchedCategories = await dbOperations.getCategories();
    setCategories(fetchedCategories);
  };

  useEffect(() => {
    fetchEntriesAndCategories();
  }, [currentMonth, isModalOpen]);

  const handleAddEntry = () => {
    setEditingEntry(null);
    setIsModalOpen(true);
  };

  const handleEditEntry = (entry: Entry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleDeleteEntry = async (id: number) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten wpis?')) {
      await dbOperations.deleteEntry(id);
      setIsModalOpen(false);
      await fetchEntriesAndCategories();
    }
  };

  const handleSaveEntry = async (entryData: Omit<Entry, 'id'>) => {
    if (editingEntry && editingEntry.id) {
      await dbOperations.updateEntry(editingEntry.id, entryData);
    } else {
      await dbOperations.addEntry(entryData);
    }
    setIsModalOpen(false);
    await fetchEntriesAndCategories();
  };

  const handleAddCategory = async (categoryName: string) => {
    await dbOperations.addCategory(categoryName);
    await fetchEntriesAndCategories();
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (window.confirm('Czy na pewno chcesz usunąć tę kategorię? Wpisy powiązane z tą kategorią zostaną zmienione na "Bez kategorii".')) {
      await dbOperations.deleteCategory(categoryId);
      await fetchEntriesAndCategories();
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Główny kontener aplikacji */}
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg relative">
        {/* Header */}
        <MonthNavigator currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} />

        {/* Main Content */}
        <main className="px-4 py-6 pb-64">
          <div>
            <EntryList entries={entries} onEdit={handleEditEntry} />
          </div>
        </main>

        {/* Fixed Footer */}
        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto">
          <div className="px-5 py-4">
            <AddEntryButton onAddEntry={handleAddEntry} />
          </div>
          <div className="px-5 pb-5">
            <MonthlySummary 
                entries={entries} 
                onOpenCategorySummary={() => setIsCategorySummaryModalOpen(true)} // New prop
            />
          </div>
        </footer>
      </div>

      <EntryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEntry}
        onDelete={handleDeleteEntry}
        entryToEdit={editingEntry}
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      {/* New Category Summary Modal */}
      <CategorySummaryModal
        isOpen={isCategorySummaryModalOpen}
        onClose={() => setIsCategorySummaryModalOpen(false)}
        entries={entries}
        currentMonth={currentMonth}
      />
    </div>
  );
}

export default App;
