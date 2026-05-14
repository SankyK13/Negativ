import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS } from '../utils/theme';

const { width, height } = Dimensions.get('window');

export default function CameraScreen({ navigation, route }) {
  const { preset } = route.params;
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [flash, setFlash] = useState('off');
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef(null);

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.permText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permContainer}>
          <Ionicons name="camera-outline" size={64} color={COLORS.textDim} />
          <Text style={styles.permTitle}>Camera Access Required</Text>
          <Text style={styles.permText}>
            We need your camera to photograph film negatives.
          </Text>
          <TouchableOpacity
            style={styles.permButton}
            onPress={requestPermission}
          >
            <Text style={styles.permButtonText}>Grant Access</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backLink}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return;

    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        skipProcessing: false,
      });

      navigation.replace('Processing', {
        imageUri: photo.uri,
        preset: preset,
      });
    } catch (error) {
      Alert.alert('Capture Failed', 'Could not take photo. Please try again.');
      setIsCapturing(false);
    }
  };

  const toggleFlash = () => {
    setFlash((prev) => (prev === 'off' ? 'on' : 'off'));
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash}
      >
        {/* Top Bar */}
        <SafeAreaView style={styles.topBar}>
          <TouchableOpacity
            style={styles.topButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>

          <View style={styles.topCenter}>
            <View style={styles.filmBadge}>
              <Ionicons name="film" size={14} color={COLORS.accent} />
              <Text style={styles.filmBadgeText}>NEGATIVE MODE</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.topButton} onPress={toggleFlash}>
            <Ionicons
              name={flash === 'on' ? 'flash' : 'flash-off'}
              size={24}
              color={flash === 'on' ? COLORS.accent : COLORS.white}
            />
          </TouchableOpacity>
        </SafeAreaView>

        {/* Center guide overlay */}
        <View style={styles.guideOverlay}>
          <View style={styles.guideFrame}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
          <Text style={styles.guideText}>
            Align the film negative within the frame
          </Text>
        </View>

        {/* Bottom Controls */}
        <SafeAreaView style={styles.bottomBar}>
          <View style={styles.bottomControls}>
            <TouchableOpacity
              style={styles.sideButton}
              onPress={() =>
                setFacing((prev) => (prev === 'back' ? 'front' : 'back'))
              }
            >
              <Ionicons
                name="camera-reverse-outline"
                size={28}
                color={COLORS.white}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.captureButton,
                isCapturing && styles.captureButtonActive,
              ]}
              onPress={handleCapture}
              disabled={isCapturing}
              activeOpacity={0.7}
            >
              <View style={styles.captureInner} />
            </TouchableOpacity>

            <View style={styles.sideButton} />
          </View>

          <Text style={styles.tipText}>
            💡 Use even lighting · Keep the negative flat · Avoid glare
          </Text>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const GUIDE_SIZE = width * 0.85;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  camera: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
  },
  topButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topCenter: {
    alignItems: 'center',
  },
  filmBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.accent + '40',
  },
  filmBadgeText: {
    color: COLORS.accent,
    fontSize: 11,
    letterSpacing: 1.5,
    ...FONTS.semibold,
  },
  guideOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideFrame: {
    width: GUIDE_SIZE,
    height: GUIDE_SIZE * 0.67,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: COLORS.accent,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: 4,
  },
  guideText: {
    color: COLORS.white,
    fontSize: 13,
    ...FONTS.medium,
    marginTop: SPACING.md,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bottomBar: {
    paddingBottom: SPACING.lg,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
  },
  sideButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  captureButtonActive: {
    opacity: 0.5,
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
  },
  tipText: {
    color: COLORS.white + '99',
    fontSize: 12,
    textAlign: 'center',
    ...FONTS.regular,
  },
  permContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    gap: SPACING.md,
  },
  permTitle: {
    fontSize: 20,
    color: COLORS.text,
    ...FONTS.bold,
  },
  permText: {
    fontSize: 14,
    color: COLORS.textDim,
    textAlign: 'center',
    ...FONTS.regular,
  },
  permButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.xl,
    paddingVertical: 14,
    borderRadius: RADIUS.lg,
    marginTop: SPACING.md,
  },
  permButtonText: {
    color: COLORS.bg,
    fontSize: 16,
    ...FONTS.bold,
  },
  backLink: {
    color: COLORS.textDim,
    fontSize: 14,
    ...FONTS.medium,
    marginTop: SPACING.sm,
  },
});
