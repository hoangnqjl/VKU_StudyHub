import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../src/constants/colors';
import { FontFamily, FontSize } from '../../src/constants/typography';
import { Spacing, BorderRadius, Shadow } from '../../src/constants/spacing';

export default function JoinRoomScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState('');

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.base }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vào phòng</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={[styles.content, { paddingBottom: insets.bottom + Spacing['3xl'] }]}>
        <View style={styles.iconWrap}>
          <LinearGradient
            colors={['#DF0218', '#B50114']}
            style={styles.iconGrad}
          >
            <Text style={styles.icon}>⏱️</Text>
          </LinearGradient>
        </View>

        <Text style={styles.title}>Nhập mã phòng</Text>
        <Text style={styles.subtitle}>Mã phòng gồm 6-8 ký tự, chủ phòng cung cấp</Text>

        <View style={styles.codeInputWrap}>
          <TextInput
            style={styles.codeInput}
            placeholder="VD: CSDL-3A"
            placeholderTextColor={Colors.textMuted}
            value={code}
            onChangeText={(t) => setCode(t.toUpperCase())}
            autoCapitalize="characters"
            maxLength={8}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            router.back();
            router.push('/pomodoro/room');
          }}
          disabled={code.length < 4}
          style={[styles.joinBtn, code.length < 4 && { opacity: 0.5 }]}
        >
          <LinearGradient
            colors={['#DF0218', '#B50114']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.joinGrad}
          >
            <Text style={styles.joinText}>Vào phòng →</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>hoặc</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.qrBtn}>
          <Text style={styles.qrBtnIcon}>📷</Text>
          <Text style={styles.qrBtnText}>Quét mã QR phòng</Text>
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
  },
  closeBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bgCard, borderRadius: 10 },
  closeText: { fontSize: 16, color: Colors.textSecondary },
  headerTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.md, color: Colors.textPrimary },
  content: {
    flex: 1,
    padding: Spacing['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    overflow: 'hidden',
    ...Shadow.danger,
  },
  iconGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 40 },
  title: { fontFamily: FontFamily.extraBold, fontSize: FontSize['2xl'], color: Colors.textPrimary },
  subtitle: { fontFamily: FontFamily.regular, fontSize: FontSize.base, color: Colors.textSecondary, textAlign: 'center' },
  codeInputWrap: {
    width: '100%',
    backgroundColor: Colors.bgInput,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.lg,
  },
  codeInput: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize['3xl'],
    color: Colors.primary,
    textAlign: 'center',
    letterSpacing: 8,
  },
  joinBtn: {
    width: '100%',
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    ...Shadow.danger,
  },
  joinGrad: { paddingVertical: Spacing.lg, alignItems: 'center' },
  joinText: { fontFamily: FontFamily.bold, fontSize: FontSize.md, color: Colors.white },
  divider: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, width: '100%' },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textMuted },
  qrBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  qrBtnIcon: { fontSize: 20 },
  qrBtnText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary },
});
