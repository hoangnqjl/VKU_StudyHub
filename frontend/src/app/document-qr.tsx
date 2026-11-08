import { safeBack } from '../utils/navigation';
import { useState, useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  FileText,
  Loader2,
  CheckCircle,
  SlidersHorizontal,
  Download,
  Copy,
} from '../components/DynamicLucideIcon';
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
import { documentService, radarService } from '../services';
import { useAlert } from '../components/AlertContext';
import { useLoading } from '../components/LoadingContext';

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

export default function DocumentQrScreen() {
  const { s, z } = useDesign(raw);
  const insets = useSafeAreaInsets();
  const { showError, showSuccess } = useAlert();
  const { showLoading, hideLoading } = useLoading();
  const params = useLocalSearchParams<{ docId?: string; title?: string; size?: string }>();
  
  const [docTitle, setDocTitle] = useState(params.title || 'Đang tải tài liệu...');
  const [docSize, setDocSize] = useState(params.size || '');
  const [docFormat, setDocFormat] = useState('PDF');
  const [downloadsCount, setDownloadsCount] = useState(0);
  const [qrValue, setQrValue] = useState('');
  const [allowOffline, setAllowOffline] = useState(true);
  const [activeDocId, setActiveDocId] = useState<string>(params.docId || '');
  const [buddies, setBuddies] = useState<any[]>([]);
  const [notice, setNotice] = useState('');

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    async function loadData() {
      // 1. Tải danh sách bạn bè thật trên Radar
      radarService.getBuddies().then((b) => {
        if (Array.isArray(b)) setBuddies(b);
      }).catch(() => {});

      // 2. Tải tài liệu thật từ cơ sở dữ liệu
      let docIdToUse = params.docId || activeDocId;
      const docs = await documentService.getDocuments().catch(() => []);
      let matchedDoc: any = null;

      if (Array.isArray(docs) && docs.length > 0) {
        if (docIdToUse) {
          matchedDoc = docs.find((d: any) => d.id === docIdToUse) || docs[0];
        } else {
          matchedDoc = docs[0];
          docIdToUse = matchedDoc.id;
          setActiveDocId(matchedDoc.id);
        }
      }

      if (matchedDoc) {
        setDocTitle(matchedDoc.title);
        const bytes = (matchedDoc as any).fileSizeBytes || (matchedDoc as any).fileSize || 2000000;
        setDocSize(`${Math.round((bytes / (1024 * 1024)) * 10) / 10} MB`);
        setDocFormat((matchedDoc.fileType || 'PDF').toUpperCase());
        setDownloadsCount(matchedDoc.downloadsCount || 0);
      }

      if (docIdToUse) {
        documentService.generateQRToken(docIdToUse, allowOffline).then((res) => {
          if (res?.qrUrl) {
            setQrValue(res.qrUrl);
          } else {
            setQrValue(`vkuapp://document-qr?token=${docIdToUse}&id=${docIdToUse}`);
          }
        }).catch(() => {
          setQrValue(`vkuapp://document-qr?token=${docIdToUse}&id=${docIdToUse}`);
        });
      }
    }
    loadData();
  }, [params.docId, allowOffline]);

  if (!fontsLoaded) return null;

  const copyLink = async () => {
    try {
      showLoading('Đang tạo liên kết chia sẻ...');
      const targetId = activeDocId || params.docId;
      const tokenData = targetId ? await documentService.generateQRToken(targetId, allowOffline).catch(() => null) : null;
      hideLoading();
      const linkToCopy = tokenData?.qrUrl || qrValue || (targetId ? `vkuapp://document-qr?token=${targetId}&id=${targetId}` : '');
      if (linkToCopy) {
        await Clipboard.setStringAsync(linkToCopy);
        showSuccess(
          'Sao chép thành công',
          'Đã sao chép liên kết chia sẻ tài liệu vào bộ nhớ tạm. Bạn bè có thể quét mã hoặc mở trực tiếp trên app VKU StudyHub!'
        );
      }
    } catch {
      hideLoading();
      showError('Lỗi', 'Không thể sao chép liên kết trên thiết bị này.');
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
            onPress={() => safeBack('/documents')}
            style={s.backButton}
          >
            <ChevronLeft size={z(25)} color={COLORS.title} strokeWidth={2.2} />
          </Pressable>
          <Text style={s.headerTitle}>Tạo mã QR tài liệu</Text>
          <View style={s.headerSpacer} />
        </View>

        <View style={s.qrCard}>
          <View style={s.documentPill}>
            <View style={s.documentIcon}>
              <FileText size={z(26)} color={COLORS.orange} strokeWidth={2} />
            </View>
            <View style={s.documentInfo}>
              <Text style={s.documentTitle} numberOfLines={1}>
                {docTitle}
              </Text>
              <View style={s.documentMeta}>
                <View style={s.pdfBadge}>
                  <Text style={s.pdfText}>{docFormat}</Text>
                </View>
                {docSize.length > 0 && <Text style={s.fileSize}>• {docSize}</Text>}
              </View>
            </View>
          </View>

          <View
            accessible
            accessibilityLabel="Mã QR tài liệu VKU"
            style={s.qrFrame}
          >
            {qrValue ? (
              <QRCode
                value={qrValue}
                size={z(190)}
                color={COLORS.navy}
                backgroundColor={COLORS.white}
                ecl="H"
                quietZone={0}
              />
            ) : (
              <View style={{ width: z(190), height: z(190), alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 size={z(32)} color={COLORS.navy} strokeWidth={2} />
                <Text style={{ marginTop: 8, fontFamily: FONT.medium, fontSize: 12, color: COLORS.body }}>
                  Đang tạo mã QR...
                </Text>
              </View>
            )}
            <View style={s.qrLogo}>
              <Text style={s.qrLogoText}>VKU</Text>
            </View>
          </View>

          <View style={s.scannedPill}>
            {downloadsCount > 0 && buddies.length > 0 ? (
              <>
                <View style={s.avatarStack}>
                  {buddies.slice(0, 3).map((buddy, index) => {
                    const initials = (buddy.studentName || buddy.fullName || 'SV').split(' ').slice(-1)[0].substring(0, 2).toUpperCase();
                    const colors = ['#0C165F', '#FF621D', '#4F5FB6'];
                    return (
                      <Avatar
                        key={buddy.userId || buddy.id || index}
                        initials={initials}
                        color={colors[index % colors.length]}
                        style={index === 0 ? s.avatarOne : s.avatarOverlap}
                      />
                    );
                  })}
                </View>
                <Text style={s.scannedText}>
                  Đã có <Text style={s.scannedCount}>{downloadsCount} lượt</Text> quét và lưu về máy
                </Text>
              </>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                <CheckCircle size={z(18)} color={COLORS.navy} strokeWidth={2} />
                <Text style={s.scannedText}>
                  Mã QR sẵn sàng chia sẻ tức thì qua radar phòng học VKU
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={s.securityCard}>
          <View style={s.sectionHeading}>
            <SlidersHorizontal size={z(19)} color={COLORS.navy} strokeWidth={2} />
            <Text style={s.sectionTitle}>Cài đặt quyền truy cập &amp; bảo mật</Text>
          </View>
          <View style={s.accessRow}>
            <View style={s.downloadIcon}>
              <Download size={z(21)} color={COLORS.title} strokeWidth={2} />
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
          <Copy size={z(21)} color={COLORS.white} strokeWidth={2} />
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
  scroll: { paddingHorizontal: 18, paddingTop: 16 },
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
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  headerTitle: { fontFamily: FONT.bold, fontSize: 17, lineHeight: 24, color: COLORS.title },
  headerSpacer: { width: 40, height: 40 },
  qrCard: {
    marginTop: 18,
    paddingHorizontal: 19,
    paddingTop: 19,
    paddingBottom: 21,
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
  documentPill: {
    padding: 13,
    borderRadius: 22,
    backgroundColor: COLORS.pale,
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0D4',
  },
  documentInfo: { flex: 1, minWidth: 0, marginLeft: 12 },
  documentTitle: { fontFamily: FONT.bold, fontSize: 14, lineHeight: 20, color: COLORS.title },
  documentMeta: { marginTop: 4, flexDirection: 'row', alignItems: 'center' },
  pdfBadge: {
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 50,
    backgroundColor: '#FFE0DD',
  },
  pdfText: { fontFamily: FONT.bold, fontSize: 9.5, lineHeight: 14, color: '#C91F26' },
  fileSize: { marginLeft: 7, fontFamily: FONT.regular, fontSize: 11.5, lineHeight: 17, color: COLORS.body },
  qrFrame: {
    marginTop: 20,
    padding: 23,
    borderWidth: 1,
    borderColor: '#ECEFF4',
    borderRadius: 28,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrLogo: {
    position: 'absolute',
    width: 58,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.navy,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  qrLogoText: {
    fontFamily: FONT.bold,
    fontSize: 12,
    color: COLORS.white,
    letterSpacing: 1,
  },
  scannedPill: {
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
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
