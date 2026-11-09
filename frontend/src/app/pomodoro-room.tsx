import { safeBack } from '../utils/navigation';
import { useState } from 'react';
import { Image, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  MoreHorizontal,
  Share2,
  Clock,
  Headphones,
  ArrowRight,
} from '../components/DynamicLucideIcon';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/inter';

import { useDesign } from '../components/design-scale';
import BookmarkButton from '../components/bookmark-button';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { pomodoroService, PomodoroRoom, authService } from '../services';
import { useAlert } from '../components/AlertContext';
import { useLoading } from '../components/LoadingContext';
import DropdownMenu, { DropdownMenuItem } from '../components/DropdownMenu';

const AVATARS = {
  host: require('../../assets/images/room/host.png'),
  my: require('../../assets/images/room/member-my.png'),
  long: require('../../assets/images/room/member-long.png'),
  ha: require('../../assets/images/room/member-ha.png'),
  duc: require('../../assets/images/room/member-duc.png'),
};

const COLORS = {
  navy: '#101D83',
  title: '#17243A',
  body: '#7D8190',
  border: '#E1E9F3',
  pale: '#F6F8FC',
  green: '#10B981',
  orange: '#F59E0B',
  white: '#FFFFFF',
};

const FONT = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semi: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extra: 'Inter_800ExtraBold',
};

const ROOM_DETAILS: Record<string, { title: string; code: string }> = {
  leetcode: { title: 'Cày LeetCode & DSA', code: 'VKU-A08' },
  uiux: { title: 'Sprint Đồ án UI/UX VKU', code: 'VKU-U12' },
  toeic: { title: 'Góc luyện TOEIC 750+', code: 'VKU-E05' },
  math: { title: 'Toán rời rạc & Giải thuật', code: 'VKU-M03' },
};

const MEMBERS: any[] = [];
export default function PomodoroRoomScreen() {
  const { s, z } = useDesign(raw);
  const insets = useSafeAreaInsets();
  const { showSuccess, showError } = useAlert();
  const { showLoading, hideLoading } = useLoading();
  const { roomId, title: titleParam } = useLocalSearchParams<{ roomId?: string; title?: string }>();
  const [roomData, setRoomData] = useState<PomodoroRoom | null>(null);
  const room = ROOM_DETAILS[roomId ?? ''] ?? ROOM_DETAILS.leetcode;
  const roomTitle = roomData?.title || (typeof titleParam === 'string' ? titleParam : room.title);
  const roomCode = roomData?.id ? `VKU-${roomData.id.slice(-3).toUpperCase()}` : room.code;
  const [roomMenuOpen, setRoomMenuOpen] = useState(false);
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string | null>(null);
  useEffect(() => {
    authService.getCurrentUser().then(u => {
      if (u?.avatarUrl) setCurrentUserAvatar(u.avatarUrl);
    }).catch(() => {});
    AsyncStorage.getItem('@vku_user_avatar').then(a => {
      if (a && !a.includes('avatar_usr_01_default.png')) setCurrentUserAvatar(a);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (roomId) {
      pomodoroService.getRoomById(roomId).then((res) => {
        if (res) setRoomData(res);
      }).catch(() => {});
    }
  }, [roomId]);
  const [bookmarked, setBookmarked] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [notice, setNotice] = useState('');
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded) return null;

  const handleCloseRoom = async () => {
    if (!roomId) return;
    try {
      showLoading('Đang đóng phòng học...');
      await pomodoroService.closeRoom(roomId);
      hideLoading();
      showSuccess('Đã đóng phòng', 'Phòng học đã được kết thúc thành công.', () => {
        router.replace('/focus' as any);
      });
    } catch (err: any) {
      hideLoading();
      showError('Lỗi', err.message || 'Không thể đóng phòng.');
    }
  };

  const shareRoom = async () => {
    try {
      await Share.share({
        message: `Tham gia phòng Pomodoro "${roomTitle}" với mã #${room.code}.`,
      });
    } catch {
      setNotice('Không thể chia sẻ phòng trên thiết bị này.');
    }
  };

  const hostMember = roomData?.participants?.find(p => p.isHost);
  const hostAvatarUrl = hostMember?.avatarUrl || (hostMember?.userId === 'usr_01' ? currentUserAvatar : undefined);

  const dynamicMembers = (roomData?.participants && roomData.participants.length > 0)
    ? roomData.participants.map((p, idx) => ({
        name: p.fullName,
        cohort: 'VKU',
        avatarUrl: p.avatarUrl || (p.userId === 'usr_01' ? currentUserAvatar : undefined),
        avatar: Object.values(AVATARS)[idx % Object.values(AVATARS).length],
        status: 'Đang học',
        host: p.isHost,
        resting: false,
      }))
    : [{ name: "Nguyễn Quang Hoàng", cohort: "K23 CNTT", avatarUrl: currentUserAvatar, avatar: AVATARS.host, status: "Đang học", host: true, resting: false }];
  const visibleMembers = showAllMembers ? dynamicMembers : dynamicMembers.slice(0, 4);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={[s.scroll, { paddingBottom: z(24) + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Quay lại danh sách phòng"
            onPress={() => safeBack('/focus')}
            style={s.roundButton}
          >
            <ChevronLeft size={z(23)} color="#263653" strokeWidth={2.2} />
          </Pressable>
          <Text style={s.headerTitle} numberOfLines={1}>Pomodoro room</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tùy chọn phòng"
            onPress={() => setRoomMenuOpen(true)}
            style={s.roundButton}
          >
            <MoreHorizontal size={z(25)} color={COLORS.title} strokeWidth={2} />
          </Pressable>
        </View>

        <View style={s.roomToolbar}>
          <View style={s.roomCodePill}>
            <Text style={s.roomCodeText}>Mã phòng #{roomCode}</Text>
          </View>
          <View style={s.roomActions}>
            <BookmarkButton
              accessibilityLabel={bookmarked ? 'Bỏ lưu phòng' : 'Lưu phòng'}
              onPress={() => setBookmarked((value) => !value)}
              selected={bookmarked}
              size={z(40)}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Chia sẻ phòng"
              onPress={shareRoom}
              style={s.shareButton}
            >
              <Share2 size={z(21)} color="#4B5060" strokeWidth={2} />
            </Pressable>
          </View>
        </View>

        <View style={s.summaryCard}>
          <View style={s.summaryStatusRow}>
            <View style={s.sessionPill}>
              <View style={s.greenDot} />
              <Text style={s.sessionText}>Đang diễn ra • Phiên 2/4</Text>
            </View>
            <View style={s.remainingPill}>
              <Text style={s.remainingText}>14m còn lại</Text>
            </View>
          </View>
          <Text style={s.roomTitle} numberOfLines={2}>{roomTitle}</Text>
          <View style={s.hostBar}>
            {hostAvatarUrl ? (
              <Image source={{ uri: hostAvatarUrl }} style={s.hostAvatar} />
            ) : (
              <Image source={AVATARS.host} style={s.hostAvatar} />
            )}
            <Text style={s.hostLabel}>• Host {roomData?.hostName ? `(${roomData.hostName})` : ''}</Text>
            <View style={s.cyclePill}>
              <Clock size={z(15)} color={COLORS.navy} strokeWidth={2} />
              <Text style={s.cycleText}>25m học • 5m nghỉ (4 chu kỳ)</Text>
            </View>
          </View>
        </View>

        <View style={s.membersCard}>
          <View style={s.membersHeading}>
            <Text style={s.membersTitle}>Thành viên (5/8)</Text>
            <View style={s.seatsPill}>
              <View style={s.greenDotSmall} />
              <Text style={s.seatsText}>Còn 3 chỗ</Text>
            </View>
          </View>
          <View>
            {visibleMembers.map((member, index) => (
              <View key={member.name} style={[s.memberRow, index === visibleMembers.length - 1 && s.lastMemberRow]}>
                <View style={s.memberPhotoWrap}>
                  {member.avatarUrl ? (
                    <Image source={{ uri: member.avatarUrl }} style={s.memberAvatarImage} />
                  ) : member.avatar ? (
                    <Image source={member.avatar} style={s.memberAvatarImage} />
                  ) : (
                    <View style={[s.memberAvatar, s.initialsAvatar]}>
                      <Text style={s.initialsText}>{member.name ? member.name.split(' ').slice(-1)[0].substring(0, 2).toUpperCase() : 'VK'}</Text>
                    </View>
                  )}
                  <View style={[s.memberStatusDot, member.resting && s.restingDot]} />
                </View>
                <View style={s.memberCopy}>
                  <View style={s.memberNameRow}>
                    <Text style={s.memberName} numberOfLines={1}>{member.name}</Text>
                    {member.host && (
                      <View style={s.hostBadge}>
                        <Text style={s.hostBadgeText}>Host</Text>
                      </View>
                    )}
                  </View>
                  <Text style={s.memberCohort}>{member.cohort}</Text>
                </View>
                <Text style={[s.memberStatus, member.resting && s.restingText]}>{member.status}</Text>
              </View>
            ))}
          </View>
          <View style={s.membersFooter}>
            <Text style={s.otherMembersText}>
              {showAllMembers ? 'Đã hiển thị tất cả thành viên' : '+1 thành viên khác'}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={showAllMembers ? 'Thu gọn danh sách thành viên' : 'Xem tất cả thành viên'}
              onPress={() => setShowAllMembers((value) => !value)}
            >
              <Text style={s.viewAllText}>{showAllMembers ? 'Thu gọn' : 'Xem tất cả (5)'}</Text>
            </Pressable>
          </View>
        </View>

        <View style={s.audioCard}>
          <Headphones size={z(20)} color={COLORS.title} strokeWidth={2} />
          <Text style={s.audioLabel}>Âm thanh nền (Mưa thư viện)</Text>
          <Pressable
            accessibilityRole="switch"
            accessibilityLabel="Âm thanh nền"
            accessibilityState={{ checked: soundOn }}
            onPress={() => setSoundOn((value) => !value)}
            style={[s.switchTrack, !soundOn && s.switchTrackOff]}
          >
            <View style={[s.switchThumb, !soundOn && s.switchThumbOff]} />
          </Pressable>
        </View>

        {notice.length > 0 && <Text style={s.notice}>{notice}</Text>}

        <Pressable
          accessibilityRole="button"
          onPress={async () => {
            const targetRoomId = roomId ?? 'leetcode';
            try {
              const u = await authService.getCurrentUser().catch(() => null);
              const avatar = currentUserAvatar || u?.avatarUrl;
              await pomodoroService.joinRoom(targetRoomId, {
                id: u?.id || 'usr_01',
                fullName: u?.fullName || 'Sinh viên VKU',
                avatarUrl: avatar || undefined
              }).catch(() => {});
            } catch {}
            router.push({
              pathname: '/pomodoro-session',
              params: { roomId: targetRoomId, title: roomTitle },
            });
          }}
          style={s.joinRoomButton}
        >
          <Text style={s.joinRoomText}>Tham gia phòng</Text>
          <ArrowRight size={z(20)} color={COLORS.white} strokeWidth={2.2} />
        </Pressable>
      </ScrollView>
      <DropdownMenu
        visible={roomMenuOpen}
        title={roomTitle}
        subtitle="Tùy chọn phòng học Pomodoro"
        items={[
          { id: 'share', label: 'Chia sẻ phòng học', sublabel: 'Mã phòng #' + roomCode, icon: 'share-2', iconColor: '#101D83' },
          { id: 'close', label: 'Đóng & Kết thúc phòng', sublabel: 'Xóa phòng khỏi hệ thống', icon: 'trash-2', iconColor: '#DC2626', danger: true },
        ]}
        onSelect={(item) => {
          setRoomMenuOpen(false);
          if (item.id === 'share') shareRoom();
          else if (item.id === 'close') handleCloseRoom();
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
  scroll: { paddingHorizontal: 18, paddingTop: 39 },
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
  roomToolbar: {
    marginTop: 30,
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roomCodePill: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 17,
    backgroundColor: COLORS.pale,
  },
  roomCodeText: { fontFamily: FONT.bold, fontSize: 12, lineHeight: 17, color: '#4B4F5C' },
  roomActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  shareButton: {
    width: 30,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    marginTop: 17,
    paddingHorizontal: 19,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 19,
    backgroundColor: COLORS.white,
    ...cardShadow,
  },
  summaryStatusRow: {
    minHeight: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sessionPill: {
    minHeight: 23,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: COLORS.pale,
    flexDirection: 'row',
    alignItems: 'center',
  },
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.green },
  sessionText: { marginLeft: 7, fontFamily: FONT.semi, fontSize: 11.5, lineHeight: 16, color: COLORS.title },
  remainingPill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 13,
    backgroundColor: '#FFF1EC',
  },
  remainingText: { fontFamily: FONT.bold, fontSize: 11.5, lineHeight: 15, color: '#C2410C' },
  roomTitle: {
    marginTop: 8,
    fontFamily: FONT.extra,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.5,
    color: COLORS.title,
  },
  hostBar: {
    minHeight: 40,
    marginTop: 8,
    paddingHorizontal: 9,
    borderRadius: 18,
    backgroundColor: '#F7F8FD',
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostAvatar: { width: 32, height: 32 },
  hostLabel: { marginLeft: 9, marginRight: 10, fontFamily: FONT.medium, fontSize: 12, color: COLORS.body },
  cyclePill: {
    minHeight: 28,
    paddingHorizontal: 9,
    borderRadius: 16,
    backgroundColor: '#E5E7F4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  cycleText: { marginLeft: 5, fontFamily: FONT.semi, fontSize: 11.5, lineHeight: 16, color: COLORS.navy },
  membersCard: {
    marginTop: 16,
    paddingHorizontal: 19,
    paddingTop: 18,
    paddingBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    ...cardShadow,
  },
  membersHeading: {
    minHeight: 30,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  membersTitle: { fontFamily: FONT.bold, fontSize: 16, lineHeight: 22, color: COLORS.title },
  seatsPill: {
    minHeight: 24,
    paddingHorizontal: 9,
    borderRadius: 14,
    backgroundColor: '#F6F9FA',
    flexDirection: 'row',
    alignItems: 'center',
  },
  greenDotSmall: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.green },
  seatsText: { marginLeft: 6, fontFamily: FONT.semi, fontSize: 11.5, lineHeight: 16, color: COLORS.green },
  memberRow: {
    minHeight: 57,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1F7',
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastMemberRow: { borderBottomWidth: 0 },
  memberPhotoWrap: {
    width: 38,
    height: 38,
    marginRight: 10,
    position: 'relative',
  },
  memberAvatar: { width: 36, height: 36, borderRadius: 18 },
  memberAvatarImage: { width: 36, height: 36 },
  initialsAvatar: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#E7ECF7' },
  initialsText: { fontFamily: FONT.bold, fontSize: 11, color: COLORS.navy },
  memberStatusDot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: COLORS.white,
    backgroundColor: COLORS.green,
  },
  restingDot: { backgroundColor: COLORS.orange },
  memberCopy: { flex: 1, minWidth: 0 },
  memberNameRow: { flexDirection: 'row', alignItems: 'center' },
  memberName: { flexShrink: 1, fontFamily: FONT.semi, fontSize: 12.5, lineHeight: 18, color: COLORS.title },
  hostBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: '#E6E8F0',
  },
  hostBadgeText: { fontFamily: FONT.bold, fontSize: 9.5, lineHeight: 12, color: COLORS.navy },
  memberCohort: { marginTop: 1, fontFamily: FONT.regular, fontSize: 11.5, lineHeight: 16, color: COLORS.body },
  memberStatus: { marginLeft: 5, fontFamily: FONT.regular, fontSize: 11.5, lineHeight: 16, color: COLORS.body },
  restingText: { color: '#D97706', fontFamily: FONT.medium },
  membersFooter: {
    minHeight: 30,
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  otherMembersText: { fontFamily: FONT.regular, fontSize: 11, lineHeight: 16, color: COLORS.body },
  viewAllText: { fontFamily: FONT.semi, fontSize: 11.5, lineHeight: 16, color: COLORS.navy },
  audioCard: {
    minHeight: 54,
    marginTop: 15,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 29,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    ...cardShadow,
  },
  audioLabel: { flex: 1, marginLeft: 8, fontFamily: FONT.semi, fontSize: 12.5, lineHeight: 18, color: COLORS.title },
  switchTrack: {
    width: 38,
    height: 22,
    padding: 2,
    borderRadius: 12,
    backgroundColor: COLORS.navy,
    justifyContent: 'center',
  },
  switchTrackOff: { backgroundColor: '#CBD5E1' },
  switchThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignSelf: 'flex-end',
    backgroundColor: COLORS.white,
  },
  switchThumbOff: { alignSelf: 'flex-start' },
  notice: { marginTop: 10, textAlign: 'center', fontFamily: FONT.medium, fontSize: 11, lineHeight: 16, color: COLORS.body },
  joinRoomButton: {
    minHeight: 50,
    marginTop: 23,
    borderRadius: 27,
    backgroundColor: COLORS.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
  joinRoomText: { marginRight: 8, fontFamily: FONT.bold, fontSize: 14, lineHeight: 20, color: COLORS.white },
});
