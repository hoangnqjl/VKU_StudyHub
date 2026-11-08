import { safeBack } from '../utils/navigation';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Image, Pressable, ScrollView, StyleSheet, Text, View, Modal, Switch, Linking, Platform } from 'react-native';

import { router } from 'expo-router';

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import LucideIcon, {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Check,
  Pencil,
  Radio,
  Folder,
  Download,
  Bell,
  LogOut,
  X,
  Send,
  Shield,
  ShieldOff,
} from '../components/DynamicLucideIcon';

import { authService, documentService } from '../services';

import { apiClient } from '../services/apiClient';

import { useAlert } from '../components/AlertContext';

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

  const { showConfirm, showSuccess, showInfo, showError } = useAlert();

  const [radarEnabled, setRadarEnabled] = useState(true);

  const [anonymousMode, setAnonymousMode] = useState(false);

  const [autoSaveScanned, setAutoSaveScanned] = useState(true);

  const [sessionAlarmEnabled, setSessionAlarmEnabled] = useState(true);

  const [instantInvitesEnabled, setInstantInvitesEnabled] = useState(true);

  const [distance, setDistance] = useState(100);

  const [showDistanceOptions, setShowDistanceOptions] = useState(false);

  const [notice, setNotice] = useState('');

  const [userName, setUserName] = useState('Nguyễn Quang Hoàng');

  const [studentId, setStudentId] = useState('23IT.B063');

  const [userEmail, setUserEmail] = useState('quanghoang.23itb063@vku.udn.vn');
  const [isGoogleLinked, setIsGoogleLinked] = useState(false);
  const [usedStorageMb, setUsedStorageMb] = useState<number>(0);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState(false);
  const [offlineFilesCount, setOfflineFilesCount] = useState<number>(0);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [systemNotifPermission, setSystemNotifPermission] = useState<string>('default');
  const [pomoNotif, setPomoNotif] = useState(true);
  const [inviteNotif, setInviteNotif] = useState(true);
  const [docNotif, setDocNotif] = useState(true);
  const [soundNotif, setSoundNotif] = useState(true);

  const handleOpenNotificationSettings = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'Notification' in window) {
      setSystemNotifPermission(Notification.permission);
    }
    setShowNotificationModal(true);
  };

  const handleRequestSystemPermission = async () => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        try {
          const perm = await Notification.requestPermission();
          setSystemNotifPermission(perm);
          if (perm === 'granted') {
            showSuccess('Đã cấp quyền thông báo', 'Trình duyệt đã cho phép VKU StudyHub gửi thông báo trực tiếp!');
          } else {
            showInfo('Chưa cấp quyền', 'Vui lòng bấm biểu tượng bảo mật bên cạnh thanh địa chỉ URL để Bật quyền Thông báo.');
          }
        } catch {
          showInfo('Cài đặt trình duyệt', 'Vui lòng kiểm tra quyền Thông báo trong cài đặt trình duyệt.');
        }
      } else {
        showInfo('Thông báo', 'Trình duyệt hiện tại không hỗ trợ Web Notification.');
      }
    } else {
      Linking.openSettings().catch(() => {
        showInfo('Cài đặt', 'Vui lòng mở Cài đặt thiết bị > Ứng dụng > VKU StudyHub > Bật thông báo.');
      });
    }
  };

  const handleSaveNotifPref = async (key: string, val: boolean) => {
    if (key === 'pomo') setPomoNotif(val);
    if (key === 'invite') setInviteNotif(val);
    if (key === 'doc') setDocNotif(val);
    if (key === 'sound') setSoundNotif(val);

    try {
      const prefs = { pomo: pomoNotif, invite: inviteNotif, doc: docNotif, sound: soundNotif, [key]: val };
      await AsyncStorage.setItem('@vku_notif_prefs', JSON.stringify(prefs));
    } catch {}
  };

  const handleSendTestNotification = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('VKU StudyHub 🎓', {
          body: 'Thông báo thiết bị hoạt động hoàn hảo! Bạn sẽ nhận được chuông Pomodoro & lời mời ghép bàn học.',
        });
      } catch {}
    }
    showSuccess(
      'Đã gửi thông báo thử nghiệm',
      'Hệ thống thông báo của VKU StudyHub đang hoạt động chính xác!'
    );
  };

  const handleToggleGoogleLink = () => {
    if (!isGoogleLinked) {
      showConfirm(
        'Liên kết tài khoản Google VKU',
        `Bạn có muốn liên kết tài khoản Google sinh viên VKU (${userEmail}) với hệ thống StudyHub để bật đăng nhập một chạm không?`,
        async () => {
          setIsGoogleLinked(true);
          await AsyncStorage.setItem('@vku_google_linked', 'true').catch(() => {});
          showSuccess('Liên kết thành công!', 'Tài khoản Google VKU đã được liên kết bảo mật với StudyHub.');
        },
        'Liên kết ngay',
        false
      );
    } else {
      showConfirm(
        'Hủy liên kết tài khoản',
        'Bạn có chắc chắn muốn ngắt liên kết tài khoản Google VKU khỏi ứng dụng?',
        async () => {
          setIsGoogleLinked(false);
          await AsyncStorage.removeItem('@vku_google_linked').catch(() => {});
          showSuccess('Đã hủy liên kết', 'Đã ngắt kết nối với tài khoản Google.');
        },
        'Hủy liên kết',
        true
      );
    }
  };

  useEffect(() => {

    async function loadUser() {

      try {

        const cached = await apiClient.getUser();

        if (cached) {

          if (cached.fullName) setUserName(cached.fullName);

          if (cached.studentId) setStudentId(cached.studentId);

          if (cached.email) setUserEmail(cached.email);
          if (cached.avatarUrl) setUserAvatar(cached.avatarUrl);

        }

        const fresh = await authService.getCurrentUser().catch(() => null);

        if (fresh) {

          if (fresh.fullName) setUserName(fresh.fullName);

          if (fresh.studentId) setStudentId(fresh.studentId);

          if (fresh.email) setUserEmail(fresh.email);
          if (fresh.avatarUrl) setUserAvatar(fresh.avatarUrl);

        }

      } catch {

        // Fallback

      }

    }

    loadUser();
    authService.getGoogleLinkStatus().then((status) => {
      if (typeof status?.isLinked === 'boolean') {
        setIsGoogleLinked(status.isLinked);
      }
      if (status?.googleEmail) {
        setUserEmail(status.googleEmail);
      }
    }).catch(() => {});
    AsyncStorage.getItem('@vku_user_avatar').then((a) => {
      if (a) setUserAvatar(a);
    }).catch(() => {});

    async function loadStorage() {
      try {
        const usage = await documentService.getStorageUsage().catch(() => null);
        if (usage) {
          setUsedStorageMb(usage.usedMb);
          setOfflineFilesCount(usage.documentsCount);
        } else {
          const docs = await documentService.getSavedDocuments().catch(() => []);
          if (Array.isArray(docs)) {
            setOfflineFilesCount(docs.length);
            let bytes = 0;
            for (const item of docs) {
              const size = (item as any)?.document?.fileSizeBytes || (item as any)?.fileSizeBytes || 0;
              bytes += Number(size) || 0;
            }
            setUsedStorageMb(bytes / (1024 * 1024));
          }
        }
      } catch {
        // Fallback
      }
    }
    loadStorage();
    AsyncStorage.getItem('@vku_google_linked').then((val) => {
      setIsGoogleLinked(val === 'true');
    }).catch(() => {});

  }, []);

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

            <ChevronLeft size={z(25)} color={COLORS.title} strokeWidth={2.2} />

          </Pressable>

          <Text style={s.headerTitle}>Cài đặt ứng dụng</Text>

          <View style={s.headerSpacer} />

        </View>

        <View style={s.accountCard}>

          <View style={s.accountTop}>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Chỉnh sửa ảnh đại diện"
              onPress={() => router.push('/edit-profile' as any)}
              style={s.avatarFrame}
            >
              <Image
                source={(!avatarError && userAvatar && !userAvatar.includes('avatar_usr_01_default.png')) ? { uri: userAvatar } : require('../../assets/images/avatar.png')}
                onError={() => setAvatarError(true)}
                style={[s.avatar, { borderRadius: 30 }]}
              />
              <View style={s.onlineBadge} />
            </Pressable>

            <View style={s.accountInfo}>

              <View style={s.accountNameRow}>

                <Text style={s.accountName}>{userName}</Text>

                <View style={s.verifiedBadge}>

                  <Check size={z(11)} color={COLORS.white} strokeWidth={3} />

                </View>

              </View>

              <Text style={s.accountDetail}>MSSV: {studentId} • {userEmail}</Text>

            </View>

          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isGoogleLinked ? 'Tài khoản VKU Google đã liên kết' : 'Chưa liên kết tài khoản Google VKU'}
            onPress={handleToggleGoogleLink}
            style={[s.linkedBadge, !isGoogleLinked && s.unlinkedBadge]}
          >
            {isGoogleLinked ? (
              <Shield size={z(16)} color={COLORS.navy} strokeWidth={2} />
            ) : (
              <ShieldOff size={z(16)} color="#64748B" strokeWidth={2} />
            )}
            <Text style={[s.linkedText, !isGoogleLinked && s.unlinkedText]}>
              {isGoogleLinked ? 'Tài khoản VKU Google đã liên kết' : 'Chưa liên kết tài khoản Google VKU'}
            </Text>
            <View style={[s.linkPill, isGoogleLinked ? s.linkPillLinked : s.linkPillUnlinked]}>
              <Text style={[s.linkPillText, isGoogleLinked ? s.linkPillTextLinked : s.linkPillTextUnlinked]}>
                {isGoogleLinked ? 'Đã xác thực' : 'Liên kết ngay'}
              </Text>
            </View>
          </Pressable>

          <Pressable

            accessibilityRole="button"

            onPress={() => router.push('/edit-profile' as any)}

            style={s.editButton}

          >

            <Pencil size={z(16)} color={COLORS.navy} strokeWidth={2} />

            <Text style={s.editText}>Chỉnh sửa thông tin</Text>

          </Pressable>

        </View>

        <View style={s.settingsCard}>

          <View style={s.sectionHeading}>

            <View style={[s.sectionIcon, s.radarIconBg]}>

              <Radio size={z(19)} color={COLORS.orange} strokeWidth={2} />

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

              {showDistanceOptions ? (
                <ChevronUp size={z(19)} color="#7B8493" strokeWidth={2} />
              ) : (
                <ChevronRight size={z(19)} color="#7B8493" strokeWidth={2} />
              )}

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

                    {selected && <Check size={z(14)} color={COLORS.white} strokeWidth={2.8} />}

                  </Pressable>

                );

              })}

            </View>

          )}

        </View>

        <View style={s.settingsCard}>

          <View style={s.sectionHeading}>

            <View style={[s.sectionIcon, s.documentsIconBg]}>

              <Folder size={z(18)} color={COLORS.navy} strokeWidth={2} />

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

            <Text style={s.storageAmount}>
              {usedStorageMb > 0
                ? `${usedStorageMb >= 1 ? usedStorageMb.toFixed(1) : usedStorageMb.toFixed(2)} MB / 1 GB`
                : '0.0 MB / 1 GB'}
            </Text>

          </View>

          <View

            accessibilityRole="progressbar"

            accessibilityValue={{
              min: 0,
              max: 100,
              now: Math.round(Math.min((usedStorageMb / 1024) * 100, 100)),
            }}

            style={s.progressTrack}

          >

            <View
              style={[
                s.progressFill,
                {
                  width: `${usedStorageMb > 0 ? Math.max(Math.min((usedStorageMb / 1024) * 100, 100), 2) : 0}%`,
                },
              ]}
            />

          </View>

          <Text style={s.storageFootnote}>Lưu trữ đám mây Cloudinary • Định mức 1 GB / sinh viên</Text>

          <Pressable

            accessibilityRole="button"

            onPress={() => router.push('/documents' as any)}
            style={s.offlineRow}
          >
            <View style={s.offlineIcon}>
              <Download size={z(17)} color={COLORS.navy} strokeWidth={2} />
            </View>
            <View style={s.linkCopy}>
              <Text style={s.settingTitle}>Quản lý liên kết tải về offline</Text>
              <Text style={s.settingDescription}>
                {offlineFilesCount > 0
                  ? `${offlineFilesCount} tệp trong kho tài liệu đã lưu`
                  : '0 tệp đã lưu trên thiết bị'}
              </Text>
            </View>
            <ChevronRight size={z(19)} color="#7B8493" strokeWidth={2} />
          </Pressable>

        </View>

        <View style={s.settingsCard}>

          <View style={s.sectionHeading}>

            <View style={[s.sectionIcon, s.notificationIconBg]}>

              <Bell size={z(18)} color={COLORS.navy} strokeWidth={2} />

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

            onPress={() => setNotice('Cài đặt thông báo đã được lưu.')}

            style={s.linkRow}

          >

            <View style={s.linkCopy}>

              <Text style={s.settingTitle}>Cài đặt thông báo thiết bị</Text>

              <Text style={s.settingDescription}>Quản lý quyền gửi thông báo của ứng dụng</Text>

            </View>

            <ChevronRight size={z(19)} color="#7B8493" strokeWidth={2} />

          </Pressable>

          <Pressable

            accessibilityRole="button"

            onPress={() => showInfo('Hỗ trợ VKU StudyHub', 'Bộ phận Kỹ thuật & Quản trị mạng VKU:\nEmail: studyhub-support@vku.udn.vn\nHotline: 0236.3667.113')}

            style={s.linkRow}

          >

            <View style={s.linkCopy}>

              <Text style={s.settingTitle}>Trợ giúp &amp; góp ý</Text>

              <Text style={s.settingDescription}>Liên hệ đội ngũ Study Hub</Text>

            </View>

            <ChevronRight size={z(19)} color="#7B8493" strokeWidth={2} />

          </Pressable>

        </View>

        <Pressable

          accessibilityRole="button"

          onPress={() => {

            showConfirm(

              'Đăng xuất tài khoản',

              'Bạn có chắc chắn muốn đăng xuất khỏi VKU StudyHub? Phiên làm việc của bạn trên thiết bị này sẽ kết thúc.',

              async () => {

                await authService.logout();

                router.replace('/login' as any);

              },

              'Đăng xuất',

              true

            );

          }}

          style={s.logoutButton}

        >

          <LogOut size={z(17)} color="#D14343" strokeWidth={2} />

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

    
        {/* ===== Modal Cài đặt Thông báo Thiết bị ===== */}
        <Modal
          visible={showNotificationModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowNotificationModal(false)}
        >
          <View style={s.notifModalOverlay}>
            <View style={s.notifModalCard}>
              {/* Modal Header */}
              <View style={s.notifModalHeader}>
                <View style={s.notifModalTitleRow}>
                  <View style={s.notifModalIconBox}>
                    <Bell size={z(18)} color={COLORS.navy} strokeWidth={2} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={s.notifModalTitle}>Thông báo thiết bị</Text>
                    <Text style={s.notifModalSubtitle}>Quyền &amp; tùy chọn thông báo</Text>
                  </View>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Đóng cài đặt thông báo"
                  onPress={() => setShowNotificationModal(false)}
                  style={s.notifCloseBtn}
                >
                  <X size={z(20)} color="#64748B" strokeWidth={2} />
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 380 }}>
                {/* 1. Trạng thái Quyền Hệ thống */}
                <View style={s.notifStatusBox}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.notifStatusLabel}>Quyền thông báo hệ thống</Text>
                    <Text style={s.notifStatusValue}>
                      {systemNotifPermission === 'granted'
                        ? '🟢 Đã cấp quyền (Đang hoạt động)'
                        : systemNotifPermission === 'denied'
                        ? '🔴 Đang chặn thông báo'
                        : '🟡 Chưa kích hoạt quyền'}
                    </Text>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    style={s.reqPermissionBtn}
                    onPress={handleRequestSystemPermission}
                  >
                    <Text style={s.reqPermissionBtnText}>
                      {Platform.OS === 'web' ? 'Cấp quyền' : 'Mở Settings'}
                    </Text>
                  </Pressable>
                </View>

                {/* 2. Các danh mục thông báo */}
                <Text style={s.notifGroupHeading}>DANH MỤC NHẬN THÔNG BÁO</Text>

                <View style={s.notifItemRow}>
                  <View style={s.notifItemCopy}>
                    <Text style={s.notifItemTitle}>Phiên Pomodoro &amp; Giờ giải lao</Text>
                    <Text style={s.notifItemSub}>Báo khi hoàn tất phiên tập trung và khi hết giờ nghỉ</Text>
                  </View>
                  <Switch
                    value={pomoNotif}
                    onValueChange={(val) => handleSaveNotifPref('pomo', val)}
                    trackColor={{ false: '#CBD5E1', true: COLORS.navy }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                <View style={s.notifItemRow}>
                  <View style={s.notifItemCopy}>
                    <Text style={s.notifItemTitle}>Lời mời ghép bàn học gần bạn</Text>
                    <Text style={s.notifItemSub}>Nhận lời mời học nhóm tại thư viện, phòng Lab</Text>
                  </View>
                  <Switch
                    value={inviteNotif}
                    onValueChange={(val) => handleSaveNotifPref('invite', val)}
                    trackColor={{ false: '#CBD5E1', true: COLORS.navy }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                <View style={s.notifItemRow}>
                  <View style={s.notifItemCopy}>
                    <Text style={s.notifItemTitle}>Tài liệu mới môn đang học</Text>
                    <Text style={s.notifItemSub}>Thông báo khi có bạn học tải lên đề thi, tóm tắt bài</Text>
                  </View>
                  <Switch
                    value={docNotif}
                    onValueChange={(val) => handleSaveNotifPref('doc', val)}
                    trackColor={{ false: '#CBD5E1', true: COLORS.navy }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                <View style={s.notifItemRow}>
                  <View style={s.notifItemCopy}>
                    <Text style={s.notifItemTitle}>Âm thanh &amp; Chuông báo</Text>
                    <Text style={s.notifItemSub}>Phát chuông thông báo âm thanh nổi khi có sự kiện</Text>
                  </View>
                  <Switch
                    value={soundNotif}
                    onValueChange={(val) => handleSaveNotifPref('sound', val)}
                    trackColor={{ false: '#CBD5E1', true: COLORS.navy }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                {/* 3. Nút thử nghiệm */}
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Gửi thông báo thử nghiệm"
                  onPress={handleSendTestNotification}
                  style={s.testNotifBtn}
                >
                  <Send size={z(14)} color={COLORS.navy} strokeWidth={2} />
                  <Text style={s.testNotifBtnText}>Thử gửi 1 thông báo mẫu</Text>
                </Pressable>
              </ScrollView>

              {/* Modal Footer */}
              <Pressable
                accessibilityRole="button"
                onPress={() => setShowNotificationModal(false)}
                style={s.doneNotifBtn}
              >
                <Text style={s.doneNotifBtnText}>Hoàn tất</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

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

  avatarCameraBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
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

  linkedText: { marginLeft: 7, fontFamily: FONT.bold, fontSize: 11.5, lineHeight: 17, color: COLORS.navy },
  unlinkedBadge: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    borderWidth: 1,
  },
  unlinkedText: {
    color: '#64748B',
    fontFamily: FONT.medium,
  },
  linkPill: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  linkPillUnlinked: {
    backgroundColor: COLORS.navy,
  },
  linkPillLinked: {
    backgroundColor: '#DCFCE7',
  },
  linkPillText: {
    fontSize: 10,
    fontFamily: FONT.bold,
  },
  linkPillTextUnlinked: {
    color: COLORS.white,
  },
  linkPillTextLinked: {
    color: '#15803D',
  },

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


  linkRow: {
    minHeight: 57,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({ web: { cursor: 'pointer' } }),
  },
  notifModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notifModalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    ...Platform.select({
      web: { boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
      default: { elevation: 8 },
    }),
  },
  notifModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 12,
  },
  notifModalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notifModalIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifModalTitle: {
    fontFamily: FONT.bold,
    fontSize: 16,
    lineHeight: 22,
    color: '#1E293B',
  },
  notifModalSubtitle: {
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 16,
    color: '#64748B',
  },
  notifCloseBtn: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    ...Platform.select({ web: { cursor: 'pointer' } }),
  },
  notifStatusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  notifStatusLabel: {
    fontFamily: FONT.semi,
    fontSize: 13,
    color: '#334155',
  },
  notifStatusValue: {
    fontFamily: FONT.medium,
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  reqPermissionBtn: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    ...Platform.select({ web: { cursor: 'pointer' } }),
  },
  reqPermissionBtnText: {
    fontFamily: FONT.bold,
    fontSize: 11.5,
    color: '#FFFFFF',
  },
  notifGroupHeading: {
    fontFamily: FONT.bold,
    fontSize: 11,
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  notifItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  notifItemCopy: {
    flex: 1,
    paddingRight: 12,
  },
  notifItemTitle: {
    fontFamily: FONT.semi,
    fontSize: 13,
    color: '#1E293B',
  },
  notifItemSub: {
    fontFamily: FONT.regular,
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  testNotifBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 14,
    gap: 8,
    ...Platform.select({ web: { cursor: 'pointer' } }),
  },
  testNotifBtnText: {
    fontFamily: FONT.bold,
    fontSize: 12.5,
    color: COLORS.navy,
  },
  doneNotifBtn: {
    backgroundColor: COLORS.navy,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
    ...Platform.select({ web: { cursor: 'pointer' } }),
  },
  doneNotifBtnText: {
    fontFamily: FONT.bold,
    fontSize: 14,
    color: '#FFFFFF',
  },


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

