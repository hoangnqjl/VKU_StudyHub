import { useState, useEffect } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { pomodoroService } from '../services';
import { router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/inter';

import StudyHubTabBar from '../components/study-hub-tab-bar';
import { useDesign } from '../components/design-scale';

const IMG = {
  logo: require('../../assets/images/vku-logo.png'),
  bell: require('../../assets/images/home/bell.png'),
  uiuxRoomIcon: require('../../assets/images/home/uiux-room-icon.png'),
};

const C = {
  primary: '#101D83',
  brand: '#374F8A',
  ink: '#172033',
  body: '#7A8395',
  muted: '#94A3B8',
  line: '#EEF1F5',
  soft: '#F6F8FB',
  green: '#10B981',
  orange: '#F59E0B',
  white: '#FFFFFF',
};

const F = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semi: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extra: 'Inter_800ExtraBold',
};

const ROOMS = [
  {
    id: 'leetcode',
    title: 'Cày LeetCode & DSA',
    icon: 'terminal' as const,
    iconColor: '#142C84',
    seats: '6/8 chỗ',
    remaining: "Còn 18'",
    remainingMinutes: 18,
    cycle: "50' Chu kỳ",
    participants: [
      { initials: 'NM', color: '#DDE8FF', textColor: '#193782' },
      { initials: 'HA', color: '#FFF0CC', textColor: '#AD5700' },
      { initials: 'TH', color: '#D8F8EB', textColor: '#08785B' },
    ],
    extra: '+3',
    subtitle: 'Đang tập trung cao độ',
  },
  {
    id: 'uiux',
    title: 'Sprint Đồ án UI/UX VKU',
    icon: 'figma' as const,
    iconColor: '#FF642D',
    seats: '4/6 chỗ',
    remaining: "Còn 42'",
    remainingMinutes: 42,
    cycle: "90' Marathon",
    participants: [
      { initials: 'ML', color: '#FFE8D1', textColor: '#B65310' },
      { initials: 'PQ', color: '#F1E2FF', textColor: '#7734A8' },
      { initials: 'DK', color: '#FFE3E7', textColor: '#A8324B' },
    ],
    extra: '+1',
    subtitle: 'Thiết kế Figma & Research',
  },
  {
    id: 'toeic',
    title: 'Góc luyện TOEIC 750+',
    icon: 'translate' as const,
    iconColor: '#374F8A',
    seats: '7/10 chỗ',
    remaining: "Còn 7'",
    remainingMinutes: 7,
    cycle: "25' Tiêu chuẩn",
    participants: [
      { initials: 'GH', color: '#E4E8FF', textColor: '#51449B' },
      { initials: 'TD', color: '#DDF3FF', textColor: '#237397' },
    ],
    extra: '+5',
    subtitle: 'Luyện Listening Part 3 & 4',
  },
  {
    id: 'math',
    title: 'Toán rời rạc & Giải thuật',
    icon: 'sigma' as const,
    iconColor: '#142C84',
    seats: '3/5 chỗ',
    remaining: "Còn 35'",
    remainingMinutes: 35,
    cycle: "50' Chu kỳ",
    participants: [
      { initials: 'BT', color: '#D7F8FB', textColor: '#167487' },
      { initials: 'VN', color: '#D7F8EE', textColor: '#08765A' },
      { initials: 'LK', color: '#FFF1C9', textColor: '#9B5B00' },
    ],
    extra: '',
    subtitle: 'Ôn thi giữa kỳ Đồ thị',
  },
];

export default function FocusScreen() {
  const { s, z } = useDesign(raw);
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });
  const [realtimeRooms, setRealtimeRooms] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    const fetchRooms = () => {
      pomodoroService.getRooms().then(rooms => {
        if (mounted && rooms) {
          const active = rooms.filter((r: any) => r.status !== 'COMPLETED');
          setRealtimeRooms(active);
        }
      }).catch(() => { });
    };

    fetchRooms();
    const interval = setInterval(fetchRooms, 3000);
    const tickInterval = setInterval(() => {
      if (!mounted) return;
      setRealtimeRooms((prev) =>
        prev.map((room) => {
          if (room.status === 'RUNNING' && room.remainingSeconds > 0) {
            return { ...room, remainingSeconds: room.remainingSeconds - 1 };
          }
          return room;
        })
      );
    }, 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
      clearInterval(tickInterval);
    };
  }, []);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={[s.scroll, { paddingBottom: z(120) + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.header}>
          <View style={s.brand}>
            <Image source={IMG.logo} style={s.logo} />
            <Text style={s.brandName}>Study Hub</Text>
          </View>
          <View style={s.headerRight}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Xem lời mời ghép bàn"
              style={s.bellButton}
              onPress={() => router.push('/table-invitation' as any)}
            >
              <Image source={IMG.bell} style={{ width: z(19), height: z(21) }} />
              <View style={s.bellDot} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Mở hồ sơ"
              style={s.avatarButton}
              onPress={() => router.push('/profile' as any)}
            >
              <Text style={s.avatarText}>AN</Text>
            </Pressable>
          </View>
        </View>

        <View style={s.createRoomCard}>
          <View style={s.groupIcon}>
            <Feather name="users" size={z(22)} color={C.primary} />
            <View style={s.groupPlus}><Feather name="plus" size={z(10)} color={C.primary} /></View>
          </View>
          <View style={s.createCopy}>
            <Text style={s.createTitle}>Phòng học nhóm</Text>
            <Text style={s.createSubtitle}>Mở không gian học Pom</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/create-room' as any)}
            style={s.createButton}
          >
            <Feather name="plus" size={z(15)} color={C.white} />
            <Text style={s.createButtonText}>Tạo phòng</Text>
          </Pressable>
        </View>

        <Text style={s.sectionTitle}>Phòng học trực tuyến đang mở</Text>

        {(realtimeRooms.length > 0 ? realtimeRooms.map((r: any, idx: number) => {
          const participants = (r.participants || []).slice(0, 3).map((p: any, pIdx: number) => ({
            initials: (p.fullName || 'VKU').split(' ').slice(-1)[0].substring(0, 2).toUpperCase(),
            color: pIdx === 0 ? '#DDE8FF' : pIdx === 1 ? '#FFF0CC' : '#D8F8EB',
            textColor: pIdx === 0 ? '#193782' : pIdx === 1 ? '#AD5700' : '#08785B',
          }));
          const remainingMins = Math.max(1, Math.ceil((r.remainingSeconds || 1500) / 60));
          const isBreak = r.currentMode === 'SHORT_BREAK' || r.currentMode === 'LONG_BREAK';
          const isPaused = r.status === 'PAUSED';
          const remainingText = isBreak ? `Nghỉ ${remainingMins}'` : isPaused ? `Chờ học (${remainingMins}')` : `Còn ${remainingMins}'`;

          return {
            id: r.id,
            title: r.title || r.name,
            icon: (idx % 3 === 0 ? 'terminal' : idx % 3 === 1 ? 'translate' : 'sigma') as any,
            iconColor: idx % 3 === 0 ? '#142C84' : idx % 3 === 1 ? '#374F8A' : '#142C84',
            seats: `${r.participants?.length || 1}/${r.maxParticipants || 8} chỗ`,
            remaining: remainingText,
            remainingMinutes: remainingMins,
            cycle: `${r.focusDurationMinutes || 25}' Chu kỳ`,
            participants,
            extra: (r.participants?.length || 0) > 3 ? `+${(r.participants?.length || 0) - 3}` : '',
            subtitle: r.courseName ? `Môn: ${r.courseName}` : 'Đang tập trung học tập',
            isBreak,
            isPaused,
          };
        }) : ROOMS).map((room) => {
          const isBusy = room.isBreak || room.remainingMinutes <= 10;
          return (
            <View key={room.id} style={s.roomCard}>
              <View style={s.roomMainRow}>
                <View style={s.roomIconBox}>
                  {room.icon === 'sigma' ? (
                    <Text style={[s.sigmaIcon, { color: room.iconColor }]}>Σ</Text>
                  ) : room.icon === 'translate' ? (
                    <MaterialCommunityIcons name="translate" size={z(21)} color={room.iconColor} />
                  ) : room.icon === 'figma' ? (
                    <Image source={IMG.uiuxRoomIcon} style={s.uiuxRoomIcon} resizeMode="contain" />
                  ) : (
                    <MaterialCommunityIcons name="console" size={z(23)} color={room.iconColor} />
                  )}
                </View>

                <View style={s.roomContent}>
                  <View style={s.roomTitleRow}>
                    <Text style={s.roomTitle} numberOfLines={1}>{room.title}</Text>
                    <View style={s.cycleBadge}>
                      <Text style={s.cycleText}>{room.cycle}</Text>
                    </View>
                  </View>
                  <View style={s.roomMetaRow}>
                    <Text style={s.seatCount}>{room.seats}</Text>
                    <Text style={s.metaDot}>•</Text>
                    <View style={[s.statusDot, isBusy && s.statusDotBusy]} />
                    <Text style={[s.remainingText, isBusy && s.remainingBusy]}>
                      {room.remaining}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={s.roomDivider} />

              <View style={s.roomFooter}>
                <View style={s.participantStack}>
                  {room.participants.map((participant: any, index: number) => (
                    <View
                      key={participant.initials}
                      style={[
                        s.participantAvatar,
                        { backgroundColor: participant.color, zIndex: room.participants.length - index },
                        index > 0 && s.participantOverlap,
                      ]}
                    >
                      <Text style={[s.participantInitials, { color: participant.textColor }]}>
                        {participant.initials}
                      </Text>
                    </View>
                  ))}
                  {room.extra.length > 0 && (
                    <View style={[s.participantAvatar, s.extraAvatar]}>
                      <Text style={s.extraText}>{room.extra}</Text>
                    </View>
                  )}
                </View>

                <Text style={s.roomSubtitle} numberOfLines={1}>{room.subtitle}</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Vào phòng ${room.title}`}
                  onPress={() => router.push({
                    pathname: '/pomodoro-room',
                    params: { roomId: room.id, title: room.title },
                  })}
                  style={s.joinButton}
                >
                  <Text style={s.joinButtonText}>Vào phòng</Text>
                  <Feather name="arrow-right" size={z(15)} color={C.white} />
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <StudyHubTabBar active="focus" bottom={Math.max(insets.bottom - 20, 13)} />
    </SafeAreaView>
  );
}

const cardShadow = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.045,
  shadowRadius: 9,
  shadowOffset: { width: 0, height: 3 },
  elevation: 1,
} as const;

const raw = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.white },
  scroll: { paddingHorizontal: 18, paddingTop: 15 },
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
    color: C.brand,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.line,
    ...cardShadow,
  },
  bellDot: {
    position: 'absolute',
    top: 7,
    left: 19,
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: C.white,
    backgroundColor: '#D81A24',
  },
  avatarButton: {
    width: 40,
    height: 40,
    marginLeft: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.brand,
  },
  avatarText: { fontFamily: F.bold, fontSize: 13, lineHeight: 18, color: C.white },
  createRoomCard: {
    minHeight: 66,
    marginTop: 15,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: '#E1E9F3',
    backgroundColor: C.white,
    flexDirection: 'row',
    alignItems: 'center',
    ...cardShadow,
  },
  groupIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F8FC',
  },
  groupPlus: {
    position: 'absolute',
    right: 3,
    top: 9,
    width: 13,
    height: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F8FC',
  },
  createCopy: { flex: 1, marginLeft: 11 },
  createTitle: { fontFamily: F.bold, fontSize: 14.5, lineHeight: 20, color: C.ink },
  createSubtitle: { marginTop: 1, fontFamily: F.regular, fontSize: 11.5, lineHeight: 16, color: C.body },
  createButton: {
    height: 36,
    paddingHorizontal: 13,
    borderRadius: 19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.primary,
  },
  createButtonText: { marginLeft: 4, fontFamily: F.semi, fontSize: 11.5, lineHeight: 16, color: C.white },
  sectionTitle: {
    marginTop: 21,
    marginBottom: 9,
    fontFamily: F.bold,
    fontSize: 15.5,
    lineHeight: 21,
    letterSpacing: -0.25,
    color: C.ink,
  },
  roomCard: {
    marginBottom: 11,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 11,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#F0F2F5',
    backgroundColor: C.white,
    ...cardShadow,
  },
  roomMainRow: { minHeight: 44, flexDirection: 'row', alignItems: 'center' },
  roomIconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EFF2F6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  uiuxRoomIcon: { width: 25, height: 25 },
  sigmaIcon: { fontFamily: F.bold, fontSize: 22, lineHeight: 26 },
  roomContent: { flex: 1, minWidth: 0, marginLeft: 11 },
  roomTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  roomTitle: { flex: 1, marginRight: 6, fontFamily: F.bold, fontSize: 13.5, lineHeight: 19, color: C.ink },
  cycleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 13,
    backgroundColor: '#F6F8FA',
  },
  cycleText: { fontFamily: F.medium, fontSize: 10.5, lineHeight: 14, color: '#334155' },
  roomMetaRow: { marginTop: 2, flexDirection: 'row', alignItems: 'center' },
  seatCount: { fontFamily: F.regular, fontSize: 11.5, lineHeight: 16, color: C.body },
  metaDot: { marginHorizontal: 5, fontFamily: F.bold, fontSize: 11, color: '#CBD5E1' },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.green },
  statusDotBusy: { backgroundColor: C.orange },
  remainingText: { marginLeft: 4, fontFamily: F.medium, fontSize: 11.5, lineHeight: 16, color: '#059669' },
  remainingBusy: { color: '#D97706' },
  roomDivider: { height: 1, marginTop: 11, marginBottom: 6, backgroundColor: '#F1F3F6' },
  roomFooter: { height: 34, flexDirection: 'row', alignItems: 'center' },
  participantStack: { flexDirection: 'row', alignItems: 'center', minWidth: 91 },
  participantAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: C.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  participantOverlap: { marginLeft: -8 },
  participantInitials: { fontFamily: F.bold, fontSize: 9.5, lineHeight: 12 },
  extraAvatar: { marginLeft: -8, backgroundColor: '#F1F5F9' },
  extraText: { fontFamily: F.semi, fontSize: 9, lineHeight: 12, color: '#475569' },
  roomSubtitle: { flex: 1, minWidth: 0, marginHorizontal: 7, fontFamily: F.medium, fontSize: 10.5, lineHeight: 15, color: C.body },
  joinButton: {
    height: 34,
    minWidth: 89,
    paddingHorizontal: 11,
    borderRadius: 19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.primary,
  },
  joinButtonText: { marginRight: 6, fontFamily: F.semi, fontSize: 11.5, lineHeight: 16, color: C.white },
});
