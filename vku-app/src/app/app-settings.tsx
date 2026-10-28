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

import { useDesign } from '../components/design-scale';

const COLORS = {
  navy: '#101D83',
  title: '#17243A',
  body: '#858996',
  border: '#E1E9F3',
  pale: '#F6F8FB',
  white: '#FFFFFF',
  orange: '#F15B2A',
  green: '#10B981',
};

const FONT = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semi: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extra: 'Inter_800ExtraBold',
};

const DISTANCES = [50, 100, 250, 500];

export default function AppSettingsScreen() {
  const { s, z } = useDesign(raw);
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });
  const [radarEnabled, setRadarEnabled] = useState(true);
  const [anonymousMode, setAnonymousMode] = useState(false);
  const [autoSaveScanned, setAutoSaveScanned] = useState(true);
  const [sessionAlarmEnabled, setSessionAlarmEnabled] = useState(true);
  const [instantInvitesEnabled, setInstantInvitesEnabled] = useState(true);
  const [distance, setDistance] = useState(100);
  const [showDistanceOptions, setShowDistanceOptions] = useState(false);
  const [notice, setNotice] = useState('');

  if (!fontsLoaded) return null;

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/profile' as any);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={[
          s.scroll,
          { paddingBottom: z(24) + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
            onPress={goBack}
            style={s.backButton}
          >
            <Feather name="chevron-left" size={z(25)} color={COLORS.title} />
          </Pressable>
          <Text style={s.headerTitle}>Cài đặt ứng dụng</Text>
          <View style={s.headerSpacer} />
        </View>

        <View style={s.accountCard}>
          <View style={s.accountTop}>
            <View style={s.avatarFrame}>
              <Image source={require('../../assets/images/avatar.png')} style={s.avatar} />
              <View style={s.onlineBadge} />
            </View>
            <View style={s.accountInfo}>
              <View style={s.accountNameRow}>
                <Text style={s.accountName}>Nguyễn Văn An</Text>
                <View style={s.verifiedBadge}>
                  <Feather name="check" size={z(11)} color={COLORS.white} />
                </View>
              </View>
              <Text style={s.accountDetail}>MSSV: 21GIT001 • an.nv@vku.udn.vn</Text>
            </View>
          </View>

          <View style={s.linkedBadge}>
            <Feather name="shield" size={z(16)} color={COLORS.navy} />
            <Text style={s.linkedText}>Tài khoản VKU Google đã liên kết</Text>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/edit-profile' as any)}
            style={s.editButton}
          >
            <Feather name="edit-3" size={z(18)} color={COLORS.navy} />
            <Text style={s.editText}>Chỉnh sửa thông tin</Text>
          </Pressable>
        </View>

        <View style={s.settingsCard}>
          <View style={s.sectionHeading}>
            <View style={[s.sectionIcon, s.radarIconBg]}>
              <Feather name="radio" size={z(19)} color={COLORS.orange} />
            </View>
            <Text style={s.sectionTitle}>Study Radar &amp; Ghép bàn</Text>
          </View>

          <SettingSwitch
            title="Tự động phát tín hiệu Radar"
            description="Kích hoạt sóng khi vào khu tự học Thư viện"
            value={radarEnabled}
            onValueChange={setRadarEnabled}
            s={s}
            z={z}
          />
          <SettingSwitch
            title="Chế độ ẩn danh khi tìm bạn"
            description="Chỉ hiện biệt danh & môn học, ẩn tên thật/MSSV"
            value={anonymousMode}
            onValueChange={setAnonymousMode}
            s={s}
            z={z}
          />

          <View style={s.distanceBlock}>
            <View style={s.distanceCopy}>
              <Text style={s.settingTitle}>Khoảng cách quét bạn học</Text>
              <Text style={s.settingDescription}>
                Mặc định: Bán kính {distance}m trong khuôn viên VKU
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Chọn khoảng cách quét bạn học"
              accessibilityState={{ expanded: showDistanceOptions }}
              onPress={() => setShowDistanceOptions((value) => !value)}
              style={s.chevronButton}
            >
              <Feather
                name={showDistanceOptions ? 'chevron-up' : 'chevron-right'}
                size={z(19)}
                color="#7B8493"
              />
            </Pressable>
          </View>
          {showDistanceOptions && (
            <View style={s.distanceOptions}>
              {DISTANCES.map((meters) => {
                const selected = distance === meters;
                return (
                  <Pressable
                    key={meters}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                    onPress={() => {
                      setDistance(meters);
                      setShowDistanceOptions(false);
                    }}
                    style={[s.distanceOption, selected && s.distanceOptionSelected]}
                  >
                    <Text style={[s.distanceOptionText, selected && s.distanceOptionTextSelected]}>
                      {meters}m
                    </Text>
                    {selected && <Feather name="check" size={z(14)} color={COLORS.white} />}
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        <View style={s.settingsCard}>
          <View style={s.sectionHeading}>
            <View style={[s.sectionIcon, s.documentsIconBg]}>
              <Feather name="folder" size={z(18)} color={COLORS.navy} />
            </View>
            <Text style={s.sectionTitle}>Kho tài liệu &amp; Mã QR</Text>
          </View>

          <SettingSwitch
            title="Tự động lưu tài liệu quét được"
            description="Đồng bộ trực tiếp vào Kho học tập cá nhân"
            value={autoSaveScanned}
            onValueChange={setAutoSaveScanned}
            s={s}
            z={z}
          />

          <View style={s.storageHeading}>
            <Text style={s.settingTitle}>Dung lượng lưu trữ tài liệu</Text>
            <Text style={s.storageAmount}>128 MB / 1 GB</Text>
          </View>
          <View
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: 100, now: 13 }}
            style={s.progressTrack}
          >
            <View style={s.progressFill} />
          </View>
          <Text style={s.storageFootnote}>Được bảo vệ bởi máy chủ lưu trữ VKU Cloud</Text>

          <Pressable
            accessibilityRole="button"
            onPress={() => setNotice('Quản lý tải về offline sẽ khả dụng khi tính năng lưu trữ trên thiết bị được kết nối.')}
            style={s.offlineRow}
          >
            <View style={s.offlineIcon}>
              <Feather name="download" size={z(17)} color={COLORS.navy} />
            </View>
            <View style={s.linkCopy}>
              <Text style={s.settingTitle}>Quản lý liên kết tải về offline</Text>
              <Text style={s.settingDescription}>0 tệp đã lưu trên thiết bị</Text>
            </View>
            <Feather name="chevron-right" size={z(19)} color="#7B8493" />
          </Pressable>
        </View>

        <View style={s.settingsCard}>
          <View style={s.sectionHeading}>
            <View style={[s.sectionIcon, s.notificationIconBg]}>
              <Feather name="bell" size={z(18)} color={COLORS.navy} />
            </View>
            <Text style={s.sectionTitle}>Thông báo &amp; Pomodoro</Text>
          </View>
          <SettingSwitch
            title="Chuông báo kết thúc phiên"
            description="Phát âm báo khi phiên Pomodoro hoàn tất"
            value={sessionAlarmEnabled}
            onValueChange={setSessionAlarmEnabled}
            s={s}
            z={z}
          />
          <SettingSwitch
            title="Lời mời ghép bàn tức thì"
            description="Nhận thông báo ngay khi có lời mời mới"
            value={instantInvitesEnabled}
            onValueChange={setInstantInvitesEnabled}
            s={s}
            z={z}
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => setNotice('Thông báo đẩy sẽ khả dụng khi dịch vụ thông báo được kết nối.')}
            style={s.linkRow}
          >
            <View style={s.linkCopy}>
              <Text style={s.settingTitle}>Cài đặt thông báo thiết bị</Text>
              <Text style={s.settingDescription}>Quản lý quyền gửi thông báo của ứng dụng</Text>
            </View>
            <Feather name="chevron-right" size={z(19)} color="#7B8493" />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => setNotice('Trợ giúp sẽ khả dụng khi dịch vụ hỗ trợ được kết nối.')}
            style={s.linkRow}
          >
            <View style={s.linkCopy}>
              <Text style={s.settingTitle}>Trợ giúp &amp; góp ý</Text>
              <Text style={s.settingDescription}>Liên hệ đội ngũ Study Hub</Text>
            </View>
            <Feather name="chevron-right" size={z(19)} color="#7B8493" />
          </Pressable>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => setNotice('Đăng xuất sẽ khả dụng khi dịch vụ xác thực tài khoản được kết nối.')}
          style={s.logoutButton}
        >
          <Feather name="log-out" size={z(17)} color="#D14343" />
          <Text style={s.logoutText}>Đăng xuất tài khoản</Text>
        </Pressable>

        {notice.length > 0 && (
          <Text accessibilityLiveRegion="polite" style={s.notice}>{notice}</Text>
        )}
        <View style={s.footer}>
          <Text style={s.versionText}>VKU StudyHub v1.2.0</Text>
          <Text style={s.copyrightText}>© 2024 VKU - Trường Đại học Công nghệ Thông tin và Truyền thông Việt - Hàn</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingSwitch({
  title,
  description,
  value,
  onValueChange,
  s,
  z,
}: {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  s: Record<string, any>;
  z: (value: number) => number;
}) {
  return (
    <View style={s.settingRow}>
      <View style={s.settingCopy}>
        <Text style={s.settingTitle}>{title}</Text>
        <Text style={s.settingDescription}>{description}</Text>
      </View>
      <Pressable
        accessibilityRole="switch"
        accessibilityLabel={title}
        accessibilityState={{ checked: value }}
        onPress={() => onValueChange(!value)}
        style={[s.switchTrack, value ? s.switchOn : s.switchOff]}
      >
        <View style={[s.switchThumb, value ? s.switchThumbOn : s.switchThumbOff]} />
      </Pressable>
    </View>
  );
}

const cardShadow = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.045,
  shadowRadius: 9,
  shadowOffset: { width: 0, height: 3 },
  elevation: 2,
} as const;

const raw = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  scroll: { paddingHorizontal: 30, paddingTop: 16 },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    ...cardShadow,
  },
  headerTitle: {
    position: 'absolute',
    left: 44,
    right: 44,
    textAlign: 'center',
    fontFamily: FONT.extra,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.45,
    color: COLORS.title,
  },
  headerSpacer: { width: 38 },
  accountCard: {
    marginTop: 18,
    paddingHorizontal: 19,
    paddingTop: 20,
    paddingBottom: 19,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 34,
    backgroundColor: COLORS.white,
    ...cardShadow,
  },
  accountTop: { flexDirection: 'row', alignItems: 'center' },
  avatarFrame: {
    width: 57,
    height: 57,
    padding: 2,
    borderRadius: 30,
    backgroundColor: COLORS.white,
  },
  avatar: { width: '100%', height: '100%', borderRadius: 28 },
  onlineBadge: {
    position: 'absolute',
    right: -1,
    bottom: 1,
    width: 15,
    height: 15,
    borderWidth: 2,
    borderColor: COLORS.white,
    borderRadius: 8,
    backgroundColor: COLORS.green,
  },
  accountInfo: { flex: 1, minWidth: 0, marginLeft: 12 },
  accountNameRow: { flexDirection: 'row', alignItems: 'center' },
  accountName: { fontFamily: FONT.bold, fontSize: 16, lineHeight: 23, color: COLORS.title },
  verifiedBadge: {
    width: 16,
    height: 16,
    marginLeft: 6,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.orange,
  },
  accountDetail: { marginTop: 1, fontFamily: FONT.regular, fontSize: 11, lineHeight: 17, color: COLORS.body },
  linkedBadge: {
    alignSelf: 'flex-start',
    minHeight: 30,
    marginTop: 15,
    paddingHorizontal: 12,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.pale,
  },
  linkedText: { marginLeft: 7, fontFamily: FONT.bold, fontSize: 12, lineHeight: 17, color: COLORS.navy },
  editButton: {
    minHeight: 42,
    marginTop: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.pale,
  },
  editText: { marginLeft: 8, fontFamily: FONT.bold, fontSize: 14, lineHeight: 20, color: COLORS.navy },
  settingsCard: {
    marginTop: 16,
    paddingHorizontal: 19,
    paddingTop: 18,
    paddingBottom: 19,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 34,
    backgroundColor: COLORS.white,
    ...cardShadow,
  },
  sectionHeading: { minHeight: 34, flexDirection: 'row', alignItems: 'center' },
  sectionIcon: { width: 31, height: 31, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  radarIconBg: { backgroundColor: '#FFE5DC' },
  documentsIconBg: { backgroundColor: '#E8E8FF' },
  notificationIconBg: { backgroundColor: '#EDF3FA' },
  sectionTitle: { marginLeft: 10, fontFamily: FONT.bold, fontSize: 15, lineHeight: 21, color: COLORS.title },
  settingRow: {
    minHeight: 74,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingCopy: { flex: 1, minWidth: 0, marginRight: 12 },
  settingTitle: { fontFamily: FONT.medium, fontSize: 14, lineHeight: 20, color: COLORS.title },
  settingDescription: { marginTop: 2, fontFamily: FONT.regular, fontSize: 11.5, lineHeight: 17, color: COLORS.body },
  switchTrack: { width: 45, height: 27, borderRadius: 15, justifyContent: 'center' },
  switchOn: { backgroundColor: COLORS.navy },
  switchOff: { backgroundColor: '#E8E8F7' },
  switchThumb: { position: 'absolute', width: 21, height: 21, borderRadius: 11, backgroundColor: COLORS.white },
  switchThumbOn: { right: 3 },
  switchThumbOff: { left: 3 },
  distanceBlock: {
    minHeight: 67,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceCopy: { flex: 1, minWidth: 0, marginRight: 10 },
  chevronButton: {
    width: 38,
    height: 38,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.pale,
  },
  distanceOptions: { marginTop: 3, flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  distanceOption: {
    minWidth: 61,
    minHeight: 30,
    paddingHorizontal: 9,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.pale,
  },
  distanceOptionSelected: { borderColor: COLORS.navy, backgroundColor: COLORS.navy },
  distanceOptionText: { fontFamily: FONT.semi, fontSize: 11, lineHeight: 15, color: COLORS.title },
  distanceOptionTextSelected: { marginRight: 5, color: COLORS.white },
  storageHeading: { marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  storageAmount: { marginLeft: 8, fontFamily: FONT.bold, fontSize: 11, lineHeight: 16, color: '#B83B09' },
  progressTrack: { height: 8, marginTop: 11, borderRadius: 5, backgroundColor: '#E8E7F7' },
  progressFill: { width: '13%', height: '100%', borderRadius: 5, backgroundColor: COLORS.orange },
  storageFootnote: { marginTop: 8, fontFamily: FONT.regular, fontSize: 11.5, lineHeight: 17, color: COLORS.body },
  linkRow: { minHeight: 57, flexDirection: 'row', alignItems: 'center' },
  offlineRow: {
    minHeight: 68,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  offlineIcon: {
    width: 34,
    height: 34,
    marginRight: 10,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EDF3FA',
  },
  linkCopy: { flex: 1, minWidth: 0, marginRight: 10 },
  logoutButton: {
    minHeight: 49,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#F3D8D8',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF8F8',
  },
  logoutText: { marginLeft: 8, fontFamily: FONT.bold, fontSize: 14, lineHeight: 20, color: '#D14343' },
  notice: { marginTop: 10, textAlign: 'center', fontFamily: FONT.medium, fontSize: 12, lineHeight: 18, color: COLORS.navy },
  footer: { alignItems: 'center', marginTop: 22, paddingHorizontal: 8 },
  versionText: { fontFamily: FONT.semi, fontSize: 11, lineHeight: 16, color: COLORS.body },
  copyrightText: {
    marginTop: 4,
    textAlign: 'center',
    fontFamily: FONT.regular,
    fontSize: 9,
    lineHeight: 14,
    color: COLORS.body,
  },
});
