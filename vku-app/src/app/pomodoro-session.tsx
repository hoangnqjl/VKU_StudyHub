import { useEffect, useState } from 'react';
import { Image, Platform, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/inter';

import { useDesign } from '../components/design-scale';

const COLORS = {
  navy: '#101D83',
  title: '#17243A',
  body: '#7D8190',
  border: '#E1E9F3',
  pale: '#F6F8FC',
  green: '#10B981',
  white: '#FFFFFF',
};

const FONT = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semi: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extra: 'Inter_800ExtraBold',
};

const STUDY_STATUSES = [
  { label: 'Tập trung', emoji: '🔥' },
  { label: 'Đang code', emoji: '💻' },
  { label: 'Làm bài tập', emoji: '✍️' },
  { label: 'Đọc tài liệu', emoji: '📖' },
  { label: 'Giải lao', emoji: '☕' },
];

const SESSION_STATUS_LABELS: Record<string, string> = {
  'Tập trung': 'PHIÊN POMODORO ĐANG CHẠY',
  'Đang code': 'ĐANG CODE',
  'Làm bài tập': 'ĐANG LÀM BÀI TẬP',
  'Đọc tài liệu': 'ĐANG ĐỌC TÀI LIỆU',
  'Giải lao': 'ĐANG GIẢI LAO',
};

const TIMER_SECONDS = 14 * 60;
const RING_PROGRESS = 0.7;

export default function PomodoroSessionScreen() {
  const { s, z } = useDesign(raw);
  const insets = useSafeAreaInsets();
  const { title: titleParam, roomId } = useLocalSearchParams<{ title?: string; roomId?: string }>();
  const roomTitle = typeof titleParam === 'string' ? titleParam : 'Cày LeetCode & DSA';
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });
  const [remainingSeconds, setRemainingSeconds] = useState(TIMER_SECONDS);
  const [paused, setPaused] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [studyStatus, setStudyStatus] = useState('Tập trung');
  const [whiteNoiseOn, setWhiteNoiseOn] = useState(true);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (paused) return undefined;
    const timerId = setInterval(() => {
      setRemainingSeconds((remaining) => {
        if (remaining <= 1) {
          clearInterval(timerId);
          return 0;
        }
        return remaining - 1;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, [paused]);

  if (!fontsLoaded) return null;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const sessionStatusLabel = remainingSeconds === 0
    ? 'PHIÊN ĐÃ KẾT THÚC'
    : paused && !onBreak
      ? 'PHIÊN POMODORO ĐANG TẠM DỪNG'
      : SESSION_STATUS_LABELS[studyStatus];
  const activityLabel = onBreak
    ? 'Đang giải lao'
    : studyStatus === 'Tập trung'
      ? 'Tập trung cao độ'
      : studyStatus;
  const selectedStatusEmoji =
    STUDY_STATUSES.find((status) => status.label === studyStatus)?.emoji ?? '🔥';
  const ringSize = z(236);
  const ringCenter = ringSize / 2;
  const ringRadius = z(105);
  const ringCircumference = 2 * Math.PI * ringRadius;

  const takeBreak = () => {
    if (onBreak) {
      setOnBreak(false);
      setPaused(false);
      setStudyStatus('Tập trung');
      setNotice('Đã quay lại phiên tập trung.');
      return;
    }

    setOnBreak(true);
    setPaused(true);
    setStudyStatus('Giải lao');
    setNotice('Đã tạm dừng để giải lao.');
  };

  const togglePause = () => {
    if (paused) {
      setPaused(false);
      if (onBreak) {
        setOnBreak(false);
        setStudyStatus('Tập trung');
      }
      setNotice('Đã tiếp tục phiên Pomodoro.');
      return;
    }

    setPaused(true);
    setNotice('Đã tạm dừng phiên Pomodoro.');
  };

  const shareSession = async () => {
    try {
      await Share.share({ message: `Mình đang học trong phòng "${roomTitle}" trên Study Hub.` });
    } catch {
      setNotice('Không thể chia sẻ phiên học trên thiết bị này.');
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={[
          s.scroll,
          {
            paddingTop: Platform.OS === 'web' ? z(78) : Math.max(z(78) - insets.top, 0),
            paddingBottom: z(24) + insets.bottom,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Quay lại phòng"
            onPress={() => router.back()}
            style={s.roundButton}
          >
            <Feather name="chevron-left" size={z(23)} color="#263653" />
          </Pressable>
          <Text style={s.headerTitle} numberOfLines={1}>Pomodoro room</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Chia sẻ phiên học"
            onPress={shareSession}
            style={s.roundButton}
          >
            <Feather name="more-horizontal" size={z(25)} color={COLORS.title} />
          </Pressable>
        </View>

        <View style={s.timerCard}>
          <View style={s.syncBadge}>
            <Feather
              name={onBreak ? 'coffee' : paused || remainingSeconds === 0 ? 'pause-circle' : 'refresh-cw'}
              size={z(14)}
              color={onBreak ? '#D97706' : paused || remainingSeconds === 0 ? COLORS.body : COLORS.green}
            />
            <Text style={s.syncText}>{sessionStatusLabel}</Text>
          </View>

          <View
            accessibilityLabel={`Còn ${minutes} phút ${seconds} giây`}
            accessibilityRole="timer"
            style={[s.timerRing, { width: ringSize, height: ringSize }]}
          >
            <Svg width={ringSize} height={ringSize} style={s.progressRing}>
              <Circle
                cx={ringCenter}
                cy={ringCenter}
                r={ringRadius}
                fill="none"
                stroke="#EEF2F7"
                strokeWidth={z(7)}
              />
              <Circle
                cx={ringCenter}
                cy={ringCenter}
                r={ringRadius}
                fill="none"
                stroke={COLORS.navy}
                strokeWidth={z(7)}
                strokeLinecap="round"
                strokeDasharray={`${ringCircumference} ${ringCircumference}`}
                strokeDashoffset={ringCircumference * (1 - RING_PROGRESS)}
                transform={`rotate(-90 ${ringCenter} ${ringCenter})`}
              />
            </Svg>
            <View style={s.timerContent}>
              <Text style={s.timerValue}>{formattedTime}</Text>
              <Text style={s.timerSubtitle}>
                {onBreak ? 'Giải lao • Phiên 2 / 4' : 'Phiên 2 / 4 • 25 phút'}
              </Text>
              <View style={s.focusBadge}>
                <Text style={s.focusText}>{activityLabel}</Text>
              </View>
            </View>
          </View>

          <View style={s.timerActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={paused ? 'Tiếp tục phòng' : 'Tạm dừng phòng'}
              onPress={togglePause}
              style={s.pauseButton}
            >
              <Feather name={paused ? 'play' : 'pause'} size={z(19)} color={COLORS.white} />
              <Text style={s.pauseButtonText}>{paused ? 'Tiếp tục phòng' : 'Tạm dừng phòng'}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={onBreak ? 'Kết thúc giải lao' : 'Bắt đầu giải lao'}
              onPress={takeBreak}
              style={s.breakButton}
            >
              <Text style={s.breakIcon}>{selectedStatusEmoji}</Text>
            </Pressable>
          </View>
        </View>

        <View style={s.statusCard}>
          <View style={s.sectionHeading}>
            <Feather name="edit-3" size={z(17)} color={COLORS.navy} />
            <Text style={s.sectionTitle}>Trạng thái học tập</Text>
          </View>
          <View style={s.statusChoices}>
            {[STUDY_STATUSES.slice(0, 2), STUDY_STATUSES.slice(2)].map((row, rowIndex) => (
              <View key={rowIndex} style={s.statusChoiceRow}>
                {row.map((status) => {
                  const selected = studyStatus === status.label;
                  return (
                    <Pressable
                      accessibilityRole="radio"
                      accessibilityState={{ checked: selected }}
                      key={status.label}
                      onPress={() => {
                        setStudyStatus(status.label);
                        setOnBreak(status.label === 'Giải lao');
                        setPaused(status.label === 'Giải lao');
                        setNotice(`Trạng thái đã đổi thành “${status.label}”.`);
                      }}
                      style={[s.statusPill, selected && s.statusPillSelected]}
                    >
                      <Text style={[s.statusText, selected && s.statusTextSelected]}>
                        {status.label} {status.emoji}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        <View style={s.noiseCard}>
          <View style={s.musicIcon}>
            <Feather name="music" size={z(19)} color={COLORS.navy} />
          </View>
          <View style={s.noiseCopy}>
            <Text style={s.noiseTitle}>White Noise</Text>
            <Text style={s.noiseSubtitle}>Mưa rào nhẹ Thư viện VKU</Text>
          </View>
          <Pressable
            accessibilityRole="switch"
            accessibilityLabel="White Noise"
            accessibilityState={{ checked: whiteNoiseOn }}
            onPress={() => {
              setWhiteNoiseOn((current) => !current);
              setNotice('Điều khiển âm thanh sẽ khả dụng khi dịch vụ âm thanh được kết nối.');
            }}
            style={[s.noiseSwitch, whiteNoiseOn && s.noiseSwitchOn]}
          >
            <Feather name="volume-2" size={z(15)} color={whiteNoiseOn ? COLORS.navy : COLORS.body} />
            <Text style={[s.noiseSwitchText, whiteNoiseOn && s.noiseSwitchTextOn]}>
              {whiteNoiseOn ? 'Đang bật' : 'Đang tắt'}
            </Text>
          </Pressable>
        </View>

        {notice.length > 0 && <Text style={s.notice}>{notice}</Text>}

        <View style={s.membersHeading}>
          <Text style={s.membersTitle}>Đang cùng học</Text>
          <View style={s.memberCount}>
            <Text style={s.memberCountText}>5 thành viên</Text>
          </View>
        </View>
        <View style={s.memberCard}>
          <Image source={require('../../assets/images/avatar.png')} style={s.memberAvatar} />
          <View style={s.memberCopy}>
            <View style={s.memberNameRow}>
              <Text style={s.memberName}>Nguyễn Văn An</Text>
              <View style={s.youBadge}><Text style={s.youText}>Bạn</Text></View>
            </View>
            <Text style={s.memberStatus}>{studyStatus}</Text>
          </View>
          <Text style={s.memberTime}>21:45</Text>
        </View>
        <Text style={s.roomLabel} numberOfLines={1}>{roomTitle}{roomId ? ` · #${roomId.toUpperCase()}` : ''}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const cardShadow = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.045,
  shadowRadius: 5,
  shadowOffset: { width: 0, height: 2 },
  elevation: 1,
} as const;

const raw = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  scroll: { paddingHorizontal: 14 },
  header: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    ...cardShadow,
  },
  headerTitle: {
    position: 'absolute',
    left: 48,
    right: 48,
    textAlign: 'center',
    fontFamily: FONT.extra,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.5,
    color: '#243653',
  },
  timerCard: {
    minHeight: 400,
    marginTop: 42,
    paddingTop: 17,
    paddingBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    ...cardShadow,
  },
  syncBadge: {
    minHeight: 25,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E6EAF3',
    borderRadius: 15,
    backgroundColor: '#F8FAFD',
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncText: { marginLeft: 6, fontFamily: FONT.semi, fontSize: 10.5, lineHeight: 15, color: COLORS.title },
  timerRing: { marginTop: 31, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  progressRing: { position: 'absolute' },
  breakIcon: { fontSize: 20, lineHeight: 25 },
  timerContent: { alignItems: 'center', justifyContent: 'center' },
  timerValue: { fontFamily: FONT.extra, fontSize: 43, lineHeight: 51, letterSpacing: -1.5, color: COLORS.navy },
  timerSubtitle: { marginTop: 1, fontFamily: FONT.medium, fontSize: 12, lineHeight: 18, color: COLORS.body },
  focusBadge: { marginTop: 7, paddingHorizontal: 11, paddingVertical: 3, borderRadius: 14, backgroundColor: COLORS.navy },
  focusText: { fontFamily: FONT.semi, fontSize: 11, lineHeight: 15, color: COLORS.white },
  timerActions: { width: '100%', marginTop: 22, paddingHorizontal: 46, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pauseButton: {
    minHeight: 48,
    flex: 1,
    marginRight: 13,
    borderRadius: 24,
    backgroundColor: COLORS.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseButtonText: { marginLeft: 9, fontFamily: FONT.bold, fontSize: 13.5, lineHeight: 19, color: COLORS.white },
  breakButton: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: '#C8CCDA',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  statusCard: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 25,
    backgroundColor: COLORS.white,
  },
  sectionHeading: { minHeight: 22, flexDirection: 'row', alignItems: 'center' },
  sectionTitle: { marginLeft: 7, fontFamily: FONT.bold, fontSize: 12.5, lineHeight: 18, color: COLORS.title },
  statusChoices: { marginTop: 7, gap: 7 },
  statusChoiceRow: { flexDirection: 'row', gap: 7 },
  statusPill: {
    minHeight: 29,
    paddingHorizontal: 11,
    borderWidth: 1,
    borderColor: '#D9DDE7',
    borderRadius: 17,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPillSelected: { borderColor: COLORS.navy, backgroundColor: COLORS.navy },
  statusText: { fontFamily: FONT.semi, fontSize: 11.5, lineHeight: 16, color: COLORS.title },
  statusTextSelected: { color: COLORS.white },
  noiseCard: {
    minHeight: 59,
    marginTop: 17,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 32,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  musicIcon: { width: 39, height: 39, borderRadius: 20, backgroundColor: COLORS.pale, alignItems: 'center', justifyContent: 'center' },
  noiseCopy: { flex: 1, minWidth: 0, marginLeft: 10 },
  noiseTitle: { fontFamily: FONT.bold, fontSize: 12.5, lineHeight: 18, color: COLORS.title },
  noiseSubtitle: { marginTop: 1, fontFamily: FONT.regular, fontSize: 11.5, lineHeight: 16, color: COLORS.body },
  noiseSwitch: {
    minHeight: 27,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.pale,
  },
  noiseSwitchOn: { backgroundColor: '#F8FAFD' },
  noiseSwitchText: { marginLeft: 5, fontFamily: FONT.semi, fontSize: 11, lineHeight: 15, color: COLORS.body },
  noiseSwitchTextOn: { color: COLORS.navy },
  notice: { marginTop: 9, textAlign: 'center', fontFamily: FONT.medium, fontSize: 10.5, lineHeight: 15, color: COLORS.body },
  membersHeading: { marginTop: 18, marginBottom: 7, flexDirection: 'row', alignItems: 'center' },
  membersTitle: { fontFamily: FONT.extra, fontSize: 17, lineHeight: 23, letterSpacing: -0.3, color: COLORS.title },
  memberCount: { marginLeft: 8, paddingHorizontal: 9, paddingVertical: 3, borderRadius: 13, backgroundColor: '#E9EBF4' },
  memberCountText: { fontFamily: FONT.semi, fontSize: 10.5, lineHeight: 14, color: COLORS.navy },
  memberCard: {
    minHeight: 66,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    ...cardShadow,
  },
  memberAvatar: { width: 41, height: 41, borderRadius: 21, borderWidth: 1, borderColor: COLORS.border },
  memberCopy: { flex: 1, minWidth: 0, marginLeft: 10 },
  memberNameRow: { flexDirection: 'row', alignItems: 'center' },
  memberName: { fontFamily: FONT.bold, fontSize: 13, lineHeight: 18, color: COLORS.title },
  youBadge: { marginLeft: 6, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 12, backgroundColor: COLORS.navy },
  youText: { fontFamily: FONT.semi, fontSize: 10, lineHeight: 14, color: COLORS.white },
  memberStatus: { marginTop: 1, fontFamily: FONT.medium, fontSize: 11, lineHeight: 15, color: COLORS.body },
  memberTime: { alignSelf: 'flex-end', marginBottom: 12, fontFamily: FONT.medium, fontSize: 10, lineHeight: 14, color: COLORS.body },
  roomLabel: { marginTop: 10, textAlign: 'center', fontFamily: FONT.medium, fontSize: 10, lineHeight: 14, color: COLORS.body },
});
