import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../src/constants/colors';
import { FontFamily, FontSize } from '../../src/constants/typography';
import { Spacing, BorderRadius, Shadow } from '../../src/constants/spacing';
import { SUBJECTS, POMODORO_PRESETS } from '../../src/constants/app';

export default function CreateRoomScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [roomName, setRoomName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [maxMembers, setMaxMembers] = useState(5);
  const [isPublic, setIsPublic] = useState(true);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.base }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tạo phòng Pomodoro</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + Spacing['3xl'] }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Room name */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Tên phòng</Text>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="VD: Phòng CSDL nhóm 3"
              placeholderTextColor={Colors.textMuted}
              value={roomName}
              onChangeText={setRoomName}
            />
          </View>
        </View>

        {/* Subject */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Môn học</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
            {SUBJECTS.slice(0, 6).map((s) => (
              <TouchableOpacity
                key={s.id}
                onPress={() => setSelectedSubject(s.id)}
                style={[styles.chip, selectedSubject === s.id && styles.chipActive]}
              >
                <Text style={styles.chipIcon}>{s.icon}</Text>
                <Text style={[styles.chipText, selectedSubject === s.id && styles.chipTextActive]}>
                  {s.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Timer preset */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>⏱️ Cài đặt thời gian</Text>
          <View style={styles.presetGrid}>
            {POMODORO_PRESETS.map((preset, i) => (
              <TouchableOpacity
                key={preset.label}
                onPress={() => setSelectedPreset(i)}
                style={[styles.presetCard, selectedPreset === i && styles.presetCardActive]}
              >
                {selectedPreset === i && (
                  <LinearGradient
                    colors={['rgba(223, 2, 24, 0.15)', 'rgba(223, 2, 24, 0.05)']}
                    style={StyleSheet.absoluteFillObject}
                  />
                )}
                <Text style={styles.presetTimes}>
                  <Text style={{ color: Colors.danger }}>{preset.work}</Text>
                  <Text style={{ color: Colors.textMuted }}>/</Text>
                  <Text style={{ color: Colors.success }}>{preset.rest}</Text>
                  <Text style={{ color: Colors.textMuted }}> phút</Text>
                </Text>
                <Text style={styles.presetName}>{preset.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Max members */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>👥 Số thành viên tối đa</Text>
          <View style={styles.counterRow}>
            <TouchableOpacity
              onPress={() => setMaxMembers(Math.max(2, maxMembers - 1))}
              style={styles.counterBtn}
            >
              <Text style={styles.counterBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.counterValue}>{maxMembers}</Text>
            <TouchableOpacity
              onPress={() => setMaxMembers(Math.min(10, maxMembers + 1))}
              style={styles.counterBtn}
            >
              <Text style={styles.counterBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Visibility */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>🌐 Chế độ phòng</Text>
          <View style={styles.visibilityRow}>
            {[
              { val: true, label: 'Công khai', icon: '🔓', desc: 'Ai cũng thấy trong danh sách' },
              { val: false, label: 'Riêng tư', icon: '🔒', desc: 'Chỉ vào bằng mã hoặc QR' },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.label}
                onPress={() => setIsPublic(opt.val)}
                style={[styles.visOption, isPublic === opt.val && styles.visOptionActive]}
              >
                <Text style={styles.visIcon}>{opt.icon}</Text>
                <Text style={[styles.visLabel, isPublic === opt.val && { color: Colors.primary }]}>
                  {opt.label}
                </Text>
                <Text style={styles.visDesc}>{opt.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Create button */}
        <TouchableOpacity
          onPress={() => {
            router.back();
            router.push('/pomodoro/room');
          }}
          disabled={!roomName || !selectedSubject}
          activeOpacity={0.85}
          style={[styles.createBtn, (!roomName || !selectedSubject) && { opacity: 0.5 }]}
        >
          <LinearGradient
            colors={['#DF0218', '#B50114']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.createGrad}
          >
            <Text style={styles.createText}>🚀 Tạo phòng</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
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
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  scroll: { padding: Spacing.base, gap: Spacing.xl },
  field: { gap: Spacing.sm },
  fieldLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  inputWrap: {
    backgroundColor: Colors.bgInput,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  input: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  hScroll: { marginHorizontal: -Spacing.base },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    marginHorizontal: 4,
  },
  chipActive: { borderColor: Colors.danger, backgroundColor: 'rgba(223, 2, 24, 0.1)' },
  chipIcon: { fontSize: 14 },
  chipText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  chipTextActive: { color: Colors.danger },
  presetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  presetCard: {
    width: '47%',
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: 4,
    overflow: 'hidden',
  },
  presetCardActive: { borderColor: Colors.danger },
  presetTimes: { fontFamily: FontFamily.bold, fontSize: FontSize.lg },
  presetName: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  counterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnText: { fontSize: 24, color: Colors.textPrimary },
  counterValue: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize['3xl'],
    color: Colors.primary,
  },
  visibilityRow: { flexDirection: 'row', gap: Spacing.md },
  visOption: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: 4,
  },
  visOptionActive: { borderColor: Colors.primary, backgroundColor: 'rgba(254, 208, 20, 0.08)' },
  visIcon: { fontSize: 24 },
  visLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  visDesc: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  createBtn: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    ...Shadow.danger,
  },
  createGrad: { paddingVertical: Spacing.lg, alignItems: 'center' },
  createText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.white,
  },
});
