import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../src/constants/colors';
import { FontFamily, FontSize } from '../src/constants/typography';
import { Spacing, BorderRadius } from '../src/constants/spacing';

const NOTIFICATIONS = [
  {
    id: '1',
    type: 'invite',
    icon: '📡',
    title: 'Lời mời ghép bàn',
    message: 'Thu Hà muốn ghép bàn học môn Mạng máy tính với bạn',
    time: '2 phút trước',
    unread: true,
    action: '/radar/match',
    actionLabel: 'Xem lời mời',
    color: Colors.accent,
  },
  {
    id: '2',
    type: 'pomodoro',
    icon: '⏱️',
    title: 'Phiên Pomodoro kết thúc',
    message: 'Phòng "CSDL nhóm 3" vừa hoàn thành phiên tập trung. Đến giờ nghỉ!',
    time: '15 phút trước',
    unread: true,
    action: '/pomodoro/room',
    actionLabel: 'Vào phòng',
    color: Colors.danger,
  },
  {
    id: '3',
    type: 'doc',
    icon: '📄',
    title: 'Tài liệu mới trong kho',
    message: 'Minh Trí đã tải lên "Đề thi CSDL 2023 + Đáp án" cho môn Cơ sở dữ liệu',
    time: '1 giờ trước',
    unread: true,
    action: '/(tabs)/docs',
    actionLabel: 'Xem tài liệu',
    color: Colors.primary,
  },
  {
    id: '4',
    type: 'invite_accepted',
    icon: '✅',
    title: 'Lời mời được chấp nhận',
    message: 'Quang Huy đã chấp nhận lời mời ghép bàn của bạn. Gặp ở Tòa A1!',
    time: '3 giờ trước',
    unread: false,
    color: Colors.success,
  },
  {
    id: '5',
    type: 'radar_off',
    icon: '🌙',
    title: 'Radar đã tự tắt',
    message: 'Trạng thái học của bạn đã được tắt tự động sau 60 phút để tránh hiển thị sai vị trí.',
    time: 'Hôm qua',
    unread: false,
    color: Colors.warning,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F1629', '#1A2540']}
        style={[styles.header, { paddingTop: insets.top + Spacing.base }]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🔔 Thông báo</Text>
        <TouchableOpacity style={styles.readAllBtn}>
          <Text style={styles.readAllText}>Đọc tất cả</Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + Spacing['2xl'] }]}
        showsVerticalScrollIndicator={false}
      >
        {NOTIFICATIONS.map((notif) => (
          <TouchableOpacity
            key={notif.id}
            onPress={() => notif.action && router.push(notif.action as any)}
            activeOpacity={0.8}
            style={[styles.notifCard, notif.unread && styles.notifCardUnread]}
          >
            {notif.unread && <View style={styles.unreadDot} />}
            <View style={[styles.notifIconBg, { backgroundColor: notif.color + '22' }]}>
              <Text style={styles.notifIcon}>{notif.icon}</Text>
            </View>
            <View style={styles.notifContent}>
              <View style={styles.notifHeader}>
                <Text style={styles.notifTitle}>{notif.title}</Text>
                <Text style={styles.notifTime}>{notif.time}</Text>
              </View>
              <Text style={styles.notifMessage} numberOfLines={2}>{notif.message}</Text>
              {notif.action && notif.actionLabel && (
                <TouchableOpacity
                  onPress={() => router.push(notif.action as any)}
                  style={[styles.actionBtn, { borderColor: notif.color + '55' }]}
                >
                  <Text style={[styles.actionBtnText, { color: notif.color }]}>
                    {notif.actionLabel} →
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        ))}
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
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 32, color: Colors.primary, lineHeight: 36 },
  headerTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.md, color: Colors.textPrimary },
  readAllBtn: {},
  readAllText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.primary },
  scroll: { padding: Spacing.base, gap: Spacing.sm },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    position: 'relative',
  },
  notifCardUnread: {
    borderColor: 'rgba(55, 79, 138, 0.5)',
    backgroundColor: 'rgba(26, 37, 64, 0.95)',
  },
  unreadDot: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    zIndex: 1,
  },
  notifIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  notifIcon: { fontSize: 24 },
  notifContent: { flex: 1, gap: Spacing.sm },
  notifHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: Spacing.sm },
  notifTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary, flex: 1 },
  notifTime: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textMuted, flexShrink: 0 },
  notifMessage: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  actionBtn: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: BorderRadius.full,
    paddingVertical: 4,
    paddingHorizontal: Spacing.md,
  },
  actionBtnText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.xs },
});
