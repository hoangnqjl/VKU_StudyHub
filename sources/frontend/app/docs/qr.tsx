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

// Mocked QR code visual
const MockQR = ({ size = 180 }: { size?: number }) => (
  <View style={{ width: size, height: size, backgroundColor: '#fff', padding: 8, borderRadius: 12 }}>
    <View style={{ flex: 1, backgroundColor: '#000', borderRadius: 4 }}>
      {/* Simulated QR pattern */}
      {Array.from({ length: 10 }).map((_, row) => (
        <View key={row} style={{ flex: 1, flexDirection: 'row' }}>
          {Array.from({ length: 10 }).map((__, col) => (
            <View
              key={col}
              style={{
                flex: 1,
                margin: 0.5,
                backgroundColor: Math.random() > 0.5 ? '#000' : '#fff',
                borderRadius: 1,
              }}
            />
          ))}
        </View>
      ))}
    </View>
  </View>
);

export default function DocQRScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [bundleMode, setBundleMode] = useState(false);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.base }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mã QR tài liệu</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing['3xl'] }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Doc info */}
        <View style={styles.docInfo}>
          <View style={styles.docIconBg}>
            <Text style={styles.docIcon}>📄</Text>
          </View>
          <View>
            <Text style={styles.docName}>Đề cương CSDL 2024</Text>
            <Text style={styles.docMeta}>PDF · 2.4MB · Cơ sở dữ liệu</Text>
          </View>
        </View>

        {/* Mode toggle */}
        <View style={styles.modeToggle}>
          <TouchableOpacity
            onPress={() => setBundleMode(false)}
            style={[styles.modeBtn, !bundleMode && styles.modeBtnActive]}
          >
            <Text style={[styles.modeBtnText, !bundleMode && styles.modeBtnTextActive]}>
              📄 Tài liệu đơn
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setBundleMode(true)}
            style={[styles.modeBtn, bundleMode && styles.modeBtnActive]}
          >
            <Text style={[styles.modeBtnText, bundleMode && styles.modeBtnTextActive]}>
              📦 Bộ tài liệu
            </Text>
          </TouchableOpacity>
        </View>

        {/* QR Display */}
        <View style={styles.qrWrapper}>
          <LinearGradient
            colors={['#1A2540', '#243057']}
            style={styles.qrBackground}
          >
            <MockQR size={200} />
            <Text style={styles.qrHint}>
              {bundleMode ? '📦 Bộ đề ôn CSDL (3 tài liệu)' : '📄 Đề cương CSDL 2024'}
            </Text>
            <Text style={styles.qrSub}>Quét để lưu ngay vào "Tài liệu của tôi"</Text>
          </LinearGradient>
        </View>

        {/* Actions */}
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>💾</Text>
            <Text style={styles.actionLabel}>Lưu ảnh QR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionLabel}>Chia sẻ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>🔗</Text>
            <Text style={styles.actionLabel}>Sao chép link</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionCard, styles.revokeCard]}>
            <Text style={styles.actionIcon}>🚫</Text>
            <Text style={[styles.actionLabel, { color: Colors.danger }]}>Thu hồi QR</Text>
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            Khi có người quét QR này, tài liệu sẽ được lưu thẳng vào "Tài liệu của tôi" — không cần đăng nhập thêm bước nào.
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
  content: { padding: Spacing.base, gap: Spacing.xl, alignItems: 'center' },
  docInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    width: '100%',
  },
  docIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(254, 208, 20, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docIcon: { fontSize: 28 },
  docName: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary },
  docMeta: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textSecondary },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.bgInput,
    borderRadius: BorderRadius.full,
    padding: 3,
    width: '100%',
  },
  modeBtn: { flex: 1, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, alignItems: 'center' },
  modeBtnActive: { backgroundColor: Colors.bgBase },
  modeBtnText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textMuted },
  modeBtnTextActive: { color: Colors.primary, fontFamily: FontFamily.semiBold },
  qrWrapper: {
    width: '100%',
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.accent,
  },
  qrBackground: { padding: Spacing['2xl'], alignItems: 'center', gap: Spacing.md },
  qrHint: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary },
  qrSub: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center' },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, width: '100%' },
  actionCard: {
    width: '47%',
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  revokeCard: { borderColor: 'rgba(223, 2, 24, 0.25)' },
  actionIcon: { fontSize: 28 },
  actionLabel: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textSecondary },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: 'rgba(55, 79, 138, 0.2)',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(55, 79, 138, 0.4)',
    padding: Spacing.md,
    width: '100%',
  },
  infoIcon: { fontSize: 16 },
  infoText: { flex: 1, fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
});
