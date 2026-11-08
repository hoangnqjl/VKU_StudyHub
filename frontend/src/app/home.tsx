import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, radarService } from '../services';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Bell, Search, SlidersHorizontal, Crosshair, QrCode, Timer, ChevronRight } from 'lucide-react-native';
import { useNotificationBadge } from '../utils/useNotificationBadge';
import { useDesign } from '../components/design-scale';
import StudyHubTabBar from '../components/study-hub-tab-bar';
import { TemoScreenTransition } from '../components/temoEffects';
import TemoSideDrawer from '../components/TemoSideDrawer';
import TemoHamburgerButton from '../components/TemoHamburgerButton';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';

// ====== Tài nguyên (cắt trực tiếp từ thiết kế Figma) ======
const IMG = {
  logo: require('../../assets/images/vku-logo.png'),
  avatar: require('../../assets/images/avatar.png'),
  arrow: require('../../assets/images/ic-arrow.png'),
  search: require('../../assets/images/home/search.png'),
  filter: require('../../assets/images/home/filter.png'),
  bell: require('../../assets/images/home/bell.png'),
  target: require('../../assets/images/home/target.png'),
  scan: require('../../assets/images/home/scan.png'),
  scanChev: require('../../assets/images/home/scan-chev.png'),
  pomo: require('../../assets/images/home/pomo.png'),
  pomoChev: require('../../assets/images/home/pomo-chev.png'),
};

// ====== Màu đo từ ảnh thiết kế ======
const C = {
  primary: '#374F8A',
  red: '#D81A24',
  body: '#64748B',
  muted: '#94A3B8',
  tabMuted: '#8C9AB5',
  line: '#F1F5F9',
  soft: '#F8FAFC',
  searchBg: '#EDF3FA',
  yellow: '#FFCA10',
  green: '#10B981',
  scanBg: '#FFF8EA',
  scanBorder: '#FEF2D9',
  pomoBg: '#FFF0F0',
  pomoBorder: '#FFE8E8',
  ring1: '#E1E9F5',
  ring2: '#EAF0F8',
  ring3: '#F3F6FB',
  white: '#FFFFFF',
};

const F = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semi: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extra: 'Inter_800ExtraBold',
};

const NEARBY: any[] = [];
export default function HomeScreen() {
  const { s, z } = useDesign(raw);
  const unreadCount = useNotificationBadge();
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  const [query, setQuery] = useState('');
  const [ready, setReady] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState(false);
  const [buddies, setBuddies] = useState<any[]>([]);

  useEffect(() => {
    authService.getCurrentUser().then(u => { if (u) { setUserProfile(u); if (u.avatarUrl) setUserAvatar(u.avatarUrl); } }).catch(() => {});
    AsyncStorage.getItem('@vku_user_avatar').then(a => { if (a) { if (a.includes('avatar_usr_01_default.png')) { AsyncStorage.removeItem('@vku_user_avatar'); } else { setUserAvatar(a); } } }).catch(() => {});
    radarService.getBuddies().then(list => { setBuddies(Array.isArray(list) ? list : []); }).catch(() => setBuddies([]));
  }, []);

  if (!fontsLoaded) return null;

  const search = () => {
    const searchQuery = query.trim();
    if (!searchQuery) return;
    router.push({ pathname: '/search-results', params: { query: searchQuery } } as any);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ===== Header ===== */}
        <View style={s.header}>
          <View style={s.brand}>
            <Image source={IMG.logo} style={s.logo} />
            <Text style={s.brandName}>Study Hub</Text>
          </View>
          <View style={s.headerRight}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Xem lời mời ghép bàn"
              style={s.bellBtn}
              onPress={() => router.push('/table-invitation' as any)}
            >
              <Bell size={z(20)} color={C.primary} strokeWidth={2} />
              {unreadCount > 0 && <View style={s.bellDot} />}
            </Pressable>
            <Pressable style={s.avatarBtn} onPress={() => router.push('/profile' as any)}>
              {(!avatarError && (userAvatar || userProfile?.avatarUrl) && !(userAvatar || userProfile?.avatarUrl).includes('avatar_usr_01_default.png')) ? (<Image source={{ uri: userAvatar || userProfile?.avatarUrl }} onError={() => setAvatarError(true)} style={{ width: 40, height: 40, borderRadius: 20 }} />) : (<Image source={IMG.avatar} style={{ width: 40, height: 40, borderRadius: 20 }} />)}
            </Pressable>
          </View>
        </View>

        {/* ===== Lời chào ===== */}
        <Text style={s.greet}>{`Chào bạn, ${userProfile?.fullName || 'sinh viên VKU'}👋`}</Text>
        <Text style={s.title}>
          Hôm nay mình <Text style={s.titleRed}>học gì nhỉ?</Text>
        </Text>

        {/* ===== Ô tìm kiếm ===== */}
        <View style={s.search}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tìm kiếm"
            onPress={search}
            hitSlop={8}
          >
            <Search size={z(17)} color={C.muted} strokeWidth={2} />
          </Pressable>
          <TextInput
            style={s.searchInput}
            placeholder="Tìm bạn, môn học, tài liệu..."
            placeholderTextColor={C.muted}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            onSubmitEditing={search}
          />
          <Pressable style={s.filterBtn}>
            <SlidersHorizontal size={z(16)} color={C.muted} strokeWidth={2} />
          </Pressable>
        </View>

        {/* ===== Study Radar ===== */}
        <View style={s.radarCard}>
          <View style={[s.ring, s.ring3]} />
          <View style={[s.ring, s.ring2]} />
          <View style={[s.ring, s.ring1]} />

          <View style={s.radarBadge}>
            <Crosshair size={z(24)} color="#1E293B" strokeWidth={2.2} />
          </View>

          <Text style={s.radarLabel}>STUDY RADAR</Text>
          <Text style={s.radarTitle}>{'Tìm bạn học quanh\nbạn'}</Text>
          <Text style={s.radarDesc}>
            {'Kết nối cùng sinh viên đang học tập tại\ncác khu tự học & thư viện trường.'}
          </Text>

          <View style={s.readyRow}>
            <View style={s.readyDot} />
            <Text style={s.readyText}>Sẵn sàng ghép bàn</Text>
            <Pressable
              onPress={async () => {
                const next = !ready;
                setReady(next);
                if (next) {
                  await radarService.checkIn({
                    locationId: 'loc_lib_02',
                    courseCode: 'IT002',
                    customLocationName: 'Thư viện VKU - Tầng 2',
                    customCourseName: 'Lập trình Web',
                    studyNote: 'Khu tự học sinh viên VKU',
                  }).catch(() => {});
                } else {
                  await radarService.checkOut().catch(() => {});
                }
              }}
              hitSlop={10}
              style={[s.track, ready ? s.trackOn : s.trackOff]}
            >
              <View style={[s.thumb, ready ? s.thumbOn : s.thumbOff]} />
            </Pressable>
          </View>
        </View>

        {/* ===== Quét tài liệu ===== */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Quét mã nhận tài liệu"
          onPress={() => router.push('/scan-document')}
          style={[s.action, s.scanAction]}
        >
          <View style={s.actionIcon}>
            <QrCode size={z(20)} color="#E8920C" strokeWidth={2} />
          </View>
          <View style={s.actionText}>
            <Text style={s.actionTitle}>Quét tài liệu</Text>
            <Text style={s.actionSub}>Lưu ngay bằng QR</Text>
          </View>
          <View style={[s.actionChev, { backgroundColor: '#FFFDF9' }]}>
            <ChevronRight size={z(16)} color="#D08000" strokeWidth={2.4} />
          </View>
        </Pressable>

        {/* ===== Pomodoro ===== */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Mở phòng học Pomodoro"
          onPress={() => router.push('/focus' as any)}
          style={[s.action, s.pomoAction, { marginTop: z(12) }]}
        >
          <View style={s.actionIcon}>
            <Timer size={z(20)} color={C.red} strokeWidth={2} />
          </View>
          <View style={s.actionText}>
            <Text style={s.actionTitle}>Pomodoro</Text>
            <Text style={s.actionSub}>Vào phòng học chung</Text>
          </View>
          <View style={[s.actionChev, { backgroundColor: '#FFFAFA' }]}>
            <ChevronRight size={z(16)} color="#E05050" strokeWidth={2.4} />
          </View>
        </Pressable>

        {/* ===== Đang học gần bạn ===== */}
        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>Đang học gần bạn</Text>
          <Pressable onPress={() => router.push('/radar' as any)}><Text style={s.sectionAll}>Xem tất cả</Text></Pressable>
        </View>

        {buddies.length === 0 ? (
          <View style={[s.nearCard, { alignItems: 'center', justifyContent: 'center', paddingVertical: 20 }]}>
            <Text style={{ fontFamily: F.medium, fontSize: 13, color: C.muted, textAlign: 'center' }}>
              Hiện chưa có bạn học nào bật Radar quanh bạn.
Hãy bật tín hiệu để kết nối cùng bạn bè!
            </Text>
          </View>
        ) : (
          buddies.map((p: any, i: number) => {
            const displayName = p.studentName || p.name || 'Sinh viên VKU';
            const subText = p.studyNote || p.sub || (p.courseName ? `Đang học ${p.courseName} · ${p.locationName || 'Thư viện'}` : 'Đang học tập');
            const initials = p.initials || displayName.split(' ').slice(-1)[0].substring(0, 2).toUpperCase();
            const avatarColor = p.color || (i % 2 === 0 ? '#FDE89F' : '#D6E6F7');
            return (
              <Pressable
                key={p.id || i}
                accessibilityRole="button"
                accessibilityLabel={`Xem hồ sơ sinh viên ${displayName}`}
                onPress={() => router.push({
                  pathname: '/student-profile',
                  params: { studentId: p.userId || p.id, name: displayName, faculty: p.studentId ? `Khoa CNTT • ${p.studentId}` : undefined, subject: p.courseName, goal: p.studyNote, location: p.locationName },
                } as any)}
                style={[s.nearCard, i > 0 && { marginTop: z(12) }]}
              >
                <View style={[s.nearAvatar, { backgroundColor: avatarColor }]}>
                  <Text style={s.nearInitials}>{initials}</Text>
                </View>
                <View style={s.nearText}>
                  <Text style={s.nearName} numberOfLines={1}>
                    {displayName}
                  </Text>
                  <Text style={s.nearSub} numberOfLines={1}>
                    {subText}
                  </Text>
                </View>
                <View style={s.nearChev}>
                  <ChevronRight size={z(16)} color={C.muted} strokeWidth={2} />
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>

      {/* ===== Thanh điều hướng dưới ===== */}
      <StudyHubTabBar active="home" bottom={Math.max(insets.bottom - 20, 13)} />
    </SafeAreaView>
  );
}

const cardShadow = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.05,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 1,
} as const;

const raw = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.white },
  scroll: { paddingHorizontal: 18, paddingTop: 15, paddingBottom: 150 },

  // Header (cao 40)
  header: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 56.5, height: 33, marginLeft: 0.5 },
  brandName: {
    marginLeft: 13,
    fontFamily: F.bold,
    fontSize: 19.5,
    lineHeight: 24,
    letterSpacing: -0.4,
    color: C.primary,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.line,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  bellDot: {
    position: 'absolute',
    top: 7.25,
    left: 19.25,
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: C.red,
    borderWidth: 1.5,
    borderColor: C.white,
  },
  avatarBtn: {
    marginLeft: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: F.bold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.2,
    color: C.white,
  },

  // Lời chào
  greet: {
    marginTop: 28.2,
    marginLeft: 4,
    fontFamily: F.regular,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.15,
    color: C.body,
  },
  title: {
    marginTop: 7.4,
    marginLeft: 4,
    fontFamily: F.extra,
    fontSize: 26.5,
    lineHeight: 32,
    letterSpacing: -1.56,
    color: C.primary,
  },
  titleRed: { color: C.red },

  // Ô tìm kiếm (cao 50)
  search: {
    marginTop: 15.9,
    height: 50,
    borderRadius: 25,
    backgroundColor: C.searchBg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 15,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: 10,
    padding: 0,
    fontFamily: F.regular,
    fontSize: 13,
    letterSpacing: -0.17,
    color: C.body,
      ...Platform.select({ web: { outlineStyle: 'none' as any } }),
  },
  filterBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Thẻ Study Radar (cao 252)
  radarCard: {
    marginTop: 16.5,
    height: 253,
    borderRadius: 30,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.line,
    overflow: 'hidden',
    ...cardShadow,
  },
  ring: { position: 'absolute', borderWidth: 1 },
  ring1: {
    width: 140,
    height: 140,
    borderRadius: 70,
    left: 212,
    top: 16,
    borderColor: C.ring1,
  },
  ring2: {
    width: 200,
    height: 200,
    borderRadius: 100,
    left: 182,
    top: -14,
    borderColor: C.ring2,
  },
  ring3: {
    width: 260,
    height: 260,
    borderRadius: 130,
    left: 152,
    top: -44,
    borderColor: C.ring3,
  },
  radarBadge: {
    position: 'absolute',
    left: 284,
    top: 31.5,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.yellow,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  radarIcon: { position: 'absolute', left: 14, top: 14, width: 28, height: 24.5 },
  radarLabel: {
    position: 'absolute',
    left: 24,
    top: 28.2,
    fontFamily: F.extra,
    fontSize: 11.5,
    lineHeight: 14,
    letterSpacing: -0.13,
    color: C.red,
  },
  radarTitle: {
    position: 'absolute',
    left: 24,
    top: 48.9,
    fontFamily: F.extra,
    fontSize: 20.5,
    lineHeight: 27,
    letterSpacing: -0.9,
    color: C.primary,
  },
  radarDesc: {
    position: 'absolute',
    left: 24,
    top: 107.7,
    fontFamily: F.regular,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.15,
    color: C.body,
  },
  readyRow: {
    position: 'absolute',
    left: 24,
    top: 167,
    width: 316,
    height: 43.5,
    borderRadius: 21.75,
    backgroundColor: C.searchBg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16.5,
    paddingRight: 16,
  },
  readyDot: { width: 9, height: 9, borderRadius: 4.5, backgroundColor: C.green },
  readyText: {
    flex: 1,
    marginLeft: 9,
    fontFamily: F.semi,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.22,
    color: C.primary,
  },
  track: { width: 48, height: 24, borderRadius: 12, justifyContent: 'center' },
  trackOn: { backgroundColor: C.primary },
  trackOff: { backgroundColor: '#CBD5E1' },
  thumb: {
    position: 'absolute',
    top: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: C.white,
  },
  thumbOn: { left: 26 },
  thumbOff: { left: 2 },

  // Hai thẻ hành động (cao 70)
  action: {
    marginTop: 16,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 20,
  },
  scanAction: { backgroundColor: C.scanBg, borderColor: C.scanBorder },
  pomoAction: { backgroundColor: C.pomoBg, borderColor: C.pomoBorder },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: { flex: 1, marginLeft: 14, paddingBottom: 3 },
  actionTitle: {
    fontFamily: F.bold,
    fontSize: 14.5,
    lineHeight: 20,
    letterSpacing: -0.3,
    color: C.primary,
  },
  actionSub: {
    marginTop: 3.6,
    fontFamily: F.regular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: -0.15,
    color: C.body,
  },
  actionChev: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Đang học gần bạn
  sectionRow: {
    marginTop: 26.3,
    height: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontFamily: F.extra,
    fontSize: 17.5,
    lineHeight: 24,
    letterSpacing: -0.45,
    color: C.primary,
  },
  sectionAll: {
    marginTop: 4.85,
    fontFamily: F.semi,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.09,
    color: C.primary,
  },

  // Thẻ bạn học gần bạn (cao 75)
  nearCard: {
    marginTop: 13.2,
    height: 75,
    borderRadius: 50,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.line,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 20,
    ...cardShadow,
  },
  nearAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nearInitials: {
    fontFamily: F.bold,
    fontSize: 14,
    lineHeight: 20,
    color: C.primary,
  },
  nearText: { flex: 1, marginLeft: 14 },
  nearName: {
    fontFamily: F.bold,
    fontSize: 14.5,
    lineHeight: 20,
    letterSpacing: -0.3,
    color: C.primary,
  },
  nearSub: {
    marginTop: 2,
    fontFamily: F.regular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: -0.15,
    color: C.body,
  },
  nearChev: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },

});