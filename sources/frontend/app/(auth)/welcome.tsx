import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../src/constants/colors';
import { FontFamily, FontSize } from '../../src/constants/typography';
import { Spacing, BorderRadius } from '../../src/constants/spacing';

const { width, height } = Dimensions.get('window');

const FEATURES = [
  { icon: '📡', label: 'Study Radar', desc: 'Tìm bạn học cùng môn tức thì' },
  { icon: '📂', label: 'QR Tài liệu', desc: 'Chia sẻ không cần đăng nhập' },
  { icon: '⏱️', label: 'Pomodoro nhóm', desc: 'Học đồng bộ cùng nhau' },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(logoScale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 6 }),
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 60, friction: 8 }),
      ]),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <LinearGradient
      colors={['#0F1629', '#1A2540', '#0F1629']}
      locations={[0, 0.5, 1]}
      style={styles.container}
    >
      {/* Decorative circles */}
      <View style={[styles.circle, styles.circle1]} />
      <View style={[styles.circle, styles.circle2]} />
      <View style={[styles.circle, styles.circle3]} />

      {/* Logo & Brand */}
      <Animated.View style={[styles.logoSection, { transform: [{ scale: logoScale }] }]}>
        <Animated.View style={[styles.logoRing, { transform: [{ scale: pulseAnim }] }]}>
          <LinearGradient
            colors={['#FED014', '#DF0218']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoGradient}
          >
            <Text style={styles.logoEmoji}>📚</Text>
          </LinearGradient>
        </Animated.View>
        <Text style={styles.brandName}>VKU StudyHub</Text>
        <Text style={styles.brandTagline}>Học cùng – Tiến nhanh hơn</Text>
      </Animated.View>

      {/* Feature Pills */}
      <Animated.View style={[styles.features, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {FEATURES.map((f, i) => (
          <Animated.View
            key={f.label}
            style={[
              styles.featurePill,
              { transform: [{ translateY: new Animated.Value(0) }] },
            ]}
          >
            <Text style={styles.featureIcon}>{f.icon}</Text>
            <View>
              <Text style={styles.featureLabel}>{f.label}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          </Animated.View>
        ))}
      </Animated.View>

      {/* CTAs */}
      <Animated.View
        style={[
          styles.ctas,
          { paddingBottom: insets.bottom + Spacing['2xl'], opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.push('/(auth)/register')}
          activeOpacity={0.85}
          style={styles.primaryBtn}
        >
          <LinearGradient
            colors={['#FED014', '#E5B800']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryGradient}
          >
            <Text style={styles.primaryBtnText}>Bắt đầu ngay</Text>
            <Text style={styles.primaryBtnArrow}>→</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(auth)/login')}
          activeOpacity={0.8}
          style={styles.secondaryBtn}
        >
          <Text style={styles.secondaryBtnText}>Đã có tài khoản? </Text>
          <Text style={styles.secondaryBtnLink}>Đăng nhập</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.07,
  },
  circle1: {
    width: 350,
    height: 350,
    backgroundColor: Colors.primary,
    top: -100,
    right: -80,
  },
  circle2: {
    width: 250,
    height: 250,
    backgroundColor: Colors.danger,
    bottom: 80,
    left: -80,
  },
  circle3: {
    width: 180,
    height: 180,
    backgroundColor: Colors.accent,
    top: height * 0.35,
    right: -40,
  },

  logoSection: {
    alignItems: 'center',
    marginTop: 100,
    gap: Spacing.md,
  },
  logoRing: {
    width: 100,
    height: 100,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#FED014',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 16,
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 48,
  },
  brandName: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize['3xl'],
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    letterSpacing: 0.3,
  },

  features: {
    width: '100%',
    paddingHorizontal: Spacing['2xl'],
    gap: Spacing.md,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: 'rgba(26, 37, 64, 0.8)',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
  },
  featureIcon: {
    fontSize: 28,
  },
  featureLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  featureDesc: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },

  ctas: {
    width: '100%',
    paddingHorizontal: Spacing['2xl'],
    gap: Spacing.base,
    alignItems: 'center',
  },
  primaryBtn: {
    width: '100%',
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    shadowColor: '#FED014',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  primaryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  primaryBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textInvert,
    letterSpacing: 0.3,
  },
  primaryBtnArrow: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textInvert,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  secondaryBtnLink: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.primary,
  },
});
