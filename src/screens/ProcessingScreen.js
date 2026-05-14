import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS } from '../utils/theme';
import { getProcessorHTML, FILM_PRESETS } from '../utils/imageProcessor';

const { width } = Dimensions.get('window');

export default function ProcessingScreen({ navigation, route }) {
  const { imageUri, preset } = route.params;
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Loading image...');
  const [error, setError] = useState(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const webViewRef = useRef(null);

  // Pulse animation for the icon
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // Animate progress bar
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const handleMessage = async (event) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);

      if (msg.type === 'progress') {
        setProgress(msg.percent);
        setStatusText(msg.message);
      } else if (msg.type === 'result') {
        setProgress(100);
        setStatusText('Saving result...');

        // Save the processed image
        const base64Data = msg.data.replace(
          /^data:image\/jpeg;base64,/,
          ''
        );
        const outputPath =
          FileSystem.cacheDirectory + `converted_${Date.now()}.jpg`;

        await FileSystem.writeAsStringAsync(outputPath, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        navigation.replace('Result', {
          originalUri: imageUri,
          processedUri: outputPath,
          preset: preset,
        });
      } else if (msg.type === 'error') {
        setError(msg.message);
      }
    } catch (e) {
      setError('Processing failed: ' + e.message);
    }
  };

  const [htmlContent, setHtmlContent] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        // Read the image and convert to base64
        const base64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const dataUri = `data:image/jpeg;base64,${base64}`;
        const html = getProcessorHTML(dataUri, preset);
        setHtmlContent(html);
      } catch (e) {
        setError('Failed to load image: ' + e.message);
      }
    })();
  }, [imageUri, preset]);

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Ionicons name="alert-circle" size={56} color={COLORS.danger} />
          <Text style={styles.errorTitle}>Processing Error</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const presetInfo = FILM_PRESETS[preset] || FILM_PRESETS.auto;
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        {/* Animated Film Reel Icon */}
        <Animated.View
          style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}
        >
          <View style={styles.iconRing}>
            <Ionicons name="film" size={40} color={COLORS.accent} />
          </View>
        </Animated.View>

        <Text style={styles.title}>Processing Negative</Text>
        <View style={styles.presetBadge}>
          <Text style={styles.presetBadgeText}>{presetInfo.label}</Text>
        </View>

        <Text style={styles.statusText}>{statusText}</Text>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[styles.progressFill, { width: progressWidth }]}
            />
          </View>
          <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
        </View>

        {/* Processing Steps */}
        <View style={styles.stepsContainer}>
          {[
            'Orange mask removal',
            'Color inversion',
            'White balance',
            'Contrast & curves',
            'Color enhancement',
            'Sharpening',
          ].map((step, idx) => {
            const stepProgress = (idx + 1) * (100 / 6);
            const isComplete = progress >= stepProgress;
            const isCurrent =
              progress >= stepProgress - 100 / 6 && progress < stepProgress;
            return (
              <View key={step} style={styles.stepRow}>
                <Ionicons
                  name={
                    isComplete
                      ? 'checkmark-circle'
                      : isCurrent
                      ? 'ellipse'
                      : 'ellipse-outline'
                  }
                  size={16}
                  color={
                    isComplete
                      ? COLORS.success
                      : isCurrent
                      ? COLORS.accent
                      : COLORS.textMuted
                  }
                />
                <Text
                  style={[
                    styles.stepText,
                    isComplete && styles.stepTextComplete,
                    isCurrent && styles.stepTextCurrent,
                  ]}
                >
                  {step}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Hidden WebView for processing */}
      {htmlContent && (
        <WebView
          ref={webViewRef}
          style={styles.hiddenWebView}
          source={{ html: htmlContent }}
          onMessage={handleMessage}
          originWhitelist={['*']}
          javaScriptEnabled={true}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  iconContainer: {
    marginBottom: SPACING.lg,
  },
  iconRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.accentGlow,
    borderWidth: 2,
    borderColor: COLORS.accent + '40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    color: COLORS.text,
    ...FONTS.bold,
    marginBottom: SPACING.sm,
  },
  presetBadge: {
    backgroundColor: COLORS.bgCard,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  presetBadgeText: {
    color: COLORS.textDim,
    fontSize: 12,
    ...FONTS.medium,
  },
  statusText: {
    fontSize: 14,
    color: COLORS.accent,
    ...FONTS.medium,
    marginBottom: SPACING.lg,
  },
  progressContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.bgHighlight,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: COLORS.accent,
  },
  progressPercent: {
    fontSize: 14,
    color: COLORS.text,
    ...FONTS.semibold,
    width: 40,
    textAlign: 'right',
  },
  stepsContainer: {
    width: '100%',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  stepText: {
    fontSize: 13,
    color: COLORS.textMuted,
    ...FONTS.regular,
  },
  stepTextComplete: {
    color: COLORS.textDim,
  },
  stepTextCurrent: {
    color: COLORS.accent,
    ...FONTS.medium,
  },
  hiddenWebView: {
    width: 0,
    height: 0,
    position: 'absolute',
    opacity: 0,
  },
  errorTitle: {
    fontSize: 20,
    color: COLORS.danger,
    ...FONTS.bold,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.textDim,
    textAlign: 'center',
    ...FONTS.regular,
  },
});
