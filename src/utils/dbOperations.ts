import { db, type Entry, type Category } from '../db';
import { format } from 'date-fns';

// Entry Operations
async function addEntry(entry: Omit<Entry, 'id'>): Promise<number> {
  return db.entries.add(entry);
}

async function getEntriesByMonth(year: number, month: number): Promise<Entry[]> {
  const startOfMonth = format(new Date(year, month - 1, 1), 'yyyy-MM-dd');
  const endOfMonth = format(new Date(year, month, 0), 'yyyy-MM-dd');

  return db.entries
    .where('date')
    .between(startOfMonth, endOfMonth, true, true)
    .reverse() // Newest first
    .sortBy('date');
}

async function updateEntry(id: number, changes: Partial<Entry>): Promise<number> {
  return db.entries.update(id, changes);
}

async function deleteEntry(id: number): Promise<void> {
  return db.entries.delete(id);
}

async function getEntriesByServiceYear(currentDate: Date): Promise<Entry[]> {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed (0-11)

  let startYear;
  // If the current month is September or later, the service year starts this year.
  // Otherwise, it started last year. (September is month index 8)
  if (month >= 8) {
    startYear = year;
  } else {
    startYear = year - 1;
  }

  const startDate = format(new Date(startYear, 8, 1), 'yyyy-MM-dd'); // September 1st
  const endDate = format(new Date(startYear + 1, 7, 31), 'yyyy-MM-dd'); // August 31st of next year

  return db.entries
    .where('date')
    .between(startDate, endDate, true, true)
    .toArray();
}

// Category Operations
async function addCategory(categoryName: string): Promise<number> {
  try {
    return await db.categories.add({ name: categoryName });
  } catch (error) {
    console.error("Error adding category:", error);
    throw error; // Re-throw to propagate the error
  }
}

async function getCategories(): Promise<Category[]> {
  return db.categories.toArray();
}

async function deleteCategory(categoryId: number): Promise<void> {
  // Set category of associated entries to null
  await db.entries
    .where('category')
    .equals((await db.categories.get(categoryId))?.name || '') // Get category name to match
    .modify({ category: null });

  return db.categories.delete(categoryId);
}

// Export all functions as a default object
const dbOperations = {
  addEntry,
  getEntriesByMonth,
  updateEntry,
  deleteEntry,
  getEntriesByServiceYear,
  addCategory,
  getCategories,
  deleteCategory,
};

export default dbOperations;

export type { Entry, Category };