import Dexie, { type Table } from 'dexie';

export interface Entry {
  id?: number;
  date: string; // YYYY-MM-DD
  category: string | null;
  hours: number;
  minutes: number;
}

export interface Category {
  id?: number;
  name: string;
}

export class TimeTrackerDB extends Dexie {
  entries!: Table<Entry>;
  categories!: Table<Category>;

  constructor() {
    super('TimeTrackerDB');
    this.version(2).stores({
      entries: '++id, date, category',
      categories: '++id, name'
    });
  }
}

export const db = new TimeTrackerDB();
