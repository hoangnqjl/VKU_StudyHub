import { safeBack } from '../utils/navigation';
import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
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
import { radarService } from '../services';
import { useAlert } from '../components/AlertContext';
import { useLoading } from '../components/LoadingContext';

const IMG = {
  avatar: require('../../assets/images/avatar.png'),
  back: require('../../assets/images/ic-back.png'),
};

const C = {
  primary: '#101D83',
  ink: '#182235',
  body: '#64748B',
  muted: '#94A3B8',
  line: '#E8EDF5',
  soft: '#F3F6FA',
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

const GREETING = 'Chào bạn, mình cũng đang làm bài tập lớn môn Lập trình Web, cho mình ghép bàn cùng ôn React nhé!';
const OPENERS = [
  { id: 'nearby', label: 'Mình ngồi gần bạn nè! 👋', message: GREETING },
  { id: 'seat', label: 'Cho mình ké 1 chỗ với! 🪑', message: 'Chào bạn, cho mình ké một chỗ để học cùng nhé!' },
];

type RequestParams = {
  name?: string;
  faculty?: string;
  subject?: string;
  location?: string;
  status?: string;
  goal?: string;
  facultyDetail?: string;
  locationDetail?: string;
  subjectDetail?: string;
};

export default function JoinTableScreen() {
  const { s, z } = useDesign(raw);
  const params = useLocalSearchParams<RequestParams>();
  const { showError, showSuccess } = useAlert();
  const { showLoading, hideLoading } = useLoading();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });
  const [selectedOpener, setSelectedOpener] = useState('nearby');
  const [message, setMessage] = useState(GREETING);
  const [anonymous, setAnonymous] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState('');

  if (!fontsLoaded) return null;

  const name = params.name ?? 'Bạn học VKU';
  const faculty = params.facultyDetail ?? params.faculty ?? 'Khoa Công nghệ Thông tin & TT';
  const subject = params.subjectDetail ?? params.subject ?? 'Môn học tự chọn / Ôn tập';
  const location = params.locationDetail ?? params.location ?? 'Khu tự học Thư viện VKU';
  const distance = params.status ?? 'Gần bạn';
  const goal = params.goal ?? 'Ôn thi & Làm bài tập';

  const goBack = () => {
    safeBack('/radar');
  };

  const chooseOpener = (opener: (typeof OPENERS)[number]) => {
    setSelectedOpener(opener.id);
    setMessage(opener.message);
    setNotice('');
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={s.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
            onPress={goBack}
            style={s.backButton}
          >
            <Image source={IMG.back} style={{ width: z(10), height: z(14) }} />
          </Pressable>
          <Text style={s.headerTitle}>Ghép bàn học tập</Text>
          <View style={s.headerSpacer} />
        </View>

        <View style={s.statusRow}>
          <View style={s.onlineBadge}>
            <View style={s.onlineDot} />
            <Text style={s.onlineText}>Radar Trực Tuyến</Text>
          </View>
          <Text style={s.distanceText}>· {distance}</Text>
          <BookmarkButton
            accessibilityLabel={saved ? 'Bỏ lưu bạn học' : 'Lưu bạn học'}
            onPress={() => setSaved((value) => !value)}
            selected={saved}
            size={z(52)}
          />
        </View>

        <View style={s.studentCard}>
          <View style={s.profileRow}>
            <View style={s.avatarWrap}>
              <Image source={IMG.avatar} style={s.avatar} />
              <View style={s.studentOnlineDot} />
            </View>
            <View style={s.profileInfo}>
              <View style={s.nameRow}>
                <Text style={s.studentName} numberOfLines={1}>{name}</Text>
                <View style={s.verifiedBadge}><Text style={s.verifiedCheck}>✓</Text></View>
              </View>
              <Text style={s.facultyText} numberOfLines={1}>{faculty}</Text>
              <View style={s.ratingRow}>
                <Text style={s.star}>★</Text>
                <Text style={s.rating}>4.9</Text>
                <Text style={s.ratingDivider}>·</Text>
                <Text style={s.sessions}>18 buổi ghép bàn tích cực</Text>
              </View>
            </View>
          </View>

          <View style={s.divider} />

          <View style={s.detailRow}>
            <View style={s.pinIcon}>
              <View style={s.pinHole} />
            </View>
            <View style={s.detailText}>
              <Text style={s.locationTitle}>{location}</Text>
              <Text style={s.locationSub}>Khu vực yên tĩnh gần cửa sổ sân bóng</Text>
            </View>
          </View>

          <View style={[s.detailRow, s.subjectRow]}>
            <Svg width={z(17)} height={z(17)} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 7.1C9.55 4.9 6.05 4.2 2.5 4.7v14.6c3.65-.5 7.15.2 9.5 2.2V7.1Zm0 0c2.45-2.2 5.95-2.9 9.5-2.4v14.6c-3.65-.5-7.15.2-9.5 2.2V7.1Z"
                stroke="#E87900"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M6 8.3c1.7 0 3.2.35 4.4 1M6 11.5c1.7 0 3.2.35 4.4 1m7.6-4.2c-1.7 0-3.2.35-4.4 1m4.4 2.2c-1.7 0-3.2.35-4.4 1"
                stroke="#E87900"
                strokeWidth={1.5}
                strokeLinecap="round"
              />
            </Svg>
            <Text style={s.subjectDetail}>{goal} {subject}</Text>
          </View>
        </View>

        <View style={s.messageCard}>
          <Text style={s.messageTitle}>Chuẩn bị lời xin ghép bàn</Text>
          <Text style={s.messageSubtitle}>
            Chọn câu mở đầu nhanh hoặc soạn lời nhắn riêng của bạn.
          </Text>

          <View style={s.openers}>
            {OPENERS.map((opener) => {
              const selected = selectedOpener === opener.id;
              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  key={opener.id}
                  onPress={() => chooseOpener(opener)}
                  style={[s.openerChip, selected ? s.openerChipOn : s.openerChipOff]}
                >
                  <Text style={[s.openerText, selected && s.openerTextOn]}>
                    {opener.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={s.messageLabelRow}>
            <Text style={s.messageLabel}>Nội dung tin nhắn</Text>
            <Text style={s.characterCount}>{message.length}/120</Text>
          </View>
          <TextInput
            accessibilityLabel="Nội dung tin nhắn"
            multiline
            maxLength={120}
            textAlignVertical="top"
            value={message}
            onChangeText={(value) => {
              setMessage(value);
              setSelectedOpener('');
              setNotice('');
            }}
            style={s.messageInput}
          />

          <View style={s.divider} />
          <Pressable
            accessibilityRole="switch"
            accessibilityLabel="Gửi bằng biệt danh"
            accessibilityState={{ checked: anonymous }}
            onPress={() => setAnonymous((value) => !value)}
            style={s.anonymousRow}
          >
            <View style={s.anonymousCopy}>
              <Text style={s.anonymousTitle}>Gửi bằng biệt danh</Text>
              <Text style={s.anonymousSubtitle}>
                Ẩn tên thật & MSSV cho đến khi được đồng ý
              </Text>
            </View>
            <View style={[s.switchTrack, anonymous && s.switchTrackOn]}>
              <View style={[s.switchThumb, anonymous && s.switchThumbOn]} />
            </View>
          </Pressable>
        </View>

        {notice.length > 0 && <Text style={s.notice}>{notice}</Text>}

        <Pressable
          accessibilityRole="button"
          onPress={async () => {
            if (!message.trim()) {
              showError('Thiếu nội dung', 'Vui lòng nhập nội dung lời nhắn gửi bạn học.');
              return;
            }
            try {
              showLoading('Đang gửi lời xin ghép bàn học...');
              const targetId = (params as any).buddyId || (params as any).userId || 'usr_02';
              await radarService.sendJoinRequest(targetId, message.trim());
              hideLoading();
              showSuccess(
                'Đã gửi lời mời',
                `Lời mời ghép bàn đã gửi tới ${name}. Hệ thống sẽ thông báo ngay khi bạn ấy phản hồi!`,
                () => router.replace('/radar' as any)
              );
            } catch (err: any) {
              hideLoading();
              showError('Lỗi gửi lời mời', err.message || 'Không thể gửi lời xin ghép bàn lúc này.');
            }
          }}
          style={s.sendButton}
        >
          <Text style={s.sendIcon}>▣</Text>
          <Text style={s.sendText}>Gửi lời xin ghép bàn học</Text>
          <Text style={s.sendArrow}>→</Text>
        </Pressable>

        <View style={s.safetyActions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setNotice('Đã gửi phản hồi vị trí thành công.')}
          >
            <Text style={s.safetyText}>⚑ Báo cáo vị trí không chính xác</Text>
          </Pressable>
          <Text style={s.safetyDivider}>·</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => setNotice('Đã cập nhật danh sách bạn học.')}
          >
            <Text style={s.safetyText}>⊘ Chặn bạn này</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const cardShadow = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.06,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
} as const;

const raw = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.white },
  scroll: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 18 },
  header: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
  headerTitle: {
    position: 'absolute',
    left: 48,
    right: 48,
    textAlign: 'center',
    fontFamily: F.extra,
    fontSize: 17,
    lineHeight: 23,
    letterSpacing: -0.5,
    color: C.ink,
  },
  headerSpacer: { width: 40, height: 40 },
  statusRow: {
    minHeight: 36,
    marginTop: 16,
    paddingLeft: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineBadge: {
    height: 28,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B9F2DD',
    backgroundColor: '#ECFDF5',
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.green },
  onlineText: {
    marginLeft: 6,
    fontFamily: F.semi,
    fontSize: 12.5,
    lineHeight: 17,
    color: '#07845F',
  },
  distanceText: {
    flex: 1,
    marginLeft: 8,
    fontFamily: F.medium,
    fontSize: 12.5,
    lineHeight: 18,
    color: C.muted,
  },
  studentCard: {
    marginTop: 14,
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.white,
    ...cardShadow,
  },
  profileRow: { minHeight: 66, flexDirection: 'row', alignItems: 'center' },
  avatarWrap: { width: 58, height: 58 },
  avatar: { width: 58, height: 58, borderRadius: 29, borderWidth: 2, borderColor: '#E6EDF8' },
  studentOnlineDot: {
    position: 'absolute',
    right: -1,
    bottom: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: C.white,
    backgroundColor: C.green,
  },
  profileInfo: { flex: 1, minWidth: 0, marginLeft: 12 },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  studentName: { flexShrink: 1, fontFamily: F.extra, fontSize: 16, lineHeight: 21, color: C.ink },
  verifiedBadge: {
    width: 14,
    height: 14,
    marginLeft: 6,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.orange,
  },
  verifiedCheck: { color: C.white, fontFamily: F.bold, fontSize: 10, lineHeight: 12 },
  facultyText: { marginTop: 2, fontFamily: F.medium, fontSize: 12, lineHeight: 17, color: C.body },
  ratingRow: { marginTop: 3, flexDirection: 'row', alignItems: 'center' },
  star: { fontSize: 13, lineHeight: 17, color: C.orange },
  rating: { marginLeft: 4, fontFamily: F.bold, fontSize: 12.5, lineHeight: 17, color: '#D97706' },
  ratingDivider: { marginHorizontal: 8, fontFamily: F.medium, fontSize: 12, color: C.muted },
  sessions: { flexShrink: 1, fontFamily: F.regular, fontSize: 11.5, lineHeight: 16, color: C.body },
  divider: { height: 1, marginVertical: 14, backgroundColor: C.line },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start' },
  pinIcon: {
    width: 13,
    height: 16,
    marginTop: 2,
    borderWidth: 1.8,
    borderColor: C.primary,
    borderRadius: 8,
    borderBottomLeftRadius: 2,
    transform: [{ rotate: '0deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinHole: { width: 4, height: 4, borderRadius: 2, backgroundColor: C.primary },
  detailText: { flex: 1, marginLeft: 10 },
  locationTitle: { fontFamily: F.semi, fontSize: 13, lineHeight: 19, color: C.ink },
  locationSub: { marginTop: 2, fontFamily: F.regular, fontSize: 11.5, lineHeight: 17, color: '#9AAAC0' },
  subjectRow: { marginTop: 15 },
  subjectDetail: { flex: 1, marginLeft: 9, fontFamily: F.regular, fontSize: 12.5, lineHeight: 20, color: '#334155' },
  messageCard: {
    marginTop: 16,
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.white,
    ...cardShadow,
  },
  messageTitle: { fontFamily: F.extra, fontSize: 15, lineHeight: 21, letterSpacing: -0.35, color: C.ink },
  messageSubtitle: { marginTop: 3, fontFamily: F.regular, fontSize: 12, lineHeight: 18, color: C.body },
  openers: { marginTop: 16, alignItems: 'flex-start', rowGap: 7 },
  openerChip: { minHeight: 30, paddingHorizontal: 12, borderRadius: 16, justifyContent: 'center' },
  openerChipOn: { backgroundColor: C.primary },
  openerChipOff: { backgroundColor: C.soft },
  openerText: { fontFamily: F.medium, fontSize: 12, lineHeight: 17, color: '#475569' },
  openerTextOn: { color: C.white },
  messageLabelRow: { marginTop: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  messageLabel: { fontFamily: F.semi, fontSize: 12, lineHeight: 17, color: '#334155' },
  characterCount: { fontFamily: F.medium, fontSize: 11.5, lineHeight: 16, color: C.muted },
  messageInput: {
    minHeight: 100,
    marginTop: 7,
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: '#F9FBFD',
    fontFamily: F.regular,
    fontSize: 13.5,
    lineHeight: 22,
    color: '#293548',
  },
  anonymousRow: { minHeight: 42, flexDirection: 'row', alignItems: 'center' },
  anonymousCopy: { flex: 1, paddingRight: 8 },
  anonymousTitle: { fontFamily: F.medium, fontSize: 12, lineHeight: 17, color: '#334155' },
  anonymousSubtitle: { marginTop: 1, fontFamily: F.regular, fontSize: 10.5, lineHeight: 15, color: '#9AAAC0' },
  switchTrack: {
    width: 44,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    backgroundColor: '#E2E8F0',
  },
  switchTrackOn: { backgroundColor: C.primary },
  switchThumb: {
    position: 'absolute',
    left: 2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  switchThumbOn: { left: 20, borderColor: C.white },
  notice: { marginTop: 10, textAlign: 'center', fontFamily: F.medium, fontSize: 11.5, lineHeight: 17, color: '#07845F' },
  sendButton: {
    minHeight: 50,
    marginTop: 16,
    borderRadius: 27,
    backgroundColor: C.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
  sendIcon: { marginRight: 9, fontFamily: F.bold, fontSize: 16, lineHeight: 20, color: C.white },
  sendText: { fontFamily: F.bold, fontSize: 13.5, lineHeight: 19, color: C.white },
  sendArrow: { marginLeft: 9, fontFamily: F.medium, fontSize: 20, lineHeight: 22, color: C.white },
  safetyActions: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  safetyText: { fontFamily: F.medium, fontSize: 10.5, lineHeight: 15, color: '#9AAAC0' },
  safetyDivider: { marginHorizontal: 10, fontFamily: F.bold, fontSize: 12, color: '#CBD5E1' },
});
