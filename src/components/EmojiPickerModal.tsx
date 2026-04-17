import React, { useState } from 'react';
import {
  Modal, View, Text, TouchableOpacity, FlatList, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '../constants';

interface Props {
  visible: boolean;
  onClose: () => void;
  onEmojiSelected: (emoji: string) => void;
  currentEmoji?: string;
}

// Common emojis for emotion selection
const COMMON_EMOJIS = [
  '😊', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🙂', '🙃',
  '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛',
  '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏',
  '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫',
  '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳',
  '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭',
  '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧',
  '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢',
  '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '🤡', '👻', '👽',
  '👾', '🤖', '💩', '😺', '😸', '😹', '😻', '😼', '😽', '🙀',
  '😿', '😾', '🙈', '🙉', '🙊', '💋', '💌', '💘', '💝', '💖',
  '💗', '💓', '💞', '💕', '💟', '❣️', '💔', '❤️', '🧡', '💛',
  '💚', '💙', '💜', '🤎', '🖤', '🤍', '💯', '💢', '💥', '💫',
];

export const EmojiPickerModal: React.FC<Props> = ({ 
  visible, 
  onClose, 
  onEmojiSelected, 
  currentEmoji 
}) => {
  const [selectedEmoji, setSelectedEmoji] = useState(currentEmoji || '');

  const handleEmojiPress = (emoji: string) => {
    setSelectedEmoji(emoji);
  };

  const handleConfirm = () => {
    if (selectedEmoji) {
      onEmojiSelected(selectedEmoji);
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.emojiButton,
        selectedEmoji === item && styles.emojiButtonSelected
      ]}
      onPress={() => handleEmojiPress(item)}
    >
      <Text style={styles.emojiText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Choisir un émoji</Text>
          <TouchableOpacity 
            onPress={handleConfirm} 
            style={[styles.confirmButton, !selectedEmoji && styles.confirmButtonDisabled]}
            disabled={!selectedEmoji}
          >
            <Text style={[styles.confirmButtonText, !selectedEmoji && styles.confirmButtonTextDisabled]}>
              Confirmer
            </Text>
          </TouchableOpacity>
        </View>

        {/* Current selection */}
        {currentEmoji && (
          <View style={styles.currentSelection}>
            <Text style={styles.currentLabel}>Émoji actuel</Text>
            <View style={styles.currentEmojiContainer}>
              <Text style={styles.currentEmoji}>{currentEmoji}</Text>
            </View>
          </View>
        )}

        {/* Emoji grid */}
        <FlatList
          data={COMMON_EMOJIS}
          renderItem={renderItem}
          numColumns={8}
          keyExtractor={(item, index) => `${item}-${index}`}
          contentContainerStyle={styles.emojiGrid}
          showsVerticalScrollIndicator={false}
        />
      </View>
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
  closeButton: {
    padding: Spacing.sm,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  confirmButton: {
    backgroundColor: Colors.iconBgBlue,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
  },
  confirmButtonDisabled: {
    backgroundColor: Colors.textSecondary,
    opacity: 0.4,
  },
  confirmButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  confirmButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  currentSelection: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E0EAF4',
  },
  currentLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  currentEmojiContainer: {
    backgroundColor: '#E8F0FF',
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentEmoji: {
    fontSize: 32,
  },
  emojiGrid: {
    padding: Spacing.md,
  },
  emojiButton: {
    width: 40,
    height: 40,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  emojiButtonSelected: {
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
  },
  emojiText: {
    fontSize: 24,
  },
});