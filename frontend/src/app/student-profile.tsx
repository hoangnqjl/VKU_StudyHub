import { safeBack } from '../utils/navigation';
import { useState, useEffect } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { documentService } from '../services';
import DocumentViewerModal, { DocumentViewerItem } from '../components/DocumentViewerModal';
import { router, useLocalSearchParams } from 'expo-router';
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
  body: '#777B89',
  border: '#E1E9F3',
  pale: '#F6F8FB',
  white: '#FFFFFF',
  green: '#10B981',
  orange: '#F15B2A',
};

const FONT = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semi: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extra: 'Inter_800ExtraBold',
};

// Dynamic real data fetched from database

export default function StudentProfileScreen() {
  const { s, z } = useDesign(raw);
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    studentId?: string;
    name?: string;
    faculty?: string;
    subject?: string;
    goal?: string;
    location?: string;
  }>();
  const studentId = Array.isArray(params.studentId) ? params.studentId[0] : params.studentId;
  const requestedName = Array.isArray(params.name) ? params.name[0] : params.name;
  const faculty = Array.isArray(params.faculty) ? params.faculty[0] : params.faculty;
  const subjectParam = Array.isArray(params.subject) ? params.subject[0] : params.subject;
  const goalParam = Array.isArray(params.goal) ? params.goal[0] : params.goal;
  const locationParam = Array.isArray(params.location) ? params.location[0] : params.location;

  
  const name = requestedName || 'Sinh viên VKU';
  const displayFaculty = faculty || 'Khoa Công nghệ Thông tin · VKU';
  const displaySubject = subjectParam || 'Lập trình ứng dụng & Web';
  const displayGoal = goalParam || 'Ôn tập học kỳ & Dự án';
  const [sharedDocs, setSharedDocs] = useState<any[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentViewerItem | null>(null);
  const [viewerVisible, setViewerVisible] = useState(false);

  useEffect(() => {
    documentService.getDocuments().then((docs) => {
      if (Array.isArray(docs)) setSharedDocs(docs);
    }).catch(() => {});
  }, []);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded) return null;

  const requestStudyTable = () => {
    router.push({
      pathname: '/join-table',
      params: {
        name,
        facultyDetail: displayFaculty,
        subjectDetail: displaySubject,
        goal: displayGoal,
        location: locationParam || 'Khu A - Tầng 2 (Bàn 04)',
      },
    } as any);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={[
          s.scroll,
          { paddingBottom: z(24) + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
            onPress={() => safeBack('/radar')}
            style={s.backButton}
          >
            <Feather name="chevron-left" size={z(25)} color={COLORS.title} />
          </Pressable>
          <Text style={s.headerTitle}>Hồ sơ sinh viên</Text>
          <View style={s.headerSpacer} />
        </View>

        <View style={s.profileCard}>
          <View pointerEvents="none" style={s.profileTintLeft} />
          <View pointerEvents="none" style={s.profileTintRight} />
          <View style={s.identity}>
            <View style={s.avatarFrame}>
                <View style={[s.avatar, s.initialsAvatar]}>
                  <Text style={s.avatarInitials}>{initialsFor(name)}</Text>
                </View>
              <View style={s.onlineBadge}>
                <View style={s.onlineDot} />
              </View>
            </View>
            <View style={s.nameRow}>
              <Text style={s.studentName}>{name}</Text>
              <View style={s.verifiedBadge}>
                <Feather name="check" size={z(12)} color={COLORS.white} />
              </View>
            </View>
            <View style={s.studentIdPill}>
              <Text style={s.studentId}>{studentId ? (studentId.startsWith('2') ? `MSSV: ${studentId}` : studentId) : 'Sinh viên VKU'}</Text>
              <View style={s.studentIdDot} />
            </View>
            <Text style={s.faculty}>{displayFaculty}</Text>
          </View>

          <View style={s.statsCard}>
            <Stat value="18" label="Ghép bàn" s={s} />
            <View style={s.statDivider} />
            <View style={s.stat}>
              <View style={s.ratingRow}>
                <Text style={s.statValue}>4.9</Text>
                <Text style={s.ratingStar}>★</Text>
              </View>
              <Text style={s.statLabel}>Uy tín</Text>
            </View>
            <View style={s.statDivider} />
            <Stat value="6" label="Tài liệu" s={s} />
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={requestStudyTable}
            style={s.requestButton}
          >
            <Feather name="user-plus" size={z(20)} color={COLORS.white} />
            <Text style={s.requestText}>Xin ghép bàn học</Text>
          </Pressable>
        </View>

        <View style={s.sectionCard}>
          <View style={s.sectionHeader}>
            <View style={s.sectionIcon}>
              <Feather name="target" size={z(20)} color={COLORS.navy} />
            </View>
            <Text style={s.sectionTitle}>Mục tiêu &amp; Môn đang ôn</Text>
            <View style={s.activeBadge}>
              <Text style={s.activeText}>ACTIVE</Text>
            </View>
          </View>

          <View style={s.goalCard}>
            <Feather name="flag" size={z(17)} color={COLORS.orange} />
            <Text style={s.goalText}>
              <Text style={s.goalStrong}>Mục tiêu: </Text>
              {displayGoal}
            </Text>
          </View>

          <View style={s.subjectChips}>
            <View style={[s.subjectChip, s.subjectChipActive]}>
              <Feather name="check" size={z(14)} color={COLORS.white} />
              <Text style={[s.subjectText, s.subjectTextActive]}>
                {displaySubject}
              </Text>
            </View>
          </View>
        </View>

        <View style={s.documentsCard}>
          <View style={s.documentsHeader}>
            <View style={s.documentsHeading}>
              <View style={s.documentsIcon}>
                <Feather name="folder" size={z(18)} color={COLORS.navy} />
              </View>
              <Text style={s.documentsTitle}>Tài liệu đã chia sẻ ({sharedDocs.length})</Text>
            </View>
            <Pressable onPress={() => router.push('/documents' as any)}>
              <Text style={s.viewAllText}>Xem tất cả</Text>
            </Pressable>
          </View>

          {sharedDocs.map((doc) => {
            const isPdf = (doc.fileType || "PDF").toUpperCase().includes("PDF");
            const color = isPdf ? "#C91F26" : "#B83B09";
            const bg = isPdf ? "#FFE0DD" : "#FFE0D5";
            return (
              <Pressable
                key={doc.id}
                style={s.documentRow}
                onPress={() => {
                  setSelectedDoc({
                    id: doc.id,
                    title: doc.title,
                    subject: doc.courseName || doc.subject || displaySubject,
                    format: doc.fileType || "PDF",
                    fileUrl: doc.fileUrl,
                    fileSizeBytes: doc.fileSizeBytes,
                    description: doc.description,
                    authorName: doc.authorName || name,
                  });
                  setViewerVisible(true);
                }}
              >
                <View style={[s.documentIcon, { backgroundColor: bg }]}>
                  <Feather name="file-text" size={z(17)} color={color} />
                </View>
                <Text numberOfLines={1} style={s.documentName}>{doc.title}</Text>
                <Text style={[s.documentType, { color }]}>{doc.fileType || "PDF"}</Text>
                <Feather name="eye" size={z(16)} color="#101D83" />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    <DocumentViewerModal
        visible={viewerVisible}
        document={selectedDoc}
        onClose={() => setViewerVisible(false)}
        onCreateQr={(doc) => {
          setViewerVisible(false);
          router.push({
            pathname: '/document-qr',
            params: { docId: doc.id, title: doc.title, size: doc.size },
          } as any);
        }}
      />
    </SafeAreaView>
  );
}

function Stat({ value, label, s }: { value: string; label: string; s: Record<string, any> }) {
  return (
    <View style={s.stat}>
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

function initialsFor(name?: string) {
  return (name ?? 'VKU')
    .split(/\s+/)
    .slice(-2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase();
}

const cardShadow = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.045,
  shadowRadius: 9,
  shadowOffset: { width: 0, height: 3 },
  elevation: 2,
} as const;

const raw = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  scroll: { paddingHorizontal: 18, paddingTop: 16 },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    ...cardShadow,
  },
  headerTitle: {
    position: 'absolute',
    left: 44,
    right: 44,
    textAlign: 'center',
    fontFamily: FONT.extra,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.4,
    color: COLORS.title,
  },
  headerSpacer: { width: 38 },
  profileCard: {
    minHeight: 383,
    marginTop: 18,
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 38,
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    ...cardShadow,
  },
  profileTintLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '48%',
    height: 160,
    borderBottomRightRadius: 150,
    backgroundColor: 'rgba(238, 239, 255, 0.65)',
  },
  profileTintRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '48%',
    height: 160,
    borderBottomLeftRadius: 150,
    backgroundColor: 'rgba(255, 239, 234, 0.72)',
  },
  identity: { alignItems: 'center' },
  avatarFrame: {
    width: 90,
    height: 90,
    padding: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 47,
    backgroundColor: COLORS.white,
    ...cardShadow,
  },
  avatar: { width: '100%', height: '100%', borderRadius: 44 },
  initialsAvatar: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#FDE89F' },
  avatarInitials: { fontFamily: FONT.bold, fontSize: 23, lineHeight: 29, color: COLORS.title },
  onlineBadge: {
    position: 'absolute',
    right: -1,
    bottom: 1,
    width: 23,
    height: 23,
    borderWidth: 3,
    borderColor: COLORS.white,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.green,
  },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.white },
  nameRow: { marginTop: 12, flexDirection: 'row', alignItems: 'center' },
  studentName: { fontFamily: FONT.extra, fontSize: 23, lineHeight: 31, letterSpacing: -0.6, color: COLORS.title },
  verifiedBadge: {
    width: 19,
    height: 19,
    marginLeft: 7,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.orange,
  },
  studentIdPill: {
    minHeight: 24,
    marginTop: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.pale,
  },
  studentId: { fontFamily: FONT.semi, fontSize: 12, lineHeight: 17, color: COLORS.body },
  studentIdDot: { width: 4, height: 4, marginLeft: 9, borderRadius: 2, backgroundColor: '#C7CBD4' },
  faculty: { marginTop: 7, fontFamily: FONT.medium, fontSize: 12, lineHeight: 18, color: '#606371' },
  statsCard: {
    width: '100%',
    minHeight: 70,
    marginTop: 17,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: COLORS.pale,
  },
  stat: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontFamily: FONT.extra, fontSize: 22, lineHeight: 29, letterSpacing: -0.5, color: COLORS.title },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingStar: { marginLeft: 2, fontFamily: FONT.extra, fontSize: 17, lineHeight: 22, color: '#F59E0B' },
  statLabel: { marginTop: 1, fontFamily: FONT.bold, fontSize: 11, lineHeight: 16, color: COLORS.body },
  statDivider: { width: 1, height: 36, backgroundColor: '#E5EAF1' },
  requestButton: {
    width: '100%',
    minHeight: 48,
    marginTop: 21,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.navy,
    shadowColor: COLORS.navy,
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  requestText: { marginLeft: 8, fontFamily: FONT.bold, fontSize: 14, lineHeight: 20, color: COLORS.white },
  sectionCard: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingTop: 17,
    paddingBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 34,
    backgroundColor: COLORS.white,
    ...cardShadow,
  },
  sectionHeader: { minHeight: 31, flexDirection: 'row', alignItems: 'center' },
  sectionIcon: {
    width: 31,
    height: 31,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.pale,
  },
  sectionTitle: { flex: 1, marginLeft: 9, fontFamily: FONT.bold, fontSize: 15, lineHeight: 21, color: COLORS.title },
  activeBadge: {
    minHeight: 27,
    paddingHorizontal: 9,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFFCF7',
  },
  activeText: { fontFamily: FONT.bold, fontSize: 10, lineHeight: 14, color: COLORS.green },
  goalCard: {
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.pale,
  },
  goalText: { flex: 1, marginLeft: 9, fontFamily: FONT.medium, fontSize: 12, lineHeight: 18, color: '#4F5360' },
  goalStrong: { fontFamily: FONT.bold, color: COLORS.title },
  subjectChips: { marginTop: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  subjectChip: {
    minHeight: 31,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.pale,
  },
  subjectChipActive: { borderColor: COLORS.navy, backgroundColor: COLORS.navy },
  subjectText: { fontFamily: FONT.semi, fontSize: 11, lineHeight: 16, color: '#4E5362' },
  subjectTextActive: { marginLeft: 5, fontFamily: FONT.bold, color: COLORS.white },
  documentsCard: {
    marginTop: 16,
    paddingHorizontal: 17,
    paddingTop: 16,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 32,
    backgroundColor: COLORS.white,
    ...cardShadow,
  },
  documentsHeader: { minHeight: 32, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  documentsHeading: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  documentsIcon: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.pale,
  },
  documentsTitle: { marginLeft: 9, fontFamily: FONT.bold, fontSize: 14, lineHeight: 20, color: COLORS.title },
  viewAllButton: { paddingLeft: 7 },
  viewAllText: { fontFamily: FONT.semi, fontSize: 11, lineHeight: 16, color: COLORS.navy },
  documentRow: {
    minHeight: 49,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F7',
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentIcon: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  documentName: { flex: 1, marginLeft: 9, fontFamily: FONT.medium, fontSize: 11, lineHeight: 16, color: COLORS.title },
  documentType: { marginHorizontal: 8, fontFamily: FONT.bold, fontSize: 9, lineHeight: 13 },
});
