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
import { Spacing, BorderRadius, Shadow } from '../../src/constants/spacing';
import { SUBJECTS, STUDY_GOALS } from '../../src/constants/app';

const CURRENT_SUBJECTS = ['co-so-dl', 'mang-may-tinh', 'toan-cao-cap'];
const CURRENT_GOALS = ['midterm', 'project'];

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [displayName, setDisplayName] = useState<'real' | 'nickname'>('real');

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + Spacing.base, paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Hero */}
        <LinearGradient
          colors={['#374F8A', '#1A2540']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.profileHero}
        >
          {/* VKU Badge */}
          <View style={styles.vkuBadge}>
            <Text style={styles.vkuBadgeText}>🎓 Sinh viên VKU</Text>
          </View>

          {/* Avatar */}
          <View style={styles.avatarRing}>
            <LinearGradient
              colors={['#FED014', '#DF0218']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarGrad}
            >
              <Text style={styles.avatarEmoji}>🧑‍💻</Text>
            </LinearGradient>
          </View>

          <Text style={styles.profileName}>Nguyễn Văn A</Text>
          <Text style={styles.profileEmail}>sv123@vku.udn.vn</Text>
          <Text style={styles.profileNickname}>Biệt danh: CodeNinja99</Text>

          {/* Stats */}
          <View style={styles.profileStats}>
            {[
              { label: 'Môn học', value: '3' },
              { label: 'Tài liệu', value: '12' },
              { label: 'Phiên học', value: '28' },
            ].map((stat) => (
              <View key={stat.label} style={styles.profileStat}>
                <Text style={styles.profileStatValue}>{stat.value}</Text>
                <Text style={styles.profileStatLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Edit button */}
          <TouchableOpacity
            onPress={() => router.push('/profile/edit')}
            style={styles.editBtn}
          >
            <Text style={styles.editBtnText}>✏️ Chỉnh sửa hồ sơ</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Current subjects */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>📚 Môn học trong kỳ</Text>
            <TouchableOpacity onPress={() => router.push('/profile/subjects')}>
              <Text style={styles.cardAction}>Sửa</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.subjectsList}>
            {SUBJECTS.filter((s) => CURRENT_SUBJECTS.includes(s.id)).map((subject) => (
              <View key={subject.id} style={styles.subjectItem}>
                <Text style={styles.subjectIcon}>{subject.icon}</Text>
                <View>
                  <Text style={styles.subjectName}>{subject.name}</Text>
                  <Text style={styles.subjectCode}>{subject.code}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Study goals */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>🎯 Mục tiêu học tập</Text>
            <TouchableOpacity onPress={() => router.push('/profile/subjects')}>
              <Text style={styles.cardAction}>Sửa</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.goalsList}>
            {STUDY_GOALS.filter((g) => CURRENT_GOALS.includes(g.id)).map((goal) => (
              <View key={goal.id} style={styles.goalChip}>
                <Text style={styles.goalIcon}>{goal.icon}</Text>
                <Text style={styles.goalName}>{goal.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Privacy */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔒 Quyền riêng tư</Text>
          <View style={styles.privacyRow}>
            <View>
              <Text style={styles.privacyLabel}>Hiển thị trên Radar</Text>
              <Text style={styles.privacyValue}>
                {displayName === 'real' ? '👤 Tên thật' : '🎭 Biệt danh'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setDisplayName(displayName === 'real' ? 'nickname' : 'real')}
              style={styles.privacyToggle}
            >
              <Text style={styles.privacyToggleText}>Đổi</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings menu */}
        <View style={styles.menuCard}>
          {[
            { icon: '🔔', label: 'Thông báo', route: '/notifications' },
            { icon: '🛡️', label: 'Bảo mật tài khoản', route: '/profile/edit' },
            { icon: '❓', label: 'Trợ giúp & Phản hồi', route: '/profile/edit' },
            { icon: '📋', label: 'Điều khoản dịch vụ', route: '/profile/edit' },
          ].map((item, i, arr) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.7}
              style={[styles.menuItem, i < arr.length - 1 && styles.menuItemBorder]}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={() => router.replace('/(auth)/welcome')}
          style={styles.logoutBtn}
        >
          <Text style={styles.logoutText}>🚪 Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgBase },
  scroll: { gap: Spacing.base, paddingHorizontal: Spacing.base },
  profileHero: {
    borderRadius: BorderRadius['2xl'],
    padding: Spacing['2xl'],
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadow.accent,
  },
  vkuBadge: {
    backgroundColor: 'rgba(254, 208, 20, 0.2)',
    borderRadius: BorderRadius.full,
    paddingVertical: 4,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(254, 208, 20, 0.3)',
    marginBottom: Spacing.sm,
  },
  vkuBadgeText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.primary,
  },
  avatarRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    padding: 3,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  avatarGrad: {
    flex: 1,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 40 },
  profileName: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
  },
  profileEmail: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.accentLight,
  },
  profileNickname: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  profileStats: {
    flexDirection: 'row',
    gap: Spacing['2xl'],
    marginTop: Spacing.sm,
  },
  profileStat: { alignItems: 'center', gap: 2 },
  profileStatValue: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.xl,
    color: Colors.primary,
  },
  profileStatLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  editBtn: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  editBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },

  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    gap: Spacing.md,
    ...Shadow.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  cardAction: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  subjectsList: { gap: Spacing.sm },
  subjectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  subjectIcon: { fontSize: 24 },
  subjectName: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  subjectCode: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  goalsList: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  goalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(254, 208, 20, 0.12)',
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(254, 208, 20, 0.25)',
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
  },
  goalIcon: { fontSize: 14 },
  goalName: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  privacyLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  privacyValue: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  privacyToggle: {
    backgroundColor: Colors.bgCardAlt,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  privacyToggleText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },

  menuCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.base,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuIcon: { fontSize: 20, width: 28 },
  menuLabel: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  menuArrow: {
    fontSize: 20,
    color: Colors.textMuted,
  },

  logoutBtn: {
    backgroundColor: 'rgba(223, 2, 24, 0.1)',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(223, 2, 24, 0.25)',
    padding: Spacing.base,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoutText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.danger,
  },
});
