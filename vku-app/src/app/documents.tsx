import { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
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

import StudyHubTabBar from '../components/study-hub-tab-bar';
import { useDesign } from '../components/design-scale';

const COLORS = {
  navy: '#101D83',
  brand: '#374F8A',
  title: '#17243A',
  body: '#7D8292',
  muted: '#8FA0B9',
  border: '#E8EEF5',
  pale: '#F6F8FB',
  white: '#FFFFFF',
  orange: '#C34B0C',
  red: '#D72D2D',
};

const FONT = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semi: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extra: 'Inter_800ExtraBold',
};

const FILTERS = [
  { label: 'Tất cả', count: 18 },
  { label: 'Đã tải xuống', count: 6 },
  { label: 'Đã lưu từ QR', count: 8 },
];

const DOCUMENTS = [
  {
    id: 'react-router',
    title: 'Slide Bài giảng React Router & Redux',
    subject: 'Lập trình Web',
    format: 'PPTX',
    size: '5.4 MB',
    date: '2 giờ trước',
    collection: 'Đã tải xuống',
    icon: 'monitor' as const,
    tint: '#B83B09',
    iconBg: '#FFE0D5',
  },
  {
    id: 'data-structures',
    title: 'Đề cương Ôn tập Cấu trúc DL & Giải thuật',
    subject: 'Cấu trúc DL & GT',
    format: 'PDF',
    size: '2.8 MB',
    date: 'Hôm qua',
    collection: 'Đã lưu từ QR',
    icon: 'file-text' as const,
    tint: '#C91F26',
    iconBg: '#FFE0DD',
  },
  {
    id: 'web-summary',
    title: 'Tóm tắt kiến thức Lập trình Web',
    subject: 'Lập trình Web',
    format: 'PDF',
    size: '1.6 MB',
    date: '3 ngày trước',
    collection: 'Đã tải xuống',
    icon: 'file-text' as const,
    tint: '#C91F26',
    iconBg: '#FFE0DD',
  },
];

type DocumentItem = (typeof DOCUMENTS)[number];

export default function DocumentsScreen() {
  const { s, z } = useDesign(raw);
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  const [newestFirst, setNewestFirst] = useState(true);
  const [notice, setNotice] = useState('');

  const documents = useMemo(() => {
    const filtered = DOCUMENTS.filter((document) => {
      const search = query.trim().toLocaleLowerCase();
      const matchesSearch = !search
        || document.title.toLocaleLowerCase().includes(search)
        || document.subject.toLocaleLowerCase().includes(search);
      const matchesFilter = activeFilter === 'Tất cả'
        || document.collection === activeFilter;
      return matchesSearch && matchesFilter;
    });
    return newestFirst ? filtered : [...filtered].reverse();
  }, [activeFilter, newestFirst, query]);

  if (!fontsLoaded) return null;

  const openDocument = (document: DocumentItem) => {
    setNotice(`Mở "${document.title}" khả dụng khi Kho tài liệu được kết nối.`);
  };

  const createQr = () => {
    router.push('/document-qr' as any);
  };

  const searchDocuments = () => {
    if (query.trim()) {
      router.push({ pathname: '/search-results', params: { query: query.trim() } } as any);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={[
          s.scroll,
          { paddingBottom: z(105) + insets.bottom },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={s.header}>
          <View style={s.brand}>
            <Image source={require('../../assets/images/vku-logo.png')} style={s.logo} />
            <Text style={s.brandName}>Study Hub</Text>
          </View>
          <View style={s.headerRight}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Xem lời mời ghép bàn"
              onPress={() => router.push('/table-invitation' as any)}
              style={s.bellButton}
            >
              <Feather name="bell" size={z(19)} color={COLORS.title} />
              <View style={s.bellDot} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Hồ sơ cá nhân"
              onPress={() => router.push('/profile' as any)}
              style={s.avatar}
            >
              <Text style={s.avatarText}>AN</Text>
            </Pressable>
          </View>
        </View>

        <View style={s.searchBox}>
          <Feather name="search" size={z(20)} color={COLORS.body} />
          <TextInput
            accessibilityLabel="Tìm trong tài liệu của tôi"
            value={query}
            onChangeText={setQuery}
            placeholder="Tìm trong tài liệu của tôi..."
            placeholderTextColor={COLORS.body}
            style={s.searchInput}
            returnKeyType="search"
            onSubmitEditing={searchDocuments}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Lọc tài liệu"
            onPress={() => setNotice('Bộ lọc nâng cao sẽ khả dụng khi Kho tài liệu được kết nối.')}
            hitSlop={8}
          >
            <Feather name="sliders" size={z(19)} color={COLORS.body} />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.filterScroll}
          contentContainerStyle={s.filterRow}
        >
          {FILTERS.map((filter) => {
            const selected = activeFilter === filter.label;
            return (
              <Pressable
                key={filter.label}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setActiveFilter(filter.label)}
                style={[s.filterChip, selected && s.filterChipSelected]}
              >
                <Text style={[s.filterText, selected && s.filterTextSelected]}>
                  {filter.label} ({filter.count})
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={s.storageCard}>
          <View style={s.storageTop}>
            <View style={s.storageIcon}>
              <Feather name="cloud" size={z(22)} color={COLORS.navy} />
              <View style={s.storageCheck}>
                <Feather name="check" size={z(8)} color={COLORS.white} />
              </View>
            </View>
            <View style={s.storageInfo}>
              <Text style={s.storageTitle}>VKU Google Drive</Text>
              <Text style={s.storageAccount}>student.vku@vku.udn.vn</Text>
            </View>
            <Text style={s.storageAmount}>12% (124 MB / 1 GB)</Text>
          </View>
          <View style={s.progressTrack}>
            <View style={s.progressFill} />
          </View>
        </View>

        <View style={s.actionRow}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/add-document' as any)}
            style={s.actionCard}
          >
            <View style={s.actionIcon}>
              <Feather name="upload" size={z(20)} color={COLORS.navy} />
            </View>
            <View style={s.actionCopy}>
              <Text style={s.actionTitle}>Tải lên file</Text>
              <Text style={s.actionSubtitle}>Chọn từ máy</Text>
            </View>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/scan-document' as any)}
            style={s.actionCard}
          >
            <View style={s.actionIcon}>
              <Feather name="maximize" size={z(20)} color={COLORS.orange} />
            </View>
            <View style={s.actionCopy}>
              <Text style={s.actionTitle}>Quét nhận QR</Text>
              <Text style={s.actionSubtitle}>Nhận tức thì</Text>
            </View>
          </Pressable>
        </View>

        <View style={s.listHeading}>
          <Text style={s.listTitle}>Danh sách tài liệu</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={newestFirst ? 'Sắp xếp mới nhất' : 'Sắp xếp cũ nhất'}
            onPress={() => setNewestFirst((value) => !value)}
            style={s.sortButton}
          >
            <Text style={s.sortText}>{newestFirst ? 'Mới nhất' : 'Cũ nhất'}</Text>
            <Feather name="chevron-down" size={z(16)} color={COLORS.body} />
          </Pressable>
        </View>

        {documents.map((document) => (
          <DocumentCard
            key={document.id}
            document={document}
            onCreateQr={createQr}
            onOpen={() => openDocument(document)}
            onMore={() => setNotice('Thao tác tài liệu sẽ khả dụng khi Kho tài liệu được kết nối.')}
          />
        ))}
        {documents.length === 0 && (
          <View style={s.emptyState}>
            <Feather name="search" size={z(24)} color={COLORS.muted} />
            <Text style={s.emptyText}>Không tìm thấy tài liệu phù hợp.</Text>
          </View>
        )}
        {notice.length > 0 && (
          <Text accessibilityLiveRegion="polite" style={s.notice}>{notice}</Text>
        )}
      </ScrollView>
      <StudyHubTabBar active="docs" bottom={Math.max(insets.bottom - 20, 13)} />
    </SafeAreaView>
  );
}

function DocumentCard({
  document,
  onCreateQr,
  onOpen,
  onMore,
}: {
  document: DocumentItem;
  onCreateQr: () => void;
  onOpen: () => void;
  onMore: () => void;
}) {
  const { s, z } = useDesign(raw);

  return (
    <View style={s.documentCard}>
      <View style={[s.documentIcon, { backgroundColor: document.iconBg }]}>
        <Feather name={document.icon} size={z(21)} color={document.tint} />
      </View>
      <View style={s.documentBody}>
        <View style={s.documentHeading}>
          <Text style={s.documentTitle}>{document.title}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Tùy chọn ${document.title}`}
            onPress={onMore}
            hitSlop={9}
            style={s.moreButton}
          >
            <Feather name="more-vertical" size={z(19)} color={COLORS.body} />
          </Pressable>
        </View>
        <View style={s.metadataRow}>
          <View style={s.subjectPill}>
            <Text numberOfLines={1} style={s.subjectText}>{document.subject}</Text>
          </View>
          <View style={[s.formatPill, document.format === 'PDF' && s.pdfPill]}>
            <Text style={[s.formatText, document.format === 'PDF' && s.pdfText]}>
              {document.format}
            </Text>
          </View>
          <Text style={s.fileSize}>{document.size}</Text>
        </View>
        <Text style={s.dateText}>• {document.date}</Text>
        <View style={s.documentActions}>
          <Pressable
            accessibilityRole="button"
            onPress={onCreateQr}
            style={s.qrButton}
          >
            <Feather name="grid" size={z(16)} color={COLORS.title} />
            <Text style={s.qrButtonText}>Tạo QR</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={onOpen}
            style={s.openButton}
          >
            <Feather name="eye" size={z(17)} color={COLORS.white} />
            <Text style={s.openButtonText}>Mở</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const cardShadow = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.045,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
} as const;

const raw = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  scroll: { paddingHorizontal: 30, paddingTop: 16 },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 49, height: 32, resizeMode: 'contain' },
  brandName: {
    marginLeft: 12,
    fontFamily: FONT.bold,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.5,
    color: COLORS.brand,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    ...cardShadow,
  },
  bellDot: {
    position: 'absolute',
    top: 6,
    right: 7,
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.white,
    backgroundColor: '#D91F36',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.brand,
  },
  avatarText: { fontFamily: FONT.bold, fontSize: 12, lineHeight: 17, color: COLORS.white },
  searchBox: {
    height: 42,
    marginTop: 15,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    ...cardShadow,
  },
  searchInput: {
    flex: 1,
    marginLeft: 11,
    padding: 0,
    fontFamily: FONT.regular,
    fontSize: 13,
    color: COLORS.title,
  },
  filterScroll: { marginTop: 16, marginHorizontal: -30 },
  filterRow: { paddingHorizontal: 30, gap: 8 },
  filterChip: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.pale,
  },
  filterChipSelected: { backgroundColor: COLORS.navy },
  filterText: { fontFamily: FONT.semi, fontSize: 12, lineHeight: 17, color: '#555866' },
  filterTextSelected: { color: COLORS.white },
  storageCard: {
    marginTop: 17,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 31,
    backgroundColor: COLORS.white,
    ...cardShadow,
  },
  storageTop: { flexDirection: 'row', alignItems: 'center' },
  storageIcon: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.pale,
  },
  storageCheck: {
    position: 'absolute',
    right: 1,
    bottom: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.navy,
  },
  storageInfo: { flex: 1, minWidth: 0, marginLeft: 10 },
  storageTitle: { fontFamily: FONT.semi, fontSize: 15, lineHeight: 21, color: COLORS.title },
  storageAccount: { marginTop: 1, fontFamily: FONT.regular, fontSize: 11.5, lineHeight: 17, color: COLORS.body },
  storageAmount: { marginLeft: 7, fontFamily: FONT.bold, fontSize: 11, lineHeight: 16, color: '#F15B2A' },
  progressTrack: { height: 6, marginTop: 13, borderRadius: 5, backgroundColor: '#EBEAFD' },
  progressFill: { width: '12%', height: '100%', borderRadius: 5, backgroundColor: COLORS.navy },
  actionRow: { marginTop: 16, flexDirection: 'row', gap: 11 },
  actionCard: {
    flex: 1,
    minWidth: 0,
    minHeight: 61,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 34,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    ...cardShadow,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.pale,
  },
  actionCopy: { flex: 1, minWidth: 0, marginLeft: 10 },
  actionTitle: { fontFamily: FONT.semi, fontSize: 11.5, lineHeight: 16, color: COLORS.title },
  actionSubtitle: { marginTop: 1, fontFamily: FONT.regular, fontSize: 11, lineHeight: 16, color: COLORS.body },
  listHeading: {
    marginTop: 27,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listTitle: { fontFamily: FONT.extra, fontSize: 16, lineHeight: 22, letterSpacing: -0.4, color: COLORS.title },
  sortButton: { flexDirection: 'row', alignItems: 'center' },
  sortText: { marginRight: 3, fontFamily: FONT.semi, fontSize: 11.5, lineHeight: 17, color: COLORS.body },
  documentCard: {
    marginBottom: 12,
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.white,
    ...cardShadow,
  },
  documentIcon: {
    width: 38,
    height: 38,
    marginTop: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentBody: { flex: 1, minWidth: 0, marginLeft: 11 },
  documentHeading: { flexDirection: 'row', alignItems: 'flex-start' },
  documentTitle: {
    flex: 1,
    fontFamily: FONT.bold,
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: -0.25,
    color: COLORS.title,
  },
  moreButton: { width: 21, marginLeft: 6, alignItems: 'flex-end' },
  metadataRow: { marginTop: 4, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 7 },
  subjectPill: {
    maxWidth: '57%',
    minHeight: 23,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
    justifyContent: 'center',
    backgroundColor: COLORS.pale,
  },
  subjectText: { fontFamily: FONT.semi, fontSize: 10, lineHeight: 14, color: COLORS.navy },
  formatPill: { minHeight: 22, paddingHorizontal: 7, borderRadius: 5, justifyContent: 'center', backgroundColor: '#FFE0D5' },
  formatText: { fontFamily: FONT.bold, fontSize: 10, lineHeight: 14, color: '#B83B09' },
  pdfPill: { backgroundColor: '#FFE0DD' },
  pdfText: { color: COLORS.red },
  fileSize: { fontFamily: FONT.regular, fontSize: 11, lineHeight: 16, color: COLORS.body },
  dateText: { marginTop: 7, fontFamily: FONT.regular, fontSize: 11, lineHeight: 16, color: COLORS.body },
  documentActions: { marginTop: 14, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  qrButton: {
    minWidth: 91,
    height: 30,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.pale,
  },
  qrButtonText: { marginLeft: 6, fontFamily: FONT.semi, fontSize: 11, lineHeight: 16, color: COLORS.title },
  openButton: {
    minWidth: 67,
    height: 30,
    paddingHorizontal: 11,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.navy,
  },
  openButtonText: { marginLeft: 6, fontFamily: FONT.semi, fontSize: 11, lineHeight: 16, color: COLORS.white },
  emptyState: { minHeight: 130, alignItems: 'center', justifyContent: 'center' },
  emptyText: { marginTop: 9, fontFamily: FONT.medium, fontSize: 12, lineHeight: 18, color: COLORS.body },
  notice: { marginTop: 8, textAlign: 'center', fontFamily: FONT.medium, fontSize: 11.5, lineHeight: 18, color: COLORS.navy },
});
