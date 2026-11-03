import React, { useState, useRef } from 'react';
import {
  Animated,
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { useDesign } from '../components/design-scale';
import { useTemoFloat } from '../components/temoEffects';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const C = {
  navy: '#101D83',
  primary: '#374F8A',
  ink: '#17243A',
  body: '#64748B',
  muted: '#94A3B8',
  line: '#E8EDF5',
  soft: '#F8FAFC',
  cream: '#FFF9E5',
  orange: '#F15B2A',
  blueSoft: '#EDF3FA',
  purpleSoft: '#ECEBFF',
  white: '#FFFFFF',
};

const F = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semi: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extra: 'Inter_800ExtraBold',
};

const SLIDES = [
  {
    id: 'radar',
    badge: 'STUDY RADAR 2.0',
    badgeColor: '#F15B2A',
    badgeBg: '#FFF2EB',
    title: 'Ghép bàn học tập\nthông minh tại VKU',
    sub: 'Tự động phát hiện bạn học cùng môn, cùng bàn ôn thi tại Thư viện Tầng 2, Tầng 3 và Khu tự học Nhà V theo thời gian thực.',
    iconName: 'radio',
    iconColor: '#F15B2A',
    decorText: '18+ bạn học đang online xung quanh',
    tags: ['Bán kính 100m', 'Cùng môn học', 'Ghép bàn tức thì'],
  },
  {
    id: 'documents',
    badge: 'KHO HỌC LIỆU SỐ',
    badgeColor: '#101D83',
    badgeBg: '#EDF3FA',
    title: 'Kho học liệu số &\nQuét nhận tài liệu QR',
    sub: 'Hàng nghìn đề thi, slide bài giảng và tóm tắt môn học chính quy VKU. Chia sẻ và quét nhận tài liệu về kho chỉ mất 1 giây.',
    iconName: 'folder',
    iconColor: '#101D83',
    decorText: 'Đề thi & Giáo trình chính quy VKU',
    tags: ['PDF, Word, Excel', 'Quét QR 1 chạm', 'Lưu trữ đám mây'],
  },
  {
    id: 'pomodoro',
    badge: 'FOCUS POMODORO',
    badgeColor: '#059669',
    badgeBg: '#ECFDF5',
    title: 'Phòng học Pomodoro\nx2 hiệu suất tập trung',
    sub: 'Tham gia phòng học nhóm ảo cùng sinh viên VKU, duy trì chuỗi kỷ luật 25/5 và phát triển thói quen tự học bền vững.',
    iconName: 'clock',
    iconColor: '#059669',
    decorText: 'Chuỗi tập trung 25 phút chuẩn khoa học',
    tags: ['Âm thanh trắng', 'Xếp hạng kỷ luật', 'Phòng học nhóm'],
  },
];

export default function OnboardingScreen() {
  const { s, z } = useDesign(raw);
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<any>(null);
  const floatStyle = useTemoFloat(8, 2400);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded) return null;

  const handleNext = async () => {
    if (activeIndex < SLIDES.length - 1) {
      const next = activeIndex + 1;
      scrollRef.current?.scrollTo({ x: next * SCREEN_WIDTH, animated: true });
      setActiveIndex(next);
    } else {
      await finishOnboarding();
    }
  };

  const finishOnboarding = async () => {
    await AsyncStorage.setItem('@vku_onboarding_done', 'true').catch(() => {});
    router.replace('/login' as any);
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / SCREEN_WIDTH);
    if (index !== activeIndex && index >= 0 && index < SLIDES.length) {
      setActiveIndex(index);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      {/* ===== Header Bar ===== */}
      <View style={s.header}>
        <View style={s.brand}>
          <Image source={require('../../assets/images/vku-logo.png')} style={s.logo} />
          <View style={{ marginLeft: 8 }}>
            <Text style={s.brandName}>VKU StudyHub</Text>
            <Text style={s.brandSub}>Giảng đường số thông minh</Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Bỏ qua hướng dẫn"
          onPress={finishOnboarding}
          style={s.skipBtn}
        >
          <Text style={s.skipText}>Bỏ qua</Text>
        </Pressable>
      </View>

      {/* ===== Slides Carousel ===== */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={s.slideScroll}
      >
        {SLIDES.map((slide, idx) => (
          <View key={slide.id} style={[s.slide, { width: SCREEN_WIDTH }]}>
            {/* Visual Graphic Box */}
            <View style={s.visualWrapper}>
              <Animated.View style={[s.visualCircleOuter, floatStyle as any]}>
                <View style={[s.visualCircleInner, { backgroundColor: slide.badgeBg }]}>
                  <View style={[s.iconBox, { backgroundColor: slide.iconColor }]}>
                    <Feather name={slide.iconName as any} size={z(36)} color={C.white} />
                  </View>
                </View>
              </Animated.View>

              <View style={s.decorPill}>
                <View style={[s.decorDot, { backgroundColor: slide.badgeColor }]} />
                <Text style={s.decorText}>{slide.decorText}</Text>
              </View>
            </View>

            {/* Slide Content */}
            <View style={s.contentBox}>
              <View style={[s.badge, { backgroundColor: slide.badgeBg }]}>
                <Text style={[s.badgeText, { color: slide.badgeColor }]}>{slide.badge}</Text>
              </View>

              <Text style={s.slideTitle}>{slide.title}</Text>
              <Text style={s.slideSub}>{slide.sub}</Text>

              <View style={s.tagsRow}>
                {slide.tags.map((tag) => (
                  <View key={tag} style={s.tagChip}>
                    <Feather name="check" size={z(12)} color={C.navy} />
                    <Text style={s.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* ===== Footer Controls ===== */}
      <View style={s.footer}>
        {/* Pagination Dots */}
        <View style={s.dotsRow}>
          {SLIDES.map((_, i) => {
            const isActive = i === activeIndex;
            return (
              <View
                key={i}
                style={[s.dot, isActive ? s.dotActive : s.dotInactive]}
              />
            );
          })}
        </View>

        {/* Action Button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={activeIndex === SLIDES.length - 1 ? 'Bắt đầu ngay' : 'Tiếp tục'}
          onPress={handleNext}
          style={({ pressed }) => [s.primaryBtn, pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] }]}
        >
          <Text style={s.primaryBtnText}>
            {activeIndex === SLIDES.length - 1 ? 'Bắt đầu khám phá ngay 🚀' : 'Tiếp tục'}
          </Text>
          {activeIndex < SLIDES.length - 1 && (
            <Feather name="arrow-right" size={z(18)} color={C.white} style={{ marginLeft: 6 }} />
          )}
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Đăng nhập ngay"
          onPress={() => router.push('/login' as any)}
          style={s.loginLinkBtn}
        >
          <Text style={s.loginLinkText}>
            Đã có tài khoản sinh viên? <Text style={s.loginLinkBold}>Đăng nhập</Text>
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const cardShadow = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.08,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 6 },
  elevation: 4,
} as const;

const raw = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  brandName: {
    fontFamily: F.extra,
    fontSize: 15,
    lineHeight: 19,
    color: C.navy,
  },
  brandSub: {
    fontFamily: F.medium,
    fontSize: 11,
    color: C.muted,
  },
  skipBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: C.soft,
  },
  skipText: {
    fontFamily: F.semi,
    fontSize: 12.5,
    color: C.body,
  },
  slideScroll: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  visualWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 18,
  },
  visualCircleOuter: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  visualCircleInner: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
  decorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.white,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.line,
    marginTop: -16,
    ...cardShadow,
  },
  decorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  decorText: {
    fontFamily: F.semi,
    fontSize: 11.5,
    color: C.ink,
  },
  contentBox: {
    alignItems: 'center',
    marginTop: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4.5,
    borderRadius: 12,
    marginBottom: 10,
  },
  badgeText: {
    fontFamily: F.bold,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  slideTitle: {
    fontFamily: F.extra,
    fontSize: 22,
    lineHeight: 29,
    textAlign: 'center',
    color: C.ink,
  },
  slideSub: {
    marginTop: 8,
    fontFamily: F.regular,
    fontSize: 13.5,
    lineHeight: 20,
    textAlign: 'center',
    color: C.body,
    paddingHorizontal: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: C.soft,
    borderWidth: 1,
    borderColor: C.line,
    gap: 4,
  },
  tagText: {
    fontFamily: F.medium,
    fontSize: 11.5,
    color: C.ink,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    alignItems: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 6,
  },
  dot: {
    height: 7,
    borderRadius: 3.5,
  },
  dotActive: {
    width: 24,
    backgroundColor: C.navy,
  },
  dotInactive: {
    width: 7,
    backgroundColor: '#CBD5E1',
  },
  primaryBtn: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: C.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
  primaryBtnText: {
    fontFamily: F.bold,
    fontSize: 15,
    color: C.white,
  },
  loginLinkBtn: {
    marginTop: 14,
    paddingVertical: 6,
  },
  loginLinkText: {
    fontFamily: F.regular,
    fontSize: 13,
    color: C.body,
  },
  loginLinkBold: {
    fontFamily: F.bold,
    color: C.navy,
  },
});
