import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
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
  const [file, setFile] = useState<SelectedDocument | null>(null);
  const [title, setTitle] = useState('Đề cương ôn tập kiểm tra Lập trình Web');
  const [subject, setSubject] = useState('Lập trình Web (IT002)');
  const [documentType, setDocumentType] = useState('Tóm tắt');
  const [description, setDescription] = useState('');
  const [notice, setNotice] = useState('');
  const [isPicking, setIsPicking] = useState(false);

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

      if (result.canceled) return;

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

      setFile({ name: picked.name, size: picked.size });
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

  const submitDocument = () => {
    if (!file) {
      setNotice('Vui lòng chọn tệp tài liệu trước khi tiếp tục.');
      return;
    }
    if (!title.trim() || !subject.trim()) {
      setNotice('Vui lòng nhập tên tài liệu và học phần.');
      return;
    }
    setNotice('Tài liệu đã sẵn sàng. Chức năng đăng tải sẽ khả dụng khi Kho tài liệu được kết nối.');
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
            onPress={() => router.back()}
            style={s.backButton}
          >
            <Feather name="chevron-left" size={z(25)} color={COLORS.title} />
          </Pressable>
          <Text style={s.headerTitle}>Thêm tài liệu mới</Text>
          <View style={s.headerSpacer} />
        </View>

        <View style={s.intro}>
          <Text style={s.pageTitle}>Thêm tài liệu mới</Text>
          <Text style={s.subtitle}>Chia sẻ học liệu hữu ích cùng cộng đồng sinh viên VKU</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Chọn tệp PDF, DOCX hoặc ZIP, tối đa 50 MB"
          disabled={isPicking}
          onPress={() => void chooseFile()}
          style={s.dropZone}
        >
          <Feather name="upload-cloud" size={z(25)} color={COLORS.navy} />
          <Text style={s.dropTitle}>{isPicking ? 'Đang mở tệp...' : 'Chạm hoặc kéo thả tệp'}</Text>
          <Text style={s.dropHint}>PDF, DOCX hoặc ZIP (tối đa 50MB)</Text>
          <View style={s.chooseButton}>
            <Feather name="paperclip" size={z(18)} color={COLORS.navy} />
            <Text style={s.chooseText}>Chọn từ máy</Text>
          </View>
        </Pressable>

        {file && (
          <View style={s.fileCard}>
            <View style={s.fileIcon}>
              <Feather name="file-text" size={z(21)} color={COLORS.red} />
              <Text style={s.fileIconLabel}>{file.name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'P'}</Text>
            </View>
            <View style={s.fileInfo}>
              <View style={s.fileTopRow}>
                <Text numberOfLines={1} style={s.fileName}>{file.name}</Text>
                <View style={s.completionBadge}>
                  <Feather name="check-circle" size={z(12)} color={COLORS.green} />
                  <Text style={s.completionText}>100%</Text>
                </View>
              </View>
              <Text style={s.fileMeta}>{formatFileSize(file.size)} • Hoàn tất</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Xóa tệp đã chọn"
              hitSlop={8}
              onPress={removeFile}
              style={s.removeButton}
            >
              <Feather name="x" size={z(21)} color="#94A3B8" />
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
            onPress={submitDocument}
            style={s.submitButton}
          >
            <Feather name="upload-cloud" size={z(19)} color={COLORS.white} />
            <Text style={s.submitText}>Đăng tài liệu</Text>
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
  const { s, z } = useDesign(raw);

  return (
    <Text style={[s.label, spacing > 0 && { marginTop: z(spacing) }]}>
      {text}{required && <Text style={s.required}> *</Text>}
    </Text>
  );
}

function formatFileSize(bytes: number) {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const raw = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  scroll: { paddingHorizontal: 20, paddingTop: 16 },
  header: {
    height: 56,
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
  dropZone: {
    minHeight: 181,
    marginTop: 25,
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
    marginLeft: 8,
    fontFamily: FONT.semi,
    fontSize: 13,
    lineHeight: 18,
    color: '#334155',
  },
  fileCard: {
    minHeight: 77,
    marginTop: 17,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 23,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    shadowColor: '#0F172A',
    shadowOpacity: 0.045,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  fileIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0EF',
  },
  fileIconLabel: {
    marginTop: -4,
    fontFamily: FONT.extra,
    fontSize: 8,
    lineHeight: 10,
    color: COLORS.red,
  },
  fileInfo: { flex: 1, minWidth: 0, marginLeft: 12 },
  fileTopRow: { flexDirection: 'row', alignItems: 'center' },
  fileName: {
    flex: 1,
    minWidth: 0,
    marginRight: 7,
    fontFamily: FONT.bold,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.title,
  },
  completionBadge: {
    minHeight: 22,
    paddingHorizontal: 7,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF8',
  },
  completionText: {
    marginLeft: 4,
    fontFamily: FONT.semi,
    fontSize: 10,
    lineHeight: 14,
    color: COLORS.green,
  },
  fileMeta: {
    marginTop: 3,
    fontFamily: FONT.regular,
    fontSize: 11,
    lineHeight: 16,
    color: '#8FA0B9',
  },
  removeButton: { width: 25, alignItems: 'flex-end' },
  form: { marginTop: 21 },
  label: {
    fontFamily: FONT.bold,
    fontSize: 13,
    lineHeight: 19,
    color: '#3F4E63',
  },
  required: { color: COLORS.red },
  input: {
    height: 50,
    marginTop: 10,
    paddingHorizontal: 16,
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
