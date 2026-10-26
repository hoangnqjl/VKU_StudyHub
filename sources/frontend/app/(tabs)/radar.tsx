import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Switch,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../src/constants/colors';
import { FontFamily, FontSize } from '../../src/constants/typography';
import { Spacing, BorderRadius, Shadow } from '../../src/constants/spacing';
import { SUBJECTS, LOCATIONS, RADAR_AUTO_OFF_MINUTES } from '../../src/constants/app';

const { width } = Dimensions.get('window');

const MOCK_USERS = [
  { id: '1', name: 'Minh Trí', subject: 'Cơ sở dữ liệu', location: 'Thư viện', time: '5 phút', avatar: '🧑‍💻', goal: 'Ôn thi giữa kỳ' },
  { id: '2', name: 'Thu Hà', subject: 'Mạng máy tính', location: 'Tòa A1', time: '12 phút', avatar: '👩‍🎓', goal: 'Làm bài tập' },
  { id: '3', name: 'Quang Huy', subject: 'Toán cao cấp', location: 'Căn tin', time: '3 phút', avatar: '🧑‍🎓', goal: 'Ôn thi cuối kỳ' },
  { id: '4', name: 'Lan Anh', subject: 'Lập trình C++', location: 'Lab Tin', time: '8 phút', avatar: '👩‍💻', goal: 'Làm đồ án' },
  { id: '5', name: 'Đức Thắng', subject: 'AI', location: 'Thư viện', time: '20 phút', avatar: '🧑‍🎓', goal: 'Tự học nâng cao' },
];

export default function RadarScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [radarActive, setRadarActive] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [filterLocation, setFilterLocation] = useState<string | null>(null);
  const [autoOff, setAutoOff] = useState(60);
  const [showSetup, setShowSetup] = useState(false);

  // Radar pulse animation
  const pulseScale1 = useRef(new Animated.Value(1)).current;
  const pulseScale2 = useRef(new Animated.Value(1)).current;
  const pulseScale3 = useRef(new Animated.Value(1)).current;
  const pulseOpacity1 = useRef(new Animated.Value(0.5)).current;
  const pulseOpacity2 = useRef(new Animated.Value(0.35)).current;
  const pulseOpacity3 = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    if (radarActive) {
      const createPulse = (scale: Animated.Value, opacity: Animated.Value, delay: number) =>
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
              Animated.timing(scale, { toValue: 2.5, duration: 2000, useNativeDriver: true }),
              Animated.timing(opacity, { toValue: 0, duration: 2000, useNativeDriver: true }),
            ]),
            Animated.parallel([
              Animated.timing(scale, { toValue: 1, duration: 0, useNativeDriver: true }),
              Animated.timing(opacity, { toValue: 0.5, duration: 0, useNativeDriver: true }),
            ]),
          ])
        );

      const a1 = createPulse(pulseScale1, pulseOpacity1, 0);
      const a2 = createPulse(pulseScale2, pulseOpacity2, 600);
      const a3 = createPulse(pulseScale3, pulseOpacity3, 1200);
      a1.start(); a2.start(); a3.start();
      return () => { a1.stop(); a2.stop(); a3.stop(); };
    }
  }, [radarActive]);

  const handleActivate = () => {
    if (!selectedSubject || !selectedLocation) {
      setShowSetup(true);
      return;
    }
    setRadarActive(true);
    setShowSetup(false);
  };

  const filteredUsers = filterLocation
    ? MOCK_USERS.filter((u) => u.location === filterLocation)
    : MOCK_USERS;

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#0F1629', '#1A2540']}
        style={[styles.header, { paddingTop: insets.top + Spacing.base }]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>📡 Study Radar</Text>
            <Text style={styles.headerSubtitle}>Tìm bạn học cùng môn</Text>
          </View>
          <View style={[styles.statusBadge, radarActive && styles.statusBadgeActive]}>
            <View style={[styles.statusDot, radarActive && styles.statusDotActive]} />
            <Text style={[styles.statusText, radarActive && styles.statusTextActive]}>
              {radarActive ? 'Đang sáng đèn' : 'Tắt'}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Radar visualization */}
        <View style={styles.radarSection}>
          <View style={styles.radarContainer}>
            {radarActive && (
              <>
                <Animated.View style={[styles.pulsRing, { transform: [{ scale: pulseScale1 }], opacity: pulseOpacity1 }]} />
                <Animated.View style={[styles.pulsRing, { transform: [{ scale: pulseScale2 }], opacity: pulseOpacity2 }]} />
                <Animated.View style={[styles.pulsRing, { transform: [{ scale: pulseScale3 }], opacity: pulseOpacity3 }]} />
              </>
            )}
            <TouchableOpacity
              onPress={radarActive ? () => setRadarActive(false) : handleActivate}
              activeOpacity={0.85}
              style={styles.radarCenter}
            >
              <LinearGradient
                colors={radarActive ? ['#374F8A', '#243660'] : ['#1A2540', '#243057']}
                style={styles.radarCenterGradient}
              >
                <Text style={styles.radarIcon}>📡</Text>
                <Text style={styles.radarCenterText}>
                  {radarActive ? 'Nhấn để\ntắt' : 'Nhấn để\nbật'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Active info */}
          {radarActive && selectedSubject && selectedLocation && (
            <View style={styles.activeInfo}>
              <View style={styles.activeInfoChip}>
                <Text style={styles.chipIcon}>📚</Text>
                <Text style={styles.chipText}>
                  {SUBJECTS.find((s) => s.id === selectedSubject)?.name}
                </Text>
              </View>
              <View style={styles.activeInfoChip}>
                <Text style={styles.chipIcon}>📍</Text>
                <Text style={styles.chipText}>
                  {LOCATIONS.find((l) => l.id === selectedLocation)?.name}
                </Text>
              </View>
              <View style={styles.activeInfoChip}>
                <Text style={styles.chipIcon}>⏱️</Text>
                <Text style={styles.chipText}>Tắt sau {autoOff}p</Text>
              </View>
            </View>
          )}
        </View>

        {/* Setup panel */}
        {(showSetup || !radarActive) && (
          <View style={styles.setupPanel}>
            <Text style={styles.setupTitle}>⚡ Thiết lập nhanh (≤ 3 chạm)</Text>

            {/* Subject picker */}
            <View style={styles.pickerSection}>
              <Text style={styles.pickerLabel}>Môn học</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScroll}>
                {SUBJECTS.slice(0, 6).map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    onPress={() => setSelectedSubject(s.id)}
                    style={[styles.pill, selectedSubject === s.id && styles.pillActive]}
                  >
                    <Text style={styles.pillIcon}>{s.icon}</Text>
                    <Text style={[styles.pillText, selectedSubject === s.id && styles.pillTextActive]}>
                      {s.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Location picker */}
            <View style={styles.pickerSection}>
              <Text style={styles.pickerLabel}>Địa điểm</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScroll}>
                {LOCATIONS.map((l) => (
                  <TouchableOpacity
                    key={l.id}
                    onPress={() => setSelectedLocation(l.id)}
                    style={[styles.pill, selectedLocation === l.id && styles.pillActive]}
                  >
                    <Text style={styles.pillIcon}>{l.icon}</Text>
                    <Text style={[styles.pillText, selectedLocation === l.id && styles.pillTextActive]}>
                      {l.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Auto-off */}
            <View style={styles.autoOffRow}>
              <Text style={styles.pickerLabel}>⏰ Tự tắt sau</Text>
              <View style={styles.autoOffPills}>
                {RADAR_AUTO_OFF_MINUTES.map((m) => (
                  <TouchableOpacity
                    key={m}
                    onPress={() => setAutoOff(m)}
                    style={[styles.autoOffPill, autoOff === m && styles.pillActive]}
                  >
                    <Text style={[styles.autoOffText, autoOff === m && styles.pillTextActive]}>
                      {m}p
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Activate button */}
            {selectedSubject && selectedLocation && (
              <TouchableOpacity onPress={handleActivate} activeOpacity={0.85} style={styles.activateBtn}>
                <LinearGradient
                  colors={['#374F8A', '#243660']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.activateGradient}
                >
                  <Text style={styles.activateText}>📡 Bật Radar ngay</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* User list */}
        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>
              🟢 {MOCK_USERS.length} bạn đang sáng đèn
            </Text>
          </View>

          {/* Filter by location */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <TouchableOpacity
              onPress={() => setFilterLocation(null)}
              style={[styles.filterPill, !filterLocation && styles.filterPillActive]}
            >
              <Text style={[styles.filterText, !filterLocation && styles.filterTextActive]}>Tất cả</Text>
            </TouchableOpacity>
            {LOCATIONS.map((l) => (
              <TouchableOpacity
                key={l.id}
                onPress={() => setFilterLocation(l.name)}
                style={[styles.filterPill, filterLocation === l.name && styles.filterPillActive]}
              >
                <Text style={styles.filterText}>{l.icon}</Text>
                <Text style={[styles.filterText, filterLocation === l.name && styles.filterTextActive]}>
                  {l.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* User cards */}
          {filteredUsers.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.userLeft}>
                <View style={styles.userAvatarWrap}>
                  <Text style={styles.userAvatar}>{user.avatar}</Text>
                  <View style={styles.onlineDot} />
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userSubject}>{user.subject}</Text>
                  <View style={styles.userMeta}>
                    <Text style={styles.userMetaText}>📍 {user.location}</Text>
                    <Text style={styles.userMetaDot}>·</Text>
                    <Text style={styles.userMetaText}>🕐 {user.time}</Text>
                  </View>
                  <View style={styles.goalPill}>
                    <Text style={styles.goalText}>{user.goal}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => router.push('/radar/invite')}
                style={styles.inviteBtn}
              >
                <LinearGradient
                  colors={['#374F8A', '#243660']}
                  style={styles.inviteGrad}
                >
                  <Text style={styles.inviteText}>Ghép bàn</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const RADAR_SIZE = 160;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgBase },
  header: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
  },
  statusBadgeActive: {
    borderColor: Colors.accent,
    backgroundColor: 'rgba(55, 79, 138, 0.2)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.offline,
  },
  statusDotActive: { backgroundColor: Colors.success },
  statusText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  statusTextActive: { color: Colors.success },

  scroll: { padding: Spacing.base, gap: Spacing.xl },

  radarSection: { alignItems: 'center', gap: Spacing.lg },
  radarContainer: {
    width: RADAR_SIZE * 2,
    height: RADAR_SIZE * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulsRing: {
    position: 'absolute',
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    borderRadius: RADAR_SIZE / 2,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  radarCenter: {
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    borderRadius: RADAR_SIZE / 2,
    overflow: 'hidden',
    ...Shadow.accent,
  },
  radarCenterGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  radarIcon: { fontSize: 40 },
  radarCenterText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.white,
    textAlign: 'center',
  },
  activeInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  activeInfoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(55, 79, 138, 0.3)',
    borderRadius: BorderRadius.full,
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  chipIcon: { fontSize: 12 },
  chipText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.accentLight,
  },

  setupPanel: {
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    gap: Spacing.base,
    ...Shadow.md,
  },
  setupTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  pickerSection: { gap: Spacing.sm },
  pickerLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  pickerScroll: { marginHorizontal: -Spacing.base },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.bgCardAlt,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    marginHorizontal: Spacing.xs,
  },
  pillActive: {
    borderColor: Colors.accent,
    backgroundColor: 'rgba(55, 79, 138, 0.3)',
  },
  pillIcon: { fontSize: 14 },
  pillText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  pillTextActive: { color: Colors.accentLight },
  autoOffRow: { gap: Spacing.sm },
  autoOffPills: { flexDirection: 'row', gap: Spacing.sm },
  autoOffPill: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.bgCardAlt,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  autoOffText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  activateBtn: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    ...Shadow.accent,
  },
  activateGradient: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  activateText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.white,
  },

  listSection: { gap: Spacing.md },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  filterScroll: { marginHorizontal: -Spacing.base },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: 4,
  },
  filterPillActive: { borderColor: Colors.primary, backgroundColor: 'rgba(254, 208, 20, 0.1)' },
  filterText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  filterTextActive: { color: Colors.primary },

  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  userLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, flex: 1 },
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
  userInfo: { flex: 1, gap: 3 },
  userName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  userSubject: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  userMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  userMetaText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  userMetaDot: { color: Colors.textMuted },
  goalPill: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderRadius: BorderRadius.full,
    paddingVertical: 2,
    paddingHorizontal: Spacing.sm,
    alignSelf: 'flex-start',
  },
  goalText: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    color: Colors.success,
  },
  inviteBtn: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginLeft: Spacing.sm,
  },
  inviteGrad: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
  inviteText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: Colors.white,
  },
});
