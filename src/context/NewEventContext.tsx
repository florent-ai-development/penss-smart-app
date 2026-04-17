import React, { createContext, useContext, useRef, useState } from 'react';
import { randomUUID } from 'expo-crypto';
import { AppEvent, AutomaticThought, RationalThought } from '../types';
import { EventRepository } from '../storage/eventRepository';
import { DEFAULT_EMOTIONS } from '../data/emotions';

interface CustomEmotionOverride {
  id: string;
  emoji: string;
}

interface NewEventDraft {
  createdAt: string;
  situation: string;
  selectedEmotionIds: string[];
  automaticThoughts: AutomaticThought[];
  rationalThoughts: RationalThought[];
  finalEmotionIntensities: Record<string, number>;
  customEmotionEmojis: Record<string, string>; // emotionId -> custom emoji
}

interface NewEventContextValue {
  draft: NewEventDraft;
  setSituation: (text: string) => void;
  toggleEmotion: (emotionId: string) => void;
  addAutomaticThought: (thought: AutomaticThought) => void;
  removeAutomaticThought: (index: number) => void;
  addRationalThought: (thought: RationalThought) => void;
  removeRationalThought: (index: number) => void;
  setFinalIntensity: (emotionId: string, value: number) => void;
  setCustomEmotionEmoji: (emotionId: string, emoji: string) => void;
  saveDraft: () => Promise<void>;
}

const NewEventContext = createContext<NewEventContextValue | null>(null);

export const NewEventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const createdAtRef = useRef<string | null>(null);

  if (createdAtRef.current === null) {
    createdAtRef.current = new Date().toISOString();
  }

  const [draft, setDraft] = useState<NewEventDraft>({
    createdAt: createdAtRef.current,
    situation: '',
    selectedEmotionIds: [],
    automaticThoughts: [],
    rationalThoughts: [],
    finalEmotionIntensities: {},
    customEmotionEmojis: {},
  });

  const setSituation = (text: string) => {
    setDraft(prev => ({ ...prev, situation: text }));
  };

  const toggleEmotion = (emotionId: string) => {
    setDraft(prev => {
      const isSelected = prev.selectedEmotionIds.includes(emotionId);
      return {
        ...prev,
        selectedEmotionIds: isSelected
          ? prev.selectedEmotionIds.filter(id => id !== emotionId)
          : [...prev.selectedEmotionIds, emotionId],
      };
    });
  };

  const addAutomaticThought = (thought: AutomaticThought) => {
    setDraft(prev => ({
      ...prev,
      automaticThoughts: [...prev.automaticThoughts, thought],
    }));
  };

  const removeAutomaticThought = (index: number) => {
    setDraft(prev => ({
      ...prev,
      automaticThoughts: prev.automaticThoughts.filter((_, i) => i !== index),
    }));
  };

  const addRationalThought = (thought: RationalThought) => {
    setDraft(prev => ({
      ...prev,
      rationalThoughts: [...prev.rationalThoughts, thought],
    }));
  };

  const removeRationalThought = (index: number) => {
    setDraft(prev => ({
      ...prev,
      rationalThoughts: prev.rationalThoughts.filter((_, i) => i !== index),
    }));
  };

  const setFinalIntensity = (emotionId: string, value: number) => {
    setDraft(prev => ({
      ...prev,
      finalEmotionIntensities: {
        ...prev.finalEmotionIntensities,
        [emotionId]: value,
      },
    }));
  };

  const setCustomEmotionEmoji = (emotionId: string, emoji: string) => {
    setDraft(prev => ({
      ...prev,
      customEmotionEmojis: {
        ...prev.customEmotionEmojis,
        [emotionId]: emoji,
      },
    }));
  };

  const saveDraft = async () => {
    const event: AppEvent = {
      id: randomUUID(),
      createdAt: draft.createdAt,
      situation: draft.situation,
      emotions: draft.selectedEmotionIds.map(id => ({
        emotionId: id,
        initialIntensity: 50,
        finalIntensity: draft.finalEmotionIntensities[id] ?? 50,
        customEmoji: draft.customEmotionEmojis[id],
      })),
      automaticThoughts: draft.automaticThoughts,
      rationalThoughts: draft.rationalThoughts,
      status: 'active',
    };

    const repository = new EventRepository();
    await repository.save(event);
  };

  return (
    <NewEventContext.Provider
      value={{
        draft,
        setSituation,
        toggleEmotion,
        addAutomaticThought,
        removeAutomaticThought,
        addRationalThought,
        removeRationalThought,
        setFinalIntensity,
        setCustomEmotionEmoji,
        saveDraft,
      }}
    >
      {children}
    </NewEventContext.Provider>
  );
};

export const useNewEventContext = () => {
  const context = useContext(NewEventContext);
  if (!context) {
    throw new Error('useNewEventContext must be used within NewEventProvider');
  }
  return context;
};