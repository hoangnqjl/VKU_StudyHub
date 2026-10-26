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

export default function DocViewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.base }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>Đề cương CSDL 2024</Text>
          <Text style={styles.headerSub}>PDF · Trang 1/15</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => setBookmarked(!bookmarked)} style={styles.iconBtn}>
            <Text style={styles.iconBtnText}>{bookmarked ? '🔖' : '📌'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/docs/qr')} style={styles.iconBtn}>
            <Text style={styles.iconBtnText}>⠿</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Document viewer mock */}
      <ScrollView
        style={styles.docViewer}
        contentContainerStyle={[styles.docContent, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Doc page mock */}
        <View style={styles.docPage}>
          <Text style={styles.docPageTitle}>ĐỀ CƯƠNG MÔN CƠ SỞ DỮ LIỆU</Text>
          <Text style={styles.docPageSub}>Học kỳ 1 – Năm học 2024-2025</Text>
          <Text style={styles.docPageSub}>Khoa Công nghệ Thông tin – VKU</Text>

          <View style={styles.docDivider} />

          <Text style={styles.docSection}>I. THÔNG TIN MÔN HỌC</Text>
          {[
            ['Tên môn học:', 'Cơ sở dữ liệu (Database Systems)'],
            ['Mã môn:', 'CS201'],
            ['Số tín chỉ:', '3 (2 lý thuyết + 1 thực hành)'],
            ['Giảng viên:', 'Th.S Nguyễn Văn Hùng'],
          ].map(([label, val]) => (
            <View key={label} style={styles.docRow}>
              <Text style={styles.docRowLabel}>{label}</Text>
              <Text style={styles.docRowValue}>{val}</Text>
            </View>
          ))}

          <Text style={styles.docSection}>II. MỤC TIÊU MÔN HỌC</Text>
          {[
            'Hiểu các khái niệm cơ bản về cơ sở dữ liệu quan hệ',
            'Thiết kế CSDL sử dụng ERD và chuẩn hoá',
            'Sử dụng thành thạo ngôn ngữ SQL',
            'Triển khai CSDL với MySQL/PostgreSQL',
          ].map((item, i) => (
            <View key={i} style={styles.docListItem}>
              <Text style={styles.docListBullet}>•</Text>
              <Text style={styles.docListText}>{item}</Text>
            </View>
          ))}

          <Text style={styles.docSection}>III. NỘI DUNG CHƯƠNG TRÌNH</Text>
          {[
            'Chương 1: Tổng quan về CSDL (4 tiết)',
            'Chương 2: Mô hình dữ liệu quan hệ (6 tiết)',
            'Chương 3: SQL cơ bản (8 tiết)',
            'Chương 4: SQL nâng cao (6 tiết)',
            'Chương 5: Thiết kế CSDL (8 tiết)',
            'Chương 6: Giao dịch và phục hồi (4 tiết)',
          ].map((ch, i) => (
            <View key={i} style={styles.chapterItem}>
              <View style={styles.chapterNum}>
                <Text style={styles.chapterNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.chapterText}>{ch}</Text>
            </View>
          ))}
        </View>

        {/* More pages indicator */}
        <View style={styles.morePages}>
          <Text style={styles.morePagesText}>📄 14 trang tiếp theo...</Text>
          <Text style={styles.morePagesHint}>Kéo xuống để đọc thêm</Text>
        </View>
      </ScrollView>

      {/* Bottom toolbar */}
      <View style={[styles.toolbar, { paddingBottom: insets.bottom + Spacing.sm }]}>
        <TouchableOpacity style={styles.toolBtn}>
          <Text style={styles.toolBtnIcon}>🔍</Text>
          <Text style={styles.toolBtnLabel}>Tìm kiếm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolBtn}>
          <Text style={styles.toolBtnIcon}>🔖</Text>
          <Text style={styles.toolBtnLabel}>Đánh dấu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolBtn}>
          <Text style={styles.toolBtnIcon}>⬇️</Text>
          <Text style={styles.toolBtnLabel}>Tải về</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/docs/qr')} style={styles.toolBtn}>
          <Text style={styles.toolBtnIcon}>⠿</Text>
          <Text style={styles.toolBtnLabel}>Chia sẻ QR</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: Colors.bgBase,
    gap: Spacing.sm,
  },
  backBtn: { width: 36 },
  backText: { fontSize: 32, color: Colors.primary, lineHeight: 36 },
  headerCenter: { flex: 1 },
  headerTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.base, color: Colors.textPrimary },
  headerSub: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textMuted },
  headerRight: { flexDirection: 'row', gap: Spacing.xs },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bgCard, borderRadius: 10 },
  iconBtnText: { fontSize: 16 },

  docViewer: { flex: 1 },
  docContent: { padding: Spacing.base, gap: Spacing.xl },
  docPage: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    gap: Spacing.md,
    ...Shadow.md,
  },
  docPageTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.lg, color: '#111', textAlign: 'center' },
  docPageSub: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: '#555', textAlign: 'center' },
  docDivider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: Spacing.sm },
  docSection: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: '#1e3a8a',
    marginTop: Spacing.sm,
  },
  docRow: { flexDirection: 'row', gap: Spacing.md },
  docRowLabel: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: '#374151', width: 110 },
  docRowValue: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: '#374151', flex: 1 },
  docListItem: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start' },
  docListBullet: { color: '#1e3a8a', fontSize: FontSize.base, marginTop: 1 },
  docListText: { flex: 1, fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: '#374151', lineHeight: 20 },
  chapterItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  chapterNum: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#1e3a8a', alignItems: 'center', justifyContent: 'center',
  },
  chapterNumText: { fontFamily: FontFamily.bold, fontSize: 11, color: '#fff' },
  chapterText: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: '#374151', flex: 1 },

  morePages: {
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  morePagesText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textSecondary },
  morePagesHint: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textMuted },

  toolbar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.bgCard,
    paddingTop: Spacing.sm,
  },
  toolBtn: { flex: 1, alignItems: 'center', gap: 2, paddingVertical: Spacing.xs },
  toolBtnIcon: { fontSize: 20 },
  toolBtnLabel: { fontFamily: FontFamily.regular, fontSize: 10, color: Colors.textMuted },
});
