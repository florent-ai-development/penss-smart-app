import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { randomUUID } from 'expo-crypto';
import { Ionicons } from '@expo/vector-icons';
import { CustomEmotionsRepository, MAX_CUSTOM_EMOTIONS } from '../storage/customEmotionsRepository';
import { PolarityToggle } from './PolarityToggle';
import { EmojiPickerModal } from './EmojiPickerModal';
import type { Emotion } from '../types';
import { Colors, Spacing } from '../constants';

const repo = new CustomEmotionsRepository();

const DEFAULT_EMOJI_NEGATIVE = '😔';
const DEFAULT_EMOJI_POSITIVE = '😊';
const MAX_LABEL_LENGTH = 15;

interface Props {
  visible: boolean;
  onClose: () => void;
  onChanged: () => void;
}

type FormView = 'list' | 'form';

export const CustomizeEmotionsModal: React.FC<Props> = ({ visible, onClose, onChanged }) => {
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [formView, setFormView] = useState<FormView>('list');

  // Form state
  const [polarity, setPolarity] = useState<'negative' | 'positive'>('negative');
  const [emoji, setEmoji] = useState(DEFAULT_EMOJI_NEGATIVE);
  const [label, setLabel] = useState('');
  const [saving, setSaving] = useState(false);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

  const load = async () => {
    const data = await repo.getAll();
    setEmotions(data);
  };

  useEffect(() => {
    if (visible) { load(); setFormView('list'); }
  }, [visible]);

  const handlePolarityChange = (p: 'negative' | 'positive') => {
    setPolarity(p);
    setEmoji(p === 'positive' ? DEFAULT_EMOJI_POSITIVE : DEFAULT_EMOJI_NEGATIVE);
  };

  const resetForm = () => {
    setPolarity('negative');
    setEmoji(DEFAULT_EMOJI_NEGATIVE);
    setLabel('');
  };

  const handleSave = async () => {
    if (label.trim().length === 0) {
      Alert.alert('Champ requis', 'Le nom de l\'émotion est obligatoire.');
      return;
    }
    setSaving(true);
    try {
      await repo.save({
        id: `custom_${randomUUID()}`,
        label: label.trim(),
        emoji,
        polarity,
      });
      await load();
      onChanged();
      resetForm();
      setFormView('list');
    } catch (e: any) {
      Alert.alert('Erreur', e?.message ?? 'Impossible d\'ajouter l\'émotion.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (emotion: Emotion) => {
    Alert.alert(
      'Supprimer cette émotion',
      `Supprimer "${emotion.label}" de vos émotions personnalisées ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await repo.delete(emotion.id);
            await load();
            onChanged();
          },
        },
      ]
    );
  };

  const canAdd = emotions.length < MAX_CUSTOM_EMOTIONS;
  const labelValid = label.trim().length > 0;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            {formView === 'form' ? (
              <TouchableOpacity onPress={() => { setFormView('list'); resetForm(); }}>
                <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            )}
            <Text style={styles.headerTitle}>
              {formView === 'list' ? 'Mes émotions personnalisées' : 'Nouvelle émotion'}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          {/* List view */}
          {formView === 'list' && (
            <ScrollView contentContainerStyle={styles.listContent}>
              <Text style={styles.quota}>
                {emotions.length}/{MAX_CUSTOM_EMOTIONS} émotions personnalisées
              </Text>

              {emotions.length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>Aucune émotion personnalisée pour le moment.</Text>
                </View>
              )}

              {emotions.map(e => (
                <View key={e.id} style={styles.emotionRow}>
                  <Text style={styles.emotionEmoji}>{e.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.emotionLabel}>{e.label}</Text>
                    <Text style={styles.emotionPolarity}>
                      {e.polarity === 'positive' ? 'Positive' : 'Négative'}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDelete(e)} hitSlop={8}>
                    <Ionicons name="trash-outline" size={20} color={Colors.btnDestructive} />
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity
                style={[styles.addBtn, !canAdd && styles.addBtnDisabled]}
                onPress={() => canAdd && setFormView('form')}
                disabled={!canAdd}
              >
                <Ionicons name="add-circle-outline" size={20} color={canAdd ? Colors.white : 'rgba(255,255,255,0.4)'} />
                <Text style={[styles.addBtnText, !canAdd && { opacity: 0.4 }]}>
                  {canAdd ? 'Ajouter une émotion' : `Limite de ${MAX_CUSTOM_EMOTIONS} atteinte`}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {/* Form view */}
          {formView === 'form' && (
            <ScrollView contentContainerStyle={styles.formContent} keyboardShouldPersistTaps="handled">
              {/* Polarity */}
              <Text style={styles.fieldLabel}>Catégorie</Text>
              <PolarityToggle value={polarity} onChange={handlePolarityChange} />

              {/* Emoji picker */}
              <Text style={styles.fieldLabel}>Émoji</Text>
              <TouchableOpacity style={styles.emojiBtn} onPress={() => setEmojiPickerVisible(true)}>
                <Text style={styles.emojiBtnIcon}>{emoji}</Text>
                <Text style={styles.emojiBtnLabel}>Choisir un émoji</Text>
                <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
              </TouchableOpacity>

              {/* Label */}
              <View style={styles.labelHeader}>
                <Text style={styles.fieldLabel}>Nom de l'émotion</Text>
                <Text style={[styles.charCount, label.length === MAX_LABEL_LENGTH && styles.charCountMax]}>
                  {label.length}/{MAX_LABEL_LENGTH}
                </Text>
              </View>
              <TextInput
                style={styles.labelInput}
                value={label}
                onChangeText={v => setLabel(v)}
                placeholder="Ex : Submergé, Serein..."
                placeholderTextColor={Colors.textSecondary}
                maxLength={MAX_LABEL_LENGTH}
                autoCapitalize="words"
                returnKeyType="done"
              />

              {/* Save */}
              <TouchableOpacity
                style={[styles.saveBtn, (!labelValid || saving) && styles.saveBtnDisabled]}
                onPress={handleSave}
                disabled={!labelValid || saving}
              >
                <Text style={styles.saveBtnText}>
                  {saving ? 'Enregistrement...' : 'Ajouter cette émotion'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* Emoji picker modal — rendered outside KeyboardAvoidingView to avoid z-index issues */}
      <EmojiPickerModal
        visible={emojiPickerVisible}
        onClose={() => setEmojiPickerVisible(false)}
        onEmojiSelected={(e) => { setEmoji(e); setEmojiPickerVisible(false); }}
        currentEmoji={emoji}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F6FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E0EAF4',
    backgroundColor: Colors.white,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  listContent: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  quota: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  emptyState: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  emotionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    gap: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  emotionEmoji: { fontSize: 28 },
  emotionLabel: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  emotionPolarity: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.iconBgBlue,
    borderRadius: 30,
    paddingVertical: 14,
    gap: Spacing.sm,
  },
  addBtnDisabled: {
    backgroundColor: Colors.textSecondary,
  },
  addBtnText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 15,
  },
  formContent: {
    padding: Spacing.md,
    gap: Spacing.lg,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  emojiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D0DBE8',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    gap: Spacing.md,
  },
  emojiBtnIcon: {
    fontSize: 28,
  },
  emojiBtnLabel: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  labelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  charCount: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  charCountMax: {
    color: Colors.btnDestructive,
    fontWeight: '600',
  },
  labelInput: {
    height: 50,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D0DBE8',
    paddingHorizontal: Spacing.md,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  saveBtn: {
    backgroundColor: Colors.iconBgBlue,
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  saveBtnDisabled: {
    opacity: 0.4,
  },
  saveBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
