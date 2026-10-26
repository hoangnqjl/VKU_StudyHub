import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../src/constants/colors';
import { FontFamily, FontSize } from '../../src/constants/typography';
import { Spacing, BorderRadius } from '../../src/constants/spacing';
import { SUBJECTS, STUDY_GOALS } from '../../src/constants/app';

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [displayName, setDisplayName] = useState<'real' | 'nickname'>('real');

  const steps = ['Môn học', 'Mục tiêu', 'Quyền riêng tư'];

  const toggleSubject = (id: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <LinearGradient colors={['#0F1629', '#1A2540']} style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}>
        <Text style={styles.title}>Thiết lập hồ sơ 🎯</Text>
        <Text style={styles.subtitle}>Chọn môn học và mục tiêu để bắt đầu</Text>

        {/* Step indicator */}
        <View style={styles.steps}>
          {steps.map((s, i) => (
            <View key={s} style={styles.stepItem}>
              <View style={[styles.stepCircle, i <= step && styles.stepCircleActive]}>
                <Text style={[styles.stepNum, i <= step && styles.stepNumActive]}>
                  {i < step ? '✓' : i + 1}
                </Text>
              </View>
              {i < steps.length - 1 && (
                <View style={[styles.stepConnector, i < step && styles.stepConnectorActive]} />
              )}
            </View>
          ))}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Step 0: Subjects */}
        {step === 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📚 Chọn môn học trong kỳ</Text>
            <Text style={styles.sectionHint}>Bạn đang học những môn nào? (có thể chọn nhiều)</Text>
            <View style={styles.grid}>
              {SUBJECTS.map((subject) => {
                const selected = selectedSubjects.includes(subject.id);
                return (
                  <TouchableOpacity
                    key={subject.id}
                    onPress={() => toggleSubject(subject.id)}
                    activeOpacity={0.8}
                    style={[styles.subjectChip, selected && styles.chipSelected]}
                  >
                    {selected && (
                      <LinearGradient
                        colors={['#374F8A', '#243660']}
                        style={StyleSheet.absoluteFillObject}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      />
                    )}
                    <Text style={styles.chipIcon}>{subject.icon}</Text>
                    <View style={styles.chipTextContainer}>
                      <Text style={[styles.chipName, selected && styles.chipNameSelected]}>
                        {subject.name}
                      </Text>
                      <Text style={styles.chipCode}>{subject.code}</Text>
                    </View>
                    {selected && <Text style={styles.checkmark}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Step 1: Goals */}
        {step === 1 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 Mục tiêu học tập</Text>
            <Text style={styles.sectionHint}>Người khác sẽ thấy mục tiêu này trên Radar của bạn</Text>
            <View style={styles.goalsGrid}>
              {STUDY_GOALS.map((goal) => {
                const selected = selectedGoals.includes(goal.id);
                return (
                  <TouchableOpacity
                    key={goal.id}
                    onPress={() => toggleGoal(goal.id)}
                    activeOpacity={0.8}
                    style={[styles.goalCard, selected && styles.goalCardSelected]}
                  >
                    {selected && (
                      <LinearGradient
                        colors={['rgba(254,208,20,0.15)', 'rgba(254,208,20,0.05)']}
                        style={StyleSheet.absoluteFillObject}
                      />
                    )}
                    <Text style={styles.goalIcon}>{goal.icon}</Text>
                    <Text style={[styles.goalName, selected && styles.goalNameSelected]}>
                      {goal.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Step 2: Privacy */}
        {step === 2 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔒 Cài đặt quyền riêng tư</Text>
            <Text style={styles.sectionHint}>Kiểm soát những gì người khác thấy trên Radar</Text>

            <View style={styles.privacySection}>
              <Text style={styles.privacyLabel}>Hiển thị tên trên Radar:</Text>
              <View style={styles.privacyOptions}>
                {(['real', 'nickname'] as const).map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => setDisplayName(opt)}
                    activeOpacity={0.8}
                    style={[styles.privacyOption, displayName === opt && styles.privacyOptionSelected]}
                  >
                    <Text style={styles.privacyOptionIcon}>
                      {opt === 'real' ? '👤' : '🎭'}
                    </Text>
                    <View>
                      <Text style={[styles.privacyOptionTitle, displayName === opt && { color: Colors.primary }]}>
                        {opt === 'real' ? 'Tên thật' : 'Biệt danh'}
                      </Text>
                      <Text style={styles.privacyOptionDesc}>
                        {opt === 'real' ? 'Ví dụ: Nguyễn Văn A' : 'Ví dụ: CodeNinja99'}
                      </Text>
                    </View>
                    {displayName === opt && <Text style={styles.optionCheck}>✓</Text>}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.privacyInfo}>
              <Text style={styles.privacyInfoIcon}>🛡️</Text>
              <Text style={styles.privacyInfoText}>
                Bạn luôn có thể thay đổi cài đặt này sau trong phần Hồ sơ. Vị trí của bạn chỉ hiển thị khi bạn đang "sáng đèn".
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom actions */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + Spacing.lg }]}>
        {step > 0 && (
          <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.prevBtn}>
            <Text style={styles.prevText}>‹ Trước</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={step < 2 ? () => setStep(step + 1) : handleFinish}
          activeOpacity={0.85}
          style={[styles.nextBtn, step === 0 && { flex: 1 }]}
        >
          <LinearGradient
            colors={['#FED014', '#E5B800']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextGradient}
          >
            <Text style={styles.nextText}>
              {step < 2 ? 'Tiếp theo →' : '🚀 Bắt đầu!'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.md,
  },
  title: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize['2xl'],
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  steps: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  stepItem: { flexDirection: 'row', alignItems: 'center' },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.bgCard,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  stepNum: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  stepNumActive: { color: Colors.textInvert },
  stepConnector: { width: 32, height: 2, backgroundColor: Colors.border, marginHorizontal: 2 },
  stepConnectorActive: { backgroundColor: Colors.primary },
  scroll: { padding: Spacing['2xl'] },
  section: { gap: Spacing.base },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  sectionHint: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: -Spacing.sm,
  },
  grid: { gap: Spacing.sm },
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: Spacing.md,
    overflow: 'hidden',
  },
  chipSelected: { borderColor: Colors.accent },
  chipIcon: { fontSize: 24 },
  chipTextContainer: { flex: 1 },
  chipName: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  chipNameSelected: { color: Colors.primary },
  chipCode: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  checkmark: { fontSize: 16, color: Colors.primary },

  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  goalCard: {
    width: '47%',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: Spacing.lg,
    overflow: 'hidden',
  },
  goalCardSelected: { borderColor: Colors.primary },
  goalIcon: { fontSize: 32 },
  goalName: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  goalNameSelected: { color: Colors.primary },

  privacySection: { gap: Spacing.md },
  privacyLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  privacyOptions: { gap: Spacing.sm },
  privacyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: Spacing.base,
    overflow: 'hidden',
  },
  privacyOptionSelected: { borderColor: Colors.primary },
  privacyOptionIcon: { fontSize: 24 },
  privacyOptionTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  privacyOptionDesc: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  optionCheck: { marginLeft: 'auto', fontSize: 18, color: Colors.primary },
  privacyInfo: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: 'rgba(55, 79, 138, 0.2)',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(55, 79, 138, 0.4)',
    padding: Spacing.md,
  },
  privacyInfoIcon: { fontSize: 16 },
  privacyInfoText: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.bgBase,
  },
  prevBtn: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  prevText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  nextBtn: {
    flex: 1,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    shadowColor: '#FED014',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  nextGradient: { paddingVertical: Spacing.md, alignItems: 'center' },
  nextText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textInvert,
  },
});
