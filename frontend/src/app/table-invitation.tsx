import { safeBack } from '../utils/navigation';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Clock,
  Award,
  Check,
  MessageSquare,
  Home,
  CheckCircle,
  Radio,
  Compass,
} from '../components/DynamicLucideIcon';
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
import { radarService, JoinRequest } from '../services';
import { useAlert } from '../components/AlertContext';
import { useLoading } from '../components/LoadingContext';

const IMG = {
  back: require('../../assets/images/ic-back.png'),
  avatar: require('../../assets/images/avatar.png'),
};

const C = {
  primary: '#101D83',
  ink: '#172033',
  body: '#64748B',
  muted: '#94A3B8',
  line: '#E4EAF2',
  soft: '#F6F9FC',
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

export default function TableInvitationScreen() {
  const { s, z } = useDesign(raw);
  const { showError, showSuccess } = useAlert();
  const { showLoading, hideLoading } = useLoading();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    invitationId?: string;
    name?: string;
    studentId?: string;
    faculty?: string;
    subject?: string;
    message?: string;
    location?: string;
  }>();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  const [activeInvitation, setActiveInvitation] = useState<{
    id: string;
    name: string;
    studentId: string;
    faculty: string;
    subject: string;
    message: string;
    location: string;
    distance?: string;
  } | null>(null);

  const [loadingInvitations, setLoadingInvitations] = useState(true);

  useEffect(() => {
    async function fetchInvitations() {
      try {
        setLoadingInvitations(true);
        // 1. Kiểm tra nếu có params điều hướng trực tiếp
        if (params.name || params.invitationId) {
          setActiveInvitation({
            id: params.invitationId || 'inv_param',
            name: params.name || 'Sinh viên VKU',
            studentId: params.studentId || 'K23 VKU',
            faculty: params.faculty || 'Khoa Công nghệ Thông tin',
            subject: params.subject || 'Lập trình Web',
            message: params.message || 'Chào bạn, mình đang học môn này gần bạn, cho mình ghép bàn cùng ôn nhé!',
            location: params.location || 'Khu tự học Thư viện',
            distance: '~10m',
          });
          setLoadingInvitations(false);
          return;
        }

        // 2. Gọi API Backend lấy danh sách lời mời ghép bàn thật
        const requests = await radarService.getJoinRequests().catch(() => []);
        if (Array.isArray(requests) && requests.length > 0) {
          const pending = requests.find((r: JoinRequest) => r.status === 'PENDING') || requests[0];
          setActiveInvitation({
            id: pending.id,
            name: pending.senderName || 'Bạn học VKU',
            studentId: pending.senderStudentId ? `MSSV: ${pending.senderStudentId}` : 'Sinh viên VKU',
            faculty: 'Khoa Công nghệ Thông tin',
            subject: 'Học phần chung',
            message: pending.message || 'Chào bạn, cho mình cùng ngồi ghép bàn ôn tập nhé!',
            location: pending.senderSeatNote || 'Khu tự học Thư viện',
            distance: '~15m',
          });
        } else {
          setActiveInvitation(null);
        }
      } catch {
        setActiveInvitation(null);
      } finally {
        setLoadingInvitations(false);
      }
    }

    fetchInvitations();
  }, [params.invitationId, params.name, params.studentId, params.subject, params.message, params.location]);

  if (!fontsLoaded) return null;

  const goBack = () => {
    safeBack('/home');
  };

  const handleRespond = async (status: 'ACCEPTED' | 'REJECTED') => {
    if (!activeInvitation) return;
    try {
      showLoading(status === 'ACCEPTED' ? 'Đang xác nhận ghép bàn...' : 'Đang gửi phản hồi...');
      await radarService.respondJoinRequest(activeInvitation.id, status).catch(() => {});
      hideLoading();

      if (status === 'ACCEPTED') {
        showSuccess(
          'Ghép bàn thành công!',
          `Bạn và ${activeInvitation.name} đã được kết nối cùng bàn học. Chúc các bạn có buổi học hiệu quả!`,
          () => router.replace('/radar' as any)
        );
      } else {
        showSuccess('Đã từ chối', 'Đã lưu trạng thái để sau.', () => router.replace('/radar' as any));
      }
    } catch (err: any) {
      hideLoading();
      showError('Thông báo', err.message || 'Không thể phản hồi lúc này.');
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={[s.scroll, { paddingBottom: z(120) + insets.bottom }]}
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

        {activeInvitation ? (
          <>
            <View style={s.alertCard}>
              <View style={s.alertTopRow}>
                <View style={s.alertBadge}>
                  <View style={s.alertDot} />
                  <Text style={s.alertBadgeText}>TÍN HIỆU STUDY RADAR</Text>
                </View>
                <View style={s.timeRow}>
                  <Clock size={z(13)} color={C.muted} strokeWidth={2} />
                  <Text style={s.timeText}>Vừa xong</Text>
                </View>
              </View>
              <Text style={s.alertTitle}>Lời mời ghép bàn học mới!</Text>
              <Text style={s.alertDescription}>
                Một bạn học cùng môn đang ở ngay gần phòng bạn và muốn học chung để cùng ôn tập hiệu quả.
              </Text>
            </View>

            <View style={s.profileCard}>
              <View style={s.profileRow}>
                <View style={s.avatarWrap}>
                  <Image source={IMG.avatar} style={s.avatar} />
                  <View style={s.avatarBadge}>
                    <Award size={z(10)} color={C.white} strokeWidth={2.5} />
                  </View>
                </View>

                <View style={s.profileInfo}>
                  <View style={s.nameRow}>
                    <Text style={s.studentName} numberOfLines={1}>{activeInvitation.name}</Text>
                    <View style={s.verifiedBadge}>
                      <View style={s.verifiedIconCircle}>
                        <Check size={z(8)} color={C.white} strokeWidth={3} />
                      </View>
                      <Text style={s.verifiedText}>Xác thực</Text>
                    </View>
                  </View>
                  <Text style={s.studentId}>{activeInvitation.studentId}</Text>
                  <Text style={s.facultyText}>{activeInvitation.faculty}</Text>
                </View>
              </View>

              <View style={s.divider} />

              <View style={s.courseCard}>
                <View style={s.courseTopRow}>
                  <Text style={s.courseLabel}>MÔN HỌC CHUNG & MỤC TIÊU</Text>
                  <View style={s.examBadge}>
                    <Check size={z(12)} color="#059669" strokeWidth={3} />
                    <Text style={s.examText}>Trùng lịch thi</Text>
                  </View>
                </View>
                <View style={s.courseRow}>
                  <View style={s.codeBadge}>
                    <Text style={s.codeText}>{'</>'}</Text>
                  </View>
                  <Text style={s.courseName}>{activeInvitation.subject}</Text>
                </View>
              </View>
            </View>

            <View style={s.messageCard}>
              <View style={s.messageHeader}>
                <MessageSquare size={z(17)} color="#E87900" strokeWidth={2} />
                <Text style={s.messageLabel}>LỜI NHẮN TỪ BẠN HỌC:</Text>
              </View>
              <View style={s.quoteRow}>
                <View style={s.quoteLine} />
                <Text style={s.quoteText}>
                  “{activeInvitation.message}”
                </Text>
              </View>
            </View>

            <View style={s.locationCard}>
              <View style={s.locationHeader}>
                <View style={s.locationIcon}>
                  <Home size={z(16)} color="#52647E" strokeWidth={2} />
                </View>
                <View style={s.locationCopy}>
                  <Text style={s.locationTitle}>{activeInvitation.location}</Text>
                  <Text style={s.locationSub}>Khu tự học sinh viên VKU</Text>
                </View>
                <View style={s.seatBadge}>
                  <Text style={s.seatText}>Bàn mở</Text>
                </View>
              </View>

              <View style={s.mapCard}>
                <View style={s.pathLine} />
                <View style={s.personNode}>
                  <View style={s.youHalo}>
                    <Text style={s.youText}>Bạn</Text>
                  </View>
                </View>
                <View style={s.distancePill}>
                  <Text style={s.mapDistance}>{activeInvitation.distance || '~10m'}</Text>
                </View>
                <View style={s.personNodeRight}>
                  <View style={s.anHalo}>
                    <Text style={s.anText}>Bạn</Text>
                  </View>
                </View>
                <View style={s.mapCaptionRow}>
                  <Text style={s.mapCaption}>Vị trí của bạn</Text>
                  <Text style={s.mapCaption}>Vị trí bạn học</Text>
                </View>
              </View>

              <Text style={s.locationFootnote}>
                Vị trí chính xác chỉ được chia sẻ sau khi bạn đồng ý ghép bàn.
              </Text>
            </View>

            <View style={s.actions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => handleRespond('ACCEPTED')}
                style={s.acceptButton}
              >
                <CheckCircle size={z(18)} color={C.white} strokeWidth={2} />
                <Text style={s.acceptText}>Đồng ý ghép bàn</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => handleRespond('REJECTED')}
                style={s.declineButton}
              >
                <Text style={s.declineText}>Để sau</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <View style={s.emptyWrap}>
            <View style={s.emptyIconCircle}>
              <Radio size={z(36)} color={C.primary} strokeWidth={2} />
            </View>
            <Text style={s.emptyTitle}>Chưa có lời mời ghép bàn nào</Text>
            <Text style={s.emptySub}>
              Hiện tại chưa có bạn học nào gửi lời mời ghép bàn quanh khu vực của bạn. Hãy bật Radar để quét tìm bạn học cùng môn đang online gần đây nhé!
            </Text>
            <Pressable
              onPress={() => router.push('/radar' as any)}
              style={s.findBuddyBtn}
            >
              <Compass size={z(18)} color={C.white} strokeWidth={2} />
              <Text style={s.findBuddyText}>Mở Study Radar tìm bạn</Text>
            </Pressable>
            <Pressable
              onPress={() => router.replace('/home' as any)}
              style={s.homeBtn}
            >
              <Text style={s.homeBtnText}>Quay về Trang chủ</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      <StudyHubTabBar active="home" bottom={Math.max(insets.bottom - 20, 13)} />
    </SafeAreaView>
  );
}

const cardShadow = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.06,
  shadowRadius: 9,
  shadowOffset: { width: 0, height: 3 },
  elevation: 2,
} as const;

const raw = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.white },
  scroll: { paddingHorizontal: 18, paddingTop: 16 },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.white,
    ...cardShadow,
  },
  headerTitle: {
    fontFamily: F.bold,
    fontSize: 16,
    color: C.ink,
  },
  headerSpacer: { width: 38 },
  alertCard: {
    marginTop: 18,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FED7AA',
    backgroundColor: '#FFF7ED',
  },
  alertTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: '#FFEDD5',
  },
  alertDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EA580C',
    marginRight: 6,
  },
  alertBadgeText: {
    fontFamily: F.bold,
    fontSize: 9.5,
    color: '#C2410C',
    letterSpacing: 0.4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontFamily: F.regular,
    fontSize: 11,
    color: C.muted,
  },
  alertTitle: {
    marginTop: 10,
    fontFamily: F.bold,
    fontSize: 16,
    color: '#9A3412',
  },
  alertDescription: {
    marginTop: 4,
    fontFamily: F.regular,
    fontSize: 12.5,
    lineHeight: 18,
    color: '#7C2D12',
  },
  profileCard: {
    marginTop: 14,
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.white,
    ...cardShadow,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    overflow: 'hidden',
    position: 'relative',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: C.white,
  },
  profileInfo: {
    marginLeft: 14,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  studentName: {
    fontFamily: F.bold,
    fontSize: 15,
    color: C.ink,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    gap: 4,
  },
  verifiedIconCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    fontFamily: F.bold,
    fontSize: 9.5,
    color: '#2563EB',
  },
  studentId: {
    marginTop: 2,
    fontFamily: F.medium,
    fontSize: 12,
    color: C.body,
  },
  facultyText: {
    marginTop: 2,
    fontFamily: F.regular,
    fontSize: 11.5,
    color: C.muted,
  },
  divider: {
    height: 1,
    backgroundColor: C.line,
    marginVertical: 14,
  },
  courseCard: {
    borderRadius: 14,
    backgroundColor: C.soft,
    padding: 12,
  },
  courseTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  courseLabel: {
    fontFamily: F.bold,
    fontSize: 10,
    color: C.muted,
    letterSpacing: 0.5,
  },
  examBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  examText: {
    fontFamily: F.semi,
    fontSize: 11,
    color: '#059669',
  },
  courseRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  codeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: C.primary,
  },
  codeText: {
    fontFamily: F.bold,
    fontSize: 11,
    color: C.white,
  },
  courseName: {
    fontFamily: F.bold,
    fontSize: 13,
    color: C.ink,
  },
  messageCard: {
    marginTop: 14,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FED7AA',
    backgroundColor: '#FFFBEB',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  messageLabel: {
    fontFamily: F.bold,
    fontSize: 10.5,
    color: '#D97706',
    letterSpacing: 0.4,
  },
  quoteRow: {
    marginTop: 8,
    flexDirection: 'row',
  },
  quoteLine: {
    width: 3,
    borderRadius: 2,
    backgroundColor: '#F59E0B',
    marginRight: 10,
  },
  quoteText: {
    flex: 1,
    fontFamily: F.medium,
    fontSize: 12.5,
    lineHeight: 18,
    color: '#78350F',
    fontStyle: 'italic',
  },
  locationCard: {
    marginTop: 14,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.white,
    ...cardShadow,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  locationCopy: {
    flex: 1,
  },
  locationTitle: {
    fontFamily: F.bold,
    fontSize: 13,
    color: C.ink,
  },
  locationSub: {
    fontFamily: F.regular,
    fontSize: 11,
    color: C.muted,
  },
  seatBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  seatText: {
    fontFamily: F.semi,
    fontSize: 11,
    color: C.body,
    textAlign: 'center',
  },
  mapCard: {
    marginTop: 14,
    height: 70,
    borderRadius: 14,
    backgroundColor: C.soft,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    position: 'relative',
  },
  pathLine: {
    position: 'absolute',
    left: 45,
    right: 45,
    height: 2,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  personNode: {
    alignItems: 'center',
  },
  youHalo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  youText: {
    fontFamily: F.bold,
    fontSize: 11,
    color: C.white,
  },
  distancePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.line,
  },
  mapDistance: {
    fontFamily: F.bold,
    fontSize: 10.5,
    color: C.body,
  },
  personNodeRight: {
    alignItems: 'center',
  },
  anHalo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  anText: {
    fontFamily: F.bold,
    fontSize: 11,
    color: C.white,
  },
  mapCaptionRow: {
    position: 'absolute',
    bottom: 6,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mapCaption: {
    fontFamily: F.regular,
    fontSize: 9,
    color: C.muted,
  },
  locationFootnote: {
    marginTop: 10,
    fontFamily: F.regular,
    fontSize: 10.5,
    color: C.muted,
    textAlign: 'center',
  },
  actions: {
    marginTop: 18,
    gap: 10,
  },
  acceptButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: C.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: C.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  acceptText: {
    fontFamily: F.bold,
    fontSize: 14,
    color: C.white,
  },
  declineButton: {
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineText: {
    fontFamily: F.semi,
    fontSize: 13,
    color: C.body,
  },
  emptyWrap: {
    marginTop: 40,
    paddingVertical: 40,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: F.bold,
    fontSize: 17,
    color: C.ink,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySub: {
    fontFamily: F.regular,
    fontSize: 13,
    lineHeight: 20,
    color: C.body,
    textAlign: 'center',
    marginBottom: 24,
  },
  findBuddyBtn: {
    height: 46,
    paddingHorizontal: 24,
    borderRadius: 23,
    backgroundColor: C.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  findBuddyText: {
    fontFamily: F.bold,
    fontSize: 13.5,
    color: C.white,
  },
  homeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  homeBtnText: {
    fontFamily: F.semi,
    fontSize: 13,
    color: C.muted,
  },
});
