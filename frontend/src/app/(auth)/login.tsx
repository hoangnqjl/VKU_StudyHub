import { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useDesign } from '../../components/design-scale';
import { authService } from '../../services';
import { useAlert } from '../../components/AlertContext';
import { useLoading } from '../../components/LoadingContext';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';

// ====== Tài nguyên (cắt trực tiếp từ thiết kế Figma) ======
const IMG = {
  logo: require('../../../assets/images/vku-logo.png'),
  google: require('../../../assets/images/google.png'),
  help: require('../../../assets/images/ic-help.png'),
  arrow: require('../../../assets/images/ic-arrow.png'),
  arrowWhite: require('../../../assets/images/ic-arrow-white.png'),
  idcard: require('../../../assets/images/ic-idcard.png'),
  lock: require('../../../assets/images/ic-lock.png'),
  eye: require('../../../assets/images/ic-eye.png'),
  headset: require('../../../assets/images/ic-headset.png'),
};

// ====== Màu đo từ ảnh thiết kế ======
const C = {
  primary: '#374F8A',
  body: '#64748B',
  label: '#475569',
  muted: '#94A3B8',
  inputBg: '#F9FBFD',
  soft: '#F8FAFC',
  line: '#F1F5F9',
  googleBorder: '#E8EDF3',
  white: '#FFFFFF',
};

const F = {
  regular: 'Inter_400Regular',
  semi: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extra: 'Inter_800ExtraBold',
};

export default function LoginScreen() {
  const { s, z } = useDesign(raw);
  const { showError, showSuccess } = useAlert();
  const { showLoading, hideLoading } = useLoading();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);


  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const scriptId = 'google-gsi-client';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      }
    }
  }, []);

  const proceedFallbackLogin = async (rawAcc: string) => {
    hideLoading();
    showError(
      'Cần cấu hình Google OAuth',
      'Tên miền Vercel này chưa được thêm vào Authorized JavaScript Origins trong Google Cloud Console. Vui lòng đăng nhập bằng Mã SV/Mật khẩu hoặc Đăng ký tài khoản.'
    );
  };

  const handleGoogleLogin = async () => {
    const rawAcc = account.trim().toLowerCase();

    // Kiểm tra định dạng nếu người dùng tự nhập email khác đuôi @vku.udn.vn
    if (rawAcc.includes('@') && !rawAcc.endsWith('@vku.udn.vn')) {
      showError(
        'Từ chối truy cập',
        'Chỉ tài khoản Google sinh viên/cán bộ VKU (@vku.udn.vn) mới được phép đăng nhập vào hệ thống!'
      );
      return;
    }

    // Trên nền tảng Web: Kích hoạt Google Identity Services OAuth Popup
    if (Platform.OS === 'web' && typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      try {
        showLoading('Đang mở cổng xác thực Google VKU...');
        (window as any).google.accounts.id.initialize({
          client_id: '404919884065-kgl77t0ilvu9034lie0grgqhqs17hmlq.apps.googleusercontent.com',
          hosted_domain: 'vku.udn.vn',
          callback: async (credentialResponse: any) => {
            if (!credentialResponse?.credential) {
              proceedFallbackLogin(rawAcc);
              return;
            }
            try {
              const base64Url = credentialResponse.credential.split('.')[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
              const payload = JSON.parse(jsonPayload);

              if (!payload.email || !payload.email.toLowerCase().endsWith('@vku.udn.vn')) {
                hideLoading();
                showError('Từ chối truy cập', 'Tài khoản Google đã chọn không thuộc miền @vku.udn.vn!');
                return;
              }

              const res = await authService.loginWithGoogle({
                email: payload.email,
                idToken: credentialResponse.credential,
                fullName: payload.name,
                avatarUrl: payload.picture
              });
              hideLoading();
              showSuccess('Đăng nhập thành công', `Chào mừng ${res.user?.fullName || payload.name} đến với VKU StudyHub!`);
              setTimeout(() => router.replace('/home' as any), 500);
            } catch (err: any) {
              hideLoading();
              showError('Lỗi đăng nhập', err.message || 'Không thể xác thực tài khoản Google với máy chủ VKU.');
            }
          }
        });

        (window as any).google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            proceedFallbackLogin(rawAcc);
          }
        });
        return;
      } catch {
        // Fallback
      }
    }

    proceedFallbackLogin(rawAcc);
  };

  const handleLogin = async () => {
    const acc = account.trim();
    const pwd = password.trim();
    if (!acc || !pwd) {
      showError('Thiếu thông tin', 'Vui lòng nhập đầy đủ mã sinh viên/email và mật khẩu.');
      return;
    }
    try {
      showLoading('Đang xác thực tài khoản VKU...');
      await authService.login(acc, pwd);
      hideLoading();
      router.replace('/home' as any);
    } catch (err: any) {
      hideLoading();
      showError('Đăng nhập thất bại', err.message || 'Mật khẩu không chính xác hoặc tài khoản không tồn tại.');
    }
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ===== Header ===== */}
          <View style={s.header}>
            <View style={s.brand}>
              <Image source={IMG.logo} style={s.logo} />
              <Text style={s.brandName}>Study Hub</Text>
            </View>
            <Pressable style={s.helpBtn}>
              <Image source={IMG.help} style={s.helpIcon} />
            </Pressable>
          </View>

          {/* ===== Tiêu đề ===== */}
          <Text style={s.title}>Chào bạn trở lại!</Text>
          <Text style={s.subtitle}>
            Đăng nhập để vào giảng đường số & kết nối bạn học VKU.
          </Text>

          {/* ===== Nút Google ===== */}
          <Pressable style={s.googleBtn} onPress={handleGoogleLogin}>
            <Image source={IMG.google} style={s.googleIcon} />
            <Text
              style={s.googleText}
              numberOfLines={1}
            >
              Tiếp tục với Google (@vku.udn.vn)
            </Text>
            <View style={s.arrowCircle}>
              <Image source={IMG.arrow} style={s.arrowIcon} />
            </View>
          </Pressable>

          {/* ===== Đường kẻ ===== */}
          <View style={s.dividerRow}>
            <View style={s.dividerLine} />
            <Text style={s.dividerText}>HOẶC TÀI KHOẢN SINH VIÊN</Text>
            <View style={s.dividerLine} />
          </View>

          {/* ===== Mã sinh viên / Email ===== */}
          <Text style={[s.label, { marginTop: z(25.75) }]}>
            Mã sinh viên hoặc Email VKU
          </Text>
          <View style={[s.inputWrap, { marginTop: z(7.25) }]}>
            <View style={s.leftIconBox}>
              <Image source={IMG.idcard} style={{ width: z(19), height: z(19) }} />
            </View>
            <TextInput
              style={s.input}
              placeholder="ma-sinh-vien@vku.udn.vn"
              placeholderTextColor={C.muted}
              value={account}
              onChangeText={setAccount}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
          </View>

          {/* ===== Mật khẩu ===== */}
          <Text style={[s.label, { marginTop: z(16.25) }]}>Mật khẩu</Text>
          <View style={[s.inputWrap, { marginTop: z(7.25) }]}>
            <View style={s.leftIconBox}>
              <Image source={IMG.lock} style={{ width: z(15.5), height: z(20) }} />
            </View>
            <TextInput
              style={[s.input, password.length === 0 && s.dotsPlaceholder]}
              placeholder="••••••••••••"
              placeholderTextColor={C.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              onSubmitEditing={handleLogin}
              returnKeyType="go"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={12}>
              <Image
                source={IMG.eye}
                style={[{ width: z(21), height: z(14.5) }, showPassword && { opacity: 0.55 }]}
              />
            </Pressable>
          </View>

          {/* ===== Ghi nhớ + Quên mật khẩu ===== */}
          <View style={s.optionsRow}>
            <Pressable style={s.remember} onPress={() => setRemember((v) => !v)}>
              <View style={[s.checkbox, !remember && s.checkboxOff]} />
              <Text style={s.rememberText}>Ghi nhớ đăng nhập</Text>
            </Pressable>
            <Pressable>
              <Text style={s.forgot}>Quên mật khẩu?</Text>
            </Pressable>
          </View>

          {/* ===== Nút Đăng nhập ===== */}
          <Pressable
            style={({ pressed }) => [s.loginBtn, pressed && { opacity: 0.92 }]}
            onPress={handleLogin}
          >
            <Text style={s.loginText}>Đăng nhập</Text>
            <Image source={IMG.arrowWhite} style={s.loginArrow} />
          </Pressable>

          {/* ===== Footer ===== */}
          <View style={s.spacer} />
          <Text style={s.footerText}>
            Chưa có tài khoản sinh viên?{'  '}
            <Text style={s.footerLink} onPress={() => router.push('/register' as any)}>
              Đăng ký ngay
            </Text>
          </Text>
          <View style={s.supportPill}>
            <Image source={IMG.headset} style={{ width: z(16), height: z(14.5) }} />
            <Text style={s.supportText}>Hỗ trợ kỹ thuật: ict@vku.udn.vn</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const raw = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.white },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 15,
    paddingBottom: 8,
  },

  // Header (cao 40)
  header: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 56.5, height: 33, marginLeft: 0.5 },
  brandName: {
    marginLeft: 13,
    fontFamily: F.bold,
    fontSize: 19.5,
    lineHeight: 24,
    letterSpacing: -0.4,
    color: C.primary,
  },
  helpBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.soft,
    borderWidth: 1,
    borderColor: C.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpIcon: { width: 19, height: 19 },

  // Tiêu đề
  title: {
    marginTop: 27.25,
    fontFamily: F.extra,
    fontSize: 26.5,
    lineHeight: 32,
    letterSpacing: -0.8,
    color: C.primary,
  },
  subtitle: {
    marginTop: 6,
    fontFamily: F.regular,
    fontSize: 13,
    lineHeight: 18.25,
    color: C.body,
  },

  // Nút Google (cao 54.5)
  googleBtn: {
    marginTop: 24.75,
    height: 54.5,
    borderRadius: 27.25,
    borderWidth: 1,
    borderColor: C.googleBorder,
    backgroundColor: C.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 21,
    shadowColor: '#0F172A',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  googleIcon: { width: 22, height: 22.5 },
  googleText: {
    flex: 1,
    marginLeft: 12.5,
    marginRight: 8,
    fontFamily: F.semi,
    fontSize: 14.5,
    lineHeight: 20,
    color: C.primary,
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowIcon: { width: 14, height: 14.5 },

  // Đường kẻ "HOẶC..."
  dividerRow: {
    marginTop: 23.5,
    height: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.line },
  dividerText: {
    marginHorizontal: 17,
    fontFamily: F.semi,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.8,
    color: C.muted,
  },

  // Label + ô nhập
  label: {
    marginLeft: 12,
    fontFamily: F.semi,
    fontSize: 12.5,
    lineHeight: 16,
    color: C.label,
  },
  inputWrap: {
    height: 52.5,
    borderRadius: 26.25,
    backgroundColor: C.inputBg,
    borderWidth: 1,
    borderColor: C.line,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 19.5,
  },
  leftIconBox: { width: 19, alignItems: 'flex-start', justifyContent: 'center' },
  input: {
    flex: 1,
    height: '100%',
    marginLeft: 12,
    padding: 0,
    fontFamily: F.regular,
    fontSize: 14.5,
    color: C.label,
  },
  dotsPlaceholder: { fontSize: 11, letterSpacing: 1.2 },

  // Ghi nhớ / Quên mật khẩu
  optionsRow: {
    marginTop: 17,
    height: 20,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  remember: { flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 5.5,
    backgroundColor: C.primary,
  },
  checkboxOff: {
    backgroundColor: C.white,
    borderWidth: 1.5,
    borderColor: C.muted,
  },
  rememberText: {
    marginLeft: 10,
    fontFamily: F.regular,
    fontSize: 13,
    lineHeight: 18,
    color: C.label,
  },
  forgot: {
    fontFamily: F.semi,
    fontSize: 13,
    lineHeight: 18,
    color: C.primary,
  },

  // Nút Đăng nhập (cao 52)
  loginBtn: {
    marginTop: 27.5,
    height: 52,
    borderRadius: 26,
    backgroundColor: C.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  loginText: {
    fontFamily: F.semi,
    fontSize: 14.5,
    lineHeight: 20,
    color: C.white,
  },
  loginArrow: { width: 14.5, height: 14, marginLeft: 8 },

  // Footer
  spacer: { flexGrow: 1, minHeight: 24 },
  footerText: {
    textAlign: 'center',
    fontFamily: F.regular,
    fontSize: 13,
    lineHeight: 16,
    color: C.body,
  },
  footerLink: { fontFamily: F.bold, color: C.primary },
  supportPill: {
    marginTop: 17.25,
    alignSelf: 'center',
    height: 31,
    borderRadius: 15.5,
    backgroundColor: C.soft,
    borderWidth: 1,
    borderColor: C.line,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  supportText: {
    marginLeft: 7,
    fontFamily: F.regular,
    fontSize: 12,
    lineHeight: 16,
    color: C.body,
  },
});