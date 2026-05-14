import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS } from '../utils/theme';
import { FILM_PRESETS } from '../utils/imageProcessor';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [selectedPreset, setSelectedPreset] = React.useState('auto');

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      navigation.navigate('Processing', {
        imageUri: result.assets[0].uri,
        preset: selectedPreset,
      });
    }
  };

  const handleCamera = () => {
    navigation.navigate('Camera', { preset: selectedPreset });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoBadge}>
              <Ionicons name="film-outline" size={22} color={COLORS.accent} />
            </View>
            <Text style={styles.appName}>NEGATIV</Text>
          </View>
          <Text style={styles.tagline}>Film Negative → Color Positive</Text>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroIconContainer}>
            <View style={styles.heroIconRing}>
              <Ionicons name="camera" size={48} color={COLORS.accent} />
            </View>
          </View>
          <Text style={styles.heroTitle}>Convert Film Negatives</Text>
          <Text style={styles.heroSubtitle}>
            Capture or import your film negatives and instantly convert them to
            vivid, color-corrected positive images.
          </Text>
        </View>

        {/* Film Preset Selector */}
        <View style={styles.presetSection}>
          <Text style={styles.sectionLabel}>FILM TYPE</Text>
          <View style={styles.presetGrid}>
            {Object.entries(FILM_PRESETS).map(([key, preset]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.presetCard,
                  selectedPreset === key && styles.presetCardActive,
                ]}
                onPress={() => setSelectedPreset(key)}
                activeOpacity={0.7}
              >
                <View style={styles.presetRadio}>
                  {selectedPreset === key && (
                    <View style={styles.presetRadioInner} />
                  )}
                </View>
                <View style={styles.presetInfo}>
                  <Text
                    style={[
                      styles.presetLabel,
                      selectedPreset === key && styles.presetLabelActive,
                    ]}
                  >
                    {preset.label}
                  </Text>
                  <Text style={styles.presetDesc} numberOfLines={1}>
                    {preset.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleCamera}
            activeOpacity={0.8}
          >
            <Ionicons name="camera" size={22} color={COLORS.bg} />
            <Text style={styles.primaryButtonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handlePickImage}
            activeOpacity={0.8}
          >
            <Ionicons name="images-outline" size={22} color={COLORS.accent} />
            <Text style={styles.secondaryButtonText}>Import from Gallery</Text>
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
  content: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
  },
  header: {
    paddingTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.accentGlow,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.accent + '30',
  },
  appName: {
    fontSize: 24,
    letterSpacing: 6,
    color: COLORS.text,
    ...FONTS.heavy,
  },
  tagline: {
    fontSize: 13,
    color: COLORS.textDim,
    ...FONTS.regular,
    marginTop: 2,
    marginLeft: 48,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  heroIconContainer: {
    marginBottom: SPACING.lg,
  },
  heroIconRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.accentGlow,
    borderWidth: 2,
    borderColor: COLORS.accent + '40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 22,
    color: COLORS.text,
    ...FONTS.bold,
    marginBottom: SPACING.sm,
  },
  heroSubtitle: {
    fontSize: 14,
    color: COLORS.textDim,
    ...FONTS.regular,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
  },
  presetSection: {
    marginBottom: SPACING.xl,
  },
  sectionLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 2,
    ...FONTS.semibold,
    marginBottom: SPACING.sm,
  },
  presetGrid: {
    gap: SPACING.sm,
  },
  presetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  presetCardActive: {
    borderColor: COLORS.accent + '60',
    backgroundColor: COLORS.accentGlow,
  },
  presetRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.accent,
  },
  presetInfo: {
    flex: 1,
  },
  presetLabel: {
    fontSize: 14,
    color: COLORS.text,
    ...FONTS.semibold,
  },
  presetLabelActive: {
    color: COLORS.accent,
  },
  presetDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    ...FONTS.regular,
    marginTop: 2,
  },
  actions: {
    gap: SPACING.md,
    marginTop: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.accent,
    paddingVertical: 16,
    borderRadius: RADIUS.lg,
  },
  primaryButtonText: {
    fontSize: 16,
    color: COLORS.bg,
    ...FONTS.bold,
  },
  secondaryButton: {
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
  secondaryButtonText: {
    fontSize: 16,
    color: COLORS.accent,
    ...FONTS.semibold,
  },
});
