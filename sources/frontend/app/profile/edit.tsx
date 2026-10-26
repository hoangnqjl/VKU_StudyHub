import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../src/constants/colors';
import { FontFamily, FontSize } from '../../src/constants/typography';
import { Spacing, BorderRadius, Shadow } from '../../src/constants/spacing';

const AVATAR_OPTIONS = ['🧑‍💻', '👩‍🎓', '🧑‍🎓', '👩‍💻', '🦊', '🐼', '🦁', '🐯', '🦅', '🐉'];

export default function EditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [avatar, setAvatar] = useState('🧑‍💻');
  const [fullName, setFullName] = useState('Nguyễn Văn A');
  const [nickname, setNickname] = useState('CodeNinja99');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); router.back(); }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.base }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>{saving ? '...' : 'Lưu'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + Spacing['3xl'] }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={() => setShowAvatarPicker(!showAvatarPicker)} style={styles.avatarWrap}>
            <LinearGradient colors={['#FED014', '#DF0218']} style={styles.avatarGrad}>
              <Text style={styles.avatarEmoji}>{avatar}</Text>
            </LinearGradient>
            <View style={styles.editAvatarBadge}>
              <Text style={styles.editAvatarIcon}>✏️</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Nhấn để chọn avatar</Text>

          {showAvatarPicker && (
            <View style={styles.avatarGrid}>
              {AVATAR_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  onPress={() => { setAvatar(opt); setShowAvatarPicker(false); }}
                  style={[styles.avatarOption, avatar === opt && styles.avatarOptionSelected]}
                >
                  <Text style={styles.avatarOptionEmoji}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Họ và tên</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholderTextColor={Colors.textMuted}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Biệt danh (hiển thị trên Radar)</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                value={nickname}
                onChangeText={setNickname}
                placeholder="VD: CodeNinja99"
                placeholderTextColor={Colors.textMuted}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Email</Text>
            <View style={[styles.inputWrap, styles.inputDisabled]}>
              <TextInput
                style={[styles.input, { color: Colors.textMuted }]}
                value="sv123@vku.udn.vn"
                editable={false}
              />
            </View>
            <Text style={styles.fieldNote}>📧 Email không thể thay đổi</Text>
          </View>
        </View>

        {/* Danger zone */}
        <View style={styles.dangerZone}>
          <Text style={styles.dangerTitle}>⚠️ Vùng nguy hiểm</Text>
          <TouchableOpacity style={styles.deleteBtn}>
            <Text style={styles.deleteBtnText}>🗑️ Xóa tài khoản</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgBase },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingBottom: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 32, color: Colors.primary, lineHeight: 36 },
  headerTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.md, color: Colors.textPrimary },
  saveBtn: { backgroundColor: Colors.primary, borderRadius: BorderRadius.full, paddingVertical: 6, paddingHorizontal: Spacing.base },
  saveBtnText: { fontFamily: FontFamily.bold, fontSize: FontSize.sm, color: Colors.textInvert },
  scroll: { padding: Spacing.base, gap: Spacing.xl },
  avatarSection: { alignItems: 'center', gap: Spacing.sm },
  avatarWrap: { width: 88, height: 88, borderRadius: 44, overflow: 'hidden', position: 'relative' },
  avatarGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 44 },
  editAvatarBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: Colors.bgBase, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.bgBase,
  },
  editAvatarIcon: { fontSize: 14 },
  avatarHint: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textMuted },
  avatarGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm,
    justifyContent: 'center', backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: Colors.border, padding: Spacing.md,
  },
  avatarOption: {
    width: 52, height: 52, borderRadius: 14, backgroundColor: Colors.bgCardAlt,
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'transparent',
  },
  avatarOptionSelected: { borderColor: Colors.primary, backgroundColor: 'rgba(254, 208, 20, 0.1)' },
  avatarOptionEmoji: { fontSize: 28 },
  form: { gap: Spacing.base },
  field: { gap: Spacing.xs },
  fieldLabel: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textSecondary, marginLeft: Spacing.xs },
  inputWrap: {
    backgroundColor: Colors.bgInput, borderRadius: BorderRadius.lg,
    borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
  },
  inputDisabled: { opacity: 0.6 },
  input: { fontFamily: FontFamily.regular, fontSize: FontSize.base, color: Colors.textPrimary },
  fieldNote: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textMuted, marginLeft: Spacing.xs },
  dangerZone: {
    backgroundColor: 'rgba(223, 2, 24, 0.07)', borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: 'rgba(223, 2, 24, 0.2)', padding: Spacing.base, gap: Spacing.md,
  },
  dangerTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.danger },
  deleteBtn: {
    backgroundColor: Colors.bgBase, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.danger, padding: Spacing.md, alignItems: 'center',
  },
  deleteBtnText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.danger },
});
