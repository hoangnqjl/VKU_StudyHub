import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../src/constants/colors';
import { FontFamily, FontSize } from '../../src/constants/typography';
import { Spacing, BorderRadius } from '../../src/constants/spacing';
import { Input } from '../../src/components/ui/Input';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    // TODO: Supabase auth
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)/home');
    }, 1200);
  };

  return (
    <LinearGradient colors={['#0F1629', '#1A2540']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + Spacing['2xl'], paddingBottom: insets.bottom + Spacing['2xl'] }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Chào mừng trở lại 👋</Text>
          <Text style={styles.subtitle}>Đăng nhập để tiếp tục học cùng nhóm</Text>

          {/* Google SSO */}
          <TouchableOpacity style={styles.googleBtn} activeOpacity={0.85}>
            <Text style={styles.googleIcon}>🔵</Text>
            <Text style={styles.googleText}>Tiếp tục với Google</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>hoặc</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email/Pass form */}
          <View style={styles.form}>
            <Input
              label="Email sinh viên"
              placeholder="sv123@vku.udn.vn"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              leftIcon={<Text style={styles.inputIcon}>✉️</Text>}
            />
            <Input
              label="Mật khẩu"
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Text style={styles.inputIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              }
            />

            <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')} style={styles.forgotRow}>
              <Text style={styles.forgotText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
              style={styles.loginBtn}
            >
              <LinearGradient
                colors={['#FED014', '#E5B800']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loginGradient}
              >
                <Text style={styles.loginText}>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.footerLink}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>

          {/* Info badge */}
          <View style={styles.infoBadge}>
            <Text style={styles.infoIcon}>🎓</Text>
            <Text style={styles.infoText}>
              Ưu tiên email{' '}
              <Text style={{ color: Colors.primary }}>@vku.udn.vn</Text>
              {' '}để xác thực sinh viên VKU
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  kav: { flex: 1 },
  scroll: {
    paddingHorizontal: Spacing['2xl'],
    gap: Spacing.lg,
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: Spacing.sm,
  },
  backText: {
    fontSize: 32,
    color: Colors.primary,
    lineHeight: 36,
  },
  title: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize['2xl'],
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    marginTop: -Spacing.sm,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  googleIcon: { fontSize: 20 },
  googleText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  form: { gap: Spacing.base },
  inputIcon: { fontSize: 16 },
  forgotRow: { alignSelf: 'flex-end' },
  forgotText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  loginBtn: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginTop: Spacing.sm,
    shadowColor: '#FED014',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 10,
  },
  loginGradient: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  loginText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textInvert,
    letterSpacing: 0.3,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  footerLink: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.primary,
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: 'rgba(55, 79, 138, 0.2)',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(55, 79, 138, 0.4)',
    padding: Spacing.md,
  },
  infoIcon: { fontSize: 16 },
  infoText: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
