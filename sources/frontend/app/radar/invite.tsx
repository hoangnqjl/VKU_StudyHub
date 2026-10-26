import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../src/constants/colors';
import { FontFamily, FontSize } from '../../src/constants/typography';
import { Spacing, BorderRadius, Shadow } from '../../src/constants/spacing';

export default function InviteScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sent, setSent] = useState(false);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.base }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Xin ghép bàn học</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing['3xl'] }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Target user card */}
        <View style={styles.userCard}>
          <LinearGradient colors={['#1A2540', '#1F2D4E']} style={styles.userCardGrad}>
            <View style={styles.userAvatarWrap}>
              <Text style={styles.userAvatar}>🧑‍💻</Text>
              <View style={styles.onlineDot} />
            </View>
            <Text style={styles.userName}>Minh Trí</Text>
            <View style={styles.subjectPill}>
              <Text style={styles.subjectText}>📚 Cơ sở dữ liệu</Text>
            </View>
            <View style={styles.locationRow}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.locationText}>Thư viện · 5 phút trước</Text>
            </View>
            <View style={styles.goalBadge}>
              <Text style={styles.goalText}>🎯 Ôn thi giữa kỳ</Text>
            </View>
          </LinearGradient>
        </View>

        {!sent ? (
          <>
            <Text style={styles.sectionTitle}>Tin nhắn đính kèm (tùy chọn)</Text>
            <View style={styles.messageOptions}>
              {[
                '👋 Chào bạn, mình học CSDL, có thể ngồi cùng không?',
                '📚 Bạn đang ôn thi CSDL hả? Mình cũng vậy!',
                '☕ Ngồi cùng cho có bạn học nhé!',
                '✏️ Tự gõ tin nhắn...',
              ].map((msg, i) => (
                <TouchableOpacity key={i} style={styles.msgOption}>
                  <Text style={styles.msgOptionText}>{msg}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => setSent(true)}
              activeOpacity={0.85}
              style={styles.sendBtn}
            >
              <LinearGradient
                colors={['#374F8A', '#243660']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.sendGrad}
              >
                <Text style={styles.sendText}>📡 Gửi lời mời ghép bàn</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.sentState}>
            <View style={styles.sentIcon}>
              <Text style={styles.sentEmoji}>✅</Text>
            </View>
            <Text style={styles.sentTitle}>Đã gửi lời mời!</Text>
            <Text style={styles.sentDesc}>
              Minh Trí sẽ nhận được thông báo. Bạn sẽ được báo khi họ chấp nhận hoặc từ chối.
            </Text>
            <TouchableOpacity onPress={() => router.back()} style={styles.doneBtn}>
              <LinearGradient
                colors={['#FED014', '#E5B800']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.doneGrad}
              >
                <Text style={styles.doneText}>Về danh sách</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
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
  headerTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.md, color: Colors.textPrimary },
  content: { padding: Spacing.base, gap: Spacing.xl, alignItems: 'center' },
  userCard: {
    width: '100%',
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.accent,
  },
  userCardGrad: { padding: Spacing.xl, alignItems: 'center', gap: Spacing.sm },
  userAvatarWrap: { position: 'relative', width: 64, height: 64 },
  userAvatar: { fontSize: 52 },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.success,
    borderWidth: 3,
    borderColor: '#1A2540',
  },
  userName: { fontFamily: FontFamily.bold, fontSize: FontSize.xl, color: Colors.textPrimary },
  subjectPill: {
    backgroundColor: 'rgba(254, 208, 20, 0.15)',
    borderRadius: BorderRadius.full,
    paddingVertical: 4,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(254, 208, 20, 0.3)',
  },
  subjectText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.primary },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationIcon: { fontSize: 14 },
  locationText: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary },
  goalBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderRadius: BorderRadius.full,
    paddingVertical: 4,
    paddingHorizontal: Spacing.md,
  },
  goalText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.success },
  sectionTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    alignSelf: 'flex-start',
  },
  messageOptions: { width: '100%', gap: Spacing.sm },
  msgOption: {
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
  },
  msgOptionText: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary },
  sendBtn: {
    width: '100%',
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    ...Shadow.accent,
  },
  sendGrad: { paddingVertical: Spacing.lg, alignItems: 'center' },
  sendText: { fontFamily: FontFamily.bold, fontSize: FontSize.md, color: Colors.white },
  sentState: { alignItems: 'center', gap: Spacing.lg, paddingVertical: Spacing['3xl'] },
  sentIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.success,
  },
  sentEmoji: { fontSize: 40 },
  sentTitle: { fontFamily: FontFamily.extraBold, fontSize: FontSize['2xl'], color: Colors.textPrimary },
  sentDesc: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  doneBtn: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    ...Shadow.golden,
    marginTop: Spacing.sm,
  },
  doneGrad: { paddingVertical: Spacing.md, paddingHorizontal: Spacing['3xl'], alignItems: 'center' },
  doneText: { fontFamily: FontFamily.bold, fontSize: FontSize.base, color: Colors.textInvert },
});
