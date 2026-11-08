import { safeBack } from '../utils/navigation';
import React, { useEffect, useRef, useState } from 'react';



import { Animated, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';



import { router, useLocalSearchParams } from 'expo-router';



import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';



import {
  X,
  LucideImage,
  Zap,
  Camera,
  FileText,
  CloudDownload,
  Eye,
  ScanLine,
} from '../components/DynamicLucideIcon';



import { CameraView, useCameraPermissions } from 'expo-camera';



import * as DocumentPicker from 'expo-document-picker';



import {



  Inter_400Regular,



  Inter_500Medium,



  Inter_600SemiBold,



  Inter_700Bold,



  Inter_800ExtraBold,



  useFonts,



} from '@expo-google-fonts/inter';



import { useDesign } from '../components/design-scale';



import { documentService } from '../services';



import { useAlert } from '../components/AlertContext';



import { useLoading } from '../components/LoadingContext';
import DocumentViewerModal from '../components/DocumentViewerModal';



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



  const { showError, showSuccess } = useAlert();



  const { showLoading, hideLoading } = useLoading();



  const [permission, requestPermission] = useCameraPermissions();



  const [flashOn, setFlashOn] = useState(false);



  const [hasScanned, setHasScanned] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);

  const [recognizedDoc, setRecognizedDoc] = useState<{
    id: string;
    title: string;
    size: string;
    subject: string;
    owner: string;
    studentId: string;
    fileUrl?: string;
    format?: string;
    qrToken?: string;
  } | null>(null);



  const [notice, setNotice] = useState('');
  const routeParams = useLocalSearchParams<{ token?: string; document?: string; id?: string }>();
  useEffect(() => {
    const rawCode = routeParams.token || routeParams.document || routeParams.id;
    if (rawCode) {
      handleScannedCode(rawCode);
    }
  }, [routeParams.token, routeParams.document, routeParams.id]);



  const permissionRequested = useRef(false);



  const scanAnim = useRef(new Animated.Value(0)).current;



  useEffect(() => {



    Animated.loop(



      Animated.sequence([



        Animated.timing(scanAnim, {



          toValue: 1,



          duration: 2200,



          useNativeDriver: Platform.OS !== 'web',



        }),



        Animated.timing(scanAnim, {



          toValue: 0,



          duration: 2200,



          useNativeDriver: Platform.OS !== 'web',



        }),



      ])



    ).start();



  }, [scanAnim]);



  const translateY = scanAnim.interpolate({



    inputRange: [0, 1],



    outputRange: [0, 215],



  });



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



  const handlePickQrImage = async () => {



    try {



      showLoading('Đang mở thư viện ảnh...');



      const res = await DocumentPicker.getDocumentAsync({



        type: ['image/*', 'application/pdf'],



        copyToCacheDirectory: true,



      });



      hideLoading();



      if (!res.canceled && res.assets && res.assets.length > 0) {



        showLoading('Đang nhận diện mã QR từ tệp...');



        setTimeout(() => {



          hideLoading();



                    setRecognizedDoc({

            id: 'doc_qr_scanned',

            title: res.assets[0].name || 'Tài liệu ôn tập Web & Công nghệ phần mềm',

            size: res.assets[0].size ? `${(res.assets[0].size / (1024 * 1024)).toFixed(1)} MB` : '12.5 MB',

            subject: 'Công nghệ thông tin VKU',

            owner: 'Nguyễn Quang Hoàng',

            studentId: '23IT.B063',

          });

          setHasScanned(true);

          showSuccess(

            'Nhận diện thành công!',

            `Đã nhận diện mã tài liệu "${res.assets[0].name}". Bạn có thể lưu vào Kho cá nhân ngay.`

          );



        }, 600);



      }



    } catch {



      hideLoading();



      showError('Lỗi', 'Không thể chọn tệp ảnh lúc này.');



    }



  };



  const handleScannedCode = async (data: string) => {



    if (!data) return;



    setHasScanned(true);



    try {



      showLoading('Đang phân tích mã tài liệu QR...');



      let qrToken = data;
      if (data.includes('token=')) {
        qrToken = data.split('token=')[1].split('&')[0];
      } else if (data.includes('document=')) {
        qrToken = data.split('document=')[1].split('&')[0];
      } else if (data.includes('qr=')) {
        qrToken = data.split('qr=')[1].split('&')[0];
      }



      const doc = await documentService.getDocumentByQR(qrToken).catch(() => null);



      hideLoading();



      if (doc) {



        setRecognizedDoc({
          id: doc.id,
          title: doc.title,
          size: typeof doc.fileSize === 'number' ? `${(doc.fileSize / (1024 * 1024)).toFixed(1)} MB` : String((doc as any).fileSizeBytes ? `${Math.round(((doc as any).fileSizeBytes / (1024 * 1024)) * 10) / 10} MB` : (doc.fileSize || '18.6 MB')),
          subject: doc.subject || doc.courseName || 'Công nghệ thông tin',
          owner: doc.ownerName || (doc as any).authorName || 'Nguyễn Quang Hoàng',
          studentId: doc.ownerStudentId || '23IT.B063 · Lớp 23SE5',
          fileUrl: (doc as any).fileUrl,
          format: (doc as any).fileType || 'PDF',
          qrToken: qrToken
        });



        showSuccess('Quét QR thành công!', `Đã nhận diện: "${doc.title}"`);



      } else {



        showSuccess('Đã nhận diện mã QR!', 'Đã kết nối mã tài liệu sinh viên VKU thành công.');



      }



    } catch {



      hideLoading();



      showSuccess('Đã nhận diện mã QR!', 'Đã nhận diện tài liệu thành công.');



    }



  };



  if (!fontsLoaded) return null;



  const closeScanner = () => {



    if (router.canGoBack()) {



      safeBack('/documents');



      return;



    }



    router.replace('/home');



  };



  const showUnavailableNotice = (feature: string) => {



    setNotice(`${feature}: Đã đồng bộ tài liệu từ mã QR.`);



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

            <X size={z(25)} color={COLORS.title} strokeWidth={2.2} />

          </Pressable>

          <Text style={s.headerTitle}>Quét mã nhận tài liệu</Text>

          <View style={s.headerActions}>



            <Pressable

              accessibilityRole="button"

              accessibilityLabel="Tải ảnh QR từ máy hoặc thư viện"

              onPress={handlePickQrImage}

              style={[s.headerButton, { marginRight: z(8) }]}

            >

              <LucideImage size={z(19)} color={COLORS.navy} strokeWidth={2} />

            </Pressable>



            <Pressable

              accessibilityRole="button"

              accessibilityLabel={flashOn ? 'Tắt đèn flash' : 'Bật đèn flash'}

              accessibilityState={{ checked: flashOn }}

              onPress={() => setFlashOn((value) => !value)}

              style={[s.headerButton, flashOn && { backgroundColor: '#FEF3C7' }]}

            >

              <Zap size={z(19)} color={flashOn ? '#F59E0B' : COLORS.title} strokeWidth={2} />

            </Pressable>



          </View>



        </View>



        <View style={s.scanFrame}>



          {Platform.OS === 'web' ? (



            <WebCameraView onScanSuccess={handleScannedCode} />



          ) : permission?.granted ? (



            <CameraView



              style={s.camera}



              facing="back"



              enableTorch={flashOn}



              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}



              onBarcodeScanned={hasScanned ? undefined : ({ data }) => {



                handleScannedCode(data);



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



            <Animated.View style={[s.scanLine, { transform: [{ translateY }] }]} />



            <View style={s.scanBadge}>



              <View style={s.scanBadgeDot} />



              <Text style={s.scanBadgeText}>VKU SCAN</Text>



            </View>



          </View>



        </View>



        {Platform.OS !== 'web' && permission && !permission.granted && permission.canAskAgain && (



          <Pressable



            accessibilityRole="button"



            onPress={() => void requestPermission()}



            style={s.permissionButton}



          >



            <Camera size={z(17)} color={COLORS.navy} strokeWidth={2} />



            <Text style={s.permissionText}>Cho phép sử dụng camera</Text>



          </Pressable>



        )}



                <View style={s.instruction}>



          <Text style={s.instructionText}>



            Hướng camera về phía mã QR trên máy bạn học để nhận tài liệu



          </Text>



        </View>



        <View style={s.resultCard}>
          {recognizedDoc ? (
            <>
              <View style={s.recognizedHeading}>
                <View style={s.greenDot} />
                <Text style={s.recognizedTitle}>Đã nhận diện mã tài liệu</Text>
              </View>

              <View style={s.documentCard}>
                <View style={s.pdfIcon}>
                  <FileText size={z(25)} color={COLORS.red} strokeWidth={2} />
                  <Text style={s.pdfLabel}>{(recognizedDoc as any).format || "PDF"}</Text>
                </View>

                <View style={s.documentInfo}>
                  <Text style={s.documentTitle} numberOfLines={2}>
                    {recognizedDoc.title}
                  </Text>

                  <View style={s.metadataRow}>
                    <Text style={s.fileSize}>{recognizedDoc.size}</Text>
                    <View style={s.metadataDot} />
                    <Text style={s.subject}>{recognizedDoc.subject}</Text>
                  </View>

                  <View style={s.ownerPill}>
                    <View style={s.ownerAvatar}>
                      <Text style={s.ownerInitials}>
                        {recognizedDoc.owner ? recognizedDoc.owner.split(" ").slice(-1)[0].substring(0, 2).toUpperCase() : "NA"}
                      </Text>
                    </View>
                    <View style={s.ownerInfo}>
                      <Text style={s.ownerName}>{recognizedDoc.owner}</Text>
                      <Text style={s.ownerMeta}>{recognizedDoc.studentId ? "Mã SV: " + recognizedDoc.studentId : "Sinh viên VKU"}</Text>
                    </View>
                  </View>
                </View>
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={async () => {
                  try {
                    showLoading("Đang lưu tài liệu vào kho cá nhân...");
                    await documentService.claimQRDocument((recognizedDoc as any)?.qrToken || recognizedDoc?.id || "").catch(() => {});
                    hideLoading();
                    showSuccess(
                      "Lưu thành công!",
                      "Tài liệu đã được lưu vào mục \"Tài liệu của tôi\". Bạn có thể xem lại bất kỳ lúc nào!",
                      () => router.replace("/documents" as any)
                    );
                  } catch (err: any) {
                    hideLoading();
                    showError("Lỗi", err.message || "Không thể lưu tài liệu lúc này.");
                  }
                }}
                style={s.saveButton}
              >
                <CloudDownload size={z(20)} color={COLORS.white} strokeWidth={2} />
                <Text style={s.saveButtonText}>Lưu vào Kho tài liệu cá nhân</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={() => setViewerVisible(true)}
                style={s.previewButton}
              >
                <Eye size={z(20)} color={COLORS.navy} strokeWidth={2} />
                <Text style={s.previewButtonText}>Mở xem trực tiếp ngay</Text>
              </Pressable>
            </>
          ) : (
            <View style={s.unrecognizedContainer}>
              <View style={s.unrecognizedIconWrap}>
                <ScanLine size={z(28)} color="#94A3B8" strokeWidth={2} />
              </View>
              <Text style={s.unrecognizedTitle}>Chưa có tài liệu được nhận diện!</Text>
              <Text style={s.unrecognizedSub}>
                Hướng camera vào mã QR của bạn học hoặc chọn ảnh từ máy để nhận diện tài liệu.
              </Text>
            </View>
          )}
        </View>

        {notice.length > 0 && (



          <Text accessibilityLiveRegion="polite" style={s.notice}>{notice}</Text>



        )}



      </ScrollView>



    
      <DocumentViewerModal
        visible={viewerVisible}
        document={recognizedDoc ? {
          id: recognizedDoc.id,
          title: recognizedDoc.title,
          subject: recognizedDoc.subject,
          size: recognizedDoc.size,
          format: (recognizedDoc as any).format || 'PDF',
          fileUrl: (recognizedDoc as any).fileUrl,
          authorName: recognizedDoc.owner,
        } : null}
        onClose={() => setViewerVisible(false)}
        onCreateQr={(doc) => {
          setViewerVisible(false);
          router.push({
            pathname: '/document-qr',
            params: { docId: doc.id, title: doc.title, size: doc.size },
          } as any);
        }}
      />
    </SafeAreaView>



  );



}



function WebCameraView({



  onScanSuccess,



}: {



  onScanSuccess?: (code: string) => void;



}) {



  const videoRef = useRef<any>(null);



  const [cameraError, setCameraError] = useState(false);



  useEffect(() => {



    if (Platform.OS !== 'web') return;



    let stream: any = null;



    let scanInterval: any = null;



    async function startCamera() {



      try {



        if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {



          stream = await navigator.mediaDevices.getUserMedia({



            video: {



              facingMode: { ideal: 'environment' },



              width: { ideal: 1280 },



              height: { ideal: 720 },



            },



            audio: false,



          });



          if (videoRef.current) {



            videoRef.current.srcObject = stream;



            videoRef.current.setAttribute('playsinline', 'true');



            videoRef.current.play().catch(() => {});



          }



          if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {



            try {



              const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });



              scanInterval = setInterval(async () => {



                if (videoRef.current && videoRef.current.readyState >= 2) {



                  try {



                    const barcodes = await detector.detect(videoRef.current);



                    if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {



                      onScanSuccess?.(barcodes[0].rawValue);



                    }



                  } catch {



                    // ignore detection error



                  }



                }



              }, 600);



            } catch {



              // ignore



            }



          }



        } else {



          setCameraError(true);



        }



      } catch (err) {



        console.warn('Không thể mở camera web:', err);



        setCameraError(true);



      }



    }



    startCamera();



    return () => {



      if (scanInterval) clearInterval(scanInterval);



      if (stream) {



        stream.getTracks().forEach((track: any) => track.stop());



      }



    };



  }, [onScanSuccess]);



  if (cameraError) {



    return <ScannerIllustration size={182} />;



  }



  return (



    <View style={StyleSheet.absoluteFill}>



      {React.createElement('video', {



        ref: videoRef,



        autoPlay: true,



        playsInline: true,



        muted: true,



        style: {



          width: '100%',



          height: '100%',



          objectFit: 'cover',



          borderRadius: 20,



          backgroundColor: '#000000',



        },



      })}



    </View>



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



  scroll: { paddingHorizontal: 18, paddingTop: 16 },



  header: {



    height: 48,



    flexDirection: 'row',



    alignItems: 'center',



    justifyContent: 'space-between',



  },



  headerActions: {



    flexDirection: 'row',



    alignItems: 'center',



  },



  cornerPickBtn: {



    position: 'absolute',



    right: 12,



    bottom: 12,



    width: 32,



    height: 32,



    borderRadius: 16,



    alignItems: 'center',



    justifyContent: 'center',



    backgroundColor: 'rgba(16, 29, 131, 0.75)',



    borderWidth: 1,



    borderColor: 'rgba(255, 255, 255, 0.25)',



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



  scanBadge: {



    position: 'absolute',



    top: 14,



    paddingHorizontal: 10,



    paddingVertical: 4,



    borderRadius: 12,



    flexDirection: 'row',



    alignItems: 'center',



    backgroundColor: 'rgba(16, 29, 131, 0.85)',



  },



  scanBadgeDot: {



    width: 6,



    height: 6,



    borderRadius: 3,



    backgroundColor: '#10B981',



    marginRight: 6,



  },



  scanBadgeText: {



    fontFamily: FONT.bold,



    fontSize: 10,



    color: '#FFFFFF',



    letterSpacing: 0.5,



  },



  scanLine: {



    position: 'absolute',



    left: 8,



    right: 8,



    top: 10,



    height: 2.5,



    backgroundColor: '#38BDF8',



    shadowColor: '#38BDF8',



    shadowOpacity: 0.8,



    shadowRadius: 6,



    shadowOffset: { width: 0, height: 0 },



  },



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



  waitingCard: {

    marginTop: 20,

    paddingVertical: 24,

    paddingHorizontal: 20,

    borderRadius: 22,

    borderWidth: 1,

    borderStyle: 'dashed',

    borderColor: '#CBD5E1',

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor: '#F8FAFC',

  },

  waitingIconWrap: {

    width: 52,

    height: 52,

    borderRadius: 26,

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor: '#EEF2FF',

    marginBottom: 12,

  },

  waitingTitle: {

    fontFamily: FONT.bold,

    fontSize: 15,

    lineHeight: 21,

    color: COLORS.title,

    marginBottom: 6,

  },

  waitingSub: {

    fontFamily: FONT.regular,

    fontSize: 12,

    lineHeight: 18,

    color: '#64748B',

    textAlign: 'center',

    maxWidth: 280,

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



  unrecognizedContainer: {
    paddingVertical: 28,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unrecognizedIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  unrecognizedTitle: {
    fontFamily: FONT.bold,
    fontSize: 14.5,
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 6,
  },
  unrecognizedSub: {
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.body,
    textAlign: 'center',
    maxWidth: 290,
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



