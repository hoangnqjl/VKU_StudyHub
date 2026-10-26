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

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        router.replace('/(auth)/onboarding');
      }, 1200);
    }
  };

  return (
    <LinearGradient colors={['#0F1629', '#1A2540']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kav}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + Spacing['2xl'], paddingBottom: insets.bottom + Spacing['2xl'] }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity onPress={() => (step > 1 ? setStep(step - 1) : router.back())} style={styles.backBtn}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          {/* Step indicator */}
          <View style={styles.stepRow}>
            <View style={[styles.stepDot, step >= 1 && styles.stepActive]} />
            <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />
            <View style={[styles.stepDot, step >= 2 && styles.stepActive]} />
          </View>

          <Text style={styles.title}>
            {step === 1 ? 'Tạo tài khoản 🎓' : 'Đặt mật khẩu 🔐'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 1
              ? 'Nhập thông tin sinh viên của bạn'
              : 'Đặt mật khẩu an toàn cho tài khoản'}
          </Text>

          <View style={styles.form}>
            {step === 1 ? (
              <>
                <Input
                  label="Họ và tên"
                  placeholder="Nguyễn Văn A"
                  value={fullName}
                  onChangeText={setFullName}
                  leftIcon={<Text style={styles.icon}>👤</Text>}
                />
                <Input
                  label="Email sinh viên"
                  placeholder="sv123@vku.udn.vn"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  leftIcon={<Text style={styles.icon}>✉️</Text>}
                />
                <View style={styles.vkuHint}>
                  <Text style={styles.vkuHintIcon}>💡</Text>
                  <Text style={styles.vkuHintText}>
                    Email <Text style={{ color: Colors.primary }}>@vku.udn.vn</Text> được xác thực tự động là sinh viên VKU
                  </Text>
                </View>
              </>
            ) : (
              <>
                <Input
                  label="Mật khẩu"
                  placeholder="Ít nhất 8 ký tự"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  leftIcon={<Text style={styles.icon}>🔒</Text>}
                />
                <Input
                  label="Xác nhận mật khẩu"
                  placeholder="Nhập lại mật khẩu"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  leftIcon={<Text style={styles.icon}>🔐</Text>}
                  error={confirmPassword && password !== confirmPassword ? 'Mật khẩu không khớp' : undefined}
                />
              </>
            )}

            <TouchableOpacity
              onPress={handleNext}
              disabled={loading}
              activeOpacity={0.85}
              style={styles.nextBtn}
            >
              <LinearGradient
                colors={['#FED014', '#E5B800']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.nextGradient}
              >
                <Text style={styles.nextText}>
                  {loading ? 'Đang xử lý...' : step === 1 ? 'Tiếp theo →' : 'Tạo tài khoản'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Google option */}
          <TouchableOpacity style={styles.googleBtn} activeOpacity={0.85}>
            <Text style={styles.googleIcon}>🔵</Text>
            <Text style={styles.googleText}>Đăng ký bằng Google</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.footerLink}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  kav: { flex: 1 },
  scroll: { paddingHorizontal: Spacing['2xl'], gap: Spacing.lg },
  backBtn: { alignSelf: 'flex-start' },
  backText: { fontSize: 32, color: Colors.primary, lineHeight: 36 },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    alignSelf: 'flex-start',
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.border,
  },
  stepActive: { backgroundColor: Colors.primary },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: Colors.border,
  },
  stepLineActive: { backgroundColor: Colors.primary },
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
  form: { gap: Spacing.base },
  icon: { fontSize: 16 },
  vkuHint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: 'rgba(254, 208, 20, 0.1)',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(254, 208, 20, 0.25)',
    padding: Spacing.md,
  },
  vkuHintIcon: { fontSize: 14 },
  vkuHintText: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  nextBtn: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginTop: Spacing.sm,
    shadowColor: '#FED014',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 10,
  },
  nextGradient: { paddingVertical: Spacing.lg, alignItems: 'center' },
  nextText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textInvert,
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
  },
  googleIcon: { fontSize: 20 },
  googleText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
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
});
