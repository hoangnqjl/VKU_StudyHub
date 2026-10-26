import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../src/constants/colors';
import { FontFamily, FontSize } from '../../src/constants/typography';
import { Spacing, BorderRadius, Shadow } from '../../src/constants/spacing';
import { SUBJECTS } from '../../src/constants/app';

export default function UploadDocScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [file, setFile] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setUploaded(true);
    }, 2000);
  };

  if (uploaded) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.base }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tải lên tài liệu</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={styles.successContent}>
          <View style={styles.successIcon}><Text style={styles.successEmoji}>✅</Text></View>
          <Text style={styles.successTitle}>Tải lên thành công!</Text>
          <Text style={styles.successDesc}>Tài liệu đã được thêm vào kho và sẵn sàng chia sẻ qua QR.</Text>
          <TouchableOpacity onPress={() => router.push('/docs/qr')} style={styles.genQrBtn}>
            <LinearGradient colors={['#FED014', '#E5B800']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.genQrGrad}>
              <Text style={styles.genQrText}>⠿ Tạo mã QR ngay</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()} style={styles.laterBtn}>
            <Text style={styles.laterText}>Để sau</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.base }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tải lên tài liệu</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + Spacing['3xl'] }]}
        showsVerticalScrollIndicator={false}
      >
        {/* File picker */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📁 Chọn tệp</Text>
          {!file ? (
            <View style={styles.dropZone}>
              <Text style={styles.dropIcon}>📤</Text>
              <Text style={styles.dropTitle}>Kéo thả hoặc chọn tệp</Text>
              <Text style={styles.dropSub}>Hỗ trợ PDF, ảnh, PPT, DOCX</Text>
              <View style={styles.dropBtns}>
                <TouchableOpacity onPress={() => setFile('de_cuong_csdl.pdf')} style={styles.dropBtn}>
                  <Text style={styles.dropBtnText}>📄 Chọn từ thiết bị</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFile('bai_tap.jpg')} style={styles.dropBtn}>
                  <Text style={styles.dropBtnText}>🖼️ Chọn từ ảnh</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.filePreview}>
              <View style={styles.fileIconBg}>
                <Text style={styles.fileIcon}>{file.endsWith('.pdf') ? '📄' : '🖼️'}</Text>
              </View>
              <View style={styles.fileInfo}>
                <Text style={styles.fileName}>{file}</Text>
                <Text style={styles.fileSize}>2.4 MB · Sẵn sàng tải lên</Text>
              </View>
              <TouchableOpacity onPress={() => setFile(null)} style={styles.removeFile}>
                <Text style={styles.removeFileText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Subject */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 Môn học</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
            {SUBJECTS.map((s) => (
              <TouchableOpacity
                key={s.id}
                onPress={() => setSelectedSubject(s.id)}
                style={[styles.chip, selectedSubject === s.id && styles.chipActive]}
              >
                <Text style={styles.chipIcon}>{s.icon}</Text>
                <Text style={[styles.chipText, selectedSubject === s.id && styles.chipTextActive]}>
                  {s.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Upload button */}
        <TouchableOpacity
          onPress={handleUpload}
          disabled={!file || !selectedSubject || uploading}
          activeOpacity={0.85}
          style={[styles.uploadBtn, (!file || !selectedSubject) && { opacity: 0.5 }]}
        >
          <LinearGradient
            colors={['#FED014', '#E5B800']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.uploadGrad}
          >
            <Text style={styles.uploadText}>
              {uploading ? '⏳ Đang tải lên...' : '📤 Tải lên tài liệu'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>🛡️</Text>
          <Text style={styles.infoText}>
            Tài liệu của bạn thuộc về bạn. Bạn có thể thu hồi hoặc cập nhật bất cứ lúc nào.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgBase },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bgCard, borderRadius: 10 },
  closeText: { fontSize: 16, color: Colors.textSecondary },
  headerTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.md, color: Colors.textPrimary },
  scroll: { padding: Spacing.base, gap: Spacing.xl },
  section: { gap: Spacing.md },
  sectionTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary },
  dropZone: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.bgCard,
    padding: Spacing['2xl'],
    alignItems: 'center',
    gap: Spacing.md,
  },
  dropIcon: { fontSize: 48 },
  dropTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.md, color: Colors.textPrimary },
  dropSub: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary },
  dropBtns: { flexDirection: 'row', gap: Spacing.md },
  dropBtn: {
    backgroundColor: Colors.bgCardAlt,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  dropBtnText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textSecondary },
  filePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.success,
    padding: Spacing.md,
  },
  fileIconBg: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(254, 208, 20, 0.1)', alignItems: 'center', justifyContent: 'center' },
  fileIcon: { fontSize: 28 },
  fileInfo: { flex: 1 },
  fileName: { fontFamily: FontFamily.medium, fontSize: FontSize.base, color: Colors.textPrimary },
  fileSize: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.success },
  removeFile: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.bgCardAlt, alignItems: 'center', justifyContent: 'center' },
  removeFileText: { fontSize: 12, color: Colors.textMuted },
  hScroll: { marginHorizontal: -Spacing.base },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.bgCard, borderRadius: BorderRadius.full,
    borderWidth: 1.5, borderColor: Colors.border,
    paddingVertical: Spacing.xs, paddingHorizontal: Spacing.md, marginHorizontal: 4,
  },
  chipActive: { borderColor: Colors.primary, backgroundColor: 'rgba(254, 208, 20, 0.1)' },
  chipIcon: { fontSize: 14 },
  chipText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textSecondary },
  chipTextActive: { color: Colors.primary },
  uploadBtn: { borderRadius: BorderRadius.full, overflow: 'hidden', ...Shadow.golden },
  uploadGrad: { paddingVertical: Spacing.lg, alignItems: 'center' },
  uploadText: { fontFamily: FontFamily.bold, fontSize: FontSize.md, color: Colors.textInvert },
  infoBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm,
    backgroundColor: 'rgba(55, 79, 138, 0.2)', borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: 'rgba(55, 79, 138, 0.4)', padding: Spacing.md,
  },
  infoIcon: { fontSize: 16 },
  infoText: { flex: 1, fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },

  successContent: { flex: 1, padding: Spacing['2xl'], alignItems: 'center', justifyContent: 'center', gap: Spacing.xl },
  successIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(34, 197, 94, 0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.success },
  successEmoji: { fontSize: 40 },
  successTitle: { fontFamily: FontFamily.extraBold, fontSize: FontSize['2xl'], color: Colors.textPrimary },
  successDesc: { fontFamily: FontFamily.regular, fontSize: FontSize.base, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  genQrBtn: { width: '100%', borderRadius: BorderRadius.full, overflow: 'hidden', ...Shadow.golden },
  genQrGrad: { paddingVertical: Spacing.lg, alignItems: 'center' },
  genQrText: { fontFamily: FontFamily.bold, fontSize: FontSize.md, color: Colors.textInvert },
  laterBtn: { paddingVertical: Spacing.md },
  laterText: { fontFamily: FontFamily.medium, fontSize: FontSize.base, color: Colors.textMuted },
});
