import { safeBack } from '../utils/navigation';
import DocumentViewerModal, { DocumentViewerItem } from '../components/DocumentViewerModal';
import DropdownMenu, { DropdownMenuItem } from '../components/DropdownMenu';
import { useEffect, useMemo, useState } from 'react';

import {

  Pressable,

  ScrollView,

  StyleSheet,

  Text,

  TextInput,

  View,

} from 'react-native';

import { useAlert } from '../components/AlertContext';

import { documentService } from '../services/documentService';

import { radarService } from '../services/radarService';

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




const SEARCH_SORT_OPTIONS: DropdownMenuItem[] = [
  { id: 'relevance', label: 'Phù hợp nhất', sublabel: 'Ưu tiên kết quả khớp chính xác từ khóa', icon: 'zap' },
  { id: 'newest', label: 'Mới nhất', sublabel: 'Tài liệu và hoạt động vừa cập nhật gần đây', icon: 'clock' },
  { id: 'downloads', label: 'Nhiều tương tác nhất', sublabel: 'Nhiều lượt tải, đánh giá hoặc kết nối', badge: 'Thịnh hành', icon: 'trending-up' },
  { id: 'title_asc', label: 'Tên A → Z', sublabel: 'Thứ tự chữ cái theo tiêu đề', icon: 'file-text' },
];

const COLORS = {

  navy: '#101D83',

  title: '#17243A',

  body: '#858996',

  border: '#E1E9F3',

  pale: '#F6F8FB',

  white: '#FFFFFF',

  green: '#10B981',

  redBg: '#FFE0DD',

  redText: '#C91F26',

  purpleBg: '#ECEBFF',

  orangeBg: '#FFE0D5',

  orangeText: '#B83B09',

};



const FONT = {

  regular: 'Inter_400Regular',

  medium: 'Inter_500Medium',

  semi: 'Inter_600SemiBold',

  bold: 'Inter_700Bold',

  extra: 'Inter_800ExtraBold',

};



const CATEGORIES = [

  'Tất cả kết quả',

  'Bạn bè',

  'Môn học',

  'Tài liệu',

  'Đề thi',

  'Slide bài giảng',

] as const;



const RESULTS: any[] = [];
const FRIENDS: any[] = [];
const SUBJECT_TEMPLATES = [
  {
    id: 'subject-web',
    kind: 'subject' as const,
    code: 'IT002',
    title: 'Lập trình di động đa nền tảng',
    initials: 'IT',
    color: '#E8EDFF',
    searchText: 'Lập trình di động đa nền tảng IT002 React Native Web',
  },
  {
    id: 'subject-pm',
    kind: 'subject' as const,
    code: 'IT001',
    title: 'Quản lý dự án phần mềm',
    initials: 'IT',
    color: '#E8EDFF',
    searchText: 'Quản lý dự án phần mềm IT001 Scrum Agile',
  },
  {
    id: 'subject-db',
    kind: 'subject' as const,
    code: 'IT003',
    title: 'Cơ sở dữ liệu nâng cao',
    initials: 'IT',
    color: '#E8EDFF',
    searchText: 'Cơ sở dữ liệu nâng cao IT003 SQL Database',
  },
];



type DocumentResult = (typeof RESULTS)[number];

type SocialResult = (typeof FRIENDS)[number] | (typeof SUBJECT_TEMPLATES)[number];

type SearchResult = DocumentResult | SocialResult;



function normalizeSearchText(value: string) {

  return value

    .toLocaleLowerCase()

    .normalize('NFD')

    .replace(/[\u0300-\u036f]/g, '')

    .replace(/đ/g, 'd')

    .trim();

}



function matchesSearch(item: SearchResult, query: string) {

  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) return true;



  const kind = item.kind;

  if (normalizedQuery.includes('ban be') && kind === 'friend') return true;

  if (normalizedQuery.includes('mon hoc') && kind === 'subject') return true;

  if (normalizedQuery.includes('tai lieu') && kind === 'document') return true;



  const searchableText = normalizeSearchText(

    kind === 'document'

      ? `${item.title} ${item.owner} ${item.category}`

      : `${item.title} ${item.subtitle} ${item.searchText}`,

  );

  return searchableText.includes(normalizedQuery)

    || normalizedQuery.split(/\s+/).some((word) => word.length > 1 && searchableText.includes(word));

}



export default function SearchResultsScreen() {

  const { s, z } = useDesign(raw);

  const insets = useSafeAreaInsets();

  const params = useLocalSearchParams<{ query?: string }>();

  const initialQuery = Array.isArray(params.query) ? params.query[0] : params.query;

  const [fontsLoaded] = useFonts({

    Inter_400Regular,

    Inter_500Medium,

    Inter_600SemiBold,

    Inter_700Bold,

    Inter_800ExtraBold,

  });

  const [query, setQuery] = useState(initialQuery || '');

  const [submittedQuery, setSubmittedQuery] = useState(initialQuery || '');

  const [activeCategory, setActiveCategory] = useState('Tất cả kết quả');

  const { showSuccess, showInfo } = useAlert();

  const [searchSort, setSearchSort] = useState<'relevance' | 'newest' | 'downloads' | 'title_asc'>('relevance');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const [savedIds, setSavedIds] = useState<string[]>([]);

  const [apiDocuments, setApiDocuments] = useState<any[]>([]);

  const [apiBuddies, setApiBuddies] = useState<any[]>([]);

  const [notice, setNotice] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<DocumentViewerItem | null>(null);
  const [viewerVisible, setViewerVisible] = useState(false);

  const openDocumentViewer = (item: SearchResult) => {
    setSelectedDoc({
      id: item.id,
      title: item.title,
      subject: (item as any).category || 'Tài liệu học tập VKU',
      format: (item as any).type || 'PDF',
      fileUrl: (item as any).fileUrl,
      fileSizeBytes: (item as any).fileSizeBytes,
      description: (item as any).description,
      authorName: (item as any).owner,
    });
    setViewerVisible(true);
  };



  useEffect(() => {

    async function fetchServerResults() {

      try {

        const [docs, buddies] = await Promise.all([

          documentService.getDocuments({ search: submittedQuery }).catch(() => []),

          radarService.getBuddies({ search: submittedQuery }).catch(() => []),

        ]);

        if (Array.isArray(docs)) setApiDocuments(docs);

        if (Array.isArray(buddies)) setApiBuddies(buddies);

      } catch {

        // Fallback silently

      }

    }

    fetchServerResults();

  }, [submittedQuery]);



  const serverDocsFormatted = useMemo(() => {
    return apiDocuments.map((doc: any) => ({
      id: doc.id,
      kind: 'document' as const,
      type: doc.fileType || 'PDF',
      category: doc.category === 'DE_THI' ? 'Đề thi' : doc.category === 'BAI_GIANG' ? 'Slide bài giảng' : 'Tài liệu',
      title: doc.title,
      owner: doc.authorName || doc.ownerName || 'Thư viện môn học VKU',
      initials: (doc.authorName || doc.ownerName || 'VKU').split(' ').slice(-1)[0].substring(0, 2).toUpperCase(),
      ownerBackground: '#E4E5FF',
      ownerColor: '#343A8D',
      source: doc.authorName ? ('person' as const) : ('library' as const),
      authorId: doc.authorId,
      fileUrl: doc.fileUrl,
      fileSizeBytes: doc.fileSizeBytes,
      description: doc.description,
    }));
  }, [apiDocuments]);



  const serverBuddiesFormatted = useMemo(() => {
    return apiBuddies.map((buddy: any) => ({
      id: `friend-${buddy.userId || buddy.id || buddy.studentId}`,
      rawId: buddy.userId || buddy.id,
      kind: 'friend' as const,
      title: buddy.studentName || buddy.fullName || 'Sinh viên VKU',
      subtitle: `${buddy.courseName || 'Đang tự học'} · ${buddy.locationName || 'Thư viện'}`,
      initials: (buddy.studentName || buddy.fullName || 'SV').split(' ').slice(-1)[0].substring(0, 2).toUpperCase(),
      color: '#E4E5FF',
      faculty: buddy.studentId ? `Khoa CNTT • MSSV ${buddy.studentId}` : 'Khoa CNTT',
      searchText: `${buddy.studentName || buddy.fullName} bạn bè ${buddy.courseName || ''} ${buddy.locationName || ''} ${buddy.studyNote || ''}`,
    }));
  }, [apiBuddies]);



  const subjectsFormatted = useMemo(() => {
    return SUBJECT_TEMPLATES.map((s) => {
      const count = apiDocuments.filter((d: any) =>
        (d.courseName || d.courseCode || d.subject || d.title || '').toLocaleLowerCase().includes(s.title.toLocaleLowerCase()) ||
        (d.courseCode || '').toUpperCase() === s.code
      ).length;
      return {
        ...s,
        subtitle: `${s.code} · ${count > 0 ? `${count} tài liệu học tập` : 'Học phần VKU'}`,
      };
    });
  }, [apiDocuments]);

  const matchingResults = useMemo(

    () => [...serverDocsFormatted, ...serverBuddiesFormatted, ...subjectsFormatted].filter(

      (item, idx, self) =>

        matchesSearch(item, submittedQuery) && self.findIndex((i) => i.id === item.id) === idx

    ),

    [submittedQuery, serverDocsFormatted, serverBuddiesFormatted],

  );

  const results = useMemo(() => {

    let filtered = matchingResults.filter((item) => {

      if (activeCategory === 'Tất cả kết quả') return true;

      if (activeCategory === 'Bạn bè' || activeCategory === 'Môn học') {

        return item.kind === (activeCategory === 'Bạn bè' ? 'friend' : 'subject');

      }

      if (activeCategory === 'Tài liệu') return item.kind === 'document';

      return item.kind === 'document' && item.category === activeCategory;

    });

    if (searchSort === 'newest') {
      filtered = [...filtered].reverse();
    } else if (searchSort === 'title_asc') {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    } else if (searchSort === 'downloads') {
      filtered = [...filtered].sort((a, b) => {
        const dA = (a as any).downloads ? parseInt((a as any).downloads) || 0 : 0;
        const dB = (b as any).downloads ? parseInt((b as any).downloads) || 0 : 0;
        return dB - dA;
      });
    }
    return filtered;
  }, [activeCategory, matchingResults, searchSort]);



  const categoryCounts = useMemo(() => ({

    'Tất cả kết quả': matchingResults.length,

    'Bạn bè': matchingResults.filter((item) => item.kind === 'friend').length,

    'Môn học': matchingResults.filter((item) => item.kind === 'subject').length,

    'Tài liệu': matchingResults.filter((item) => item.kind === 'document').length,

    'Đề thi': matchingResults.filter((item) => item.kind === 'document' && item.category === 'Đề thi').length,

    'Slide bài giảng': matchingResults.filter((item) => item.kind === 'document' && item.category === 'Slide bài giảng').length,

  }), [matchingResults]);



  if (!fontsLoaded) return null;



  const performSearch = () => {

    setSubmittedQuery(query.trim());

    setActiveCategory('Tất cả kết quả');

    setNotice('');

  };



  const clearSearch = () => {

    setQuery('');

    setSubmittedQuery('');

    setNotice('');

  };



  const toggleSaved = async (item: DocumentResult) => {

    const isSaved = savedIds.includes(item.id);

    setSavedIds((current) => isSaved

      ? current.filter((id) => id !== item.id)

      : [...current, item.id]);

    if (!isSaved) {

      showSuccess('Đã lưu tài liệu', `Đã lưu "${item.title}" vào Kho tài liệu cá nhân của bạn.`);

      await documentService.toggleSaveDocument(item.id).catch(() => null);

    } else {

      showInfo('Bỏ lưu', `Đã xóa tài liệu khỏi danh sách yêu thích.`);

    }

  };



  const downloadResult = (item: SearchResult) => {

    showSuccess('Tải tài liệu thành công', `Tệp "${item.title}" đã được lưu về bộ nhớ ngoại tuyến của bạn.`);

  };



  const resultCount = results.length;



  return (

    <SafeAreaView style={s.safe} edges={['top']}>

      <ScrollView

        contentContainerStyle={[

          s.scroll,

          { paddingBottom: z(24) + insets.bottom },

        ]}

        keyboardShouldPersistTaps="handled"

        showsVerticalScrollIndicator={false}

      >

        <View style={s.searchHeader}>

          <Pressable

            accessibilityRole="button"

            accessibilityLabel="Quay lại"

            onPress={() => safeBack('/home')}

            style={s.backButton}

          >

            <Feather name="chevron-left" size={z(25)} color={COLORS.title} />

          </Pressable>

          <View style={s.searchBox}>

            <Feather name="search" size={z(21)} color={COLORS.navy} />

            <TextInput

                    accessibilityLabel="Tìm bạn, môn học hoặc tài liệu"

              value={query}

              onChangeText={setQuery}

              onSubmitEditing={performSearch}

              placeholder="Tìm tài liệu, môn học..."

              placeholderTextColor={COLORS.body}

              returnKeyType="search"

              style={s.searchInput}

            />

            {query.length > 0 && (

              <Pressable

                accessibilityRole="button"

                accessibilityLabel="Xóa nội dung tìm kiếm"

                onPress={clearSearch}

                hitSlop={8}

                style={s.clearButton}

              >

                <Feather name="x" size={z(17)} color="#555B67" />

              </Pressable>

            )}

          </View>

          <Pressable

            accessibilityRole="button"

            accessibilityLabel="Lọc kết quả tìm kiếm"

            onPress={() => setNotice('Đã lọc kết quả tìm kiếm.')}

            style={s.filterButton}

          >

            <Feather name="filter" size={z(18)} color={COLORS.navy} />

          </Pressable>

        </View>



        <ScrollView

          horizontal

          showsHorizontalScrollIndicator={false}

          style={s.categoryScroll}

          contentContainerStyle={s.categoryRow}

        >

          {CATEGORIES.map((category) => {

            const selected = activeCategory === category;

            return (

              <Pressable

                key={category}

                accessibilityRole="button"

                accessibilityState={{ selected }}

                onPress={() => setActiveCategory(category)}

                style={[s.categoryChip, selected && s.categoryChipSelected]}

              >

                <Text style={[s.categoryText, selected && s.categoryTextSelected]}>

                  {category} ({categoryCounts[category]})

                </Text>

                {selected && (

                  <Feather name="check" size={z(15)} color={COLORS.white} />

                )}

              </Pressable>

            );

          })}

        </ScrollView>



        <View style={s.resultsMeta}>

          <View style={s.resultSummary}>

            <View style={s.greenDot} />

            <Text style={s.summaryText}>Tìm thấy </Text>

            <Text style={s.summaryCount}>{resultCount}</Text>

            <Text style={s.summaryText}> kết quả cho </Text>

            <Text numberOfLines={1} style={s.summaryQuery}>“{submittedQuery || 'tất cả'}”</Text>

          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Chọn kiểu sắp xếp"
            onPress={() => setSortDropdownOpen(true)}
            style={s.sortButton}
          >
            <Text style={s.sortText}>
              {SEARCH_SORT_OPTIONS.find((o) => o.id === searchSort)?.label || 'Phù hợp'}
            </Text>
            <Feather name="chevron-down" size={z(16)} color={COLORS.title} />
          </Pressable>

        </View>



        {results.map((item) => item.kind === 'document' ? (

          <ResultCard

            key={item.id}

            item={item}

            saved={savedIds.includes(item.id)}

            onSave={() => toggleSaved(item)}

            onDownload={() => downloadResult(item)}
            onOpen={() => openDocumentViewer(item)}

            s={s}

            z={z}

          />

        ) : (

          <PersonSubjectCard

            key={item.id}

            item={item}

            onPress={() => setNotice(`Trang học phần ${item.title} sẽ mở khi Kho tài liệu được kết nối.`)}

            s={s}

            z={z}

          />

        ))}

        {results.length === 0 && (

          <View style={s.emptyState}>

            <Feather name="search" size={z(27)} color="#9AAAC1" />

            <Text style={s.emptyTitle}>Chưa tìm thấy kết quả</Text>

            <Text style={s.emptyText}>Thử từ khóa khác hoặc chọn một loại kết quả khác.</Text>

          </View>

        )}

        {notice.length > 0 && (

          <Text accessibilityLiveRegion="polite" style={s.notice}>{notice}</Text>

        )}

      </ScrollView>

    <DropdownMenu
        visible={sortDropdownOpen}
        title="Sắp xếp kết quả tìm kiếm"
        items={SEARCH_SORT_OPTIONS}
        selectedId={searchSort}
        onSelect={(item) => {
          setSearchSort(item.id as any);
        }}
        onClose={() => setSortDropdownOpen(false)}
      />
      <DocumentViewerModal
        visible={viewerVisible}
        document={selectedDoc}
        onClose={() => setViewerVisible(false)}
        onCreateQr={(doc: any) => {
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



function ResultCard({
  item,
  saved,
  onSave,
  onOpen,
  onDownload,
  s,
  z,
}: {
  item: DocumentResult;
  saved: boolean;
  onSave: () => void;
  onOpen?: () => void;
  onDownload: () => void;
  s: Record<string, any>;
  z: (value: number) => number;
}) {

  const isPdf = item.type === 'PDF';

  const isZip = item.type === 'ZIP CODE';



  return (

    <View style={s.resultCard}>

      <View style={[

        s.fileType,

        isPdf ? s.pdfType : isZip ? s.zipType : s.archiveType,

      ]}>

        <Text style={[

          s.fileTypeText,

          isPdf ? s.pdfTypeText : isZip ? s.zipTypeText : s.archiveTypeText,

        ]}>

          {item.type}

        </Text>

      </View>



      <Text style={s.resultTitle}>{item.title}</Text>



      <Pressable

        accessibilityRole={item.source === 'person' ? 'button' : undefined}

        accessibilityLabel={item.source === 'person' ? `Xem hồ sơ ${item.owner}` : undefined}

        onPress={item.source === 'person'

          ? () => router.push({

            pathname: '/student-profile',

            params: { studentId: (item as any).authorId || (item as any).rawId || 'usr_vku', name: item.owner },

          } as any)

          : undefined}

        style={s.ownerRow}

      >

        {item.source === 'library' ? (

          <Feather name="home" size={z(17)} color={COLORS.navy} />

        ) : item.source === 'person' ? (

          <View style={[s.initialsBadge, { backgroundColor: item.ownerBackground }]}>

            <Text style={[s.initialsText, { color: item.ownerColor }]}>{item.initials}</Text>

          </View>

        ) : (

          <Text style={s.authorLabel}>Tác giả:</Text>

        )}

        <Text style={[

          s.ownerName,

          item.source === 'library' && s.libraryName,

          item.source === 'author' && s.authorName,

        ]}>

          {item.owner}

        </Text>

      </Pressable>



      {item.source === 'library' && <View style={s.separator} />}



      <View style={s.cardActions}>

        <Pressable

          accessibilityRole="button"

          accessibilityLabel={saved ? `Bỏ lưu ${item.title}` : `Lưu ${item.title}`}

          accessibilityState={{ selected: saved }}

          onPress={onSave}

          style={[s.saveButton, saved && s.saveButtonSelected]}

        >

          <Feather

            name="bookmark"

            size={z(17)}

            color={saved ? COLORS.white : COLORS.body}

            fill={saved ? COLORS.white : 'transparent'}

          />

          <Text style={[s.saveButtonText, saved && s.saveButtonTextSelected]}>

            {saved ? 'Đã lưu' : 'Lưu'}

          </Text>

        </Pressable>

        <Pressable

          accessibilityRole="button"

          onPress={onDownload}

          style={s.downloadButton}

        >

          <Feather name="download" size={z(17)} color={COLORS.white} />

          <Text style={s.downloadButtonText}>Tải về</Text>

        </Pressable>

      </View>

    </View>

  );

}



function PersonSubjectCard({

  item,

  onPress,

  s,

  z,

}: {

  item: SocialResult;

  onPress: () => void;

  s: Record<string, any>;

  z: (value: number) => number;

}) {

  const isFriend = item.kind === 'friend';



  return (

    <View style={s.socialCard}>

      <View style={s.socialTop}>

        <View style={[s.socialAvatar, { backgroundColor: item.color }]}>

          {isFriend ? (

            <Text style={s.socialInitials}>{item.initials}</Text>

          ) : (

            <Feather name="book-open" size={z(19)} color={COLORS.navy} />

          )}

        </View>

        <View style={s.socialCopy}>

          <Text style={s.socialTitle}>{item.title}</Text>

          <Text style={s.socialSubtitle}>{item.subtitle}</Text>

        </View>

        {isFriend && (

          <View style={s.onlineIndicator} accessibilityLabel="Đang hoạt động" />

        )}

      </View>

      <Pressable

        accessibilityRole="button"

        onPress={() => {

          if (item.kind === 'friend') {

            router.push({

              pathname: '/student-profile',

              params: {

                studentId: item.id.replace('friend-', ''),

                name: item.title,

              },

            } as any);

            return;

          }

          onPress();

        }}

        style={s.socialAction}

      >

        <Feather

          name={isFriend ? 'user' : 'book'}

          size={z(15)}

          color={COLORS.navy}

        />

        <Text style={s.socialActionText}>{isFriend ? 'Xem hồ sơ' : 'Xem học phần'}</Text>

        <Feather name="chevron-right" size={z(16)} color={COLORS.navy} />

      </Pressable>

    </View>

  );

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

  scroll: { paddingTop: 16, paddingBottom: 24 },

  searchHeader: {

    height: 53,

    paddingHorizontal: 18,

    flexDirection: 'row',

    alignItems: 'center',

    gap: 8,

  },

  backButton: {

    width: 38,

    height: 38,

    borderRadius: 22,

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor: COLORS.white,

    ...cardShadow,

  },

  searchBox: {

    flex: 1,

    minWidth: 0,

    height: 40,

    paddingHorizontal: 14,

    borderRadius: 24,

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: COLORS.white,

    ...cardShadow,

  },

  searchInput: {

    flex: 1,

    minWidth: 0,

    marginLeft: 9,

    padding: 0,

    fontFamily: FONT.semi,

    fontSize: 14,

    lineHeight: 20,

    color: COLORS.title,

  },

  clearButton: {

    width: 24,

    height: 24,

    borderRadius: 12,

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor: COLORS.pale,

  },

  filterButton: {

    width: 38,

    height: 38,

    borderRadius: 21,

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor: COLORS.white,

    ...cardShadow,

  },

  categoryScroll: {

    marginTop: 24,

    paddingBottom: 8,

    borderBottomWidth: 1,

    borderBottomColor: '#F3F5F8',

  },

  categoryRow: { paddingHorizontal: 18, gap: 7 },

  categoryChip: {

    minHeight: 35,

    paddingHorizontal: 15,

    borderWidth: 1,

    borderColor: COLORS.border,

    borderRadius: 23,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    gap: 6,

    backgroundColor: COLORS.pale,

  },

  categoryChipSelected: {

    paddingHorizontal: 16,

    borderColor: COLORS.navy,

    backgroundColor: COLORS.navy,

    ...cardShadow,

  },

  categoryText: { fontFamily: FONT.semi, fontSize: 12, lineHeight: 17, color: '#505463' },

  categoryTextSelected: { fontFamily: FONT.bold, color: COLORS.white },

  resultsMeta: {

    minHeight: 58,

    paddingLeft: 30,

    paddingRight: 30,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    gap: 7,

  },

  resultSummary: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center' },

  greenDot: { width: 6, height: 6, marginRight: 7, borderRadius: 3, backgroundColor: COLORS.green },

  summaryText: { fontFamily: FONT.regular, fontSize: 11.5, lineHeight: 17, color: COLORS.body },

  summaryCount: { fontFamily: FONT.bold, fontSize: 11.5, lineHeight: 17, color: COLORS.title },

  summaryQuery: { flexShrink: 1, fontFamily: FONT.bold, fontSize: 11.5, lineHeight: 17, color: COLORS.navy },

  sortButton: {

    height: 28,

    paddingHorizontal: 9,

    borderWidth: 1,

    borderColor: COLORS.border,

    borderRadius: 17,

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: COLORS.pale,

  },

  sortText: { marginRight: 3, fontFamily: FONT.semi, fontSize: 11, lineHeight: 15, color: COLORS.title },

  resultCard: {

    marginHorizontal: 18,

    marginBottom: 15,

    paddingHorizontal: 15,

    paddingTop: 15,

    paddingBottom: 14,

    borderWidth: 1,

    borderColor: COLORS.border,

    borderRadius: 30,

    backgroundColor: COLORS.white,

    ...cardShadow,

  },

  socialCard: {

    marginHorizontal: 18,

    marginBottom: 13,

    paddingHorizontal: 15,

    paddingVertical: 13,

    borderWidth: 1,

    borderColor: COLORS.border,

    borderRadius: 26,

    backgroundColor: COLORS.white,

    ...cardShadow,

  },

  socialTop: { flexDirection: 'row', alignItems: 'center' },

  socialAvatar: {

    width: 42,

    height: 42,

    borderRadius: 22,

    alignItems: 'center',

    justifyContent: 'center',

  },

  socialInitials: { fontFamily: FONT.bold, fontSize: 13, lineHeight: 18, color: COLORS.title },

  socialCopy: { flex: 1, minWidth: 0, marginLeft: 11 },

  socialTitle: { fontFamily: FONT.bold, fontSize: 14, lineHeight: 20, color: COLORS.title },

  socialSubtitle: { marginTop: 2, fontFamily: FONT.regular, fontSize: 11, lineHeight: 16, color: COLORS.body },

  onlineIndicator: { width: 9, height: 9, marginLeft: 8, borderRadius: 5, backgroundColor: COLORS.green },

  socialAction: {

    minHeight: 31,

    marginTop: 11,

    paddingHorizontal: 10,

    borderWidth: 1,

    borderColor: COLORS.border,

    borderRadius: 18,

    flexDirection: 'row',

    alignItems: 'center',

    alignSelf: 'flex-end',

    backgroundColor: COLORS.pale,

  },

  socialActionText: { marginHorizontal: 6, fontFamily: FONT.semi, fontSize: 11, lineHeight: 16, color: COLORS.navy },

  fileType: {

    alignSelf: 'flex-start',

    minHeight: 23,

    paddingHorizontal: 10,

    borderRadius: 15,

    justifyContent: 'center',

  },

  pdfType: { backgroundColor: COLORS.redBg },

  archiveType: { backgroundColor: COLORS.purpleBg },

  zipType: { backgroundColor: COLORS.orangeBg },

  fileTypeText: { fontFamily: FONT.extra, fontSize: 12, lineHeight: 17, letterSpacing: 0.2 },

  pdfTypeText: { color: COLORS.redText },

  archiveTypeText: { color: '#4B4B5C' },

  zipTypeText: { color: COLORS.orangeText },

  resultTitle: {

    marginTop: 9,

    fontFamily: FONT.bold,

    fontSize: 15,

    lineHeight: 21,

    letterSpacing: -0.3,

    color: COLORS.title,

  },

  ownerRow: { minHeight: 30, marginTop: 11, flexDirection: 'row', alignItems: 'center' },

  initialsBadge: { width: 21, height: 21, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },

  initialsText: { fontFamily: FONT.extra, fontSize: 10, lineHeight: 14 },

  ownerName: { marginLeft: 7, fontFamily: FONT.medium, fontSize: 12, lineHeight: 18, color: COLORS.title },

  libraryName: { fontFamily: FONT.bold, color: COLORS.navy },

  authorLabel: { fontFamily: FONT.regular, fontSize: 12, lineHeight: 18, color: COLORS.body },

  authorName: { marginLeft: 6 },

  separator: { height: 1, marginTop: 8, backgroundColor: COLORS.border },

  cardActions: { marginTop: 20, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },

  saveButton: {

    minWidth: 70,

    height: 34,

    paddingHorizontal: 12,

    borderWidth: 1,

    borderColor: COLORS.border,

    borderRadius: 22,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor: '#F8FAFD',

  },

  saveButtonSelected: { borderColor: COLORS.navy, backgroundColor: COLORS.navy },

  saveButtonText: { marginLeft: 6, fontFamily: FONT.medium, fontSize: 13, lineHeight: 18, color: COLORS.title },

  saveButtonTextSelected: { fontFamily: FONT.semi, color: COLORS.white },

  openButton: {
    minWidth: 70,
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#101D83',
    gap: 5,
  },
  openButtonText: {
    fontFamily: FONT.semi,
    fontSize: 13,
    color: '#FFFFFF',
  },
  downloadButton: {

    minWidth: 82,

    height: 34,

    paddingHorizontal: 13,

    borderRadius: 22,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor: COLORS.navy,

  },

  downloadButtonText: { marginLeft: 6, fontFamily: FONT.medium, fontSize: 13, lineHeight: 18, color: COLORS.white },

  emptyState: { minHeight: 220, marginHorizontal: 18, alignItems: 'center', justifyContent: 'center' },

  emptyTitle: { marginTop: 11, fontFamily: FONT.bold, fontSize: 14, lineHeight: 20, color: COLORS.title },

  emptyText: { marginTop: 5, textAlign: 'center', fontFamily: FONT.regular, fontSize: 12, lineHeight: 18, color: COLORS.body },

  notice: { marginHorizontal: 18, marginTop: 3, textAlign: 'center', fontFamily: FONT.medium, fontSize: 12, lineHeight: 18, color: COLORS.navy },

});

