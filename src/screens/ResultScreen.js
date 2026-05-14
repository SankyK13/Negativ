import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  Alert,
  ScrollView,
  Animated,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS } from '../utils/theme';

const { width } = Dimensions.get('window');
const IMAGE_WIDTH = width - SPACING.lg * 2;
const IMAGE_HEIGHT = IMAGE_WIDTH * 0.75;

export default function ResultScreen({ navigation, route }) {
  const { originalUri, processedUri, preset } = route.params;
  const [showOriginal, setShowOriginal] = useState(false);
  const [saved, setSaved] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSave = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant photo library access to save images.'
        );
        return;
      }

      await MediaLibrary.saveToLibraryAsync(processedUri);
      setSaved(true);
      Alert.alert('Saved!', 'The converted image has been saved to your photo library.');
    } catch (error) {
      Alert.alert('Error', 'Failed to save image: ' + error.message);
    }
  };

  const handleNewConversion = () => {
    navigation.popToTop();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Conversion Complete</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Success Badge */}
        <View style={styles.successBadge}>
          <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
          <Text style={styles.successText}>Successfully converted</Text>
        </View>

        {/* Image Comparison */}
        <Animated.View style={[styles.imageSection, { opacity: fadeAnim }]}>
          {/* Toggle Tabs */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleTab, !showOriginal && styles.toggleTabActive]}
              onPress={() => setShowOriginal(false)}
            >
              <Ionicons
                name="sunny"
                size={16}
                color={!showOriginal ? COLORS.bg : COLORS.textDim}
              />
              <Text
                style={[
                  styles.toggleText,
                  !showOriginal && styles.toggleTextActive,
                ]}
              >
                Positive
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleTab, showOriginal && styles.toggleTabActive]}
              onPress={() => setShowOriginal(true)}
            >
              <Ionicons
                name="film"
                size={16}
                color={showOriginal ? COLORS.bg : COLORS.textDim}
              />
              <Text
                style={[
                  styles.toggleText,
                  showOriginal && styles.toggleTextActive,
                ]}
              >
                Negative
              </Text>
            </TouchableOpacity>
          </View>

          {/* Image Display */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: showOriginal ? originalUri : processedUri }}
              style={styles.image}
              resizeMode="contain"
            />

            {/* Swipe hint overlay */}
            <View style={styles.imageLabel}>
              <Text style={styles.imageLabelText}>
                {showOriginal ? 'ORIGINAL NEGATIVE' : 'CONVERTED POSITIVE'}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Side by Side Preview */}
        <View style={styles.sideBySide}>
          <Text style={styles.sectionLabel}>BEFORE & AFTER</Text>
          <View style={styles.sideBySideRow}>
            <View style={styles.thumbContainer}>
              <Image
                source={{ uri: originalUri }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
              <Text style={styles.thumbLabel}>Negative</Text>
            </View>
            <Ionicons
              name="arrow-forward"
              size={20}
              color={COLORS.accent}
              style={{ marginTop: -12 }}
            />
            <View style={styles.thumbContainer}>
              <Image
                source={{ uri: processedUri }}
                style={[styles.thumbnail, styles.thumbnailActive]}
                resizeMode="cover"
              />
              <Text style={styles.thumbLabel}>Positive</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.saveButton, saved && styles.saveButtonDone]}
            onPress={handleSave}
            disabled={saved}
            activeOpacity={0.8}
          >
            <Ionicons
              name={saved ? 'checkmark' : 'download-outline'}
              size={22}
              color={COLORS.bg}
            />
            <Text style={styles.saveButtonText}>
              {saved ? 'Saved to Gallery' : 'Save to Gallery'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.newButton}
            onPress={handleNewConversion}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle-outline" size={22} color={COLORS.accent} />
            <Text style={styles.newButtonText}>Convert Another</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    paddingBottom: SPACING.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.bgCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    color: COLORS.text,
    ...FONTS.bold,
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    alignSelf: 'center',
    backgroundColor: COLORS.success + '15',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.success + '30',
    marginBottom: SPACING.lg,
  },
  successText: {
    color: COLORS.success,
    fontSize: 13,
    ...FONTS.medium,
  },
  imageSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: 4,
    marginBottom: SPACING.md,
  },
  toggleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
  },
  toggleTabActive: {
    backgroundColor: COLORS.accent,
  },
  toggleText: {
    fontSize: 14,
    color: COLORS.textDim,
    ...FONTS.semibold,
  },
  toggleTextActive: {
    color: COLORS.bg,
  },
  imageContainer: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
  },
  imageLabel: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  imageLabelText: {
    color: COLORS.white,
    fontSize: 10,
    letterSpacing: 1,
    ...FONTS.semibold,
  },
  sideBySide: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 2,
    ...FONTS.semibold,
    marginBottom: SPACING.md,
  },
  sideBySideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  thumbContainer: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  thumbnail: {
    width: (width - SPACING.lg * 2 - 60) / 2,
    height: ((width - SPACING.lg * 2 - 60) / 2) * 0.75,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  thumbnailActive: {
    borderColor: COLORS.accent + '60',
  },
  thumbLabel: {
    fontSize: 12,
    color: COLORS.textDim,
    ...FONTS.medium,
  },
  actions: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.accent,
    paddingVertical: 16,
    borderRadius: RADIUS.lg,
  },
  saveButtonDone: {
    backgroundColor: COLORS.success,
  },
  saveButtonText: {
    fontSize: 16,
    color: COLORS.bg,
    ...FONTS.bold,
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.bgCard,
    paddingVertical: 16,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.accent + '30',
  },
  newButtonText: {
    fontSize: 16,
    color: COLORS.accent,
    ...FONTS.semibold,
  },
});
