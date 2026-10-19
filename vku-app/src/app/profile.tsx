import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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

// ====== Tài nguyên (cắt trực tiếp từ thiết kế Figma) ======
const IMG = {
  avatar: require('../../assets/images/avatar.png'),
  back: require('../../assets/images/ic-back.png'),
  gear: require('../../assets/images/ic-gear.png'),
  pencil: require('../../assets/images/ic-pencil.png'),
  book: require('../../assets/images/ic-book.png'),
  plusWhite: require('../../assets/images/ic-plus-white.png'),
  check: require('../../assets/images/ic-check-white.png'),
  plusGray: require('../../assets/images/ic-plus-gray.png'),
  target: require('../../assets/images/ic-target.png'),
  layers: require('../../assets/images/ic-layers.png'),
  trophy: require('../../assets/images/ic-trophy.png'),
  cap: require('../../assets/images/ic-cap.png'),
  filter: require('../../assets/images/ic-filter.png'),
};

// ====== Màu đo từ ảnh thiết kế ======
const C = {
  primary: '#374F8A',
  ink: '#1E2E4F',
  body: '#64748B',
  muted: '#94A3B8',
  label: '#475569',
  line: '#F1F5F9',
  soft: '#F8FAFC',
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

export default function ProfileScreen() {
  const { s, z } = useDesign(raw);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

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
    else router.replace('/login' as any);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== Header ===== */}
        <View style={s.header}>
          <Pressable style={s.circleBtn} onPress={goBack}>
            <Image source={IMG.back} style={{ width: z(9), height: z(12.5) }} />
          </Pressable>
          <Text style={s.headerTitle}>Hồ sơ sinh viên</Text>
          <Pressable style={s.circleBtn}>
            <Image source={IMG.gear} style={{ width: z(19), height: z(21) }} />
          </Pressable>
        </View>

        {/* ===== Thẻ thông tin ===== */}
        <View style={[s.card, s.profileCard]}>
          <View style={s.avatarBox}>
            <Image source={IMG.avatar} style={s.avatar} />
          </View>
          <View style={s.profileText}>
            <Text style={s.name}>Quang Hoàng</Text>
            <Text style={s.mssv}>MSSV: 23IT.B063</Text>
            <Text style={s.faculty}>Khoa khoa học máy tính</Text>
          </View>
          <Pressable style={s.editBtn} onPress={() => router.push('/edit-profile' as any)}>
            <Image source={IMG.pencil} style={{ width: z(14), height: z(14) }} />
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

        {/* ===== Tài liệu của tôi ===== */}
        <View style={s.docsHeader}>
          <View style={{ marginTop: z(7) }}>
            <Text style={s.docsTitle}>Tài liệu của tôi</Text>
            <Text style={s.docsSub}>3 tệp đã đóng góp cho cộng đồng</Text>
          </View>
          <Pressable style={s.filterBtn}>
            <Image source={IMG.filter} style={{ width: z(10), height: z(8) }} />
          </Pressable>
        </View>
      </ScrollView>
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
  scroll: { paddingHorizontal: 18, paddingTop: 15, paddingBottom: 40 },

  // Header (cao 40)
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

  // Khung thẻ chung
  card: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.line,
    ...cardShadow,
  },

  // Thẻ thông tin (cao 98)
  profileCard: {
    marginTop: 20,
    borderRadius: 48,
    paddingVertical: 18,
    paddingLeft: 18,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBox: { width: 60, height: 60 },
  avatar: { position: 'absolute', left: -2, top: -2, width: 66, height: 66 },
  profileText: { flex: 1, marginLeft: 16 },
  name: {
    fontFamily: F.extra,
    fontSize: 17,
    lineHeight: 24,
    letterSpacing: -0.3,
    color: C.ink,
  },
  mssv: {
    marginTop: 2,
    fontFamily: F.semi,
    fontSize: 13,
    lineHeight: 16,
    color: C.body,
  },
  faculty: {
    marginTop: 2,
    fontFamily: F.regular,
    fontSize: 12.5,
    lineHeight: 16,
    color: C.muted,
  },
  editBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.soft,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  // Thẻ mục (Môn học / Mục tiêu)
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

  // Chip môn học (cao 32)
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

  // Mục tiêu
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

  // Tài liệu của tôi
  docsHeader: {
    marginTop: 15.5,
    marginLeft: 4,
    marginRight: -2,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  docsTitle: {
    fontFamily: F.extra,
    fontSize: 18.5,
    lineHeight: 24,
    letterSpacing: -0.7,
    color: C.ink,
  },
  docsSub: {
    marginTop: 2,
    fontFamily: F.regular,
    fontSize: 13,
    lineHeight: 16,
    color: C.muted,
  },
  filterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
});