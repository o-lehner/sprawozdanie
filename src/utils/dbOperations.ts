import { db, type Entry, type Category } from '../db';

// Entry Operations
async function addEntry(entry: Omit<Entry, 'id'>): Promise<number> {
  return db.entries.add(entry);
}

async function getEntriesByMonth(year: number, month: number): Promise<Entry[]> {
  const startOfMonth = new Date(year, month - 1, 1).toISOString().split('T')[0];
  const endOfMonth = new Date(year, month, 0).toISOString().split('T')[0]; // last day of the month

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
  addCategory,
  getCategories,
  deleteCategory,
};

export default dbOperations;

export type { Entry, Category };