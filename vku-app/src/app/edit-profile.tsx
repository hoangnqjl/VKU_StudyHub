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
import { useDesign } from '../components/design-scale';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';

// ====== Tài nguyên (dùng chung với các trang trước) ======
const IMG = {
  avatar: require('../../assets/images/avatar.png'),
  back: require('../../assets/images/ic-back.png'),
  pencil: require('../../assets/images/ic-pencil.png'),
  person: require('../../assets/images/ic-person.png'),
  mail: require('../../assets/images/ic-mail.png'),
  idcard: require('../../assets/images/ic-idcard.png'),
  capMuted: require('../../assets/images/ic-cap-muted.png'),
  chevron: require('../../assets/images/ic-chevron-down.png'),
  lock: require('../../assets/images/ic-lock.png'),
  book: require('../../assets/images/ic-book.png'),
  plusWhite: require('../../assets/images/ic-plus-white.png'),
  check: require('../../assets/images/ic-check-white.png'),
  plusGray: require('../../assets/images/ic-plus-gray.png'),
  target: require('../../assets/images/ic-target.png'),
  layers: require('../../assets/images/ic-layers.png'),
  trophy: require('../../assets/images/ic-trophy.png'),
  cap: require('../../assets/images/ic-cap.png'),
};

// ====== Màu (giống trang Hồ sơ) ======
const C = {
  primary: '#374F8A',
  ink: '#1E2E4F',
  body: '#64748B',
  muted: '#94A3B8',
  label: '#475569',
  line: '#F1F5F9',
  soft: '#F8FAFC',
  inputBg: '#FBFCFD',
  blue: '#EDF3FA',
  chipLight: '#F3F5FA',
  chipLightBorder: '#ECF0F6',
  cream: '#FFF8EA',
  yellowBg: '#FFF9E5',
  yellowBorder: '#FED014',
  radioOff: '#CBD5E1',
  white: '#FFFFFF',
};

const F = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semi: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extra: 'Inter_800ExtraBold',
};

const COURSES = [
  'Lập trình Web',
  'Cấu trúc dữ liệu & GT',
  'Mạng máy tính',
  'Trí tuệ nhân tạo',
  'Kỹ thuật phần mềm',
];

const GOALS = [
  {
    id: 'exam',
    title: 'Ôn thi cuối kỳ (Active)',
    sub: 'Ưu tiên tìm bạn luyện đề và chia sẻ tóm tắt',
    icon: IMG.layers,
    iconSize: { width: 15, height: 14 },
  },
  {
    id: 'hackathon',
    title: 'Tìm nhóm Hackathon VKU',
    sub: 'Cần Frontend UI và lập trình AI',
    icon: IMG.trophy,
    iconSize: { width: 13, height: 12 },
  },
  {
    id: 'thesis',
    title: 'Đồ án tốt nghiệp / Khóa luận',
    sub: 'Tập trung nghiên cứu chuyên sâu',
    icon: IMG.cap,
    iconSize: { width: 13, height: 11 },
  },
];

export default function EditProfileScreen() {
  const { s, z } = useDesign(raw);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  const [fullName, setFullName] = useState('Quang Hoàng');
  const [email, setEmail] = useState('quanghoang.23itb063@vku.udn.vn');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([
    'Lập trình Web',
    'Cấu trúc dữ liệu & GT',
    'Mạng máy tính',
  ]);
  const [goal, setGoal] = useState('exam');

  if (!fontsLoaded) return null;

  const toggleCourse = (name: string) =>
    setSelectedCourses((cur) =>
      cur.includes(name) ? cur.filter((c) => c !== name) : [...cur, name]
    );

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/profile' as any);
  };

  const handleSave = () => {
    // TODO: gọi API cập nhật hồ sơ ở đây
    goBack();
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
            <Pressable style={s.circleBtn} onPress={goBack}>
              <Image source={IMG.back} style={{ width: z(9), height: z(12.5) }} />
            </Pressable>
            <Text style={s.headerTitle}>Chỉnh sửa hồ sơ</Text>
            <View style={s.circleSpacer} />
          </View>

          {/* ===== Ảnh đại diện ===== */}
          <View style={s.avatarWrap}>
            <View style={s.avatarRing}>
              <Image source={IMG.avatar} style={s.avatar} />
            </View>
            <Pressable style={s.avatarBadge}>
              <Image source={IMG.pencil} style={{ width: z(14), height: z(14) }} />
            </Pressable>
          </View>
          <Text style={s.changePhoto}>Đổi ảnh đại diện</Text>

          {/* ===== Thông tin cá nhân ===== */}
          <View style={[s.card, s.sectionCard]}>
            <View style={s.sectionHeader}>
              <View style={[s.iconCircle, { backgroundColor: C.blue }]}>
                <Image source={IMG.pencil} style={{ width: z(13), height: z(13) }} />
              </View>
              <View style={s.sectionText}>
                <Text style={s.sectionTitle}>Thông tin cá nhân</Text>
                <Text style={s.sectionSub}>Hiển thị trên hồ sơ & Radar bạn bè</Text>
              </View>
            </View>

            <Text style={[s.label, { marginTop: z(14) }]}>Họ và tên</Text>
            <View style={[s.inputWrap, { marginTop: z(6) }]}>
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

            <Text style={[s.label, { marginTop: z(12) }]}>Email VKU</Text>
            <View style={[s.inputWrap, { marginTop: z(6) }]}>
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
          </View>

          {/* ===== Thông tin học tập ===== */}
          <View style={[s.card, s.sectionCard]}>
            <View style={s.sectionHeader}>
              <View style={[s.iconCircle, { backgroundColor: C.blue }]}>
                <Image source={IMG.cap} style={{ width: z(13), height: z(11) }} />
              </View>
              <View style={s.sectionText}>
                <Text style={s.sectionTitle}>Thông tin học tập</Text>
                <Text style={s.sectionSub}>Dùng để xác thực sinh viên VKU</Text>
              </View>
            </View>

            <Text style={[s.label, { marginTop: z(14) }]}>Mã số sinh viên</Text>
            <View style={[s.inputWrap, s.inputLocked, { marginTop: z(6) }]}>
              <View style={s.leftIconBox}>
                <Image source={IMG.idcard} style={{ width: z(19), height: z(19) }} />
              </View>
              <Text style={[s.input, s.lockedText]}>23IT.B063</Text>
              <Image source={IMG.lock} style={{ width: z(12), height: z(15.5) }} />
            </View>

            <Text style={[s.label, { marginTop: z(12) }]}>Khoa</Text>
            <Pressable style={[s.inputWrap, { marginTop: z(6) }]}>
              <View style={s.leftIconBox}>
                <Image source={IMG.capMuted} style={{ width: z(20.5), height: z(17) }} />
              </View>
              <Text style={s.selectText}>Khoa khoa học máy tính</Text>
              <Image source={IMG.chevron} style={{ width: z(17.5), height: z(14) }} />
            </Pressable>

            <Text style={[s.label, { marginTop: z(12) }]}>Khóa học</Text>
            <Pressable style={[s.inputWrap, { marginTop: z(6) }]}>
              <View style={s.leftIconBox}>
                <Image source={IMG.capMuted} style={{ width: z(20.5), height: z(17) }} />
              </View>
              <Text style={s.selectText}>Khóa 2023 (K23)</Text>
              <Image source={IMG.chevron} style={{ width: z(17.5), height: z(14) }} />
            </Pressable>
          </View>

          {/* ===== Môn đang học trong kỳ ===== */}
          <View style={[s.card, s.sectionCard]}>
            <View style={s.sectionHeader}>
              <View style={[s.iconCircle, { backgroundColor: C.blue }]}>
                <Image source={IMG.book} style={{ width: z(13), height: z(11.5) }} />
              </View>
              <View style={s.sectionText}>
                <Text style={s.sectionTitle}>Môn đang học trong kỳ</Text>
                <Text style={s.sectionSub}>Tối ưu gợi ý Radar & Kho tài liệu</Text>
              </View>
              <Pressable style={s.addBtn}>
                <Image source={IMG.plusWhite} style={{ width: z(8), height: z(8.5) }} />
                <Text style={s.addText}>Thêm</Text>
              </Pressable>
            </View>

            <View style={s.chips}>
              {COURSES.map((name) => {
                const on = selectedCourses.includes(name);
                return (
                  <Pressable
                    key={name}
                    onPress={() => toggleCourse(name)}
                    style={[s.chip, on ? s.chipOn : s.chipOff]}
                  >
                    <Text style={[s.chipText, on ? s.chipTextOn : s.chipTextOff]}>
                      {name}
                    </Text>
                    <Image
                      source={on ? IMG.check : IMG.plusGray}
                      style={on ? s.checkIcon : s.plusIcon}
                    />
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* ===== Mục tiêu học tập ===== */}
          <View style={[s.card, s.sectionCard]}>
            <View style={s.sectionHeader}>
              <View style={[s.iconCircle, { backgroundColor: C.cream }]}>
                <Image source={IMG.target} style={{ width: z(15), height: z(15) }} />
              </View>
              <View style={s.sectionText}>
                <Text style={s.sectionTitle}>Mục tiêu học tập</Text>
                <Text style={s.sectionSub}>Phát tín hiệu ưu tiên trên Radar bạn bè</Text>
              </View>
            </View>

            <View style={s.goals}>
              {GOALS.map((g) => {
                const active = goal === g.id;
                return (
                  <Pressable
                    key={g.id}
                    onPress={() => setGoal(g.id)}
                    style={[s.goal, active ? s.goalActive : s.goalIdle]}
                  >
                    <View
                      style={[
                        s.goalIcon,
                        { backgroundColor: active ? C.white : C.blue },
                      ]}
                    >
                      <Image
                        source={g.icon}
                        style={{ width: z(g.iconSize.width), height: z(g.iconSize.height) }}
                      />
                    </View>
                    <View style={s.goalText}>
                      <Text style={s.goalTitle}>{g.title}</Text>
                      <Text style={s.goalSub}>{g.sub}</Text>
                    </View>
                    <View style={[s.radio, active && { borderColor: C.primary }]}>
                      {active && <View style={s.radioDot} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* ===== Nút Lưu ===== */}
          <Pressable
            style={({ pressed }) => [s.saveBtn, pressed && { opacity: 0.92 }]}
            onPress={handleSave}
          >
            <Image source={IMG.check} style={{ width: z(12), height: z(9.5) }} />
            <Text style={s.saveText}>Lưu thay đổi</Text>
          </Pressable>

          <Text style={s.footerText}>
            Không muốn thay đổi?{'  '}
            <Text style={s.footerLink} onPress={goBack}>
              Hủy bỏ
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const cardShadow = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.05,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 1,
} as const;

const raw = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.white },
  scroll: { paddingHorizontal: 18, paddingTop: 15, paddingBottom: 32 },

  // Header (cao 40) — giống trang Hồ sơ
  header: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circleBtn: {
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
  circleSpacer: { width: 40, height: 40 },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    paddingBottom: 4,
    fontFamily: F.extra,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -1,
    color: C.ink,
  },

  // Ảnh đại diện
  avatarWrap: {
    marginTop: 22,
    alignSelf: 'center',
    width: 92,
    height: 92,
  },
  avatarRing: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.line,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  avatar: { width: 98, height: 98 },
  avatarBadge: {
    position: 'absolute',
    right: -2,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.line,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  changePhoto: {
    marginTop: 10,
    textAlign: 'center',
    fontFamily: F.semi,
    fontSize: 13,
    lineHeight: 18,
    color: C.primary,
  },

  // Khung thẻ chung
  card: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.line,
    ...cardShadow,
  },

  // Thẻ mục — giống trang Hồ sơ
  sectionCard: {
    marginTop: 16,
    borderRadius: 32,
    paddingTop: 14.5,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 36.5,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionText: { flex: 1, marginLeft: 10 },
  sectionTitle: {
    fontFamily: F.extra,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.3,
    color: C.ink,
  },
  sectionSub: {
    marginTop: 0.5,
    fontFamily: F.regular,
    fontSize: 12.5,
    lineHeight: 16,
    color: C.muted,
  },
  addBtn: {
    height: 30.5,
    borderRadius: 15.25,
    paddingHorizontal: 15,
    backgroundColor: C.primary,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  addText: {
    marginLeft: 6,
    fontFamily: F.semi,
    fontSize: 13,
    lineHeight: 18,
    color: C.white,
  },

  // Ô nhập — giống trang Đăng ký / Đăng nhập
  label: {
    marginLeft: 12,
    fontFamily: F.semi,
    fontSize: 12.5,
    lineHeight: 16,
    color: C.label,
  },
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
  inputLocked: { backgroundColor: C.soft },
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
  lockedText: { textAlignVertical: 'center', lineHeight: 48, color: C.muted },
  selectText: {
    flex: 1,
    marginLeft: 12.75,
    fontFamily: F.medium,
    fontSize: 13.75,
    lineHeight: 20,
    color: C.primary,
  },

  // Chip môn học (cao 32) — giống trang Hồ sơ
  chips: {
    marginTop: 16.5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 7,
    rowGap: 8,
  },
  chip: {
    height: 32,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipOn: {
    backgroundColor: C.primary,
    paddingLeft: 15,
    paddingRight: 16,
  },
  chipOff: {
    backgroundColor: C.chipLight,
    borderWidth: 1,
    borderColor: C.chipLightBorder,
    paddingLeft: 14,
    paddingRight: 15,
  },
  chipText: { fontSize: 13, lineHeight: 18 },
  chipTextOn: { fontFamily: F.semi, color: C.white },
  chipTextOff: { fontFamily: F.medium, color: C.label },
  checkIcon: { width: 12, height: 9.5, marginLeft: 8.5 },
  plusIcon: { width: 10, height: 10.5, marginLeft: 8.5 },

  // Mục tiêu — giống trang Hồ sơ
  goals: { marginTop: 11.25, rowGap: 11 },
  goal: {
    minHeight: 65,
    borderRadius: 22,
    paddingVertical: 13,
    paddingLeft: 14,
    paddingRight: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalActive: {
    backgroundColor: C.yellowBg,
    borderWidth: 1.5,
    borderColor: C.yellowBorder,
  },
  goalIdle: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.line,
  },
  goalIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalText: { flex: 1, marginLeft: 11.5, marginRight: 16 },
  goalTitle: {
    fontFamily: F.bold,
    fontSize: 13,
    lineHeight: 19,
    color: C.ink,
  },
  goalSub: {
    marginTop: 0.5,
    fontFamily: F.regular,
    fontSize: 12.5,
    lineHeight: 17,
    color: C.body,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: C.radioOff,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.primary,
  },

  // Nút Lưu (cao 52) — giống nút Đăng nhập
  saveBtn: {
    marginTop: 24,
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
  saveText: {
    marginLeft: 8,
    fontFamily: F.semi,
    fontSize: 14.5,
    lineHeight: 20,
    color: C.white,
  },
  footerText: {
    marginTop: 20,
    textAlign: 'center',
    fontFamily: F.regular,
    fontSize: 13,
    lineHeight: 16,
    color: C.body,
  },
  footerLink: { fontFamily: F.bold, color: C.primary },
});
