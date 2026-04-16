import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Emotion, EmotionPolarity } from '../types';

const KEY = '@penss/custom_emotions';
export const MAX_CUSTOM_EMOTIONS = 10;

export class CustomEmotionsRepository {
  async getAll(): Promise<Emotion[]> {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  async save(emotion: Emotion): Promise<void> {
    const all = await this.getAll();
    if (all.length >= MAX_CUSTOM_EMOTIONS) {
      throw new Error(`Maximum de ${MAX_CUSTOM_EMOTIONS} émotions personnalisées atteint.`);
    }
    await AsyncStorage.setItem(KEY, JSON.stringify([...all, emotion]));
  }

  async delete(id: string): Promise<void> {
    const all = await this.getAll();
    await AsyncStorage.setItem(KEY, JSON.stringify(all.filter(e => e.id !== id)));
  }
}
