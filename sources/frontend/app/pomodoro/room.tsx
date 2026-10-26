import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../src/constants/colors';
import { FontFamily, FontSize } from '../../src/constants/typography';
import { Spacing, BorderRadius, Shadow } from '../../src/constants/spacing';
import { POMODORO_PRESETS } from '../../src/constants/app';

type Phase = 'focus' | 'rest';

const MEMBERS = [
  { id: '1', name: 'Minh Trí (Bạn)', avatar: '🧑‍💻', status: 'focus', isHost: true },
  { id: '2', name: 'Thu Hà', avatar: '👩‍🎓', status: 'focus', isHost: false },
  { id: '3', name: 'Quang Huy', avatar: '🧑‍🎓', status: 'focus', isHost: false },
  { id: '4', name: 'Lan Anh', avatar: '👩‍💻', status: 'rest', isHost: false },
];

export default function PomodoroRoomScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [phase, setPhase] = useState<Phase>('focus');
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(25 * 60);
  const [totalSeconds] = useState(25 * 60);
  const [sessionCount, setSessionCount] = useState(0);

  const progressAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (running) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.04, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [running]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (running && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => {
          const next = s - 1;
          Animated.timing(progressAnim, {
            toValue: next / totalSeconds,
            duration: 900,
            useNativeDriver: false,
          }).start();
          return next;
        });
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [running, seconds]);

  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');

  const phaseColor = phase === 'focus' ? Colors.danger : Colors.success;
  const phaseLabel = phase === 'focus' ? '🎯 Tập trung' : '☕ Nghỉ giải lao';

  return (
    <LinearGradient colors={['#0F1629', '#1A2540']} style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.base }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Phòng CSDL nhóm 3</Text>
          <Text style={styles.headerCode}>Mã: CSDL-3A</Text>
        </View>
        <TouchableOpacity style={styles.shareBtn}>
          <Text style={styles.shareIcon}>⠿</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + Spacing['3xl'] }]} showsVerticalScrollIndicator={false}>
        {/* Phase badge */}
        <View style={[styles.phaseBadge, { backgroundColor: phaseColor + '22', borderColor: phaseColor + '55' }]}>
          <Text style={[styles.phaseText, { color: phaseColor }]}>{phaseLabel}</Text>
          <Text style={styles.sessionCount}>Phiên #{sessionCount + 1}</Text>
        </View>

        {/* Timer ring */}
        <Animated.View style={[styles.timerRingWrapper, { transform: [{ scale: pulseAnim }] }]}>
          <View style={[styles.timerRing, { borderColor: phaseColor + '44' }]}>
            <View style={[styles.timerRingInner, { borderColor: phaseColor }]}>
              <Text style={[styles.timerText, { color: phaseColor }]}>{mins}:{secs}</Text>
              <Text style={styles.timerLabel}>{phase === 'focus' ? 'tập trung' : 'nghỉ ngơi'}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={() => setSeconds(totalSeconds)}
            style={styles.controlBtn}
          >
            <Text style={styles.controlBtnText}>↺</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setRunning(!running)}
            style={[styles.playBtn, { shadowColor: phaseColor }]}
          >
            <LinearGradient
              colors={phase === 'focus' ? ['#DF0218', '#B50114'] : ['#22C55E', '#16A34A']}
              style={styles.playGrad}
            >
              <Text style={styles.playIcon}>{running ? '⏸' : '▶'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setPhase(phase === 'focus' ? 'rest' : 'focus');
              setSeconds(phase === 'focus' ? 5 * 60 : 25 * 60);
              setRunning(false);
              if (phase === 'focus') setSessionCount(c => c + 1);
            }}
            style={styles.controlBtn}
          >
            <Text style={styles.controlBtnText}>⏭</Text>
          </TouchableOpacity>
        </View>

        {/* Members in room */}
        <View style={styles.membersSection}>
          <Text style={styles.sectionTitle}>👥 Thành viên ({MEMBERS.length})</Text>
          {MEMBERS.map((member) => (
            <View key={member.id} style={styles.memberRow}>
              <View style={styles.memberAvatarWrap}>
                <Text style={styles.memberAvatar}>{member.avatar}</Text>
                <View style={[styles.memberStatus, { backgroundColor: member.status === 'focus' ? Colors.danger : Colors.success }]} />
              </View>
              <View style={styles.memberInfo}>
                <View style={styles.memberNameRow}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  {member.isHost && (
                    <View style={styles.hostBadge}>
                      <Text style={styles.hostBadgeText}>👑 Chủ phòng</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.memberStatusText, { color: member.status === 'focus' ? Colors.danger : Colors.success }]}>
                  {member.status === 'focus' ? '🎯 Đang tập trung' : '☕ Đang nghỉ'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Session history */}
        <View style={styles.historyCard}>
          <Text style={styles.sectionTitle}>📊 Hôm nay</Text>
          <View style={styles.historyStats}>
            <View style={styles.historyStat}>
              <Text style={styles.historyValue}>{sessionCount}</Text>
              <Text style={styles.historyLabel}>Phiên hoàn thành</Text>
            </View>
            <View style={styles.historyStat}>
              <Text style={styles.historyValue}>{sessionCount * 25}p</Text>
              <Text style={styles.historyLabel}>Thời gian học</Text>
            </View>
            <View style={styles.historyStat}>
              <Text style={styles.historyValue}>{MEMBERS.length}</Text>
              <Text style={styles.historyLabel}>Thành viên</Text>
            </View>
          </View>
        </View>

        {/* Leave room */}
        <TouchableOpacity onPress={() => router.back()} style={styles.leaveBtn}>
          <Text style={styles.leaveBtnText}>🚪 Rời phòng</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 32, color: Colors.primary, lineHeight: 36 },
  headerCenter: { alignItems: 'center' },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  headerCode: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.primary,
    letterSpacing: 1,
  },
  shareBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  shareIcon: { fontSize: 18, color: Colors.textSecondary },

  scroll: { padding: Spacing.base, gap: Spacing.xl, alignItems: 'center' },

  phaseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  phaseText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
  },
  sessionCount: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },

  timerRingWrapper: { alignItems: 'center', justifyContent: 'center' },
  timerRing: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerRingInner: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  timerText: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize['4xl'],
    letterSpacing: -1,
  },
  timerLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },

  controls: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xl },
  controlBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlBtnText: { fontSize: 24, color: Colors.textSecondary },
  playBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  playGrad: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: { fontSize: 28 },

  membersSection: { width: '100%', gap: Spacing.md },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
  },
  memberAvatarWrap: { position: 'relative', width: 40, height: 40 },
  memberAvatar: { fontSize: 32 },
  memberStatus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.bgCard,
  },
  memberInfo: { flex: 1, gap: 2 },
  memberNameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  memberName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  hostBadge: {
    backgroundColor: 'rgba(254, 208, 20, 0.15)',
    borderRadius: BorderRadius.full,
    paddingVertical: 2,
    paddingHorizontal: Spacing.sm,
  },
  hostBadgeText: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    color: Colors.primary,
  },
  memberStatusText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
  },

  historyCard: {
    width: '100%',
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    gap: Spacing.md,
    ...Shadow.sm,
  },
  historyStats: { flexDirection: 'row', justifyContent: 'space-around' },
  historyStat: { alignItems: 'center', gap: 2 },
  historyValue: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.xl,
    color: Colors.primary,
  },
  historyLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  leaveBtn: {
    width: '100%',
    backgroundColor: 'rgba(223, 2, 24, 0.1)',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(223, 2, 24, 0.25)',
    padding: Spacing.base,
    alignItems: 'center',
  },
  leaveBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.danger,
  },
});
