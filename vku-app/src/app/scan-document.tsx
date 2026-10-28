import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
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
  green: '#10B981',
  red: '#C91F26',
  purple: '#ECEBFF',
};

const FONT = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semi: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extra: 'Inter_800ExtraBold',
};

const SCANNER_MODULES = [
  [82, 20, 8, 8], [94, 20, 8, 8], [106, 20, 8, 8],
  [42, 74, 8, 8], [54, 74, 8, 8], [66, 74, 8, 8], [78, 74, 8, 8],
  [104, 74, 8, 8], [116, 74, 8, 8], [128, 74, 8, 8], [140, 74, 8, 8],
  [82, 114, 8, 8], [98, 114, 16, 8], [122, 114, 8, 8],
  [82, 132, 16, 8], [108, 132, 8, 8], [126, 132, 16, 8],
].map(([left, top, width, height]) => ({ left, top, width, height }));

export default function ScanDocumentScreen() {
  const { s, z } = useDesign(raw);
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [flashOn, setFlashOn] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [notice, setNotice] = useState('');
  const permissionRequested = useRef(false);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    if (!permission?.granted && permission?.canAskAgain && !permissionRequested.current) {
      permissionRequested.current = true;
      void requestPermission();
    }
  }, [permission, requestPermission]);

  if (!fontsLoaded) return null;

  const closeScanner = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/home');
  };

  const showUnavailableNotice = (feature: string) => {
    setNotice(`${feature} sẽ khả dụng khi dịch vụ Kho tài liệu được kết nối.`);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={[
          s.scroll,
          { paddingBottom: z(18) + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Đóng trình quét"
            onPress={closeScanner}
            style={s.headerButton}
          >
            <Feather name="x" size={z(25)} color={COLORS.title} />
          </Pressable>
          <Text style={s.headerTitle}>Quét mã nhận tài liệu</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={flashOn ? 'Tắt đèn flash' : 'Bật đèn flash'}
            accessibilityState={{ checked: flashOn }}
            onPress={() => setFlashOn((value) => !value)}
            style={s.headerButton}
          >
            <Feather name="zap" size={z(22)} color={flashOn ? '#F59E0B' : COLORS.title} />
          </Pressable>
        </View>

        <View style={s.scanFrame}>
          {permission?.granted && Platform.OS !== 'web' ? (
            <CameraView
              style={s.camera}
              facing="back"
              enableTorch={flashOn}
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              onBarcodeScanned={hasScanned ? undefined : () => {
                setHasScanned(true);
                setNotice('Đã nhận diện mã QR thành công.');
              }}
            />
          ) : (
            <ScannerIllustration size={z(182)} />
          )}
          <View pointerEvents="none" style={s.scanOverlay}>
            <View style={[s.corner, s.cornerTopLeft]} />
            <View style={[s.corner, s.cornerTopRight]} />
            <View style={[s.corner, s.cornerBottomLeft]} />
            <View style={[s.corner, s.cornerBottomRight]} />
            <View style={s.scanLine} />
            <View style={s.scanLogo}>
              <Text style={s.scanLogoText}>VKU</Text>
            </View>
          </View>
        </View>

        {Platform.OS !== 'web' && permission && !permission.granted && permission.canAskAgain && (
          <Pressable
            accessibilityRole="button"
            onPress={() => void requestPermission()}
            style={s.permissionButton}
          >
            <Feather name="camera" size={z(17)} color={COLORS.navy} />
            <Text style={s.permissionText}>Cho phép sử dụng camera</Text>
          </Pressable>
        )}

        <View style={s.instruction}>
          <Text style={s.instructionText}>
            Hướng camera về phía mã QR trên máy bạn học để nhận tài liệu
          </Text>
        </View>

        <View style={s.resultCard}>
          <View style={s.recognizedHeading}>
            <View style={s.greenDot} />
            <Text style={s.recognizedTitle}>Đã nhận diện mã tài liệu</Text>
          </View>

          <View style={s.documentCard}>
            <View style={s.pdfIcon}>
              <Feather name="file-text" size={z(25)} color={COLORS.red} />
              <Text style={s.pdfLabel}>PDF</Text>
            </View>
            <View style={s.documentInfo}>
              <Text style={s.documentTitle}>
                Tổng hợp Bài tập lớn Web &amp; Mini-Project 2024.pdf
              </Text>
              <View style={s.metadataRow}>
                <Text style={s.fileSize}>18.6 MB</Text>
                <View style={s.metadataDot} />
                <Text style={s.subject}>Công nghệ thông tin</Text>
              </View>

              <View style={s.ownerPill}>
                <View style={s.ownerAvatar}>
                  <Text style={s.ownerInitials}>NA</Text>
                </View>
                <View style={s.ownerInfo}>
                  <Text style={s.ownerName}>Nguyễn Quang Hoàng</Text>
                  <Text style={s.ownerMeta}>Mã SV: 23IT.B063 · Lớp 23SE5</Text>
                </View>
              </View>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => showUnavailableNotice('Lưu tài liệu')}
            style={s.saveButton}
          >
            <Feather name="download-cloud" size={z(20)} color={COLORS.white} />
            <Text style={s.saveButtonText}>Lưu vào Kho tài liệu cá nhân</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => showUnavailableNotice('Xem tài liệu trực tiếp')}
            style={s.previewButton}
          >
            <Feather name="eye" size={z(20)} color={COLORS.navy} />
            <Text style={s.previewButtonText}>Mở xem trực tiếp ngay</Text>
          </Pressable>
        </View>
        {notice.length > 0 && (
          <Text accessibilityLiveRegion="polite" style={s.notice}>{notice}</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ScannerIllustration({ size }: { size: number }) {
  const scale = size / 182;
  const scaled = (value: number) => value * scale;
  const finderSize = scaled(37);

  return (
    <View
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        marginLeft: -size / 2,
        marginTop: -size / 2,
        width: size,
        height: size,
      }}
    >
      <View style={[raw.mockFinder, { left: scaled(23), top: scaled(20), width: finderSize, height: finderSize }]}>
        <View style={[raw.mockFinderCore, { width: scaled(16), height: scaled(16) }]} />
      </View>
      <View style={[raw.mockFinder, { right: scaled(23), top: scaled(20), width: finderSize, height: finderSize }]}>
        <View style={[raw.mockFinderCore, { width: scaled(16), height: scaled(16) }]} />
      </View>
      <View style={[raw.mockFinder, { left: scaled(23), bottom: scaled(20), width: finderSize, height: finderSize }]}>
        <View style={[raw.mockFinderCore, { width: scaled(16), height: scaled(16) }]} />
      </View>
      {SCANNER_MODULES.map((module, index) => (
        <View
          key={index}
          style={[
            raw.mockModule,
            {
              left: scaled(module.left),
              top: scaled(module.top),
              width: scaled(module.width),
              height: scaled(module.height),
            },
            index === 7 && raw.mockModuleAccent,
          ]}
        />
      ))}
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
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 11,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
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
  scanFrame: {
    width: 238,
    height: 238,
    alignSelf: 'center',
    marginTop: 25,
    borderWidth: 1,
    borderColor: '#E7EAF2',
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    ...cardShadow,
  },
  camera: { ...StyleSheet.absoluteFill },
  mockFinder: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: COLORS.navy,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  mockFinderCore: { borderRadius: 1, backgroundColor: COLORS.navy },
  mockModule: { position: 'absolute', backgroundColor: COLORS.navy },
  mockModuleAccent: { backgroundColor: '#F15B2A' },
  scanOverlay: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  corner: { position: 'absolute', width: 22, height: 22, borderColor: COLORS.navy },
  cornerTopLeft: { left: 11, top: 11, borderTopWidth: 2, borderLeftWidth: 2, borderTopLeftRadius: 6 },
  cornerTopRight: { right: 11, top: 11, borderTopWidth: 2, borderRightWidth: 2, borderTopRightRadius: 6 },
  cornerBottomLeft: { left: 11, bottom: 11, borderBottomWidth: 2, borderLeftWidth: 2, borderBottomLeftRadius: 6 },
  cornerBottomRight: { right: 11, bottom: 11, borderBottomWidth: 2, borderRightWidth: 2, borderBottomRightRadius: 6 },
  scanLine: {
    position: 'absolute',
    left: 1,
    right: 1,
    top: '50%',
    height: 2,
    backgroundColor: '#B8B8D8',
    opacity: 0.9,
  },
  scanLogo: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -18,
    marginTop: -18,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.purple,
  },
  scanLogoText: { fontFamily: FONT.extra, fontSize: 11, lineHeight: 15, color: COLORS.navy },
  permissionButton: {
    alignSelf: 'center',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  permissionText: { marginLeft: 7, fontFamily: FONT.semi, fontSize: 11, lineHeight: 16, color: COLORS.navy },
  instruction: {
    minHeight: 50,
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.pale,
  },
  instructionText: {
    textAlign: 'center',
    fontFamily: FONT.medium,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.body,
  },
  resultCard: {
    marginTop: 19,
    paddingHorizontal: 15,
    paddingTop: 16,
    paddingBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 27,
    backgroundColor: COLORS.white,
    ...cardShadow,
  },
  recognizedHeading: { minHeight: 21, flexDirection: 'row', alignItems: 'center' },
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.green },
  recognizedTitle: { marginLeft: 5, fontFamily: FONT.bold, fontSize: 13, lineHeight: 19, color: COLORS.title },
  documentCard: {
    marginTop: 13,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E9ECF3',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.white,
  },
  pdfIcon: {
    width: 45,
    minHeight: 52,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE0DD',
  },
  pdfLabel: { marginTop: 2, fontFamily: FONT.bold, fontSize: 9, lineHeight: 13, color: COLORS.red },
  documentInfo: { flex: 1, minWidth: 0, marginLeft: 14 },
  documentTitle: { fontFamily: FONT.bold, fontSize: 14, lineHeight: 20, color: COLORS.title },
  metadataRow: { marginTop: 4, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  fileSize: { fontFamily: FONT.medium, fontSize: 10.5, lineHeight: 16, color: COLORS.body },
  metadataDot: { width: 4, height: 4, marginHorizontal: 7, borderRadius: 2, backgroundColor: '#C5C9D4' },
  subject: { fontFamily: FONT.semi, fontSize: 10.5, lineHeight: 16, color: COLORS.navy },
  ownerPill: {
    minHeight: 54,
    marginTop: 12,
    marginLeft: -59,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.pale,
  },
  ownerAvatar: { width: 27, height: 27, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.purple },
  ownerInitials: { fontFamily: FONT.bold, fontSize: 10, lineHeight: 14, color: COLORS.navy },
  ownerInfo: { flex: 1, minWidth: 0, marginLeft: 8 },
  ownerName: { fontFamily: FONT.bold, fontSize: 12, lineHeight: 17, color: COLORS.title },
  ownerMeta: { marginTop: 1, fontFamily: FONT.regular, fontSize: 10.5, lineHeight: 16, color: COLORS.body },
  saveButton: {
    minHeight: 46,
    marginTop: 21,
    borderRadius: 25,
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
  saveButtonText: { marginLeft: 8, fontFamily: FONT.bold, fontSize: 13, lineHeight: 18, color: COLORS.white },
  previewButton: {
    minHeight: 45,
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.pale,
  },
  previewButtonText: { marginLeft: 8, fontFamily: FONT.semi, fontSize: 13, lineHeight: 18, color: COLORS.navy },
  notice: { marginTop: 10, textAlign: 'center', fontFamily: FONT.medium, fontSize: 11, lineHeight: 16, color: COLORS.navy },
});
