import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/inter';

import { useDesign } from '../components/design-scale';

const COLORS = {
  navy: '#101D83',
  title: '#17243A',
  body: '#7D8190',
  border: '#E1E9F3',
  pale: '#F6F8FB',
  white: '#FFFFFF',
};

const FONT = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semi: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extra: 'Inter_800ExtraBold',
};

const CYCLES = [25, 50, 90] as const;
const CAPACITIES = [4, 6, 8] as const;
const SUBJECTS = [
  'Lập trình Web (IT002)',
  'Cấu trúc dữ liệu & Giải thuật',
  'Cơ sở dữ liệu',
  'Tiếng Anh TOEIC',
  'Thiết kế giao diện UI/UX',
] as const;

export default function CreateRoomScreen() {
  const { s, z } = useDesign(raw);
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });
  const [roomName, setRoomName] = useState('Ôn thi Web React & Redux');
  const [cycleMinutes, setCycleMinutes] = useState<(typeof CYCLES)[number]>(25);
  const [sessions, setSessions] = useState(4);
  const [subject, setSubject] = useState<(typeof SUBJECTS)[number]>(SUBJECTS[0]);
  const [capacity, setCapacity] = useState<(typeof CAPACITIES)[number]>(6);
  const [soundOn, setSoundOn] = useState(true);
  const [subjectPickerOpen, setSubjectPickerOpen] = useState(false);
  const [notice, setNotice] = useState('');

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={[s.scroll, { paddingBottom: z(24) + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={s.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
            onPress={() => router.back()}
            style={s.roundButton}
          >
            <Feather name="chevron-left" size={z(23)} color="#263653" />
          </Pressable>
          <Text style={s.headerTitle}>Pomodoro room</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tùy chọn"
            onPress={() => setNotice('Các tùy chọn khác sẽ có khi dịch vụ phòng học được kết nối.')}
            style={s.roundButton}
          >
            <Feather name="more-horizontal" size={z(25)} color={COLORS.title} />
          </Pressable>
        </View>

        <View style={s.nameCard}>
          <Text style={s.fieldLabel}>Tên phòng</Text>
          <View style={s.textInputWrap}>
            <Feather name="edit-3" size={z(17)} color={COLORS.body} />
            <TextInput
              accessibilityLabel="Tên phòng"
              maxLength={60}
              onChangeText={setRoomName}
              placeholder="Nhập tên phòng"
              placeholderTextColor="#9AA1AF"
              returnKeyType="done"
              style={s.roomNameInput}
              value={roomName}
            />
          </View>
        </View>

        <View style={s.cycleCard}>
          <View style={s.sectionHeading}>
            <Feather name="clock" size={z(20)} color={COLORS.navy} />
            <Text style={s.sectionTitle}>Chu kỳ Pomodoro</Text>
          </View>
          <View style={s.optionRow}>
            {CYCLES.map((minutes) => {
              const selected = cycleMinutes === minutes;
              return (
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  key={minutes}
                  onPress={() => setCycleMinutes(minutes)}
                  style={[s.choicePill, selected && s.choicePillSelected]}
                >
                  <Text style={[s.choiceText, selected && s.choiceTextSelected]}>{minutes} phút</Text>
                </Pressable>
              );
            })}
          </View>
          <View style={s.sessionsControl}>
            <Text style={s.sessionsLabel}>Số chu kỳ</Text>
            <View style={s.sessionsActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Giảm số chu kỳ"
                accessibilityState={{ disabled: sessions <= 1 }}
                disabled={sessions <= 1}
                onPress={() => setSessions((value) => Math.max(1, value - 1))}
                style={[s.stepperButton, sessions <= 1 && s.stepperDisabled]}
              >
                <Feather name="minus" size={z(18)} color={COLORS.title} />
              </Pressable>
              <Text style={s.sessionsValue}>{sessions} phiên</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Tăng số chu kỳ"
                accessibilityState={{ disabled: sessions >= 12 }}
                disabled={sessions >= 12}
                onPress={() => setSessions((value) => Math.min(12, value + 1))}
                style={[s.stepperButton, sessions >= 12 && s.stepperDisabled]}
              >
                <Feather name="plus" size={z(18)} color={COLORS.title} />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={s.subjectCard}>
          <Text style={s.fieldLabel}>Môn học</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Môn học: ${subject}`}
            accessibilityState={{ expanded: subjectPickerOpen }}
            onPress={() => setSubjectPickerOpen((open) => !open)}
            style={s.subjectSelect}
          >
            <Feather name="book-open" size={z(19)} color={COLORS.navy} />
            <Text style={s.subjectText} numberOfLines={1}>{subject}</Text>
            <Feather
              name={subjectPickerOpen ? 'chevron-up' : 'chevron-down'}
              size={z(18)}
              color={COLORS.body}
            />
          </Pressable>
          {subjectPickerOpen && (
            <View style={s.subjectOptions}>
              {SUBJECTS.map((option) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: subject === option }}
                  key={option}
                  onPress={() => {
                    setSubject(option);
                    setSubjectPickerOpen(false);
                  }}
                  style={s.subjectOption}
                >
                  <Text style={[s.subjectOptionText, subject === option && s.subjectOptionSelected]}>
                    {option}
                  </Text>
                  {subject === option && <Feather name="check" size={z(16)} color={COLORS.navy} />}
                </Pressable>
              ))}
            </View>
          )}
          <Text style={[s.fieldLabel, s.capacityLabel]}>Quy mô phòng</Text>
          <View style={s.optionRow}>
            {CAPACITIES.map((count) => {
              const selected = capacity === count;
              return (
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  key={count}
                  onPress={() => setCapacity(count)}
                  style={[s.choicePill, selected && s.choicePillSelected]}
                >
                  <Text style={[s.choiceText, selected && s.choiceTextSelected]}>{count} người</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={s.audioCard}>
          <Feather name="headphones" size={z(20)} color={COLORS.title} />
          <Text style={s.audioLabel}>Âm thanh nền (Mưa thư viện)</Text>
          <Pressable
            accessibilityRole="switch"
            accessibilityLabel="Âm thanh nền"
            accessibilityState={{ checked: soundOn }}
            onPress={() => setSoundOn((value) => !value)}
            style={[s.switchTrack, !soundOn && s.switchTrackOff]}
          >
            <View style={[s.switchThumb, !soundOn && s.switchThumbOff]} />
          </Pressable>
        </View>

        {notice.length > 0 && <Text style={s.notice}>{notice}</Text>}

        <Pressable
          accessibilityRole="button"
          onPress={() => {
            if (!roomName.trim()) {
              setNotice('Hãy nhập tên phòng trước khi tiếp tục.');
              return;
            }
            setNotice('Chưa thể mở phòng vì dịch vụ phòng học chưa kết nối.');
          }}
          style={s.startButton}
        >
          <Text style={s.startButtonText}>Bắt đầu mở phòng</Text>
          <Feather name="arrow-right" size={z(20)} color={COLORS.white} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const cardShadow = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.045,
  shadowRadius: 5,
  shadowOffset: { width: 0, height: 2 },
  elevation: 1,
} as const;

const raw = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  scroll: { paddingHorizontal: 14, paddingTop: 39 },
  header: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    ...cardShadow,
  },
  headerTitle: {
    position: 'absolute',
    left: 48,
    right: 48,
    textAlign: 'center',
    fontFamily: FONT.extra,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.5,
    color: '#243653',
  },
  nameCard: {
    marginTop: 30,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    ...cardShadow,
  },
  fieldLabel: { fontFamily: FONT.semi, fontSize: 12.5, lineHeight: 18, color: COLORS.title },
  textInputWrap: {
    height: 43,
    marginTop: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 25,
    backgroundColor: '#F7F9FC',
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomNameInput: {
    flex: 1,
    height: '100%',
    marginLeft: 11,
    padding: 0,
    fontFamily: FONT.regular,
    fontSize: 14,
    color: COLORS.title,
  },
  cycleCard: {
    marginTop: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    ...cardShadow,
  },
  sectionHeading: { height: 24, flexDirection: 'row', alignItems: 'center' },
  sectionTitle: { marginLeft: 8, fontFamily: FONT.bold, fontSize: 14, lineHeight: 20, color: COLORS.title },
  optionRow: { marginTop: 12, flexDirection: 'row', gap: 7 },
  choicePill: {
    flex: 1,
    minHeight: 36,
    paddingHorizontal: 5,
    borderRadius: 23,
    backgroundColor: COLORS.pale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choicePillSelected: { backgroundColor: COLORS.navy },
  choiceText: { fontFamily: FONT.semi, fontSize: 12, lineHeight: 17, color: '#555966' },
  choiceTextSelected: { color: COLORS.white },
  sessionsControl: {
    minHeight: 45,
    marginTop: 12,
    paddingHorizontal: 17,
    borderRadius: 25,
    backgroundColor: '#F7F9FC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sessionsLabel: { fontFamily: FONT.semi, fontSize: 12, lineHeight: 17, color: COLORS.title },
  sessionsActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepperButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
  stepperDisabled: { opacity: 0.45 },
  sessionsValue: { minWidth: 45, textAlign: 'center', fontFamily: FONT.bold, fontSize: 13, lineHeight: 18, color: COLORS.navy },
  subjectCard: {
    marginTop: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    ...cardShadow,
  },
  subjectSelect: {
    height: 43,
    marginTop: 6,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 25,
    backgroundColor: '#F7F9FC',
    flexDirection: 'row',
    alignItems: 'center',
  },
  subjectText: { flex: 1, marginHorizontal: 10, fontFamily: FONT.regular, fontSize: 14, lineHeight: 20, color: COLORS.title },
  subjectOptions: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
  subjectOption: {
    minHeight: 38,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.pale,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subjectOptionText: { flex: 1, fontFamily: FONT.medium, fontSize: 11.5, lineHeight: 16, color: COLORS.title },
  subjectOptionSelected: { fontFamily: FONT.semi, color: COLORS.navy },
  capacityLabel: { marginTop: 13 },
  audioCard: {
    minHeight: 54,
    marginTop: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 29,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    ...cardShadow,
  },
  audioLabel: { flex: 1, marginLeft: 8, fontFamily: FONT.semi, fontSize: 12.5, lineHeight: 18, color: COLORS.title },
  switchTrack: {
    width: 38,
    height: 22,
    padding: 2,
    borderRadius: 12,
    backgroundColor: COLORS.navy,
    justifyContent: 'center',
  },
  switchTrackOff: { backgroundColor: '#CBD5E1' },
  switchThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignSelf: 'flex-end',
    backgroundColor: COLORS.white,
  },
  switchThumbOff: { alignSelf: 'flex-start' },
  notice: { marginTop: 10, textAlign: 'center', fontFamily: FONT.medium, fontSize: 11, lineHeight: 16, color: COLORS.body },
  startButton: {
    minHeight: 50,
    marginTop: 22,
    borderRadius: 27,
    backgroundColor: COLORS.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
  startButtonText: { marginRight: 8, fontFamily: FONT.bold, fontSize: 14, lineHeight: 20, color: COLORS.white },
});
