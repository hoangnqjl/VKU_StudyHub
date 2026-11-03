import { safeBack } from '../utils/navigation';
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
import { pomodoroService, POMODORO_SOCKET_EVENTS, authService } from '../services';
import { useAlert } from '../components/AlertContext';
import { useLoading } from '../components/LoadingContext';
import DropdownMenu, { DropdownMenuItem } from '../components/DropdownMenu';
import { TemoPressable } from '../components/temoEffects';

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
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(TIMER_SECONDS);
  const [paused, setPaused] = useState(false);
  const [roomMenuOpen, setRoomMenuOpen] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [studyStatus, setStudyStatus] = useState('Tập trung');
  const [whiteNoiseOn, setWhiteNoiseOn] = useState(true);
  const [notice, setNotice] = useState('');
  const [participants, setParticipants] = useState<any[]>([]);

  const { showError, showSuccess } = useAlert();
  const { showLoading, hideLoading } = useLoading();
  const currentRoomId = roomId || 'room_default_01';

  // Realtime Socket.IO synchronization
  useEffect(() => {
    const socket = pomodoroService.getSocket();
    let localUser: any = null;

    authService.getCurrentUser().then((u) => {
      localUser = u;
      setCurrentUser(u);
      pomodoroService.joinRoomRealtime(currentRoomId, {
        id: u?.id || 'usr_01',
        fullName: u?.fullName || 'Sinh viên VKU',
        avatarUrl: u?.avatarUrl,
      });
    }).catch(() => {
      pomodoroService.joinRoomRealtime(currentRoomId, {
        id: 'usr_01',
        fullName: 'Sinh viên VKU',
      });
    });

    const handleRoomState = (data: any) => {
      if (data?.room) {
        if (typeof data.room.remainingSeconds === 'number') {
          setRemainingSeconds(data.room.remainingSeconds);
        }
        setPaused(data.room.status === 'PAUSED');
        setOnBreak(data.room.currentMode !== 'FOCUS');
        if (data.room.participants && data.room.participants.length > 0) {
          setParticipants(data.room.participants);
        }
      }
    };

    const handleTick = (data: any) => {
      if (data?.remainingSeconds !== undefined) {
        setRemainingSeconds(data.remainingSeconds);
        setPaused(data.status === 'PAUSED');
        setOnBreak(data.currentMode !== 'FOCUS');
      }
    };

    const handlePhaseChanged = (data: any) => {
      setOnBreak(data?.mode !== 'FOCUS');
      setNotice(data?.mode !== 'FOCUS' ? 'Đã chuyển sang giờ giải lao!' : 'Bắt đầu phiên học tập trung!');
    };

    const handleRoomClosed = (data: any) => {
      showSuccess('Phòng đã đóng', data?.message || 'Phòng học này đã kết thúc.', () => {
        router.replace('/focus' as any);
      });
    };
    socket.on('pomodoro:room_closed', handleRoomClosed);
    socket.on(POMODORO_SOCKET_EVENTS.ROOM_STATE, handleRoomState);
    socket.on(POMODORO_SOCKET_EVENTS.TIMER_TICK, handleTick);
    socket.on(POMODORO_SOCKET_EVENTS.PHASE_CHANGED, handlePhaseChanged);

    return () => {
      socket.off('pomodoro:room_closed', handleRoomClosed);
      socket.off(POMODORO_SOCKET_EVENTS.ROOM_STATE, handleRoomState);
      socket.off(POMODORO_SOCKET_EVENTS.TIMER_TICK, handleTick);
      socket.off(POMODORO_SOCKET_EVENTS.PHASE_CHANGED, handlePhaseChanged);
      if (localUser?.id) {
        pomodoroService.leaveRoomRealtime(currentRoomId, localUser.id);
      }
    };
  }, [currentRoomId]);

  // Local tick countdown when active
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
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

  const handleCloseRoom = async () => {
    try {
      showLoading('Đang kết thúc phòng học...');
      await pomodoroService.closeRoom(currentRoomId);
      hideLoading();
      showSuccess('Đã đóng phòng', 'Phòng học đã kết thúc và xóa khỏi danh sách trực tuyến.', () => {
        router.replace('/focus' as any);
      });
    } catch (err: any) {
      hideLoading();
      showError('Lỗi', err.message || 'Không thể đóng phòng lúc này.');
    }
  };

  const togglePause = () => {
    if (paused) {
      setPaused(false);
      pomodoroService.sendTimerAction(currentRoomId, 'START');
      if (onBreak) {
        setOnBreak(false);
        setStudyStatus('Tập trung');
      }
      setNotice('Đã tiếp tục phiên Pomodoro (Đồng bộ mọi thành viên).');
      return;
    }

    setPaused(true);
    pomodoroService.sendTimerAction(currentRoomId, 'PAUSE');
    setNotice('Đã tạm dừng phiên Pomodoro (Đồng bộ mọi thành viên).');
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
            onPress={() => safeBack('/focus')}
            style={s.roundButton}
          >
            <Feather name="chevron-left" size={z(23)} color="#263653" />
          </Pressable>
          <Text style={s.headerTitle} numberOfLines={1}>{roomTitle}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tùy chọn phiên học"
            onPress={() => setRoomMenuOpen(true)}
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
                strokeDashoffset={ringCircumference * (1 - Math.max(0, Math.min(1, remainingSeconds / (onBreak ? 5 * 60 : 25 * 60))))}
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
              setNotice('Âm thanh nền tập trung đã được bật.');
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
            <Text style={s.memberCountText}>
              {(participants.length > 0 ? participants.length : 1)} thành viên
            </Text>
          </View>
        </View>

        {(participants.length > 0 ? participants : [
          {
            userId: currentUser?.id || 'usr_01',
            fullName: currentUser?.fullName || 'Nguyễn Quang Hoàng',
            avatarUrl: currentUser?.avatarUrl,
            isHost: true,
          }
        ]).map((member: any, idx: number) => {
          const isYou = member.userId === (currentUser?.id || 'usr_01');
          return (
            <View key={member.userId || idx} style={s.memberCard}>
              <Image
                source={
                  member.avatarUrl && typeof member.avatarUrl === 'string' && member.avatarUrl.startsWith('http')
                    ? { uri: member.avatarUrl }
                    : require('../../assets/images/avatar.png')
                }
                style={s.memberAvatar}
              />
              <View style={s.memberCopy}>
                <View style={s.memberNameRow}>
                  <Text style={s.memberName}>{member.fullName || 'Thành viên VKU'}</Text>
                  {isYou && (
                    <View style={s.youBadge}><Text style={s.youText}>Bạn</Text></View>
                  )}
                  {member.isHost && !isYou && (
                    <View style={[s.youBadge, { backgroundColor: '#EEF2FF' }]}>
                      <Text style={[s.youText, { color: COLORS.navy }]}>Chủ phòng</Text>
                    </View>
                  )}
                </View>
                <Text style={s.memberStatus}>{isYou ? studyStatus : 'Đang học tập'}</Text>
              </View>
              <Text style={s.memberTime}>{formattedTime}</Text>
            </View>
          );
        })}
        <Text style={s.roomLabel} numberOfLines={1}>{roomTitle}{roomId ? ` · #${roomId.toUpperCase()}` : ''}</Text>

        {/* Nút thoát / Đóng phòng rõ ràng */}
        <TemoPressable
          accessibilityRole="button"
          accessibilityLabel="Rời và đóng phòng học"
          onPress={handleCloseRoom}
          style={s.leaveRoomBtn}
        >
          <Feather name="log-out" size={z(16)} color="#DC2626" />
          <Text style={s.leaveRoomBtnText}>Kết thúc & Đóng phòng học</Text>
        </TemoPressable>
      </ScrollView>

      {/* Menu tùy chọn phòng học */}
      <DropdownMenu
        visible={roomMenuOpen}
        title={roomTitle}
        subtitle="Quản lý và điều khiển phiên học Pomodoro"
        items={[
          {
            id: 'share',
            label: 'Chia sẻ phiên học',
            sublabel: 'Gửi lời mời tham gia cùng bàn học',
            icon: 'share-2',
            iconColor: '#101D83',
          },
          {
            id: 'leave',
            label: 'Rời phòng học',
            sublabel: 'Quay về trang danh sách phòng',
            icon: 'arrow-left-circle',
            iconColor: '#F59E0B',
          },
          {
            id: 'close',
            label: 'Đóng & Kết thúc phòng',
            sublabel: 'Kết thúc phiên Pomodoro và xóa phòng',
            icon: 'trash-2',
            iconColor: '#DC2626',
            danger: true,
          },
        ]}
        onSelect={async (item) => {
          setRoomMenuOpen(false);
          if (item.id === 'share') {
            shareSession();
          } else if (item.id === 'leave') {
            safeBack('/focus');
          } else if (item.id === 'close') {
            handleCloseRoom();
          }
        }}
        onClose={() => setRoomMenuOpen(false)}
      />
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
  scroll: { paddingHorizontal: 18 },
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
  membersHeading: { marginTop: 22, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  membersTitle: { fontFamily: FONT.extra, fontSize: 17, lineHeight: 23, letterSpacing: -0.3, color: COLORS.title },
  memberCount: { marginLeft: 8, paddingHorizontal: 9, paddingVertical: 3, borderRadius: 13, backgroundColor: '#E9EBF4' },
  memberCountText: { fontFamily: FONT.semi, fontSize: 10.5, lineHeight: 14, color: COLORS.navy },
  memberCard: {
    minHeight: 68,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E8EEF5',
    borderRadius: 24,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    ...cardShadow,
  },
  memberAvatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: '#E8EEF5' },
  memberCopy: { flex: 1, minWidth: 0, marginLeft: 12 },
  memberNameRow: { flexDirection: 'row', alignItems: 'center' },
  memberName: { fontFamily: FONT.bold, fontSize: 13.5, lineHeight: 19, color: COLORS.title },
  youBadge: { marginLeft: 6, paddingHorizontal: 8, paddingVertical: 2.5, borderRadius: 12, backgroundColor: COLORS.navy },
  youText: { fontFamily: FONT.semi, fontSize: 10, lineHeight: 14, color: COLORS.white },
  memberStatus: { marginTop: 2, fontFamily: FONT.medium, fontSize: 11.5, lineHeight: 16, color: COLORS.body },
  memberTime: { alignSelf: 'flex-end', marginBottom: 10, fontFamily: FONT.medium, fontSize: 11, lineHeight: 15, color: COLORS.body },
  roomLabel: { marginTop: 16, marginBottom: 16, textAlign: 'center', fontFamily: FONT.medium, fontSize: 11, lineHeight: 15, color: COLORS.body },
  leaveRoomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 20,
    alignSelf: 'center',
    ...Platform.select({
      web: { cursor: 'pointer' },
    }),
  },
  leaveRoomBtnText: {
    fontFamily: FONT.semi,
    fontSize: 13,
    color: '#DC2626',
  },
});
