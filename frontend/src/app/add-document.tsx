import { safeBack } from '../utils/navigation';
import { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAlert } from '../components/AlertContext';
import { documentService, StorageUsage } from '../services/documentService';
import { router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Cloud,
  UploadCloud,
  Paperclip,
  FileText,
  CheckCircle,
  X,
} from '../components/DynamicLucideIcon';
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

const COLORS = {
  navy: '#101D83',
  title: '#17243A',
  body: '#71819B',
  border: '#E1E9F3',
  pale: '#F7F9FC',
  white: '#FFFFFF',
  green: '#00A878',
  red: '#F0444F',
};

const FONT = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semi: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extra: 'Inter_800ExtraBold',
};

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = ['pdf', 'docx', 'zip'];
const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/zip',
  'application/x-zip-compressed',
];
const DOCUMENT_TYPES = ['Đề thi', 'Tóm tắt', 'Bài giảng', 'Đồ án mẫu'];

type SelectedDocument = {
  name: string;
  size: number;
  uri?: string;
  fileData?: string;
};

export default function AddDocumentScreen() {
  const { s, z } = useDesign(raw);
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });
  const { showError, showSuccess } = useAlert();
  const [file, setFile] = useState<SelectedDocument | null>(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [documentType, setDocumentType] = useState('Tóm tắt');
  const [description, setDescription] = useState('');
  const [notice, setNotice] = useState('');
  const [isPicking, setIsPicking] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [storageUsage, setStorageUsage] = useState<StorageUsage | null>(null);

  useEffect(() => {
    documentService
      .getStorageUsage()
      .then((usage) => {
        if (usage) setStorageUsage(usage);
      })
      .catch(() => {});
  }, []);

  if (!fontsLoaded) return null;

  const chooseFile = async () => {
    setIsPicking(true);
    setNotice('');

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ACCEPTED_TYPES,
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) return;

      const picked = result.assets[0];
      const extension = picked.name.split('.').pop()?.toLowerCase();
      if (!extension || !ACCEPTED_EXTENSIONS.includes(extension)) {
        setNotice('Chỉ chấp nhận tệp PDF, DOCX hoặc ZIP.');
        return;
      }
      if (picked.size === undefined) {
        setNotice('Không thể xác định dung lượng tệp đã chọn.');
        return;
      }
      if (picked.size > MAX_FILE_SIZE) {
        setNotice('Dung lượng tệp vượt quá giới hạn 50 MB.');
        return;
      }

      // Đọc file thành Base64 Data URL để lưu trữ Cloudinary
      let base64Data: string | undefined = undefined;
      try {
        if (Platform.OS === 'web' && (picked as any).file) {
          const rawFile = (picked as any).file as File;
          base64Data = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error('Lỗi đọc tệp'));
            reader.readAsDataURL(rawFile);
          });
        } else if (picked.uri) {
          const resp = await fetch(picked.uri);
          const blob = await resp.blob();
          base64Data = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error('Lỗi chuyển đổi tệp'));
            reader.readAsDataURL(blob);
          });
        }
      } catch (readErr) {
        console.warn('Lỗi đọc nội dung file:', readErr);
      }

      setFile({ name: picked.name, size: picked.size, uri: picked.uri, fileData: base64Data });
      setTitle((prev) => {
        if (!prev || !prev.trim()) {
          return picked.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim();
        }
        return prev;
      });
    } catch {
      setNotice('Không thể mở trình chọn tệp. Vui lòng thử lại.');
    } finally {
      setIsPicking(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setNotice('');
  };

  const submitDocument = async () => {
    if (!file) {
      showError('Thiếu tài liệu', 'Vui lòng chọn tệp tài liệu (PDF, DOCX hoặc ZIP) trước khi tiếp tục.');
      return;
    }
    if (!title.trim() || !subject.trim()) {
      showError('Thiếu thông tin', 'Vui lòng nhập tên tài liệu và học phần.');
      return;
    }

    try {
      setIsUploading(true);
      const ext = file.name.split('.').pop()?.toLowerCase();
      let fileType: 'PDF' | 'DOCX' | 'ZIP' | 'IMAGE' = 'PDF';
      if (ext === 'docx') fileType = 'DOCX';
      else if (ext === 'zip') fileType = 'ZIP';

      let cat: 'DE_THI' | 'TOM_TAT' | 'BAI_GIANG' | 'DO_AN' = 'TOM_TAT';
      if (documentType === 'Đề thi') cat = 'DE_THI';
      else if (documentType === 'Bài giảng') cat = 'BAI_GIANG';
      else if (documentType === 'Đồ án mẫu') cat = 'DO_AN';

      // Tạo đường dẫn lưu trữ Cloudinary
      const safeName = encodeURIComponent(file.name.replace(/\s+/g, '_'));
      const fallbackUrl = `https://res.cloudinary.com/ktrcmxn2/image/upload/v1/vku_studyhub/documents/${Date.now()}_${safeName}`;

      const cleanSubject = subject.trim();
      const extractedCode = cleanSubject.includes('(')
        ? cleanSubject.split('(')[1].replace(')', '').trim().toUpperCase()
        : cleanSubject.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase() || 'GEN001';

      await documentService.createDocument({
        title: title.trim(),
        description: description.trim() || `Tài liệu môn ${cleanSubject}`,
        courseCode: extractedCode,
        courseName: cleanSubject.split('(')[0]?.trim() || cleanSubject,
        category: cat,
        fileUrl: fallbackUrl,
        fileData: file.fileData,
        fileName: file.name,
        fileType,
        fileSizeBytes: file.size,
      });

      showSuccess(
        'Tải lên thành công',
        `Tài liệu "${title}" đã được lưu trữ trên Cloudinary (hạn mức 1 GB) và chia sẻ vào Kho học liệu chung.`
      );
      setTimeout(() => {
        safeBack('/documents');
      }, 1000);
    } catch (err: any) {
      showError(
        'Lỗi đăng tài liệu',
        err.message || 'Không thể đăng tài liệu lên máy chủ VKU. Vui lòng thử lại sau.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={[
          s.scroll,
          { paddingBottom: z(24) + insets.bottom },
        ]}
        keyboardShouldPersistTaps="handled"
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
          <Text style={s.headerTitle}>Thêm tài liệu mới</Text>
          <View style={s.headerSpacer} />
        </View>

        <View style={s.intro}>
          <Text style={s.pageTitle}>Thêm tài liệu mới</Text>
          <Text style={s.subtitle}>Chia sẻ học liệu hữu ích cùng cộng đồng sinh viên VKU</Text>
        </View>

        <View style={s.storageQuotaBadge}>
          <View style={s.cloudIconWrap}>
            <Cloud size={z(16)} color={COLORS.navy} strokeWidth={2} />
          </View>
          <View style={s.storageQuotaTextContainer}>
            <Text style={s.storageQuotaTitle}>Lưu trữ đám mây Cloudinary (1 GB / sinh viên)</Text>
            <Text style={s.storageQuotaSub}>
              {storageUsage
                ? `Đã sử dụng ${storageUsage.usedMb.toFixed(1)} MB / 1 GB (${storageUsage.usedPercentage}%) • Tối đa 50MB/tệp`
                : 'Mỗi tài khoản được cấp 1 GB lưu trữ tài liệu Cloudinary'}
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Chọn tệp PDF, DOCX hoặc ZIP, tối đa 50 MB"
          disabled={isPicking || isUploading}
          onPress={() => void chooseFile()}
          style={s.dropZone}
        >
          <UploadCloud size={z(25)} color={COLORS.navy} strokeWidth={2} />
          <Text style={s.dropTitle}>{isPicking ? 'Đang mở tệp...' : 'Chạm hoặc kéo thả tệp'}</Text>
          <Text style={s.dropHint}>PDF, DOCX hoặc ZIP (tối đa 50MB)</Text>
          <View style={s.chooseButton}>
            <Paperclip size={z(18)} color={COLORS.navy} strokeWidth={2} />
            <Text style={s.chooseText}>Chọn từ máy</Text>
          </View>
        </Pressable>

        {file && (
          <View style={s.fileCard}>
            <View style={s.fileIcon}>
              <FileText size={z(21)} color={COLORS.red} strokeWidth={2} />
              <Text style={s.fileIconLabel}>{file.name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'DOC'}</Text>
            </View>
            <View style={s.fileInfo}>
              <View style={s.fileTopRow}>
                <Text numberOfLines={1} style={s.fileName}>{file.name}</Text>
                <View style={s.completionBadge}>
                  <CheckCircle size={z(12)} color={COLORS.green} strokeWidth={2.5} />
                  <Text style={s.completionText}>Đã sẵn sàng</Text>
                </View>
              </View>
              <Text style={s.fileMeta}>{formatFileSize(file.size)} • Sẵn sàng tải lên Cloudinary</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Xóa tệp đã chọn"
              hitSlop={8}
              onPress={removeFile}
              style={s.removeButton}
            >
              <X size={z(21)} color="#94A3B8" strokeWidth={2} />
            </Pressable>
          </View>
        )}

        <View style={s.form}>
          <FieldLabel text="Tên tài liệu" required />
          <TextInput
            accessibilityLabel="Tên tài liệu"
            value={title}
            onChangeText={setTitle}
            placeholder="Nhập tên tài liệu"
            placeholderTextColor="#9AAAC1"
            style={s.input}
          />

          <FieldLabel text="Học phần" required spacing={21} />
          <TextInput
            accessibilityLabel="Học phần"
            value={subject}
            onChangeText={setSubject}
            placeholder="Nhập tên học phần"
            placeholderTextColor="#9AAAC1"
            style={s.input}
          />

          <Text style={[s.label, s.typeLabel]}>Loại tài liệu</Text>
          <View style={s.typeOptions}>
            {DOCUMENT_TYPES.map((type) => (
              <Pressable
                key={type}
                accessibilityRole="button"
                accessibilityState={{ selected: documentType === type }}
                onPress={() => setDocumentType(type)}
                style={[s.typeChip, documentType === type && s.typeChipSelected]}
              >
                <Text style={[s.typeText, documentType === type && s.typeTextSelected]}>
                  {type}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={[s.label, s.descriptionLabel]}>
            Mô tả / Ghi chú <Text style={s.optional}>(không bắt buộc)</Text>
          </Text>
          <TextInput
            accessibilityLabel="Mô tả hoặc ghi chú"
            value={description}
            onChangeText={setDescription}
            placeholder="Thêm mô tả ngắn gọn giúp bạn học nắm rõ nội dung tài liệu"
            placeholderTextColor="#9AAAC1"
            multiline
            textAlignVertical="top"
            style={s.descriptionInput}
          />

          <Pressable
            accessibilityRole="button"
            disabled={isUploading}
            onPress={submitDocument}
            style={[s.submitButton, isUploading && { opacity: 0.7 }]}
          >
            {isUploading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <UploadCloud size={z(19)} color={COLORS.white} strokeWidth={2} />
            )}
            <Text style={s.submitText}>
              {isUploading ? 'Đang tải lên Cloudinary...' : 'Đăng tài liệu'}
            </Text>
          </Pressable>
          {notice.length > 0 && (
            <Text accessibilityLiveRegion="polite" style={s.notice}>{notice}</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FieldLabel({
  text,
  required = false,
  spacing = 0,
}: {
  text: string;
  required?: boolean;
  spacing?: number;
}) {
  const { s } = useDesign(raw);
  return (
    <Text style={[s.label, spacing > 0 && { marginTop: spacing }]}>
      {text} {required && <Text style={s.required}>*</Text>}
    </Text>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const raw = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  scroll: { paddingHorizontal: 20 },
  header: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: FONT.bold,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.5,
    color: COLORS.title,
  },
  headerSpacer: { width: 40 },
  intro: { marginTop: 20 },
  pageTitle: {
    fontFamily: FONT.extra,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.8,
    color: COLORS.title,
  },
  subtitle: {
    marginTop: 3,
    fontFamily: FONT.regular,
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.body,
  },
  storageQuotaBadge: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 10,
  },
  cloudIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storageQuotaTextContainer: {
    flex: 1,
  },
  storageQuotaTitle: {
    fontFamily: FONT.bold,
    fontSize: 12.5,
    color: COLORS.navy,
  },
  storageQuotaSub: {
    fontFamily: FONT.regular,
    fontSize: 11,
    color: '#3B82F6',
    marginTop: 2,
  },
  dropZone: {
    minHeight: 181,
    marginTop: 18,
    borderWidth: 2,
    borderColor: '#CFD9E7',
    borderStyle: 'dashed',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.pale,
  },
  dropTitle: {
    marginTop: 7,
    fontFamily: FONT.bold,
    fontSize: 15,
    lineHeight: 21,
    color: COLORS.title,
  },
  dropHint: {
    marginTop: 6,
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.body,
  },
  chooseButton: {
    minWidth: 138,
    height: 40,
    marginTop: 15,
    paddingHorizontal: 17,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  chooseText: {
    marginLeft: 7,
    fontFamily: FONT.bold,
    fontSize: 13,
    color: COLORS.navy,
  },
  fileCard: {
    marginTop: 15,
    padding: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  fileIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE9EB',
  },
  fileIconLabel: {
    position: 'absolute',
    bottom: 5,
    fontFamily: FONT.extra,
    fontSize: 8,
    color: COLORS.red,
  },
  fileInfo: { flex: 1, marginLeft: 11 },
  fileTopRow: { flexDirection: 'row', alignItems: 'center' },
  fileName: {
    flex: 1,
    marginRight: 6,
    fontFamily: FONT.bold,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.title,
  },
  completionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF9F4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 3,
  },
  completionText: {
    fontFamily: FONT.bold,
    fontSize: 10,
    color: COLORS.green,
  },
  fileMeta: {
    marginTop: 3,
    fontFamily: FONT.medium,
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.body,
  },
  removeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: { marginTop: 17 },
  label: {
    fontFamily: FONT.bold,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.title,
  },
  required: { color: COLORS.red },
  input: {
    height: 44,
    marginTop: 9,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 27,
    fontFamily: FONT.regular,
    fontSize: 13,
    color: COLORS.title,
    backgroundColor: COLORS.white,
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  typeLabel: { marginTop: 15 },
  typeOptions: { marginTop: 11, flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  typeChip: {
    minHeight: 38,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  typeChipSelected: { borderColor: COLORS.navy, backgroundColor: COLORS.navy },
  typeText: { fontFamily: FONT.medium, fontSize: 12, lineHeight: 17, color: '#526176' },
  typeTextSelected: { fontFamily: FONT.bold, color: COLORS.white },
  descriptionLabel: { marginTop: 14 },
  optional: { fontFamily: FONT.regular, color: '#9AAAC1' },
  descriptionInput: {
    minHeight: 96,
    marginTop: 10,
    paddingHorizontal: 15,
    paddingTop: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    fontFamily: FONT.regular,
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.title,
  },
  submitButton: {
    minHeight: 49,
    marginTop: 20,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.navy,
  },
  submitText: { marginLeft: 8, fontFamily: FONT.bold, fontSize: 14, lineHeight: 20, color: COLORS.white },
  notice: { marginTop: 10, textAlign: 'center', fontFamily: FONT.medium, fontSize: 12, lineHeight: 18, color: COLORS.navy },
});
