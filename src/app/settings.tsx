import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, StyleSheet, Alert,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../components/ScreenHeader';
import { STORAGE_KEYS } from '../storage/keys';
import { Colors, Spacing } from '../constants';

const CUSTOM_EMOTIONS_KEY = '@penss/custom_emotions';

export default function SettingsScreen() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAll = async () => {
    setDeleting(true);
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.EVENTS,
        STORAGE_KEYS.STRESS_ENTRIES,
        CUSTOM_EMOTIONS_KEY,
      ]);
      setShowConfirm(false);
      router.replace('/');
      // Small delay so the navigation settles before the alert appears
      setTimeout(() => {
        Alert.alert('Données supprimées', 'Toutes vos données ont été supprimées avec succès.', [{ text: 'OK' }]);
      }, 300);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Paramètres" onBack={() => router.back()} />

      <View style={styles.content}>
        <TouchableOpacity style={styles.row} onPress={() => setShowConfirm(true)}>
          <View style={styles.rowIcon}>
            <Ionicons name="trash-outline" size={22} color={Colors.btnDestructive} />
          </View>
          <Text style={styles.rowLabel}>Supprimer toutes les données</Text>
          <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Confirmation modal */}
      <Modal
        visible={showConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirm(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <Ionicons name="warning" size={40} color={Colors.btnDestructive} style={{ marginBottom: Spacing.sm }} />
            <Text style={styles.modalTitle}>Supprimer toutes les données ?</Text>
            <Text style={styles.modalBody}>
              Cette action est irréversible. Tous vos événements, mesures de stress et émotions personnalisées seront définitivement supprimés.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowConfirm(false)}
                disabled={deleting}
              >
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteBtn, deleting && { opacity: 0.5 }]}
                onPress={handleDeleteAll}
                disabled={deleting}
              >
                <Text style={styles.deleteText}>{deleting ? 'Suppression...' : 'Tout supprimer'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F2F6FF',
  },
  content: {
    padding: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: Spacing.md,
    gap: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(220,53,69,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.btnDestructive,
  },
  overlay: {
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
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#D0DBE8',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  deleteBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: Colors.btnDestructive,
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
});
