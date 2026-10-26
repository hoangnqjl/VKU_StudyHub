import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../src/constants/colors';
import { FontFamily, FontSize } from '../../src/constants/typography';
import { Spacing, BorderRadius, Shadow } from '../../src/constants/spacing';

const { width } = Dimensions.get('window');

const QUICK_ACTIONS = [
  { id: 'radar', icon: '📡', label: 'Bật Radar', desc: 'Tìm bạn học', color: Colors.accent, route: '/(tabs)/radar' },
  { id: 'scan', icon: '📷', label: 'Quét QR', desc: 'Nhận tài liệu', color: Colors.danger, route: '/docs/scan' },
  { id: 'pomodoro', icon: '⏱️', label: 'Tạo phòng', desc: 'Học nhóm', color: '#9333EA', route: '/pomodoro/create' },
  { id: 'upload', icon: '📤', label: 'Tải lên', desc: 'Chia sẻ tài liệu', color: Colors.success, route: '/docs/upload' },
];

const ACTIVE_USERS = [
  { id: '1', name: 'Minh Trí', subject: 'Cơ sở dữ liệu', location: 'Thư viện', time: '5 phút', avatar: '🧑‍💻' },
  { id: '2', name: 'Thu Hà', subject: 'Mạng máy tính', location: 'Tòa A1', time: '12 phút', avatar: '👩‍🎓' },
  { id: '3', name: 'Quang Huy', subject: 'Toán cao cấp', location: 'Căn tin', time: '3 phút', avatar: '🧑‍🎓' },
];

const RECENT_DOCS = [
  { id: '1', name: 'Đề cương CSDL 2024', subject: 'CSDL', type: 'PDF', size: '2.4MB', icon: '📄' },
  { id: '2', name: 'Bài tập Mạng máy tính', subject: 'MMT', type: 'PDF', size: '1.1MB', icon: '📄' },
  { id: '3', name: 'Slide Toán chương 3', subject: 'Toán CC', type: 'PPT', size: '5.8MB', icon: '📊' },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 70, friction: 9 }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Hero Header */}
      <LinearGradient
        colors={['#0F1629', '#1A2540']}
        style={[styles.header, { paddingTop: insets.top + Spacing.base }]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Chào buổi chiều 👋</Text>
            <Text style={styles.userName}>Nguyễn Văn A</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.notifBtn}>
            <Text style={styles.notifIcon}>🔔</Text>
            <View style={styles.notifBadge}>
              <Text style={styles.notifBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Đang học', value: '12', sub: 'bạn trên Radar' },
            { label: 'Tài liệu', value: '8', sub: 'của tôi' },
            { label: 'Phiên hôm nay', value: '3', sub: 'Pomodoro' },
          ].map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statSub}>{stat.sub}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 90 }]}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thao tác nhanh ⚡</Text>
            <View style={styles.quickGrid}>
              {QUICK_ACTIONS.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  onPress={() => router.push(action.route as any)}
                  activeOpacity={0.8}
                  style={styles.quickCard}
                >
                  <LinearGradient
                    colors={[action.color + '33', action.color + '11']}
                    style={styles.quickGradient}
                  >
                    <View style={[styles.quickIconBg, { backgroundColor: action.color + '22' }]}>
                      <Text style={styles.quickIcon}>{action.icon}</Text>
                    </View>
                    <Text style={styles.quickLabel}>{action.label}</Text>
                    <Text style={styles.quickDesc}>{action.desc}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Radar preview */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📡 Đang học gần đây</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/radar')}>
                <Text style={styles.seeAll}>Xem tất cả →</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
              {ACTIVE_USERS.map((user) => (
                <TouchableOpacity
                  key={user.id}
                  activeOpacity={0.85}
                  style={styles.userCard}
                >
                  <View style={styles.userAvatarWrap}>
                    <Text style={styles.userAvatar}>{user.avatar}</Text>
                    <View style={styles.onlineDot} />
                  </View>
                  <Text style={styles.userName2}>{user.name}</Text>
                  <View style={styles.subjectPill}>
                    <Text style={styles.subjectPillText}>{user.subject}</Text>
                  </View>
                  <Text style={styles.userLocation}>📍 {user.location}</Text>
                  <Text style={styles.userTime}>🕐 {user.time} trước</Text>
                  <TouchableOpacity style={styles.inviteBtn}>
                    <LinearGradient
                      colors={['#374F8A', '#243660']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.inviteGradient}
                    >
                      <Text style={styles.inviteText}>Ghép bàn</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Recent Docs */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📂 Tài liệu gần đây</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/docs')}>
                <Text style={styles.seeAll}>Xem tất cả →</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.docsList}>
              {RECENT_DOCS.map((doc) => (
                <TouchableOpacity
                  key={doc.id}
                  onPress={() => router.push('/docs/view')}
                  activeOpacity={0.8}
                  style={styles.docItem}
                >
                  <View style={styles.docIconBg}>
                    <Text style={styles.docIcon}>{doc.icon}</Text>
                  </View>
                  <View style={styles.docInfo}>
                    <Text style={styles.docName} numberOfLines={1}>{doc.name}</Text>
                    <Text style={styles.docMeta}>{doc.subject} · {doc.type} · {doc.size}</Text>
                  </View>
                  <TouchableOpacity style={styles.docQrBtn} onPress={() => router.push('/docs/qr')}>
                    <Text style={styles.docQrIcon}>⠿</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>

        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgBase },
  header: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.lg,
    gap: Spacing.base,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  greeting: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  userName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notifIcon: { fontSize: 20 },
  notifBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: Colors.white,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(55, 79, 138, 0.2)',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.md,
    gap: 2,
  },
  statValue: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.xl,
    color: Colors.primary,
  },
  statLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textPrimary,
  },
  statSub: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: Colors.textMuted,
  },
  scroll: { padding: Spacing.base, gap: Spacing['2xl'] },
  section: { gap: Spacing.md },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  seeAll: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  quickCard: {
    width: (width - Spacing.base * 2 - Spacing.sm) / 2,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadow.md,
  },
  quickGradient: { padding: Spacing.base, gap: Spacing.sm },
  quickIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickIcon: { fontSize: 24 },
  quickLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  quickDesc: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  hScroll: { marginHorizontal: -Spacing.base, paddingHorizontal: Spacing.base },
  userCard: {
    width: 150,
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginRight: Spacing.md,
    gap: Spacing.xs,
    ...Shadow.sm,
  },
  userAvatarWrap: { position: 'relative', width: 44, height: 44 },
  userAvatar: { fontSize: 36 },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.bgCard,
  },
  userName2: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  subjectPill: {
    backgroundColor: 'rgba(55, 79, 138, 0.3)',
    borderRadius: BorderRadius.full,
    paddingVertical: 2,
    paddingHorizontal: Spacing.sm,
    alignSelf: 'flex-start',
  },
  subjectPillText: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    color: Colors.accentLight,
  },
  userLocation: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  userTime: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  inviteBtn: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginTop: Spacing.xs,
  },
  inviteGradient: {
    paddingVertical: 6,
    alignItems: 'center',
  },
  inviteText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: Colors.white,
  },
  docsList: { gap: Spacing.sm },
  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
  },
  docIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(254, 208, 20, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docIcon: { fontSize: 24 },
  docInfo: { flex: 1 },
  docName: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  docMeta: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  docQrBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.bgCardAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docQrIcon: { fontSize: 18, color: Colors.textSecondary },
});
