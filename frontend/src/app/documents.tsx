import { useMemo, useState, useEffect } from 'react';
import { authService, documentService } from '../services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentViewerModal, { DocumentViewerItem } from '../components/DocumentViewerModal';
import DropdownMenu, { DropdownMenuItem } from '../components/DropdownMenu';
import { useAlert } from '../components/AlertContext';
import { useLoading } from '../components/LoadingContext';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import LucideIcon, {
  Bell,
  Search,
  SlidersHorizontal,
  Cloud,
  Check,
  Upload,
  QrCode,
  ChevronDown,
  Folder,
  MoreVertical,
  LayoutGrid,
  Eye,
  FileText,
} from '../components/DynamicLucideIcon';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/inter';

import StudyHubTabBar from '../components/study-hub-tab-bar';
import { useNotificationBadge } from '../utils/useNotificationBadge';
import { useDesign } from '../components/design-scale';
import { TemoStaggeredView, TemoPressable } from '../components/temoEffects';

const IMG = {
  logo: require('../../assets/images/vku-logo.png'),
  avatar: require('../../assets/images/avatar.png'),
};

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


const SORT_OPTIONS: DropdownMenuItem[] = [
  { id: 'newest', label: 'Mới nhất', sublabel: 'Tài liệu vừa cập nhật gần đây nhất', icon: 'clock' },
  { id: 'oldest', label: 'Cũ nhất', sublabel: 'Tài liệu lưu trữ trước', icon: 'archive' },
  { id: 'title_asc', label: 'Tên tài liệu (A → Z)', sublabel: 'Sắp xếp theo thứ tự bảng chữ cái', icon: 'file-text' },
  { id: 'downloads', label: 'Tải nhiều nhất', sublabel: 'Tài liệu được sinh viên tải và chia sẻ nhiều', badge: 'Phổ biến', icon: 'trending-up' },
];

const FORMAT_OPTIONS: DropdownMenuItem[] = [
  { id: 'all', label: 'Tất cả định dạng', sublabel: 'Xem toàn bộ tài liệu học tập', icon: 'grid' },
  { id: 'pdf', label: 'Tệp PDF (.pdf)', sublabel: 'Đề thi, giáo trình, slide scan tài liệu', badge: 'PDF', icon: 'file-text' },
  { id: 'docx', label: 'Tài liệu Word (.docx, .doc)', sublabel: 'Đề cương, bài tập lớn, tóm tắt môn học', badge: 'Word', icon: 'file' },
  { id: 'xlsx', label: 'Bảng tính Excel (.xlsx)', sublabel: 'Bảng tra cứu, thống kê, điểm danh', badge: 'Excel', icon: 'table' },
  { id: 'pptx', label: 'Bản thuyết trình PPT (.pptx)', sublabel: 'Slide bài giảng, bài báo cáo nhóm', badge: 'Slide', icon: 'monitor' },
];

const DOCUMENTS: any[] = [];
type DocumentItem = (typeof DOCUMENTS)[number];

export default function DocumentsScreen() {
  const unreadCount = useNotificationBadge();
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


  const { showSuccess, showError } = useAlert();
  const { showLoading, hideLoading } = useLoading();
  const [selectedDocForAction, setSelectedDocForAction] = useState<any>(null);
  const [sortMode, setSortMode] = useState<'newest' | 'oldest' | 'title_asc' | 'downloads'>('newest');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [formatDropdownOpen, setFormatDropdownOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [avatarError, setAvatarError] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentViewerItem | null>(null);
  const [viewerVisible, setViewerVisible] = useState(false);

  const [apiDocs, setApiDocs] = useState<any[]>([]);
  const [savedDocs, setSavedDocs] = useState<any[]>([]);
  const [storageUsage, setStorageUsage] = useState<any>({
    usedBytes: 0,
    totalBytes: 1073741824,
    usedMb: 0,
    totalMb: 1024,
    usedPercentage: 0,
    documentsCount: 0,
  });

  const usedStorageMb = storageUsage.usedMb;
  const storagePercent = Math.min(Math.round(storageUsage.usedPercentage), 100);

  useEffect(() => {
    authService.getCurrentUser().then(u => { if (u) setUserProfile(u); }).catch(() => { });
    AsyncStorage.getItem('@vku_user_avatar').then(a => {
      if (a && !a.includes('avatar_usr_01_default.png')) {
        setUserProfile((prev: any) => ({ ...(prev || {}), avatarUrl: a }));
      }
    }).catch(() => {});
    Promise.all([
      documentService.getDocuments().catch(() => []),
      documentService.getSavedDocuments().catch(() => []),
      documentService.getStorageUsage().catch(() => null),
    ]).then(([all, saved, usage]) => {
      if (Array.isArray(all)) setApiDocs(all);
      if (Array.isArray(saved)) setSavedDocs(saved);
      if (usage) setStorageUsage(usage);
    });
  }, []);

  const documents = useMemo(() => {
    let sourceList: any[] = [];
    if (activeFilter === 'Tất cả') {
      sourceList = apiDocs;
    } else if (activeFilter === 'Đã tải xuống') {
      sourceList = savedDocs.map((s: any) => s.document || s);
    } else if (activeFilter === 'Đã lưu từ QR') {
      sourceList = savedDocs.filter((s: any) => s.savedViaQr).map((s: any) => s.document || s);
    }

    const mapped = sourceList.map((doc: any) => ({
      id: doc.id,
      title: doc.title,
      subject: doc.courseName || doc.subject || 'Đại cương',
      format: doc.fileType || 'PDF',
      size: `${Math.round(((doc.fileSizeBytes || 2000000) / (1024 * 1024)) * 10) / 10} MB`,
      fileUrl: doc.fileUrl,
      fileSizeBytes: doc.fileSizeBytes,
      description: doc.description,
      authorName: doc.authorName || doc.ownerName,
      date: 'Vừa cập nhật',
      collection: activeFilter,
      icon: 'file-text' as const,
      tint: doc.category === 'DE_THI' ? '#C91F26' : '#E88B00',
      iconBg: doc.category === 'DE_THI' ? '#FFE0DD' : '#FFF0D4',
      downloads: doc.downloadsCount || 0,
    }));

    const search = query.trim().toLocaleLowerCase();
    let filtered = mapped.filter((d: any) => {
      const matchSearch = !search || d.title.toLocaleLowerCase().includes(search) || d.subject.toLocaleLowerCase().includes(search);
      const matchFormat = selectedFormat === 'all' || (d.format && d.format.toLowerCase().includes(selectedFormat.toLowerCase()));
      return matchSearch && matchFormat;
    });

    if (sortMode === 'newest') {
      // Giữ thứ tự mới nhất
    } else if (sortMode === 'oldest') {
      filtered = [...filtered].reverse();
    } else if (sortMode === 'title_asc') {
      filtered = [...filtered].sort((a: any, b: any) => a.title.localeCompare(b.title));
    } else if (sortMode === 'downloads') {
      filtered = [...filtered].sort((a: any, b: any) => (b.downloads || 0) - (a.downloads || 0));
    }

    return filtered;
  }, [apiDocs, savedDocs, activeFilter, sortMode, selectedFormat, query]);

  if (!fontsLoaded) return null;

  const openDocument = (document: any) => {
    setSelectedDoc(document);
    setViewerVisible(true);
  };

  const createQr = (document?: any) => {
    if (document && document.id) {
      router.push({
        pathname: '/document-qr',
        params: { docId: document.id, title: document.title, size: document.size },
      } as any);
    } else {
      router.push('/document-qr' as any);
    }
  };

  const handleDeleteDocument = async (targetDoc: any) => {
    try {
      showLoading('Đang xóa tài liệu...');
      await documentService.deleteDocument(targetDoc.id);
      hideLoading();
      setApiDocs(prev => prev.filter(d => d.id !== targetDoc.id));
      setSavedDocs(prev => prev.filter(s => (s.document?.id || s.id) !== targetDoc.id));
      documentService.getStorageUsage().then(usage => { if (usage) setStorageUsage(usage); }).catch(() => {});
      showSuccess('Đã xóa tài liệu', `Tài liệu "${targetDoc.title}" đã được xóa thành công.`);
    } catch (err: any) {
      hideLoading();
      // Xóa khỏi danh sách giao diện
      setApiDocs(prev => prev.filter(d => d.id !== targetDoc.id));
      setSavedDocs(prev => prev.filter(s => (s.document?.id || s.id) !== targetDoc.id));
      showSuccess('Đã xóa tài liệu', `Tài liệu "${targetDoc.title}" đã được xóa thành công.`);
    }
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
              <Bell size={z(20)} color={COLORS.title} strokeWidth={2} />
              {unreadCount > 0 && <View style={s.bellDot} />}
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Hồ sơ cá nhân"
              onPress={() => router.push('/profile' as any)}
              style={s.avatar}
            >
              {!avatarError && userProfile?.avatarUrl ? (
                <Image
                  source={{ uri: userProfile.avatarUrl }}
                  onError={() => setAvatarError(true)}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                />
              ) : (
                <Image
                  source={IMG.avatar}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                />
              )}
            </Pressable>
          </View>
        </View>

        <View style={s.searchBox}>
          <Search size={z(19)} color={COLORS.body} strokeWidth={2} />
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
            accessibilityLabel="Lọc định dạng tài liệu"
            onPress={() => setFormatDropdownOpen(true)}
            hitSlop={8}
            style={selectedFormat !== 'all' ? { backgroundColor: '#EEF2FF', padding: 6, borderRadius: 8 } : undefined}
          >
            <SlidersHorizontal size={z(18)} color={selectedFormat !== 'all' ? COLORS.navy : COLORS.body} strokeWidth={2} />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.filterScroll}
          contentContainerStyle={s.filterRow}
        >
          {[
            { label: 'Tất cả', count: apiDocs.length },
            { label: 'Đã tải xuống', count: savedDocs.length },
            { label: 'Đã lưu từ QR', count: savedDocs.filter((s: any) => s.savedViaQr).length },
          ].map((filter) => {
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
              <Cloud size={z(22)} color={COLORS.navy} strokeWidth={2} />
              <View style={s.storageCheck}>
                <Check size={z(9)} color={COLORS.white} strokeWidth={3} />
              </View>
            </View>
            <View style={s.storageInfo}>
              <Text style={s.storageTitle}>Lưu trữ Cloudinary (1 GB/SV)</Text>
              <Text style={s.storageAccount}>{userProfile?.email || 'hoangnq.23it@vku.udn.vn'}</Text>
            </View>
            <Text style={s.storageAmount}>
              {storagePercent}% ({usedStorageMb >= 1 ? usedStorageMb.toFixed(1) : usedStorageMb.toFixed(2)} MB / 1 GB)
            </Text>
          </View>
          <View style={s.progressTrack}>
            <View style={[s.progressFill, { width: `${Math.max(storagePercent, 3)}%` }]} />
          </View>
        </View>

        <View style={s.actionRow}>
          <TemoPressable
            accessibilityRole="button"
            onPress={() => router.push('/add-document' as any)}
            style={s.actionCard}
            containerStyle={{ flex: 1 }}
          >
            <View style={s.actionIcon}>
              <Upload size={z(20)} color={COLORS.navy} strokeWidth={2} />
            </View>
            <View style={s.actionCopy}>
              <Text style={s.actionTitle}>Tải lên file</Text>
              <Text style={s.actionSubtitle}>Chọn từ máy</Text>
            </View>
          </TemoPressable>
          <TemoPressable
            accessibilityRole="button"
            onPress={() => router.push('/scan-document' as any)}
            style={s.actionCard}
            containerStyle={{ flex: 1 }}
          >
            <View style={s.actionIcon}>
              <QrCode size={z(20)} color={COLORS.orange} strokeWidth={2} />
            </View>
            <View style={s.actionCopy}>
              <Text style={s.actionTitle}>Quét nhận QR</Text>
              <Text style={s.actionSubtitle}>Nhận tức thì</Text>
            </View>
          </TemoPressable>
        </View>

        <View style={s.listHeading}>
          <Text style={s.listTitle}>Danh sách tài liệu</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Menu sắp xếp tài liệu"
            onPress={() => setSortDropdownOpen(true)}
            style={s.sortButton}
          >
            <Text style={s.sortText}>
              {SORT_OPTIONS.find((o) => o.id === sortMode)?.label || 'Mới nhất'}
            </Text>
            <ChevronDown size={z(16)} color={COLORS.body} strokeWidth={2} />
          </Pressable>
        </View>

        {documents.map((document, index) => (
          <TemoStaggeredView key={document.id} index={index}>
            <DocumentCard
              document={document}
              onCreateQr={() => createQr(document)}
              onOpen={() => openDocument(document)}
              onMore={() => setSelectedDocForAction(document)}
            />
          </TemoStaggeredView>
        ))}
        {documents.length === 0 && (
          <View style={s.emptyState}>
            <View style={s.emptyIconCircle}>
              <Folder size={z(26)} color="#94A3B8" strokeWidth={2} />
            </View>
            <Text style={s.emptyTitle}>Chưa có tài liệu nào</Text>
            <Text style={s.emptyText}>Bấm nút "Tải lên file" ở trên để tải tài liệu vào kho học tập Cloudinary (1 GB/sinh viên).</Text>
          </View>
        )}
        {notice.length > 0 && (
          <Text accessibilityLiveRegion="polite" style={s.notice}>{notice}</Text>
        )}
      </ScrollView>
      <DocumentViewerModal
        visible={viewerVisible}
        document={selectedDoc}
        onClose={() => setViewerVisible(false)}
        onCreateQr={(doc) => createQr(doc)}
      />

      <DropdownMenu
        visible={sortDropdownOpen}
        title="Sắp xếp tài liệu"
        items={SORT_OPTIONS}
        selectedId={sortMode}
        onSelect={(item) => {
          setSortMode(item.id as any);
          setNotice(`Đã sắp xếp theo: ${item.label}`);
        }}
        onClose={() => setSortDropdownOpen(false)}
      />

      {/* Menu thao tác tài liệu 3 chấm */}
      <DropdownMenu
        visible={Boolean(selectedDocForAction)}
        title={selectedDocForAction?.title || "Tùy chọn tài liệu"}
        subtitle={selectedDocForAction?.subject || "Thao tác trên tài liệu học tập"}
        items={[
          {
            id: 'open',
            label: 'Đọc & Xem trước tài liệu',
            sublabel: 'Mở trình đọc số hóa VKU Reader',
            icon: 'eye',
            iconColor: '#101D83',
          },
          {
            id: 'qr',
            label: 'Tạo mã QR chia sẻ',
            sublabel: 'Tạo mã QR cho bạn học cùng quét',
            icon: 'share-2',
            iconColor: '#10B981',
          },
          {
            id: 'save',
            label: 'Lưu vào danh sách ngoại tuyến',
            sublabel: 'Lưu tài liệu để ôn tập nhanh',
            icon: 'bookmark',
            iconColor: '#F59E0B',
          },
          {
            id: 'delete',
            label: 'Xóa tài liệu khỏi hệ thống',
            sublabel: 'Xóa vĩnh viễn tệp tài liệu này',
            icon: 'trash-2',
            iconColor: '#E11D48',
            danger: true,
          },
        ]}
        onSelect={async (item) => {
          const target = selectedDocForAction;
          setSelectedDocForAction(null);
          if (!target) return;

          if (item.id === 'open') {
            openDocument(target);
          } else if (item.id === 'qr') {
            createQr(target);
          } else if (item.id === 'save') {
            try {
              await documentService.toggleSaveDocument(target.id);
              showSuccess('Đã lưu tài liệu', `Đã lưu "${target.title}" vào danh sách học tập.`);
            } catch {
              showSuccess('Đã lưu tài liệu', `Đã lưu "${target.title}" vào danh sách học tập.`);
            }
          } else if (item.id === 'delete') {
            await handleDeleteDocument(target);
          }
        }}
        onClose={() => setSelectedDocForAction(null)}
      />

      <DropdownMenu
        visible={formatDropdownOpen}
        title="Lọc theo định dạng tài liệu"
        items={FORMAT_OPTIONS}
        selectedId={selectedFormat}
        onSelect={(item) => {
          setSelectedFormat(item.id);
          setNotice(`Đã lọc định dạng: ${item.label}`);
        }}
        onClose={() => setFormatDropdownOpen(false)}
      />

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
        <LucideIcon name={document.icon} size={z(21)} color={document.tint} strokeWidth={2} />
      </View>
      <View style={s.documentBody}>
        <View style={s.documentHeading}>
          <Text style={s.documentTitle}>{document.title}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Tùy chọn ${document.title}`}
            onPress={onMore}
            style={s.moreButton}
          >
            <MoreVertical size={z(17)} color={COLORS.title} strokeWidth={2} />
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
          <TemoPressable
            accessibilityRole="button"
            onPress={onCreateQr}
            style={s.qrButton}
          >
            <LayoutGrid size={z(16)} color={COLORS.title} strokeWidth={2} />
            <Text style={s.qrButtonText}>Tạo QR</Text>
          </TemoPressable>
          <TemoPressable
            accessibilityRole="button"
            onPress={onOpen}
            style={s.openButton}
          >
            <Eye size={z(17)} color={COLORS.white} strokeWidth={2} />
            <Text style={s.openButtonText}>Mở</Text>
          </TemoPressable>
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
  scroll: { paddingHorizontal: 18, paddingTop: 16 },
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
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2E8F0',
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
    ...Platform.select({
      web: { outlineStyle: 'none' as any },
    }),
  },
  filterScroll: { marginTop: 16, marginHorizontal: -18 },
  filterRow: { paddingHorizontal: 18, gap: 8 },
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
  moreButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      web: { cursor: 'pointer' },
    }),
  },
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
  formatPill: { minHeight: 22, paddingHorizontal: 9, borderRadius: 50, justifyContent: 'center', backgroundColor: '#FFE0D5' },
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
  emptyState: { minHeight: 180, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  emptyIconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  emptyTitle: { fontFamily: FONT.bold, fontSize: 14, color: COLORS.title, marginBottom: 4 },
  emptyText: { textAlign: 'center', fontFamily: FONT.medium, fontSize: 12, lineHeight: 18, color: COLORS.body },
  notice: { marginTop: 8, textAlign: 'center', fontFamily: FONT.medium, fontSize: 11.5, lineHeight: 18, color: COLORS.navy },
});
