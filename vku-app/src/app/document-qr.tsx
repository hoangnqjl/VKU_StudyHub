import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
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
  border: '#E8EEF5',
  pale: '#F6F8FB',
  white: '#FFFFFF',
  orange: '#B83B09',
};

const FONT = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semi: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extra: 'Inter_800ExtraBold',
};

const DOCUMENT_LINK = 'vkuapp://document-qr?document=outline-web';

export default function DocumentQrScreen() {
  const { s, z } = useDesign(raw);
  const insets = useSafeAreaInsets();
  const [allowOffline, setAllowOffline] = useState(true);
  const [notice, setNotice] = useState('');
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded) return null;

  const copyLink = async () => {
    try {
      await Clipboard.setStringAsync(DOCUMENT_LINK);
      setNotice('Đã sao chép liên kết chia sẻ.');
    } catch {
      setNotice('Không thể sao chép liên kết trên thiết bị này.');
    }
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
            onPress={() => router.back()}
            style={s.backButton}
          >
            <Feather name="chevron-left" size={z(25)} color={COLORS.title} />
          </Pressable>
          <Text style={s.headerTitle}>Tạo mã QR tài liệu</Text>
          <View style={s.headerSpacer} />
        </View>

        <View style={s.qrCard}>
          <View style={s.documentPill}>
            <View style={s.documentIcon}>
              <Feather name="file-text" size={z(26)} color={COLORS.orange} />
            </View>
            <View style={s.documentInfo}>
              <Text style={s.documentTitle} numberOfLines={1}>
                Đề cương Ôn thi Lập trình Web - I
              </Text>
              <View style={s.documentMeta}>
                <View style={s.pdfBadge}>
                  <Text style={s.pdfText}>PDF</Text>
                </View>
                <Text style={s.fileSize}>• 12.8 MB</Text>
              </View>
            </View>
          </View>

          <View
            accessible
            accessibilityLabel="Mã QR tài liệu VKU"
            style={s.qrFrame}
          >
            <QRCode
              value={DOCUMENT_LINK}
              size={z(190)}
              color={COLORS.navy}
              backgroundColor={COLORS.white}
              ecl="H"
              quietZone={0}
            />
            <View style={s.qrLogo}>
              <Text style={s.qrLogoText}>VKU</Text>
            </View>
          </View>

          <View style={s.scannedPill}>
            <View style={s.avatarStack}>
              <Avatar initials="AN" color="#0C165F" style={s.avatarOne} />
              <Avatar initials="TH" color="#FF621D" style={s.avatarOverlap} />
              <Avatar initials="ML" color="#4F5FB6" style={s.avatarOverlap} />
            </View>
            <Text style={s.scannedText}>
              Đã có <Text style={s.scannedCount}>3 bạn</Text> quét thành công vừa xong
            </Text>
          </View>
        </View>

        <View style={s.securityCard}>
          <View style={s.sectionHeading}>
            <Feather name="sliders" size={z(19)} color={COLORS.navy} />
            <Text style={s.sectionTitle}>Cài đặt quyền truy cập &amp; bảo mật</Text>
          </View>
          <View style={s.accessRow}>
            <View style={s.downloadIcon}>
              <Feather name="download" size={z(21)} color={COLORS.title} />
            </View>
            <View style={s.accessCopy}>
              <Text style={s.accessTitle}>Tải về offline &amp; Chỉnh sửa</Text>
              <Text style={s.accessDescription}>
                Cho phép sinh viên lưu trữ bản sao cá nhân
              </Text>
            </View>
            <Pressable
              accessibilityRole="switch"
              accessibilityLabel="Cho phép tải về offline và chỉnh sửa"
              accessibilityState={{ checked: allowOffline }}
              onPress={() => setAllowOffline((value) => !value)}
              style={[s.switchTrack, allowOffline ? s.switchOn : s.switchOff]}
            >
              <View style={[s.switchThumb, allowOffline ? s.thumbOn : s.thumbOff]} />
            </Pressable>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={copyLink}
          style={s.copyButton}
        >
          <Feather name="copy" size={z(21)} color={COLORS.white} />
          <Text style={s.copyText}>Sao chép liên kết chia sẻ</Text>
        </Pressable>
        {notice.length > 0 && (
          <Text accessibilityLiveRegion="polite" style={s.notice}>{notice}</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Avatar({
  initials,
  color,
  style,
}: {
  initials: string;
  color: string;
  style: object;
}) {
  const { z } = useDesign(raw);

  return (
    <View style={[raw.avatar, style, { width: z(39), height: z(39), borderRadius: z(20), backgroundColor: color }]}>
      <Text style={[raw.avatarText, { fontSize: z(12) }]}>{initials}</Text>
    </View>
  );
}

const raw = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  scroll: { paddingHorizontal: 30, paddingTop: 16 },
  header: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  headerTitle: {
    position: 'absolute',
    left: 44,
    right: 44,
    textAlign: 'center',
    fontFamily: FONT.extra,
    fontSize: 17,
    lineHeight: 23,
    letterSpacing: -0.5,
    color: COLORS.title,
  },
  headerSpacer: { width: 40 },
  qrCard: {
    marginTop: 18,
    paddingHorizontal: 22,
    paddingTop: 23,
    paddingBottom: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 34,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    shadowColor: '#0F172A',
    shadowOpacity: 0.045,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  documentPill: {
    width: '100%',
    minHeight: 66,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 36,
    backgroundColor: COLORS.pale,
    borderWidth: 1,
    borderColor: '#F0F3F7',
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCEEE9',
  },
  documentInfo: { flex: 1, minWidth: 0, marginLeft: 11 },
  documentTitle: { fontFamily: FONT.bold, fontSize: 15, lineHeight: 20, color: COLORS.title },
  documentMeta: { marginTop: 3, flexDirection: 'row', alignItems: 'center' },
  pdfBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 5, backgroundColor: '#FFE0DF' },
  pdfText: { fontFamily: FONT.bold, fontSize: 10, lineHeight: 14, color: '#A8191D' },
  fileSize: { marginLeft: 8, fontFamily: FONT.medium, fontSize: 12, lineHeight: 17, color: COLORS.body },
  qrFrame: {
    width: 238,
    height: 238,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#EAF0F7',
    borderRadius: 23,
    backgroundColor: COLORS.white,
    shadowColor: '#0F172A',
    shadowOpacity: 0.035,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  qrLogo: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -31,
    marginTop: -31,
    width: 62,
    height: 62,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.navy,
  },
  qrLogoText: { fontFamily: FONT.extra, fontSize: 15, lineHeight: 19, color: COLORS.white },
  scannedPill: {
    width: '100%',
    minHeight: 54,
    marginTop: 18,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 30,
    backgroundColor: COLORS.pale,
    borderWidth: 1,
    borderColor: '#F0F3F7',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarStack: { flexDirection: 'row', alignItems: 'center' },
  avatar: { alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.white },
  avatarOne: { zIndex: 3 },
  avatarOverlap: { marginLeft: -9, zIndex: 2 },
  avatarText: { fontFamily: FONT.bold, color: COLORS.white },
  scannedText: { flex: 1, marginLeft: 10, fontFamily: FONT.medium, fontSize: 11.5, lineHeight: 17, color: COLORS.title },
  scannedCount: { fontFamily: FONT.bold, color: COLORS.navy },
  securityCard: {
    marginTop: 18,
    paddingHorizontal: 19,
    paddingTop: 21,
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 32,
    backgroundColor: COLORS.white,
    shadowColor: '#0F172A',
    shadowOpacity: 0.045,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  sectionHeading: { flexDirection: 'row', alignItems: 'center' },
  sectionTitle: { flex: 1, marginLeft: 9, fontFamily: FONT.bold, fontSize: 14, lineHeight: 20, color: COLORS.title },
  accessRow: { marginTop: 20, flexDirection: 'row', alignItems: 'center' },
  downloadIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.pale,
  },
  accessCopy: { flex: 1, minWidth: 0, marginLeft: 11, marginRight: 7 },
  accessTitle: { fontFamily: FONT.semi, fontSize: 13.5, lineHeight: 19, color: COLORS.title },
  accessDescription: { marginTop: 3, fontFamily: FONT.regular, fontSize: 12, lineHeight: 18, color: COLORS.body },
  switchTrack: { width: 45, height: 26, borderRadius: 14, justifyContent: 'center' },
  switchOn: { backgroundColor: COLORS.navy },
  switchOff: { backgroundColor: '#CBD2DE' },
  switchThumb: { position: 'absolute', width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.white },
  thumbOn: { right: 3 },
  thumbOff: { left: 3 },
  copyButton: {
    minHeight: 50,
    marginTop: 24,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.navy,
    shadowColor: COLORS.navy,
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  copyText: { marginLeft: 9, fontFamily: FONT.medium, fontSize: 15, lineHeight: 21, color: COLORS.white },
  notice: { marginTop: 10, textAlign: 'center', fontFamily: FONT.medium, fontSize: 12, lineHeight: 18, color: COLORS.navy },
});
