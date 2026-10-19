import { useState } from 'react';
import {
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
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';

// ====== Tài nguyên (cắt trực tiếp từ thiết kế Figma) ======
const IMG = {
  logo: require('../../../assets/images/vku-logo.png'),
  google: require('../../../assets/images/google.png'),
  back: require('../../../assets/images/ic-back-reg.png'),
  person: require('../../../assets/images/ic-person.png'),
  mail: require('../../../assets/images/ic-mail.png'),
  shield: require('../../../assets/images/ic-shield.png'),
  idcard: require('../../../assets/images/ic-idcard.png'),
  cap: require('../../../assets/images/ic-cap-muted.png'),
  chevron: require('../../../assets/images/ic-chevron-down.png'),
  lock: require('../../../assets/images/ic-lock.png'),
  history: require('../../../assets/images/ic-history-lock.png'),
  eye: require('../../../assets/images/ic-eye.png'),
  arrowWhite: require('../../../assets/images/ic-arrow-white.png'),
  check: require('../../../assets/images/ic-check-white.png'),
};

// ====== Màu đo từ ảnh thiết kế ======
const C = {
  primary: '#374F8A',
  body: '#64748B',
  label: '#475569',
  muted: '#94A3B8',
  inputBg: '#FBFCFD',
  line: '#F1F5F9',
  googleBorder: '#E8EDF3',
  ring: '#CBD5E1',
  white: '#FFFFFF',
};

const F = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semi: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extra: 'Inter_800ExtraBold',
};

export default function RegisterScreen() {
  const { s, z } = useDesign(raw);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mssv, setMssv] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);

  if (!fontsLoaded) return null;

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/login' as any);
  };

  const handleRegister = () => {
    // TODO: gọi API tạo tài khoản ở đây
    router.replace('/home' as any);
  };

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
            <Pressable style={s.backBtn} onPress={goBack}>
              <Image source={IMG.back} style={{ width: z(9), height: z(14) }} />
            </Pressable>
            <Image source={IMG.logo} style={s.logo} />
          </View>

          {/* ===== Tiêu đề ===== */}
          <Text style={s.title}>Tạo tài khoản mới</Text>
          <Text style={s.subtitle}>Tham gia cộng đồng học tập thông minh VKU</Text>

          {/* ===== Nút Google ===== */}
          <Pressable style={s.googleBtn}>
            <Image
              source={IMG.google}
              style={{ width: z(19.8), height: z(20.25) }}
            />
            <Text style={s.googleText}>Đăng ký nhanh qua VKU Google</Text>
          </Pressable>

          {/* ===== Đường kẻ ===== */}
          <View style={s.dividerRow}>
            <View style={s.dividerLine} />
            <Text style={s.dividerText}>HOẶC ĐĂNG KÝ BẰNG EMAIL</Text>
            <View style={s.dividerLine} />
          </View>

          {/* ===== Họ và tên ===== */}
          <View style={[s.inputWrap, { marginTop: z(20) }]}>
            <View style={s.leftIconBox}>
              <Image source={IMG.person} style={{ width: z(16), height: z(16) }} />
            </View>
            <TextInput
              style={s.input}
              placeholder="Họ và tên sinh viên"
              placeholderTextColor={C.muted}
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

          {/* ===== Email ===== */}
          <View style={[s.inputWrap, { marginTop: z(14) }]}>
            <View style={s.leftIconBox}>
              <Image source={IMG.mail} style={{ width: z(19), height: z(16) }} />
            </View>
            <TextInput
              style={s.input}
              placeholder="tensv.mssv@vku.udn.vn"
              placeholderTextColor={C.muted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
          </View>

          {/* ===== Dòng gợi ý ===== */}
          <View style={s.hintRow}>
            <Image source={IMG.shield} style={{ width: z(11.5), height: z(13.5) }} />
            <Text style={s.hintText}>
              Sử dụng định dạng chính thức: <Text style={s.hintLink}>@vku.udn.vn</Text>
            </Text>
          </View>

          {/* ===== MSSV + Khóa học ===== */}
          <View style={s.twoCols}>
            <View style={[s.inputWrap, { flex: 1 }]}>
              <View style={s.leftIconBox}>
                <Image source={IMG.idcard} style={{ width: z(19), height: z(19) }} />
              </View>
              <TextInput
                style={s.input}
                placeholder="MSSV"
                placeholderTextColor={C.muted}
                value={mssv}
                onChangeText={setMssv}
                autoCapitalize="characters"
                autoCorrect={false}
              />
            </View>
            <Pressable style={[s.inputWrap, s.selectWrap, { flex: 1 }]}>
              <View style={s.leftIconBox}>
                <Image source={IMG.cap} style={{ width: z(20.5), height: z(17) }} />
              </View>
              <Text style={s.selectText}>Khóa học</Text>
              <Image
                source={IMG.chevron}
                style={{ width: z(17.5), height: z(14), marginBottom: z(6) }}
              />
            </Pressable>
          </View>

          {/* ===== Mật khẩu ===== */}
          <View style={[s.inputWrap, { marginTop: z(14) }]}>
            <View style={s.leftIconBox}>
              <Image source={IMG.lock} style={{ width: z(15.5), height: z(20) }} />
            </View>
            <TextInput
              style={s.input}
              placeholder="Mật khẩu"
              placeholderTextColor={C.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={12}>
              <Image
                source={IMG.eye}
                style={[
                  { width: z(21), height: z(14.5), marginBottom: z(7) },
                  showPassword && { opacity: 0.55 },
                ]}
              />
            </Pressable>
          </View>

          {/* ===== Xác nhận mật khẩu ===== */}
          <View style={[s.inputWrap, { marginTop: z(14) }]}>
            <View style={s.leftIconBox}>
              <Image source={IMG.history} style={{ width: z(19), height: z(19) }} />
            </View>
            <TextInput
              style={s.input}
              placeholder="Xác nhận mật khẩu"
              placeholderTextColor={C.muted}
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry={!showConfirm}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Pressable onPress={() => setShowConfirm((v) => !v)} hitSlop={12}>
              <Image
                source={IMG.eye}
                style={[
                  { width: z(21), height: z(14.5), marginBottom: z(7) },
                  showConfirm && { opacity: 0.55 },
                ]}
              />
            </Pressable>
          </View>

          {/* ===== Đồng ý điều khoản ===== */}
          <Pressable style={s.agreeRow} onPress={() => setAgree((v) => !v)}>
            <View style={[s.checkbox, agree && s.checkboxOn]}>
              {agree && (
                <Image source={IMG.check} style={{ width: z(10), height: z(8) }} />
              )}
            </View>
            <Text style={s.agreeText}>
              Tôi đồng ý với <Text style={s.agreeLink}>Điều khoản dịch vụ</Text> và{' '}
              <Text style={s.agreeLink}>Chính sách bảo mật</Text>{' '}
              <Text style={s.agreeLink}>VKU</Text>
            </Text>
          </Pressable>

          {/* ===== Nút Tạo tài khoản ===== */}
          <Pressable
            style={({ pressed }) => [s.submitBtn, pressed && { opacity: 0.92 }]}
            onPress={handleRegister}
          >
            <Text style={s.submitText}>Tạo tài khoản</Text>
            <Image
              source={IMG.arrowWhite}
              style={{ width: z(12.75), height: z(12.3), marginLeft: z(10) }}
            />
          </Pressable>

          {/* ===== Footer ===== */}
          <Text style={s.footerText}>
            Đã có tài khoản?{'  '}
            <Text
              style={s.footerLink}
              onPress={() => router.replace('/login' as any)}
            >
              Đăng nhập ngay
            </Text>
          </Text>
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
    paddingTop: 11,
    paddingBottom: 24,
  },

  // Header (cao 40)
  header: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  logo: { width: 56.5, height: 33, marginRight: 1.5 },

  // Tiêu đề
  title: {
    marginTop: 20.25,
    fontFamily: F.extra,
    fontSize: 26.5,
    lineHeight: 32,
    letterSpacing: -0.8,
    color: C.primary,
  },
  subtitle: {
    marginTop: 3.75,
    fontFamily: F.regular,
    fontSize: 13.5,
    lineHeight: 18,
    color: C.body,
  },

  // Nút Google (cao 46)
  googleBtn: {
    marginTop: 21,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: C.googleBorder,
    backgroundColor: C.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  googleText: {
    marginLeft: 12,
    fontFamily: F.semi,
    fontSize: 14,
    lineHeight: 20,
    color: C.primary,
  },

  // Đường kẻ "HOẶC..."
  dividerRow: {
    marginTop: 20.5,
    height: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.line },
  dividerText: {
    marginHorizontal: 13,
    fontFamily: F.semi,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.8,
    color: C.muted,
  },

  // Ô nhập (cao 48)
  inputWrap: {
    height: 48,
    borderRadius: 24,
    backgroundColor: C.inputBg,
    borderWidth: 1,
    borderColor: C.line,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 16,
  },
  leftIconBox: { width: 20, alignItems: 'center', justifyContent: 'center' },
  input: {
    flex: 1,
    height: '100%',
    marginLeft: 12.75,
    padding: 0,
    fontFamily: F.regular,
    fontSize: 13.75,
    color: C.label,
  },
  selectWrap: { paddingRight: 12 },
  selectText: {
    flex: 1,
    marginLeft: 12.75,
    fontFamily: F.medium,
    fontSize: 13.75,
    lineHeight: 20,
    color: C.primary,
  },

  // Dòng gợi ý
  hintRow: {
    marginTop: 6,
    marginLeft: 12,
    height: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hintText: {
    marginLeft: 5.75,
    fontFamily: F.regular,
    fontSize: 12,
    lineHeight: 16,
    color: C.body,
  },
  hintLink: { fontFamily: F.semi, color: C.primary },

  // MSSV + Khóa học
  twoCols: {
    marginTop: 14.5,
    flexDirection: 'row',
    columnGap: 12,
  },

  // Đồng ý điều khoản
  agreeRow: {
    marginTop: 18.5,
    paddingLeft: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    marginTop: 1.4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.ring,
    backgroundColor: C.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: C.primary, borderColor: C.primary },
  agreeText: {
    flex: 1,
    marginLeft: 9.75,
    fontFamily: F.regular,
    fontSize: 12.5,
    lineHeight: 19.75,
    color: C.body,
  },
  agreeLink: { fontFamily: F.semi, color: C.primary },

  // Nút Tạo tài khoản (cao 49)
  submitBtn: {
    marginTop: 21.5,
    height: 49,
    borderRadius: 24.5,
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
  submitText: {
    fontFamily: F.semi,
    fontSize: 14.5,
    lineHeight: 20,
    color: C.white,
  },

  // Footer
  footerText: {
    marginTop: 25,
    textAlign: 'center',
    fontFamily: F.regular,
    fontSize: 13.5,
    lineHeight: 16,
    color: C.body,
  },
  footerLink: { fontFamily: F.bold, color: C.primary },
});