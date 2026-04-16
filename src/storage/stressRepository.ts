import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './keys';
import { StressEntry } from '../types';

export class StressRepository {
  async getAll(): Promise<StressEntry[]> {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEYS.STRESS_ENTRIES);
      return json ? JSON.parse(json) : [];
    } catch (error) {
      console.error('Error getting all stress entries:', error);
      return [];
    }
  }

  async getByDate(date: string): Promise<StressEntry | null> {
    try {
      const entries = await this.getAll();
      return entries.find(entry => entry.date === date) || null;
    } catch (error) {
      console.error('Error getting stress entry by date:', error);
      return null;
    }
  }

  async save(entry: StressEntry): Promise<void> {
    try {
      const entries = await this.getAll();
      const index = entries.findIndex(e => e.date === entry.date);

      if (index !== -1) {
        entries[index] = entry;
      } else {
        entries.push(entry);
      }

      await AsyncStorage.setItem(STORAGE_KEYS.STRESS_ENTRIES, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving stress entry:', error);
    }
  }
}