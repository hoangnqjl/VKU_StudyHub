import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../src/constants/colors';
import { FontFamily, FontSize } from '../../src/constants/typography';
import { Spacing, BorderRadius, Shadow } from '../../src/constants/spacing';
import { Input } from '../../src/components/ui/Input';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <LinearGradient colors={['#0F1629', '#1A2540']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kav}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + Spacing['2xl'], paddingBottom: insets.bottom + Spacing['2xl'] }]}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          {!sent ? (
            <>
              <View style={styles.iconWrap}>
                <Text style={styles.iconEmoji}>🔑</Text>
              </View>
              <Text style={styles.title}>Quên mật khẩu?</Text>
              <Text style={styles.subtitle}>
                Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu.
              </Text>
              <Input
                label="Email"
                placeholder="sv123@vku.udn.vn"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                leftIcon={<Text style={{ fontSize: 16 }}>✉️</Text>}
              />
              <TouchableOpacity
                onPress={() => setSent(true)}
                disabled={!email}
                style={[styles.sendBtn, !email && { opacity: 0.5 }]}
              >
                <LinearGradient colors={['#FED014', '#E5B800']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.sendGrad}>
                  <Text style={styles.sendText}>Gửi link đặt lại</Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.sentState}>
              <View style={styles.sentIcon}><Text style={styles.sentEmoji}>📬</Text></View>
              <Text style={styles.sentTitle}>Email đã được gửi!</Text>
              <Text style={styles.sentDesc}>
                Kiểm tra hộp thư của <Text style={{ color: Colors.primary }}>{email}</Text> để đặt lại mật khẩu.
              </Text>
              <TouchableOpacity onPress={() => router.back()} style={styles.backToLogin}>
                <Text style={styles.backToLoginText}>← Quay lại đăng nhập</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  kav: { flex: 1 },
  scroll: { paddingHorizontal: Spacing['2xl'], gap: Spacing.xl },
  backBtn: { alignSelf: 'flex-start' },
  backText: { fontSize: 32, color: Colors.primary, lineHeight: 36 },
  iconWrap: { width: 80, height: 80, borderRadius: 24, backgroundColor: 'rgba(254, 208, 20, 0.15)', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderWidth: 2, borderColor: 'rgba(254, 208, 20, 0.3)' },
  iconEmoji: { fontSize: 40 },
  title: { fontFamily: FontFamily.extraBold, fontSize: FontSize['2xl'], color: Colors.textPrimary, textAlign: 'center' },
  subtitle: { fontFamily: FontFamily.regular, fontSize: FontSize.base, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  sendBtn: { borderRadius: BorderRadius.full, overflow: 'hidden', ...Shadow.golden },
  sendGrad: { paddingVertical: Spacing.lg, alignItems: 'center' },
  sendText: { fontFamily: FontFamily.bold, fontSize: FontSize.md, color: Colors.textInvert },
  sentState: { alignItems: 'center', gap: Spacing.xl },
  sentIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(34, 197, 94, 0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.success },
  sentEmoji: { fontSize: 40 },
  sentTitle: { fontFamily: FontFamily.extraBold, fontSize: FontSize['2xl'], color: Colors.textPrimary },
  sentDesc: { fontFamily: FontFamily.regular, fontSize: FontSize.base, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  backToLogin: { marginTop: Spacing.md },
  backToLoginText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.primary },
});
