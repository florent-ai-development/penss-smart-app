import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, Modal, TouchableOpacity, StyleSheet,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { PillButton } from '../../components/PillButton';
import { EventRepository } from '../../storage/eventRepository';
import { CustomEmotionsRepository } from '../../storage/customEmotionsRepository';
import { DEFAULT_EMOTIONS } from '../../data/emotions';
import { DEFAULT_COGNITIVE_BIASES } from '../../data/biases';
import type { AppEvent, Emotion } from '../../types';
import { Colors, Spacing } from '../../constants';

const repo = new EventRepository();
const customRepo = new CustomEmotionsRepository();

function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} - ${hh}:${mm}`;
}

function getEmotionLabel(id: string, customEmotions: Emotion[]) {
  return (
    DEFAULT_EMOTIONS.find(e => e.id === id)?.label ??
    customEmotions.find(e => e.id === id)?.label ??
    id
  );
}

function getBiasLabel(id: string) {
  return DEFAULT_COGNITIVE_BIASES.find(b => b.id === id)?.label ?? id;
}

export default function EventDetailScreen() {
  const { id: rawId } = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const [event, setEvent] = useState<AppEvent | null>(null);
  const [customEmotions, setCustomEmotions] = useState<Emotion[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (id) repo.getById(id).then(setEvent);
      customRepo.getAll().then(setCustomEmotions);
    }, [id])
  );

  const handleArchive = async () => {
    if (!id) return;
    await repo.archive(id);
    router.back();
  };

  const handleDeleteConfirm = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      await repo.delete(id);
      setShowDeleteModal(false);
      router.back();
    } finally {
      setDeleting(false);
    }
  };

  if (!event) return null;

  return (
    <View style={{ flex: 1, backgroundColor: '#F2F6FF' }}>
      <ScreenHeader title="Détail de l'événement" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Date row */}
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={16} color={Colors.textDate} />
          <Text style={styles.dateText}>{formatDate(event.createdAt)}</Text>
        </View>

        {/* Situation */}
        <Card>
          <Text style={styles.cardTitle}>Situation</Text>
          <Text style={styles.cardBody}>{event.situation}</Text>
        </Card>

        {/* Emotions */}
        <Card>
          <Text style={styles.cardTitle}>Émotions</Text>
          {event.emotions.map((e, i) => (
            <View key={e.emotionId}>
              {i > 0 && <View style={styles.divider} />}
              <View style={styles.emotionRow}>
                <Text style={styles.cardBody}>{getEmotionLabel(e.emotionId, customEmotions)}</Text>
                <Text style={styles.intensityText}>Intensité : {e.finalIntensity}/100</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Automatic thoughts */}
        {event.automaticThoughts.length > 0 && (
          <Card>
            <Text style={styles.cardTitle}>Pensées automatiques</Text>
            {event.automaticThoughts.map((t, i) => (
              <View key={i} style={[styles.thoughtBlock, i > 0 && { marginTop: Spacing.sm }]}>
                <View style={styles.thoughtBlueBorder} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardBody}>{t.text}</Text>
                  <Text style={styles.beliefText}>Croyance : {t.beliefLevel}%</Text>
                </View>
              </View>
            ))}
          </Card>
        )}

        {/* Rational thoughts */}
        {event.rationalThoughts.length > 0 && (
          <Card>
            <Text style={styles.cardTitle}>Pensées rationnelles</Text>
            {event.rationalThoughts.map((t, i) => (
              <View key={i} style={[styles.thoughtBlock, i > 0 && { marginTop: Spacing.sm }]}>
                <View style={styles.thoughtTealBorder} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardBody}>{t.text}</Text>
                  <Text style={styles.beliefText}>Croyance : {t.beliefLevel}%</Text>
                  {t.selectedBiasIds.length > 0 && (
                    <Text style={styles.biasText}>
                      Biais : {t.selectedBiasIds.map(getBiasLabel).join(', ')}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </Card>
        )}

        {/* Actions */}
        <View style={styles.actionRow}>
          {event.status === 'active' && (
            <View style={{ flex: 1 }}>
              <PillButton
                label="Archiver"
                onPress={handleArchive}
                variant="outline"
                icon={<Ionicons name="archive" size={16} color={Colors.btnOutlineText} />}
              />
            </View>
          )}
          <View style={{ flex: 1 }}>
            <PillButton
              label="Supprimer"
              onPress={() => setShowDeleteModal(true)}
              variant="destructive"
              icon={<Ionicons name="trash" size={16} color={Colors.white} />}
            />
          </View>
        </View>
      </ScrollView>

      {/* Delete confirmation modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Ionicons name="warning-outline" size={36} color={Colors.btnDestructive} style={{ marginBottom: Spacing.sm }} />
            <Text style={styles.modalTitle}>Supprimer cet événement ?</Text>
            <Text style={styles.modalBody}>Cette action est irréversible. L'événement sera définitivement supprimé.</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                <Text style={styles.modalCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalDeleteBtn, deleting && { opacity: 0.5 }]}
                onPress={handleDeleteConfirm}
                disabled={deleting}
              >
                <Text style={styles.modalDeleteText}>{deleting ? 'Suppression...' : 'Supprimer'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.md,
    gap: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textDate,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textAccent,
    marginBottom: Spacing.sm,
  },
  cardBody: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8EFF8',
    marginVertical: Spacing.sm,
  },
  emotionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  intensityText: {
    fontSize: 13,
    color: Colors.textAccent,
  },
  thoughtBlock: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  thoughtBlueBorder: {
    width: 3,
    borderRadius: 2,
    backgroundColor: Colors.textAccent,
    alignSelf: 'stretch',
  },
  thoughtTealBorder: {
    width: 3,
    borderRadius: 2,
    backgroundColor: Colors.accent,
    alignSelf: 'stretch',
  },
  beliefText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  biasText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    fontStyle: 'italic',
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  modalBox: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.xl,
    alignItems: 'center',
    width: '100%',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  modalBody: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#D0DBE8',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  modalDeleteBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: Colors.btnDestructive,
    alignItems: 'center',
  },
  modalDeleteText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
});
