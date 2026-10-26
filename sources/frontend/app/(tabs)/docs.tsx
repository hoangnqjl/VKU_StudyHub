import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../src/constants/colors';
import { FontFamily, FontSize } from '../../src/constants/typography';
import { Spacing, BorderRadius, Shadow } from '../../src/constants/spacing';
import { SUBJECTS } from '../../src/constants/app';

const { width } = Dimensions.get('window');

const MOCK_DOCS = [
  { id: '1', name: 'Đề cương CSDL 2024', subject: 'Cơ sở dữ liệu', subjectId: 'co-so-dl', type: 'PDF', size: '2.4MB', uploader: 'Minh Trí', downloads: 48, icon: '📄', date: '2 ngày trước' },
  { id: '2', name: 'Bài tập Mạng máy tính chương 3', subject: 'Mạng máy tính', subjectId: 'mang-may-tinh', type: 'PDF', size: '1.1MB', uploader: 'Thu Hà', downloads: 23, icon: '📄', date: '5 ngày trước' },
  { id: '3', name: 'Slide Toán cao cấp C3', subject: 'Toán cao cấp', subjectId: 'toan-cao-cap', type: 'PPT', size: '5.8MB', uploader: 'GV Hùng', downloads: 102, icon: '📊', date: '1 tuần trước' },
  { id: '4', name: 'Đề thi CSDL 2023 + Đáp án', subject: 'Cơ sở dữ liệu', subjectId: 'co-so-dl', type: 'PDF', size: '800KB', uploader: 'Lan Anh', downloads: 87, icon: '📋', date: '3 ngày trước' },
  { id: '5', name: 'Ôn tập Lập trình C++ căn bản', subject: 'Lập trình C/C++', subjectId: 'lap-trinh-c', type: 'PDF', size: '3.2MB', uploader: 'Quang Huy', downloads: 56, icon: '📄', date: '4 ngày trước' },
  { id: '6', name: 'Tài liệu AI – Machine Learning', subject: 'Trí tuệ nhân tạo', subjectId: 'ai', type: 'ZIP', size: '12MB', uploader: 'Đức Thắng', downloads: 34, icon: '🗜️', date: '6 ngày trước' },
];

const TABS = ['Tất cả', 'Của tôi', 'Đã lưu'];

export default function DocsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const filtered = MOCK_DOCS.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(searchText.toLowerCase());
    const matchSubject = !selectedSubject || d.subjectId === selectedSubject;
    return matchSearch && matchSubject;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#0F1629', '#1A2540']}
        style={[styles.header, { paddingTop: insets.top + Spacing.base }]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>📂 Kho tài liệu</Text>
            <Text style={styles.headerSubtitle}>Tài liệu theo môn học</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => router.push('/docs/scan')}
              style={styles.headerBtn}
            >
              <Text style={styles.headerBtnIcon}>📷</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/docs/upload')}
              style={[styles.headerBtn, styles.uploadBtn]}
            >
              <LinearGradient
                colors={['#FED014', '#E5B800']}
                style={styles.uploadGrad}
              >
                <Text style={styles.uploadBtnIcon}>+</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm tài liệu..."
            placeholderTextColor={Colors.textMuted}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          {TABS.map((tab, i) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(i)}
              style={[styles.tab, activeTab === i && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Subject filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectScroll}>
          <TouchableOpacity
            onPress={() => setSelectedSubject(null)}
            style={[styles.subjectChip, !selectedSubject && styles.subjectChipActive]}
          >
            <Text style={[styles.subjectChipText, !selectedSubject && styles.subjectChipTextActive]}>
              Tất cả môn
            </Text>
          </TouchableOpacity>
          {SUBJECTS.map((s) => (
            <TouchableOpacity
              key={s.id}
              onPress={() => setSelectedSubject(selectedSubject === s.id ? null : s.id)}
              style={[styles.subjectChip, selectedSubject === s.id && styles.subjectChipActive]}
            >
              <Text style={styles.subjectChipIcon}>{s.icon}</Text>
              <Text style={[styles.subjectChipText, selectedSubject === s.id && styles.subjectChipTextActive]}>
                {s.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Count */}
        <Text style={styles.countText}>{filtered.length} tài liệu</Text>

        {/* Document list */}
        {filtered.map((doc) => (
          <TouchableOpacity
            key={doc.id}
            onPress={() => router.push('/docs/view')}
            activeOpacity={0.8}
            style={styles.docCard}
          >
            <View style={styles.docIconBg}>
              <Text style={styles.docIcon}>{doc.icon}</Text>
              <View style={styles.docTypeBadge}>
                <Text style={styles.docTypeText}>{doc.type}</Text>
              </View>
            </View>
            <View style={styles.docInfo}>
              <Text style={styles.docName} numberOfLines={2}>{doc.name}</Text>
              <Text style={styles.docSubject}>{doc.subject}</Text>
              <View style={styles.docMeta}>
                <Text style={styles.docMetaText}>👤 {doc.uploader}</Text>
                <Text style={styles.docMetaDot}>·</Text>
                <Text style={styles.docMetaText}>{doc.size}</Text>
                <Text style={styles.docMetaDot}>·</Text>
                <Text style={styles.docMetaText}>⬇️ {doc.downloads}</Text>
              </View>
              <Text style={styles.docDate}>{doc.date}</Text>
            </View>
            <View style={styles.docActions}>
              <TouchableOpacity
                onPress={() => router.push('/docs/qr')}
                style={styles.docActionBtn}
              >
                <Text style={styles.docActionIcon}>⠿</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.docActionBtn}>
                <Text style={styles.docActionIcon}>⬇️</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {/* Empty state */}
        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>Không tìm thấy tài liệu</Text>
            <Text style={styles.emptyDesc}>Thử thay đổi bộ lọc hoặc tải lên tài liệu đầu tiên</Text>
            <TouchableOpacity
              onPress={() => router.push('/docs/upload')}
              style={styles.emptyBtn}
            >
              <LinearGradient
                colors={['#FED014', '#E5B800']}
                style={styles.emptyBtnGrad}
              >
                <Text style={styles.emptyBtnText}>Tải lên tài liệu</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgBase },
  header: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
    gap: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  headerActions: { flexDirection: 'row', gap: Spacing.sm },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBtnIcon: { fontSize: 18 },
  uploadBtn: { overflow: 'hidden' },
  uploadGrad: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadBtnIcon: {
    fontSize: 24,
    color: Colors.textInvert,
    fontFamily: FontFamily.bold,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.bgInput,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  searchIcon: { fontSize: 16 },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  clearIcon: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.bgInput,
    borderRadius: BorderRadius.full,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.full,
  },
  tabActive: { backgroundColor: Colors.bgBase },
  tabText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  tabTextActive: { color: Colors.textPrimary, fontFamily: FontFamily.semiBold },

  scroll: { padding: Spacing.base, gap: Spacing.md },
  subjectScroll: { marginHorizontal: -Spacing.base },
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: 4,
  },
  subjectChipActive: { borderColor: Colors.primary, backgroundColor: 'rgba(254, 208, 20, 0.12)' },
  subjectChipIcon: { fontSize: 14 },
  subjectChipText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  subjectChipTextActive: { color: Colors.primary },

  countText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },

  docCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  docIconBg: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(254, 208, 20, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  docIcon: { fontSize: 28 },
  docTypeBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: Colors.accent,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  docTypeText: {
    fontFamily: FontFamily.bold,
    fontSize: 8,
    color: Colors.white,
  },
  docInfo: { flex: 1, gap: 3 },
  docName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  docSubject: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.primary,
  },
  docMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
  docMetaText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  docMetaDot: { color: Colors.textMuted },
  docDate: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  docActions: { gap: Spacing.sm },
  docActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.bgCardAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docActionIcon: { fontSize: 16 },

  emptyState: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing['3xl'],
  },
  emptyIcon: { fontSize: 56 },
  emptyTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  emptyDesc: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  emptyBtn: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginTop: Spacing.sm,
    ...Shadow.golden,
  },
  emptyBtnGrad: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing['2xl'],
    alignItems: 'center',
  },
  emptyBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.textInvert,
  },
});
