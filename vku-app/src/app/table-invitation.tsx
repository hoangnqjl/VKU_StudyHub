import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
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
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });
  const [notice, setNotice] = useState('');

  if (!fontsLoaded) return null;

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/home' as any);
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

        <View style={s.alertCard}>
          <View style={s.alertTopRow}>
            <View style={s.alertBadge}>
              <View style={s.alertDot} />
              <Text style={s.alertBadgeText}>TÍN HIỆU STUDY RADAR</Text>
            </View>
            <View style={s.timeRow}>
              <Feather name="clock" size={z(13)} color={C.muted} />
              <Text style={s.timeText}>1 phút trước</Text>
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
                <Feather name="award" size={z(10)} color={C.white} />
              </View>
            </View>

            <View style={s.profileInfo}>
              <View style={s.nameRow}>
                <Text style={s.studentName} numberOfLines={1}>Nguyễn Văn An</Text>
                <View style={s.verifiedBadge}>
                  <View style={s.verifiedIconCircle}>
                    <Feather name="check" size={z(8)} color={C.white} />
                  </View>
                  <Text style={s.verifiedText}>Xác thực</Text>
                </View>
              </View>
              <Text style={s.studentId}>MSSV: 21GIT001</Text>
              <Text style={s.facultyText}>Khoa CNTT & Truyền thông · K21</Text>
            </View>
          </View>

          <View style={s.divider} />

          <View style={s.courseCard}>
            <View style={s.courseTopRow}>
              <Text style={s.courseLabel}>MÔN HỌC CHUNG & MỤC TIÊU</Text>
              <View style={s.examBadge}>
                <Feather name="check" size={z(12)} color="#059669" />
                <Text style={s.examText}>Trùng lịch thi</Text>
              </View>
            </View>
            <View style={s.courseRow}>
              <View style={s.codeBadge}>
                <Text style={s.codeText}>{'</>'}</Text>
              </View>
              <Text style={s.courseName}>Lập trình Web (React / Redux)</Text>
            </View>
          </View>
        </View>

        <View style={s.messageCard}>
          <View style={s.messageHeader}>
            <Feather name="message-square" size={z(17)} color="#E87900" />
            <Text style={s.messageLabel}>LỜI NHẮN TỪ AN:</Text>
          </View>
          <View style={s.quoteRow}>
            <View style={s.quoteLine} />
            <Text style={s.quoteText}>
              “Chào My, mình đang ngồi bàn A08 gần đó cũng đang ôn thi phần Redux, cho mình qua ngồi ghép bàn cùng ôn nhé!”
            </Text>
          </View>
        </View>

        <View style={s.locationCard}>
          <View style={s.locationHeader}>
            <View style={s.locationIcon}>
              <Feather name="home" size={z(16)} color="#52647E" />
            </View>
            <View style={s.locationCopy}>
              <Text style={s.locationTitle}>Tầng 3 - Nhà V (Khu tự học mở)</Text>
              <Text style={s.locationSub}>Cùng dãy Bàn học A</Text>
            </View>
            <View style={s.seatBadge}>
              <Text style={s.seatText}>Bàn A04 ▯{'\n'}A08</Text>
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
              <Text style={s.mapDistance}>~10m</Text>
            </View>
            <View style={s.personNodeRight}>
              <View style={s.anHalo}>
                <Text style={s.anText}>An</Text>
              </View>
            </View>
            <View style={s.mapCaptionRow}>
              <Text style={s.mapCaption}>Vị trí của bạn</Text>
              <Text style={s.mapCaption}>Vị trí của An</Text>
            </View>
          </View>

          <Text style={s.locationFootnote}>
            Vị trí chính xác chỉ được chia sẻ sau khi bạn đồng ý ghép bàn.
          </Text>
        </View>

        <View style={s.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setNotice('Chưa thể xác nhận vì ứng dụng chưa kết nối dịch vụ ghép bàn.')}
            style={s.acceptButton}
          >
            <Feather name="check-circle" size={z(18)} color={C.white} />
            <Text style={s.acceptText}>Đồng ý ghép bàn</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => setNotice('Chưa thể từ chối lời mời vì ứng dụng chưa kết nối dịch vụ ghép bàn.')}
            style={s.declineButton}
          >
            <Text style={s.declineText}>Để sau</Text>
          </Pressable>
        </View>
        {notice.length > 0 && <Text style={s.notice}>{notice}</Text>}
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
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.white,
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
  alertCard: {
    marginTop: 18,
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#FFE58A',
    backgroundColor: '#FFFCF3',
    ...cardShadow,
  },
  alertTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  alertBadge: {
    minHeight: 28,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFD965',
    backgroundColor: '#FFF5CC',
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.orange },
  alertBadgeText: {
    marginLeft: 7,
    fontFamily: F.bold,
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 0.3,
    color: '#8A4310',
  },
  timeRow: { flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
  timeText: { marginLeft: 4, fontFamily: F.medium, fontSize: 11, lineHeight: 15, color: C.muted },
  alertTitle: {
    marginTop: 10,
    fontFamily: F.extra,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.45,
    color: C.ink,
  },
  alertDescription: {
    marginTop: 5,
    fontFamily: F.regular,
    fontSize: 13,
    lineHeight: 19,
    color: C.body,
  },
  profileCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.white,
    ...cardShadow,
  },
  profileRow: { minHeight: 62, flexDirection: 'row', alignItems: 'center' },
  avatarWrap: { width: 58, height: 58 },
  avatar: { width: 58, height: 58, borderRadius: 29, borderWidth: 2, borderColor: '#E7EDF5' },
  avatarBadge: {
    position: 'absolute',
    right: -2,
    bottom: -1,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: C.white,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.primary,
  },
  profileInfo: { flex: 1, minWidth: 0, marginLeft: 12 },
  nameRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', rowGap: 3 },
  studentName: { flexShrink: 1, fontFamily: F.extra, fontSize: 17, lineHeight: 22, color: C.ink },
  verifiedBadge: {
    minHeight: 24,
    marginLeft: 7,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedIconCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
  },
  verifiedText: { marginLeft: 4, fontFamily: F.semi, fontSize: 11, lineHeight: 15, color: '#2563EB' },
  studentId: { marginTop: 2, fontFamily: F.bold, fontSize: 12.5, lineHeight: 18, color: '#1E3A70' },
  facultyText: { marginTop: 1, fontFamily: F.regular, fontSize: 11.5, lineHeight: 16, color: C.body },
  divider: { height: 1, marginVertical: 13, backgroundColor: '#EDF1F6' },
  courseCard: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    backgroundColor: C.soft,
  },
  courseTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  courseLabel: { flex: 1, fontFamily: F.bold, fontSize: 10.5, lineHeight: 15, color: '#71829B' },
  examBadge: {
    minHeight: 24,
    paddingHorizontal: 8,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    backgroundColor: '#ECFDF5',
    flexDirection: 'row',
    alignItems: 'center',
  },
  examText: { marginLeft: 4, fontFamily: F.semi, fontSize: 10.5, lineHeight: 14, color: '#07845F' },
  courseRow: { marginTop: 9, flexDirection: 'row', alignItems: 'center' },
  codeBadge: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#122B68',
  },
  codeText: { fontFamily: F.bold, fontSize: 13, lineHeight: 18, color: C.white },
  courseName: { flex: 1, marginLeft: 10, fontFamily: F.bold, fontSize: 13, lineHeight: 19, color: C.ink },
  messageCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#FFE58A',
    backgroundColor: '#FFFCF6',
    ...cardShadow,
  },
  messageHeader: { flexDirection: 'row', alignItems: 'center' },
  messageLabel: { marginLeft: 8, fontFamily: F.bold, fontSize: 12, lineHeight: 17, color: '#8A4310' },
  quoteRow: { marginTop: 9, flexDirection: 'row' },
  quoteLine: { width: 2, borderRadius: 1, backgroundColor: '#F6C934' },
  quoteText: {
    flex: 1,
    marginLeft: 8,
    fontFamily: F.medium,
    fontSize: 13,
    lineHeight: 22,
    fontStyle: 'italic',
    color: '#475569',
  },
  locationCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.white,
    ...cardShadow,
  },
  locationHeader: { flexDirection: 'row', alignItems: 'center' },
  locationIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  locationCopy: { flex: 1, minWidth: 0, marginLeft: 9, marginRight: 8 },
  locationTitle: { fontFamily: F.bold, fontSize: 13, lineHeight: 19, color: C.ink },
  locationSub: { marginTop: 3, fontFamily: F.regular, fontSize: 11, lineHeight: 16, color: C.body },
  seatBadge: { minWidth: 82, paddingHorizontal: 8, paddingVertical: 6, borderRadius: 13, backgroundColor: '#F1F5F9' },
  seatText: { textAlign: 'center', fontFamily: F.semi, fontSize: 10.5, lineHeight: 16, color: '#475569' },
  mapCard: {
    height: 116,
    marginTop: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5ECF4',
    backgroundColor: '#F8FAFD',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  pathLine: {
    position: 'absolute',
    top: 54,
    left: '22%',
    right: '22%',
    borderTopWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
  },
  personNode: { position: 'absolute', top: 18, left: '18%' },
  personNodeRight: { position: 'absolute', top: 18, right: '18%' },
  youHalo: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 3,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#173A83',
  },
  youText: { fontFamily: F.bold, fontSize: 12, lineHeight: 16, color: C.white },
  anHalo: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 3,
    borderColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
  },
  anText: { fontFamily: F.bold, fontSize: 12, lineHeight: 16, color: C.white },
  distancePill: {
    position: 'absolute',
    top: 44,
    left: '43%',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: C.white,
  },
  mapDistance: { fontFamily: F.semi, fontSize: 10, lineHeight: 13, color: '#475569' },
  mapCaptionRow: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mapCaption: { fontFamily: F.medium, fontSize: 9.5, lineHeight: 13, color: C.muted },
  locationFootnote: { marginTop: 9, fontFamily: F.regular, fontSize: 10.5, lineHeight: 15, color: C.muted },
  actions: { marginTop: 14, flexDirection: 'row', columnGap: 10 },
  notice: {
    marginTop: 8,
    textAlign: 'center',
    fontFamily: F.medium,
    fontSize: 11,
    lineHeight: 16,
    color: C.body,
  },
  acceptButton: {
    flex: 1,
    height: 46,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.primary,
  },
  acceptText: { marginLeft: 8, fontFamily: F.bold, fontSize: 12.5, lineHeight: 18, color: C.white },
  declineButton: {
    minWidth: 84,
    height: 46,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: C.line,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.white,
  },
  declineText: { fontFamily: F.semi, fontSize: 12, lineHeight: 17, color: C.body },
});
