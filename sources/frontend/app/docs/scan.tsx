import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../src/constants/colors';
import { FontFamily, FontSize } from '../../src/constants/typography';
import { Spacing, BorderRadius, Shadow } from '../../src/constants/spacing';

export default function QRScanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [scanned, setScanned] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  if (permissionDenied) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.base }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quét mã QR</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={styles.permissionContent}>
          <Text style={styles.permIcon}>📷</Text>
          <Text style={styles.permTitle}>Cần quyền truy cập camera</Text>
          <Text style={styles.permDesc}>
            VKU StudyHub cần quyền camera để quét mã QR tài liệu. Tính năng này không thu thập ảnh hay video của bạn.
          </Text>
          <TouchableOpacity style={styles.permBtn} onPress={() => setPermissionDenied(false)}>
            <LinearGradient colors={['#FED014', '#E5B800']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.permGrad}>
              <Text style={styles.permBtnText}>Cấp quyền camera</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.permSkip}>Không, để sau</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (scanned) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.base }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quét thành công!</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={styles.successContent}>
          <View style={styles.successIcon}>
            <Text style={styles.successEmoji}>✅</Text>
          </View>
          <Text style={styles.successTitle}>Đã lưu tài liệu!</Text>
          <View style={styles.savedDocCard}>
            <View style={styles.savedDocIcon}>
              <Text style={styles.savedDocIconEmoji}>📄</Text>
            </View>
            <View>
              <Text style={styles.savedDocName}>Đề cương CSDL 2024</Text>
              <Text style={styles.savedDocMeta}>PDF · 2.4MB · Cơ sở dữ liệu</Text>
              <Text style={styles.savedDocStatus}>✅ Đã lưu vào "Tài liệu của tôi"</Text>
            </View>
          </View>
          <View style={styles.successActions}>
            <TouchableOpacity onPress={() => router.push('/docs/view')} style={styles.viewBtn}>
              <LinearGradient colors={['#374F8A', '#243660']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.viewGrad}>
                <Text style={styles.viewText}>Xem ngay</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setScanned(false)} style={styles.scanMoreBtn}>
              <Text style={styles.scanMoreText}>📷 Quét thêm</Text>
            </TouchableOpacity>
          </View>
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
        <Text style={styles.headerTitle}>Quét mã QR</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Camera viewfinder (mocked) */}
      <View style={styles.cameraView}>
        <LinearGradient colors={['#0F1629', '#0A0F1E']} style={styles.cameraGrad}>
          {/* Scan frame */}
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
            {/* Scan line */}
            <View style={styles.scanLine} />
          </View>

          <Text style={styles.cameraHint}>Hướng camera vào mã QR tài liệu</Text>

          {/* Demo button */}
          <TouchableOpacity
            onPress={() => setScanned(true)}
            style={styles.demoScanBtn}
          >
            <LinearGradient
              colors={['#FED014', '#E5B800']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.demoScanGrad}
            >
              <Text style={styles.demoScanText}>📷 Demo: Quét tài liệu mẫu</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setPermissionDenied(true)}
            style={styles.denyBtn}
          >
            <Text style={styles.denyText}>Xem màn hình từ chối quyền →</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
}

const CORNER_SIZE = 24;

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

  cameraView: { flex: 1 },
  cameraGrad: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.xl },
  scanFrame: {
    width: 240,
    height: 240,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: Colors.primary,
    borderWidth: 3,
  },
  cornerTL: { top: 0, left: 0, borderBottomWidth: 0, borderRightWidth: 0, borderTopLeftRadius: 4 },
  cornerTR: { top: 0, right: 0, borderBottomWidth: 0, borderLeftWidth: 0, borderTopRightRadius: 4 },
  cornerBL: { bottom: 0, left: 0, borderTopWidth: 0, borderRightWidth: 0, borderBottomLeftRadius: 4 },
  cornerBR: { bottom: 0, right: 0, borderTopWidth: 0, borderLeftWidth: 0, borderBottomRightRadius: 4 },
  scanLine: {
    position: 'absolute',
    width: 200,
    height: 2,
    backgroundColor: Colors.primary,
    opacity: 0.7,
  },
  cameraHint: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  demoScanBtn: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    ...Shadow.golden,
  },
  demoScanGrad: { paddingVertical: Spacing.md, paddingHorizontal: Spacing['2xl'], alignItems: 'center' },
  demoScanText: { fontFamily: FontFamily.bold, fontSize: FontSize.base, color: Colors.textInvert },
  denyBtn: { marginTop: Spacing.sm },
  denyText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textMuted },

  permissionContent: { flex: 1, padding: Spacing['2xl'], alignItems: 'center', justifyContent: 'center', gap: Spacing.xl },
  permIcon: { fontSize: 64 },
  permTitle: { fontFamily: FontFamily.extraBold, fontSize: FontSize['2xl'], color: Colors.textPrimary, textAlign: 'center' },
  permDesc: { fontFamily: FontFamily.regular, fontSize: FontSize.base, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  permBtn: { width: '100%', borderRadius: BorderRadius.full, overflow: 'hidden', ...Shadow.golden },
  permGrad: { paddingVertical: Spacing.lg, alignItems: 'center' },
  permBtnText: { fontFamily: FontFamily.bold, fontSize: FontSize.md, color: Colors.textInvert },
  permSkip: { fontFamily: FontFamily.medium, fontSize: FontSize.base, color: Colors.textMuted },

  successContent: { flex: 1, padding: Spacing['2xl'], alignItems: 'center', justifyContent: 'center', gap: Spacing.xl },
  successIcon: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.success,
  },
  successEmoji: { fontSize: 40 },
  successTitle: { fontFamily: FontFamily.extraBold, fontSize: FontSize['2xl'], color: Colors.textPrimary },
  savedDocCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.bgCard, borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.border, padding: Spacing.md, width: '100%',
  },
  savedDocIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(254, 208, 20, 0.1)', alignItems: 'center', justifyContent: 'center' },
  savedDocIconEmoji: { fontSize: 28 },
  savedDocName: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary },
  savedDocMeta: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textSecondary },
  savedDocStatus: { fontFamily: FontFamily.medium, fontSize: FontSize.xs, color: Colors.success },
  successActions: { flexDirection: 'row', gap: Spacing.md, width: '100%' },
  viewBtn: { flex: 1, borderRadius: BorderRadius.full, overflow: 'hidden', ...Shadow.accent },
  viewGrad: { paddingVertical: Spacing.md, alignItems: 'center' },
  viewText: { fontFamily: FontFamily.bold, fontSize: FontSize.base, color: Colors.white },
  scanMoreBtn: {
    flex: 1, paddingVertical: Spacing.md, borderRadius: BorderRadius.full,
    backgroundColor: Colors.bgCard, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center',
  },
  scanMoreText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary },
});
