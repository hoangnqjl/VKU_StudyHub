import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../src/constants/colors';
import { FontFamily, FontSize } from '../../src/constants/typography';
import { Spacing, BorderRadius, Shadow } from '../../src/constants/spacing';

export default function MatchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [decided, setDecided] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => { setAccepted(true); setDecided(true); };
  const handleDecline = () => { setAccepted(false); setDecided(true); };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.base }]}>
        <Text style={styles.headerTitle}>📩 Lời mời ghép bàn</Text>
      </View>

      <View style={[styles.content, { paddingBottom: insets.bottom + Spacing['3xl'] }]}>
        {!decided ? (
          <>
            <View style={styles.notifBell}>
              <Text style={styles.notifBellEmoji}>🔔</Text>
            </View>
            <Text style={styles.title}>Bạn có lời mời mới!</Text>

            {/* Sender card */}
            <View style={styles.senderCard}>
              <LinearGradient colors={['#374F8A', '#1A2540']} style={styles.senderGrad}>
                <Text style={styles.senderAvatar}>👩‍🎓</Text>
                <Text style={styles.senderName}>Thu Hà</Text>
                <View style={styles.senderSubject}>
                  <Text style={styles.senderSubjectText}>📚 Mạng máy tính</Text>
                </View>
                <Text style={styles.senderMessage}>
                  "Bạn đang ôn thi MMT hả? Mình cũng vậy!"
                </Text>
                <View style={styles.senderMeta}>
                  <Text style={styles.senderMetaText}>📍 Tòa A1 · 12 phút trước</Text>
                </View>
              </LinearGradient>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={handleDecline}
                style={styles.declineBtn}
              >
                <Text style={styles.declineBtnText}>✕ Từ chối</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAccept}
                style={styles.acceptBtn}
              >
                <LinearGradient
                  colors={['#22C55E', '#16A34A']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.acceptGrad}
                >
                  <Text style={styles.acceptText}>✓ Chấp nhận</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.laterText}>Để sau</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.resultState}>
            <Text style={styles.resultEmoji}>{accepted ? '🎉' : '👋'}</Text>
            <Text style={styles.resultTitle}>
              {accepted ? 'Đã ghép bàn thành công!' : 'Đã từ chối lời mời'}
            </Text>
            <Text style={styles.resultDesc}>
              {accepted
                ? 'Thu Hà đã được thông báo. Hẹn gặp ở Tòa A1 nhé!'
                : 'Bạn luôn có thể tìm bạn học khác trên Radar.'}
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.doneBtn}
            >
              <LinearGradient
                colors={['#FED014', '#E5B800']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.doneGrad}
              >
                <Text style={styles.doneText}>
                  {accepted ? 'Tuyệt vời!' : 'Về Radar'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgBase },
  header: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: 'center',
  },
  headerTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.md, color: Colors.textPrimary },
  content: {
    flex: 1,
    padding: Spacing['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  notifBell: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(254, 208, 20, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(254, 208, 20, 0.3)',
  },
  notifBellEmoji: { fontSize: 40 },
  title: { fontFamily: FontFamily.extraBold, fontSize: FontSize['2xl'], color: Colors.textPrimary },
  senderCard: {
    width: '100%',
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadow.accent,
  },
  senderGrad: { padding: Spacing.xl, alignItems: 'center', gap: Spacing.sm },
  senderAvatar: { fontSize: 56 },
  senderName: { fontFamily: FontFamily.bold, fontSize: FontSize.xl, color: Colors.textPrimary },
  senderSubject: {
    backgroundColor: 'rgba(254, 208, 20, 0.15)',
    borderRadius: BorderRadius.full,
    paddingVertical: 4,
    paddingHorizontal: Spacing.md,
  },
  senderSubjectText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.primary },
  senderMessage: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  senderMeta: {},
  senderMetaText: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textMuted },
  actions: { flexDirection: 'row', gap: Spacing.md, width: '100%' },
  declineBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.bgCard,
    borderWidth: 1.5,
    borderColor: Colors.danger,
    alignItems: 'center',
  },
  declineBtnText: { fontFamily: FontFamily.bold, fontSize: FontSize.base, color: Colors.danger },
  acceptBtn: {
    flex: 1,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  acceptGrad: { paddingVertical: Spacing.md, alignItems: 'center' },
  acceptText: { fontFamily: FontFamily.bold, fontSize: FontSize.base, color: Colors.white },
  laterText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textMuted },
  resultState: { alignItems: 'center', gap: Spacing.lg },
  resultEmoji: { fontSize: 64 },
  resultTitle: { fontFamily: FontFamily.extraBold, fontSize: FontSize['2xl'], color: Colors.textPrimary },
  resultDesc: { fontFamily: FontFamily.regular, fontSize: FontSize.base, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  doneBtn: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    ...Shadow.golden,
    marginTop: Spacing.sm,
  },
  doneGrad: { paddingVertical: Spacing.md, paddingHorizontal: Spacing['3xl'], alignItems: 'center' },
  doneText: { fontFamily: FontFamily.bold, fontSize: FontSize.base, color: Colors.textInvert },
});
