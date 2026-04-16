import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './keys';
import { AppEvent, EventStatus } from '../types';

export class EventRepository {
  async getAll(): Promise<AppEvent[]> {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEYS.EVENTS);
      return json ? JSON.parse(json) : [];
    } catch (error) {
      console.error('Error getting all events:', error);
      return [];
    }
  }

  async getById(id: string): Promise<AppEvent | null> {
    try {
      const events = await this.getAll();
      return events.find(event => event.id === id) || null;
    } catch (error) {
      console.error('Error getting event by id:', error);
      return null;
    }
  }

  async getActive(): Promise<AppEvent[]> {
    try {
      const events = await this.getAll();
      return events.filter(event => event.status === 'active');
    } catch (error) {
      console.error('Error getting active events:', error);
      return [];
    }
  }

  async getArchived(): Promise<AppEvent[]> {
    try {
      const events = await this.getAll();
      return events.filter(event => event.status === 'archived');
    } catch (error) {
      console.error('Error getting archived events:', error);
      return [];
    }
  }

  async save(event: AppEvent): Promise<void> {
    try {
      const events = await this.getAll();
      const index = events.findIndex(e => e.id === event.id);

      if (index !== -1) {
        events[index] = event;
      } else {
        events.push(event);
      }

      await AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    } catch (error) {
      console.error('Error saving event:', error);
    }
  }

  async archive(id: string): Promise<void> {
    try {
      const event = await this.getById(id);
      if (event) {
        event.status = 'archived';
        event.archivedAt = new Date().toISOString();
        await this.save(event);
      }
    } catch (error) {
      console.error('Error archiving event:', error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const events = await this.getAll();
      const filteredEvents = events.filter(event => event.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(filteredEvents));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  }
}