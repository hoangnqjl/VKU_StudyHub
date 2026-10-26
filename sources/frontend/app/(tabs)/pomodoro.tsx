import React, { useState, useEffect, useRef } from 'react';
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
import { POMODORO_PRESETS } from '../../src/constants/app';

const MOCK_ROOMS = [
  { id: '1', name: 'Phòng CSDL nhóm 3', subject: 'Cơ sở dữ liệu', host: 'Minh Trí', members: 4, maxMembers: 6, phase: 'focus', timeLeft: '18:32', code: 'CSDL-3A' },
  { id: '2', name: 'Ôn Toán cao cấp', subject: 'Toán cao cấp', host: 'Thu Hà', members: 2, maxMembers: 5, phase: 'rest', timeLeft: '03:15', code: 'TOAN-HB' },
  { id: '3', name: 'Làm đồ án Mobile', subject: 'Lập trình Mobile', host: 'Quang Huy', members: 5, maxMembers: 6, phase: 'focus', timeLeft: '22:07', code: 'MOB-QH' },
];

const PHASE_COLORS = {
  focus: Colors.danger,
  rest: Colors.success,
};

const PHASE_LABELS = {
  focus: '🎯 Tập trung',
  rest: '☕ Nghỉ giải lao',
};

export default function PomodoroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeRoom, setActiveRoom] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#0F1629', '#1A2540']}
        style={[styles.header, { paddingTop: insets.top + Spacing.base }]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>⏱️ Pomodoro nhóm</Text>
            <Text style={styles.headerSubtitle}>Học đồng bộ cùng bạn</Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.headerBtns}>
          <TouchableOpacity
            onPress={() => router.push('/pomodoro/create')}
            style={styles.createBtn}
          >
            <LinearGradient
              colors={['#DF0218', '#B50114']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.createGrad}
            >
              <Text style={styles.createBtnText}>+ Tạo phòng</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/pomodoro/join')}
            style={styles.joinBtn}
          >
            <Text style={styles.joinBtnText}>📲 Vào bằng mã</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Active rooms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔴 Phòng đang hoạt động</Text>
          {MOCK_ROOMS.map((room) => (
            <TouchableOpacity
              key={room.id}
              onPress={() => router.push('/pomodoro/room')}
              activeOpacity={0.85}
              style={styles.roomCard}
            >
              <LinearGradient
                colors={['#1A2540', '#1F2D4E']}
                style={styles.roomGrad}
              >
                {/* Room header */}
                <View style={styles.roomHeader}>
                  <View style={styles.roomInfo}>
                    <Text style={styles.roomName}>{room.name}</Text>
                    <Text style={styles.roomSubject}>{room.subject}</Text>
                  </View>
                  <View style={[styles.phaseBadge, { backgroundColor: PHASE_COLORS[room.phase as keyof typeof PHASE_COLORS] + '22', borderColor: PHASE_COLORS[room.phase as keyof typeof PHASE_COLORS] + '55' }]}>
                    <Text style={[styles.phaseText, { color: PHASE_COLORS[room.phase as keyof typeof PHASE_COLORS] }]}>
                      {PHASE_LABELS[room.phase as keyof typeof PHASE_LABELS]}
                    </Text>
                  </View>
                </View>

                {/* Timer display */}
                <View style={styles.roomTimer}>
                  <Text style={[styles.timerText, { color: PHASE_COLORS[room.phase as keyof typeof PHASE_COLORS] }]}>
                    {room.timeLeft}
                  </Text>
                </View>

                {/* Room footer */}
                <View style={styles.roomFooter}>
                  <View style={styles.memberRow}>
                    <Text style={styles.memberIcon}>👥</Text>
                    <Text style={styles.memberText}>
                      {room.members}/{room.maxMembers} thành viên
                    </Text>
                  </View>
                  <View style={styles.roomRight}>
                    <View style={styles.codeBadge}>
                      <Text style={styles.codeText}>{room.code}</Text>
                    </View>
                    <Text style={styles.hostText}>👑 {room.host}</Text>
                  </View>
                </View>

                {/* Member avatars */}
                <View style={styles.memberAvatars}>
                  {Array.from({ length: room.members }).map((_, i) => (
                    <View key={i} style={[styles.memberAvatar, { marginLeft: i > 0 ? -8 : 0 }]}>
                      <Text style={styles.memberAvatarText}>
                        {['🧑‍💻', '👩‍🎓', '🧑‍🎓', '👩‍💻', '🧑'][i % 5]}
                      </Text>
                    </View>
                  ))}
                  <Text style={styles.joinRoomText}>Tham gia →</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Pomodoro presets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Cài đặt thời gian phổ biến</Text>
          <View style={styles.presetsGrid}>
            {POMODORO_PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset.label}
                onPress={() => router.push('/pomodoro/create')}
                activeOpacity={0.8}
                style={styles.presetCard}
              >
                <Text style={styles.presetWork}>{preset.work}p</Text>
                <Text style={styles.presetSlash}>/</Text>
                <Text style={styles.presetRest}>{preset.rest}p</Text>
                <Text style={styles.presetLabel}>{preset.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Mẹo học với Pomodoro</Text>
          {[
            'Tắt thông báo trong phiên tập trung',
            'Dùng thời gian nghỉ để đứng dậy và căng người',
            'Mỗi 4 pomodoro, nghỉ dài 15–30 phút',
          ].map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <View style={styles.tipDot} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
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
  headerBtns: { flexDirection: 'row', gap: Spacing.sm },
  createBtn: {
    flex: 1,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    ...Shadow.danger,
  },
  createGrad: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  createBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.white,
  },
  joinBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.bgCard,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  joinBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },

  scroll: { padding: Spacing.base, gap: Spacing.xl },
  section: { gap: Spacing.md },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  roomCard: {
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadow.md,
  },
  roomGrad: { padding: Spacing.base, gap: Spacing.md },
  roomHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  roomInfo: { flex: 1, gap: 2 },
  roomName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  roomSubject: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  phaseBadge: {
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  phaseText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
  },
  roomTimer: { alignItems: 'center' },
  timerText: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize['4xl'],
    letterSpacing: -1,
  },
  roomFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  memberIcon: { fontSize: 16 },
  memberText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  roomRight: { alignItems: 'flex-end', gap: 2 },
  codeBadge: {
    backgroundColor: Colors.bgInput,
    borderRadius: BorderRadius.sm,
    paddingVertical: 2,
    paddingHorizontal: Spacing.sm,
  },
  codeText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    color: Colors.primary,
    letterSpacing: 1,
  },
  hostText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  memberAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.bgInput,
    borderWidth: 2,
    borderColor: Colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberAvatarText: { fontSize: 16 },
  joinRoomText: {
    marginLeft: 'auto',
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.danger,
  },

  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  presetCard: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    flexWrap: 'wrap',
  },
  presetWork: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.danger,
  },
  presetSlash: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textMuted,
  },
  presetRest: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.success,
  },
  presetLabel: {
    width: '100%',
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  tipsCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  tipsTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 7,
  },
  tipText: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
