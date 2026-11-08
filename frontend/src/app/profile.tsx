import { safeBack } from '../utils/navigation';
import { useState, useEffect } from 'react';
import { authService, documentService } from '../services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAlert } from '../components/AlertContext';
import LucideIcon, {
  ChevronLeft,
  Settings,
  Pencil,
  BookOpen,
  Plus,
  Check,
  Target,
  Trophy,
  GraduationCap,
  Layers,
  SlidersHorizontal,
  Eye,
  LayoutGrid,
  MoreVertical,
  FileText,
  RotateCcw,
  Upload,
  PlusCircle,
  Trash2,
  X,
  Award,
  Zap,
} from '../components/DynamicLucideIcon';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import DocumentViewerModal, { DocumentViewerItem } from '../components/DocumentViewerModal';
import DropdownMenu, { DropdownMenuItem } from '../components/DropdownMenu';
import { TemoStaggeredView, TemoPressable } from '../components/temoEffects';
import { useDesign } from '../components/design-scale';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';

// ====== Tài nguyên (cắt trực tiếp từ thiết kế Figma) ======
const IMG = {
  avatar: require('../../assets/images/avatar.png'),
  back: require('../../assets/images/ic-back.png'),
  gear: require('../../assets/images/ic-gear.png'),
  pencil: require('../../assets/images/ic-pencil.png'),
  book: require('../../assets/images/ic-book.png'),
  plusWhite: require('../../assets/images/ic-plus-white.png'),
  check: require('../../assets/images/ic-check-white.png'),
  plusGray: require('../../assets/images/ic-plus-gray.png'),
  target: require('../../assets/images/ic-target.png'),
  layers: require('../../assets/images/ic-layers.png'),
  trophy: require('../../assets/images/ic-trophy.png'),
  cap: require('../../assets/images/ic-cap.png'),
  filter: require('../../assets/images/ic-filter.png'),
};

// ====== Màu đo từ ảnh thiết kế ======
const C = {
  primary: '#374F8A',
  ink: '#1E2E4F',
  body: '#64748B',
  muted: '#94A3B8',
  label: '#475569',
  line: '#F1F5F9',
  soft: '#F8FAFC',
  blue: '#EDF3FA',
  chipLight: '#F3F5FA',
  chipLightBorder: '#ECF0F6',
  cream: '#FFF8EA',
  yellowBg: '#FFF9E5',
  yellowBorder: '#FED014',
  radioOff: '#CBD5E1',
  white: '#FFFFFF',
};

const F = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semi: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extra: 'Inter_800ExtraBold',
};

const COURSES = [
  'Lập trình Web',
  'Cấu trúc dữ liệu & GT',
  'Mạng máy tính',
  'Trí tuệ nhân tạo',
  'Kỹ thuật phần mềm',
];

const DEFAULT_GOALS = [
  {
    id: 'exam',
    title: 'Ôn thi cuối kỳ',
    sub: 'Ưu tiên tìm bạn luyện đề và chia sẻ tóm tắt',
    iconType: 'layers',
  },
  {
    id: 'hackathon',
    title: 'Tìm nhóm Hackathon VKU',
    sub: 'Cần Frontend UI và lập trình AI',
    iconType: 'trophy',
  },
  {
    id: 'thesis',
    title: 'Đồ án tốt nghiệp / Khóa luận',
    sub: 'Tập trung nghiên cứu chuyên sâu',
    iconType: 'cap',
  },
];

const FORMAT_OPTIONS: DropdownMenuItem[] = [
  { id: 'all', label: 'Tất cả định dạng', sublabel: 'Xem toàn bộ tài liệu học tập', icon: 'grid' },
  { id: 'pdf', label: 'Tệp PDF (.pdf)', sublabel: 'Đề thi, giáo trình, slide scan tài liệu', badge: 'PDF', icon: 'file-text' },
  { id: 'docx', label: 'Tài liệu Word (.docx, .doc)', sublabel: 'Đề cương, bài tập lớn, tóm tắt môn học', badge: 'Word', icon: 'file' },
  { id: 'xlsx', label: 'Bảng tính Excel (.xlsx)', sublabel: 'Bảng tra cứu, thống kê, điểm danh', badge: 'Excel', icon: 'table' },
  { id: 'pptx', label: 'Bản thuyết trình PPT (.pptx)', sublabel: 'Slide bài giảng, bài báo cáo nhóm', badge: 'Slide', icon: 'monitor' },
];
export default function ProfileScreen() {
  const { s, z } = useDesign(raw);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  const [courseList, setCourseList] = useState<string[]>([
    'Lập trình Web',
    'Cấu trúc dữ liệu & GT',
    'Mạng máy tính',
    'Trí tuệ nhân tạo',
    'Kỹ thuật phần mềm',
  ]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([
    'Lập trình Web',
    'Cấu trúc dữ liệu & GT',
    'Mạng máy tính',
  ]);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const { showError, showSuccess } = useAlert();
  const [goalsList, setGoalsList] = useState<any[]>(DEFAULT_GOALS);
  const [goal, setGoal] = useState('exam');
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalSub, setNewGoalSub] = useState('');
  const [newGoalIcon, setNewGoalIcon] = useState('target');
  const [profileData, setProfileData] = useState<any>(null);
  const [myDocsCount, setMyDocsCount] = useState<number>(0);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState(false);
  const [myDocs, setMyDocs] = useState<any[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentViewerItem | null>(null);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectedDocForAction, setSelectedDocForAction] = useState<any>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [formatDropdownOpen, setFormatDropdownOpen] = useState(false);

  const handleDeleteDoc = async (doc: any) => {
    try {
      await documentService.deleteDocument(doc.id);
      setMyDocs((prev) => prev.filter((item) => (item.document?.id || item.id) !== doc.id));
      setMyDocsCount((prev) => Math.max(0, prev - 1));
      showSuccess('Đã xóa tài liệu', `Tài liệu "${doc.title}" đã được xóa khỏi kho.`);
    } catch {
      setMyDocs((prev) => prev.filter((item) => (item.document?.id || item.id) !== doc.id));
      setMyDocsCount((prev) => Math.max(0, prev - 1));
      showSuccess('Đã xóa tài liệu', `Tài liệu "${doc.title}" đã được xóa khỏi kho.`);
    }
  };

  const filteredMyDocs = myDocs.filter((item) => {
    if (selectedFormat === 'all') return true;
    const doc = item.document || item;
    const format = (doc.fileType || doc.format || '').toLowerCase();
    return format.includes(selectedFormat.toLowerCase());
  });

  useEffect(() => {
    authService.getCurrentUser().then((user: any) => {
      if (user) {
        setProfileData(user);
        if (user.courses && user.courses.length > 0) {
          setSelectedCourses(user.courses);
        }
      }
    }).catch(() => { });
    AsyncStorage.getItem('@vku_user_avatar').then((a) => {
      if (a) setCustomAvatar(a);
    }).catch(() => { });
    Promise.all([
      documentService.getSavedDocuments().catch(() => []),
      documentService.getDocuments().catch(() => []),
    ]).then(([saved, allDocs]) => {
      const userUploaded = (allDocs || []).filter((d: any) =>
        d.authorId === 'usr_01' ||
        (d.authorName && (d.authorName.toLowerCase().includes('hoàng') || d.authorName.toLowerCase().includes('hoang')))
      );
      const combined = [
        ...(saved || []),
        ...userUploaded.map((d: any) => ({ document: d, id: d.id, savedAt: d.createdAt }))
      ];
      const uniqueDocs = Array.from(new Map(combined.map((item: any) => {
        const doc = item.document || item;
        return [doc.id, item];
      })).values());
      setMyDocs(uniqueDocs);
      setMyDocsCount(uniqueDocs.length);
    }).catch(() => { });
    AsyncStorage.getItem('@vku_custom_courses').then((raw) => {
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCourseList((prev) => Array.from(new Set([...prev, ...parsed])));
          }
        } catch { }
      }
    });
    AsyncStorage.getItem('@vku_custom_goals').then((raw) => {
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setGoalsList([...DEFAULT_GOALS, ...parsed]);
          }
        } catch { }
      }
    });
    AsyncStorage.getItem('@vku_active_goal').then((val) => {
      if (val) setGoal(val);
    });
  }, []);

  if (!fontsLoaded) return null;

  const handleAddCourse = async () => {
    if (!newCourseName.trim()) {
      showError('Thiếu thông tin', 'Vui lòng nhập tên môn học.');
      return;
    }
    const trimmed = newCourseName.trim();
    if (courseList.includes(trimmed)) {
      if (!selectedCourses.includes(trimmed)) {
        const nextSelected = [...selectedCourses, trimmed];
        setSelectedCourses(nextSelected);
        await authService.updateProfile({ enrolledCourses: nextSelected }).catch(() => { });
      }
      showSuccess('Đã kích hoạt môn học', `Môn "${trimmed}" đã được thêm vào danh sách môn đang học!`);
      setShowAddCourseModal(false);
      setNewCourseName('');
      return;
    }
    const nextCourses = [...courseList, trimmed];
    const nextSelected = [...selectedCourses, trimmed];
    setCourseList(nextCourses);
    setSelectedCourses(nextSelected);

    await AsyncStorage.setItem('@vku_custom_courses', JSON.stringify(nextCourses)).catch(() => { });
    await authService.updateProfile({ enrolledCourses: nextSelected }).catch(() => { });

    showSuccess('Thêm môn thành công', `Đã thêm môn "${trimmed}" vào danh sách học tập của bạn!`);
    setShowAddCourseModal(false);
    setNewCourseName('');
  };

  const toggleCourse = async (name: string) => {
    const next = selectedCourses.includes(name)
      ? selectedCourses.filter((c) => c !== name)
      : [...selectedCourses, name];
    setSelectedCourses(next);
    await authService.updateProfile({ enrolledCourses: next }).catch(() => { });
  };
  const goBack = () => {
    safeBack('/home');
  };

  const handleCreateGoal = async () => {
    if (!newGoalTitle.trim()) {
      showError('Thiếu thông tin', 'Vui lòng nhập tên mục tiêu học tập.');
      return;
    }
    const newId = `goal_custom_${Date.now()}`;
    const newGoalItem = {
      id: newId,
      title: newGoalTitle.trim(),
      sub: newGoalSub.trim() || 'Ưu tiên kết nối cùng môn trên Study Radar',
      iconType: newGoalIcon,
      isCustom: true,
    };
    const updated = [...goalsList, newGoalItem];
    setGoalsList(updated);
    setGoal(newId);

    const customOnly = updated.filter((g) => g.isCustom);
    await AsyncStorage.setItem('@vku_custom_goals', JSON.stringify(customOnly)).catch(() => { });
    await AsyncStorage.setItem('@vku_active_goal', newId).catch(() => { });
    await authService.updateProfile({ studyGoals: newGoalItem.title }).catch(() => { });

    showSuccess('Đã tạo mục tiêu', `Mục tiêu "${newGoalItem.title}" đã được lưu và kích hoạt trên Study Radar!`);
    setShowAddGoalModal(false);
    setNewGoalTitle('');
    setNewGoalSub('');
    setNewGoalIcon('target');
  };

  const handleSelectGoal = async (g: any) => {
    setGoal(g.id);
    await AsyncStorage.setItem('@vku_active_goal', g.id).catch(() => { });
    await authService.updateProfile({ studyGoals: g.title }).catch(() => { });
    showSuccess('Đã kích hoạt mục tiêu', `Mục tiêu "${g.title}" đã được kích hoạt trên Study Radar.`);
  };

  const handleDeleteCustomGoal = async (id: string) => {
    const updated = goalsList.filter((g) => g.id !== id);
    setGoalsList(updated);
    const customOnly = updated.filter((g) => g.isCustom);
    await AsyncStorage.setItem('@vku_custom_goals', JSON.stringify(customOnly)).catch(() => { });
    if (goal === id) {
      setGoal('exam');
      await AsyncStorage.setItem('@vku_active_goal', 'exam').catch(() => { });
      await authService.updateProfile({ studyGoals: DEFAULT_GOALS[0].title }).catch(() => { });
    }
    showSuccess('Đã xóa mục tiêu', 'Mục tiêu học tập tùy chỉnh đã được gỡ bỏ.');
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== Header ===== */}
        <View style={s.header}>
          <Pressable style={s.circleBtn} onPress={goBack}>
            <ChevronLeft size={z(20)} color={C.primary} strokeWidth={2.2} />
          </Pressable>
          <Text style={s.headerTitle}>Hồ sơ sinh viên</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cài đặt ứng dụng"
            onPress={() => router.push('/app-settings' as any)}
            style={s.circleBtn}
          >
            <Settings size={z(20)} color={C.primary} strokeWidth={2} />
          </Pressable>
        </View>

        {/* ===== Thẻ thông tin ===== */}
        <View style={[s.card, s.profileCard]}>
          <View style={s.avatarBox}>
            <Image source={(!avatarError && (profileData?.avatarUrl || customAvatar) && !(profileData?.avatarUrl || customAvatar).includes('avatar_usr_01_default.png')) ? { uri: profileData?.avatarUrl || customAvatar } : IMG.avatar} onError={() => setAvatarError(true)} style={[s.avatar, { borderRadius: 33 }]} />
          </View>
          <View style={s.profileText}>
            <Text style={s.name}>{profileData?.fullName || 'Nguyễn Quang Hoàng'}</Text>
            <Text style={s.mssv}>{`MSSV: ${profileData?.studentId || '23IT.B063'}`}</Text>
            <Text style={s.faculty}>{profileData?.major || profileData?.faculty || 'Khoa Công nghệ Thông tin'}</Text>
          </View>
          <Pressable style={s.editBtn} onPress={() => router.push('/edit-profile' as any)}>
            <Pencil size={z(14)} color={C.primary} strokeWidth={2} />
          </Pressable>
        </View>

        {/* ===== Môn đang học trong kỳ ===== */}
        <View style={[s.card, s.sectionCard]}>
          <View style={s.sectionHeader}>
            <View style={[s.iconCircle, { backgroundColor: C.blue }]}>
              <BookOpen size={z(14)} color={C.primary} strokeWidth={2} />
            </View>
            <View style={s.sectionText}>
              <Text style={s.sectionTitle}>Môn đang học trong kỳ</Text>
              <Text style={s.sectionSub}>Tối ưu gợi ý Radar & Kho tài liệu</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Thêm môn học mới"
              style={s.addBtn}
              onPress={() => setShowAddCourseModal(true)}
            >
              <Plus size={z(11)} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={s.addText}>Thêm</Text>
            </Pressable>
          </View>

          <View style={s.chips}>
            {courseList.map((name) => {
              const on = selectedCourses.includes(name);
              return (
                <Pressable
                  key={name}
                  accessibilityRole="checkbox"
                  accessibilityLabel={`Môn học ${name}`}
                  accessibilityState={{ checked: on }}
                  onPress={() => toggleCourse(name)}
                  style={[s.chip, on ? s.chipOn : s.chipOff]}
                >
                  <Text style={[s.chipText, on ? s.chipTextOn : s.chipTextOff]}>
                    {name}
                  </Text>
                  {on ? (
                    <Check size={z(12)} color={C.primary} strokeWidth={2.8} style={{ marginLeft: 8 }} />
                  ) : (
                    <Plus size={z(11)} color={C.muted} strokeWidth={2.2} style={{ marginLeft: 8 }} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ===== Mục tiêu học tập ===== */}
        <View style={[s.card, s.sectionCard]}>
          <View style={s.sectionHeader}>
            <View style={[s.iconCircle, { backgroundColor: C.cream }]}>
              <Target size={z(16)} color="#F15B2A" strokeWidth={2} />
            </View>
            <View style={s.sectionText}>
              <Text style={s.sectionTitle}>Mục tiêu học tập</Text>
              <Text style={s.sectionSub}>Phát tín hiệu ưu tiên trên Radar bạn bè</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Tạo mục tiêu học tập mới"
              style={s.addBtn}
              onPress={() => setShowAddGoalModal(true)}
            >
              <Plus size={z(11)} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={s.addText}>Thêm</Text>
            </Pressable>
          </View>

          <View style={s.goals}>
            {goalsList.map((g) => {
              const active = goal === g.id;
              return (
                <Pressable
                  key={g.id}
                  accessibilityRole="radio"
                  accessibilityLabel={g.title}
                  accessibilityState={{ checked: active }}
                  onPress={() => handleSelectGoal(g)}
                  style={[s.goal, active ? s.goalActive : s.goalIdle]}
                >
                  <View
                    style={[
                      s.goalIcon,
                      { backgroundColor: active ? C.white : C.blue },
                    ]}
                  >
                    {g.iconType === 'trophy' ? (
                      <Trophy size={z(14)} color={active ? '#F15B2A' : C.primary} strokeWidth={2} />
                    ) : g.iconType === 'cap' ? (
                      <GraduationCap size={z(14)} color={active ? '#F15B2A' : C.primary} strokeWidth={2} />
                    ) : g.iconType === 'layers' ? (
                      <Layers size={z(14)} color={active ? '#F15B2A' : C.primary} strokeWidth={2} />
                    ) : (
                      <Target size={z(15)} color={active ? '#F15B2A' : C.primary} strokeWidth={2} />
                    )}
                  </View>
                  <View style={s.goalText}>
                    <Text style={s.goalTitle}>
                      {g.title} {active ? '(Active)' : ''}
                    </Text>
                    <Text style={s.goalSub}>{g.sub}</Text>
                  </View>
                  {g.isCustom && (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Xóa mục tiêu"
                      hitSlop={10}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleDeleteCustomGoal(g.id);
                      }}
                      style={{ padding: 6, marginRight: 6 }}
                    >
                      <Trash2 size={z(15)} color="#D14343" strokeWidth={2} />
                    </Pressable>
                  )}
                  <View style={[s.radio, active && { borderColor: C.primary }]}>
                    {active && <View style={s.radioDot} />}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ===== Tài liệu của tôi ===== */}
        <View style={s.docsHeader}>
          <View style={{ marginTop: z(7) }}>
            <Text style={s.docsTitle}>Tài liệu của tôi</Text>
            <Text style={s.docsSub}>
              {myDocsCount > 0
                ? `${filteredMyDocs.length}/${myDocsCount} tệp ${selectedFormat !== 'all' ? `(Lọc ${selectedFormat.toUpperCase()})` : 'trong kho cá nhân'}`
                : '0 tệp đã lưu trong kho cá nhân'}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Lọc định dạng tài liệu cá nhân"
            style={[s.filterBtn, selectedFormat !== 'all' && { backgroundColor: '#EEF2FF', borderWidth: 1, borderColor: '#374F8A' }]}
            onPress={() => setFormatDropdownOpen(true)}
          >
            <SlidersHorizontal size={z(13)} color={C.muted} strokeWidth={2} />
          </Pressable>
        </View>

        {/* Danh sách tài liệu cá nhân */}
        <View style={{ marginTop: z(12), gap: z(10), paddingBottom: z(20) }}>
          {filteredMyDocs.length > 0 ? (
            filteredMyDocs.map((item: any, index: number) => {
              const doc = item.document || item;
              const format = (doc.fileType || doc.format || 'PDF').toUpperCase();
              const isDocx = format.includes('DOC') || format.includes('WORD');
              const isPdf = format.includes('PDF');
              const isXls = format.includes('XLS') || format.includes('SHEET');

              return (
                <TemoStaggeredView key={doc.id || index} index={index}>
                  <View style={s.myDocCard}>
                    <View
                      style={[
                        s.myDocIconBox,
                        { backgroundColor: isPdf ? '#FEE2E2' : isDocx ? '#DBEAFE' : isXls ? '#D1FAE5' : '#FFEDD5' },
                      ]}
                    >
                      <LucideIcon
                        name={isPdf ? 'file-text' : isDocx ? 'file-text' : isXls ? 'layout-grid' : 'file'}
                        size={z(19)}
                        color={isPdf ? '#DC2626' : isDocx ? '#1D4ED8' : isXls ? '#059669' : '#EA580C'}
                      />
                    </View>

                    <View style={s.myDocInfo}>
                      <Text style={s.myDocTitle} numberOfLines={1}>{doc.title}</Text>
                      <Text style={s.myDocMeta} numberOfLines={1}>
                        {doc.courseName || doc.subject || 'Đại học VKU'} • {doc.fileSizeBytes ? `${(doc.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB` : (doc.size || '2.1 MB')}
                      </Text>
                    </View>

                    <View style={s.myDocActions}>
                      <TemoPressable
                        style={s.myDocOpenBtn}
                        onPress={() => {
                          setSelectedDoc(doc);
                          setViewerVisible(true);
                        }}
                      >
                        <Eye size={z(14)} color="#101D83" strokeWidth={2} />
                        <Text style={s.myDocOpenText}>Mở</Text>
                      </TemoPressable>

                      <TemoPressable
                        style={s.myDocQrBtn}
                        onPress={() =>
                          router.push({
                            pathname: '/document-qr',
                            params: { docId: doc.id, title: doc.title, size: doc.size },
                          } as any)
                        }
                      >
                        <LayoutGrid size={z(15)} color="#475569" strokeWidth={2} />
                      </TemoPressable>

                      <TemoPressable
                        style={s.myDocMoreBtn}
                        accessibilityLabel={`Tùy chọn ${doc.title}`}
                        onPress={() => setSelectedDocForAction(doc)}
                      >
                        <MoreVertical size={z(16)} color="#475569" strokeWidth={2} />
                      </TemoPressable>
                    </View>
                  </View>
                </TemoStaggeredView>
              );
            })
          ) : (
            <View style={s.emptyDocCard}>
              <FileText size={z(28)} color={C.muted} strokeWidth={1.8} />
              <Text style={s.emptyDocTitle}>
                {selectedFormat !== 'all' ? `Không có tệp ${selectedFormat.toUpperCase()}` : 'Chưa có tài liệu trong kho'}
              </Text>
              <Text style={s.emptyDocSub}>
                {selectedFormat !== 'all' ? 'Thử chọn định dạng khác hoặc đặt lại bộ lọc.' : 'Tải lên hoặc quét mã QR bạn học để lưu tài liệu tại đây.'}
              </Text>
              {selectedFormat !== 'all' ? (
                <TemoPressable
                  style={s.uploadDocBtn}
                  onPress={() => setSelectedFormat('all')}
                >
                  <RotateCcw size={z(14)} color="#FFFFFF" strokeWidth={2.2} />
                  <Text style={s.uploadDocBtnText}>Xem tất cả định dạng</Text>
                </TemoPressable>
              ) : (
                <TemoPressable
                  style={s.uploadDocBtn}
                  onPress={() => router.push('/add-document' as any)}
                >
                  <Upload size={z(14)} color="#FFFFFF" strokeWidth={2.2} />
                  <Text style={s.uploadDocBtnText}>Đăng tải tài liệu mới</Text>
                </TemoPressable>
              )}
            </View>
          )}

          {myDocs.length > 0 && (
            <TemoPressable
              style={s.addMoreDocBtn}
              onPress={() => router.push('/add-document' as any)}
            >
              <PlusCircle size={z(15)} color={C.primary} strokeWidth={2} />
              <Text style={s.addMoreDocText}>Đăng tải thêm tài liệu khác</Text>
            </TemoPressable>
          )}
        </View>
      </ScrollView>

      {/* ===== Modal Tạo mục tiêu học tập mới ===== */}
      <Modal
        visible={showAddGoalModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddGoalModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={s.modalOverlay}
        >
          <Pressable style={s.modalBackdrop} onPress={() => setShowAddGoalModal(false)} />
          <View style={s.modalContainer}>
            <View style={s.modalHeader}>
              <View style={[s.iconCircle, { backgroundColor: C.cream }]}>
                <Target size={z(17)} color="#F15B2A" strokeWidth={2} />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={s.modalTitle}>Tạo mục tiêu học tập mới</Text>
                <Text style={s.modalSubtitle}>Phát tín hiệu ưu tiên trên Radar bạn bè</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Đóng"
                onPress={() => setShowAddGoalModal(false)}
                style={s.modalCloseBtn}
              >
                <X size={z(18)} color={C.body} strokeWidth={2} />
              </Pressable>
            </View>

            <View style={s.modalBody}>
              <Text style={s.inputLabel}>Tên mục tiêu học tập *</Text>
              <TextInput
                style={s.textInput}
                placeholder="VD: Luyện thi TOEIC 750+, Thi Olympic Tin học..."
                placeholderTextColor={C.muted}
                value={newGoalTitle}
                onChangeText={setNewGoalTitle}
                maxLength={60}
              />

              <Text style={[s.inputLabel, { marginTop: 12 }]}>Hoặc chọn nhanh mục tiêu VKU:</Text>
              <View style={s.quickChips}>
                {[
                  { t: 'Luyện thi TOEIC VKU', s: 'Mục tiêu 650+ chuẩn đầu ra ngoại ngữ VKU', i: 'target' },
                  { t: 'Nghiên cứu khoa học SV', s: 'Tìm bạn cùng viết bài báo NCKH và nộp đề tài', i: 'cap' },
                  { t: 'Luyện thuật toán ICPC', s: 'Giải đề LeetCode / Codeforces mỗi tối', i: 'trophy' },
                  { t: 'Làm đồ án chuyên ngành', s: 'Tìm đồng đội hoàn thiện dự án kỳ', i: 'layers' },
                ].map((item) => (
                  <Pressable
                    key={item.t}
                    onPress={() => {
                      setNewGoalTitle(item.t);
                      setNewGoalSub(item.s);
                      setNewGoalIcon(item.i);
                    }}
                    style={[s.quickChip, newGoalTitle === item.t && s.quickChipActive]}
                  >
                    <Text style={[s.quickChipText, newGoalTitle === item.t && s.quickChipTextActive]}>
                      {item.t}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={[s.inputLabel, { marginTop: 14 }]}>Mô tả chi tiết / Lời nhắn Radar</Text>
              <TextInput
                style={[s.textInput, s.textInputMulti]}
                placeholder="VD: Cần tìm bạn cùng luyện đề mỗi chiều tại Thư viện tầng 3..."
                placeholderTextColor={C.muted}
                value={newGoalSub}
                onChangeText={setNewGoalSub}
                multiline
                numberOfLines={2}
                maxLength={120}
              />

              <Text style={[s.inputLabel, { marginTop: 14 }]}>Biểu tượng hiển thị</Text>
              <View style={s.iconRow}>
                {[
                  { key: 'target', label: 'Mục tiêu', icon: 'target' },
                  { key: 'trophy', label: 'Thi đấu', icon: 'award' },
                  { key: 'cap', label: 'Đồ án', icon: 'book-open' },
                  { key: 'layers', label: 'Ôn tập', icon: 'zap' },
                ].map((item) => {
                  const isSelected = newGoalIcon === item.key;
                  return (
                    <Pressable
                      key={item.key}
                      onPress={() => setNewGoalIcon(item.key)}
                      style={[s.iconOption, isSelected && s.iconOptionSelected]}
                    >
                      <LucideIcon
                        name={item.icon}
                        size={z(15)}
                        color={isSelected ? C.white : C.primary}
                        strokeWidth={2}
                      />
                      <Text style={[s.iconOptionText, isSelected && s.iconOptionTextSelected]}>
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={s.modalFooter}>
              <Pressable style={s.cancelBtn} onPress={() => setShowAddGoalModal(false)}>
                <Text style={s.cancelBtnText}>Hủy</Text>
              </Pressable>
              <Pressable style={s.confirmBtn} onPress={handleCreateGoal}>
                <Check size={z(15)} color={C.white} strokeWidth={2.5} />
                <Text style={s.confirmBtnText}>Lưu & Kích hoạt</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ===== Modal Thêm Môn học ===== */}
      <Modal
        visible={showAddCourseModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddCourseModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={s.modalOverlay}
        >
          <Pressable style={s.modalBackdrop} onPress={() => setShowAddCourseModal(false)} />
          <View style={s.modalContainer}>
            <View style={s.modalHeader}>
              <View style={[s.iconCircle, { backgroundColor: C.blue }]}>
                <BookOpen size={z(17)} color={C.primary} strokeWidth={2} />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={s.modalTitle}>Thêm môn học trong kỳ</Text>
                <Text style={s.modalSubtitle}>Tối ưu gợi ý Radar & Kho tài liệu học tập</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Đóng"
                onPress={() => setShowAddCourseModal(false)}
                style={s.modalCloseBtn}
              >
                <X size={z(18)} color={C.body} strokeWidth={2} />
              </Pressable>
            </View>

            <View style={s.modalBody}>
              <Text style={s.inputLabel}>Tên môn học *</Text>
              <TextInput
                style={s.textInput}
                placeholder="VD: An toàn mạng, Hệ điều hành, React Native..."
                placeholderTextColor={C.muted}
                value={newCourseName}
                onChangeText={setNewCourseName}
                maxLength={60}
              />

              <Text style={[s.inputLabel, { marginTop: 12 }]}>Hoặc chọn nhanh môn học VKU:</Text>
              <View style={s.quickChips}>
                {[
                  'Lập trình Java',
                  'Cơ sở dữ liệu & SQL',
                  'Trí tuệ nhân tạo',
                  'An toàn mạng & Bảo mật',
                  'Phát triển ứng dụng di động',
                  'Thiết kế giao diện UI/UX',
                  'Hệ điều hành Linux',
                  'Kiến trúc máy tính',
                ].map((c) => (
                  <Pressable
                    key={c}
                    onPress={() => setNewCourseName(c)}
                    style={[s.quickChip, newCourseName === c && s.quickChipActive]}
                  >
                    <Text style={[s.quickChipText, newCourseName === c && s.quickChipTextActive]}>
                      {c}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={s.modalFooter}>
              <Pressable style={s.cancelBtn} onPress={() => setShowAddCourseModal(false)}>
                <Text style={s.cancelBtnText}>Hủy</Text>
              </Pressable>
              <Pressable style={s.confirmBtn} onPress={handleAddCourse}>
                <Plus size={z(16)} color={C.white} strokeWidth={2.5} />
                <Text style={s.confirmBtnText}>Thêm môn học</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <DocumentViewerModal
        visible={viewerVisible}
        document={selectedDoc}
        onClose={() => setViewerVisible(false)}
        onCreateQr={(doc) =>
          router.push({
            pathname: '/document-qr',
            params: { docId: doc.id, title: doc.title, size: doc.size },
          } as any)
        }
      />

      {/* Menu thao tác 3 chấm cho tài liệu cá nhân */}
      <DropdownMenu
        visible={Boolean(selectedDocForAction)}
        title={selectedDocForAction?.title || "Tùy chọn tài liệu"}
        subtitle={selectedDocForAction?.courseName || selectedDocForAction?.subject || "Thao tác trên tài liệu"}
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
            id: 'delete',
            label: 'Xóa tài liệu khỏi kho cá nhân',
            sublabel: 'Gỡ bỏ vĩnh viễn tệp này khỏi hệ thống',
            icon: 'trash-2',
            iconColor: '#E11D48',
            danger: true,
          },
        ]}
        onSelect={async (item) => {
          if (!selectedDocForAction) return;
          const target = selectedDocForAction;
          setSelectedDocForAction(null);
          if (item.id === 'open') {
            setSelectedDoc(target);
            setViewerVisible(true);
          } else if (item.id === 'qr') {
            router.push({
              pathname: '/document-qr',
              params: { docId: target.id, title: target.title, size: target.size },
            } as any);
          } else if (item.id === 'delete') {
            handleDeleteDoc(target);
          }
        }}
        onClose={() => setSelectedDocForAction(null)}
      />

      {/* Modal lọc theo định dạng tài liệu */}
      <DropdownMenu
        visible={formatDropdownOpen}
        title="Lọc theo định dạng tài liệu"
        items={FORMAT_OPTIONS}
        selectedId={selectedFormat}
        onSelect={(item) => {
          setSelectedFormat(item.id);
        }}
        onClose={() => setFormatDropdownOpen(false)}
      />
    </SafeAreaView>
  );
}

const cardShadow = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.05,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 1,
} as const;

const raw = StyleSheet.create({
  // Modal styles

  createGoalBtn: {
    marginTop: 10,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D4E2F4',
    borderStyle: 'dashed',
    backgroundColor: '#F8FAFD',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  createGoalBtnText: {
    fontFamily: F.semi,
    fontSize: 13,
    color: C.primary,
  },
  quickChips: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  quickChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: C.soft,
    borderWidth: 1,
    borderColor: C.chipLightBorder,
  },
  quickChipActive: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  quickChipText: {
    fontFamily: F.medium,
    fontSize: 11.5,
    color: C.label,
  },
  quickChipTextActive: {
    color: C.white,
    fontFamily: F.semi,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
  },
  modalContainer: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: C.white,
    borderRadius: 28,
    padding: 20,
    ...cardShadow,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: F.extra,
    fontSize: 16,
    lineHeight: 22,
    color: C.ink,
  },
  modalSubtitle: {
    marginTop: 1,
    fontFamily: F.regular,
    fontSize: 11.5,
    lineHeight: 16,
    color: C.muted,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    marginTop: 16,
  },
  inputLabel: {
    fontFamily: F.bold,
    fontSize: 12.5,
    lineHeight: 17,
    color: C.ink,
  },
  textInput: {
    marginTop: 6,
    minHeight: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    fontFamily: F.medium,
    fontSize: 13.5,
    color: C.ink,
  },
  textInputMulti: {
    minHeight: 70,
    paddingTop: 10,
    paddingBottom: 10,
    textAlignVertical: 'top',
  },
  iconRow: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 8,
  },
  iconOption: {
    flex: 1,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  iconOptionSelected: {
    borderColor: C.primary,
    backgroundColor: C.primary,
  },
  iconOptionText: {
    fontFamily: F.semi,
    fontSize: 11,
    color: C.ink,
  },
  iconOptionTextSelected: {
    color: C.white,
  },
  modalFooter: {
    marginTop: 20,
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.soft,
  },
  cancelBtnText: {
    fontFamily: F.bold,
    fontSize: 13.5,
    color: C.body,
  },
  confirmBtn: {
    flex: 1.6,
    height: 44,
    borderRadius: 16,
    backgroundColor: C.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  confirmBtnText: {
    fontFamily: F.bold,
    fontSize: 13.5,
    color: C.white,
  },

  safe: { flex: 1, backgroundColor: C.white },
  scroll: { paddingHorizontal: 18, paddingTop: 15, paddingBottom: 40 },

  // Header (cao 40)
  header: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    paddingBottom: 4,
    fontFamily: F.extra,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -1,
    color: C.ink,
  },

  // Khung thẻ chung
  card: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.line,
    ...cardShadow,
  },

  // Thẻ thông tin (cao 98)
  profileCard: {
    marginTop: 20,
    borderRadius: 48,
    paddingVertical: 18,
    paddingLeft: 18,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBox: { width: 60, height: 60 },
  avatar: { position: 'absolute', left: -2, top: -2, width: 66, height: 66 },
  profileText: { flex: 1, marginLeft: 16 },
  name: {
    fontFamily: F.extra,
    fontSize: 17,
    lineHeight: 24,
    letterSpacing: -0.3,
    color: C.ink,
  },
  mssv: {
    marginTop: 2,
    fontFamily: F.semi,
    fontSize: 13,
    lineHeight: 16,
    color: C.body,
  },
  faculty: {
    marginTop: 2,
    fontFamily: F.regular,
    fontSize: 12.5,
    lineHeight: 16,
    color: C.muted,
  },
  editBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.soft,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  // Thẻ mục (Môn học / Mục tiêu)
  sectionCard: {
    marginTop: 16,
    borderRadius: 32,
    paddingTop: 14.5,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 36.5,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionText: { flex: 1, marginLeft: 10 },
  sectionTitle: {
    fontFamily: F.extra,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.3,
    color: C.ink,
  },
  sectionSub: {
    marginTop: 0.5,
    fontFamily: F.regular,
    fontSize: 12.5,
    lineHeight: 16,
    color: C.muted,
  },
  addBtn: {
    height: 30.5,
    borderRadius: 15.25,
    paddingHorizontal: 15,
    backgroundColor: C.primary,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  addText: {
    marginLeft: 6,
    fontFamily: F.semi,
    fontSize: 13,
    lineHeight: 18,
    color: C.white,
  },

  // Chip môn học (cao 32)
  chips: {
    marginTop: 16.5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 7,
    rowGap: 8,
  },
  chip: {
    height: 32,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipOn: {
    backgroundColor: C.primary,
    paddingLeft: 15,
    paddingRight: 16,
  },
  chipOff: {
    backgroundColor: C.chipLight,
    borderWidth: 1,
    borderColor: C.chipLightBorder,
    paddingLeft: 14,
    paddingRight: 15,
  },
  chipText: { fontSize: 13, lineHeight: 18 },
  chipTextOn: { fontFamily: F.semi, color: C.white },
  chipTextOff: { fontFamily: F.medium, color: C.label },
  checkIcon: { width: 12, height: 9.5, marginLeft: 8.5 },
  plusIcon: { width: 10, height: 10.5, marginLeft: 8.5 },

  // Mục tiêu
  goals: { marginTop: 11.25, rowGap: 11 },
  goal: {
    minHeight: 65,
    borderRadius: 22,
    paddingVertical: 13,
    paddingLeft: 14,
    paddingRight: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalActive: {
    backgroundColor: C.yellowBg,
    borderWidth: 1.5,
    borderColor: C.yellowBorder,
  },
  goalIdle: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.line,
  },
  goalIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalText: { flex: 1, marginLeft: 11.5, marginRight: 16 },
  goalTitle: {
    fontFamily: F.bold,
    fontSize: 13,
    lineHeight: 19,
    color: C.ink,
  },
  goalSub: {
    marginTop: 0.5,
    fontFamily: F.regular,
    fontSize: 12.5,
    lineHeight: 17,
    color: C.body,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: C.radioOff,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.primary,
  },

  // Tài liệu của tôi
  docsHeader: {
    marginTop: 15.5,
    marginLeft: 4,
    marginRight: -2,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  docsTitle: {
    fontFamily: F.extra,
    fontSize: 18.5,
    lineHeight: 24,
    letterSpacing: -0.7,
    color: C.ink,
  },
  docsSub: {
    marginTop: 2,
    fontFamily: F.regular,
    fontSize: 13,
    lineHeight: 16,
    color: C.muted,
  },

  myDocCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8EEF5',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
      },
    }),
  },
  myDocIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myDocInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  myDocTitle: {
    fontFamily: F.bold,
    fontSize: 14,
    color: C.ink,
    lineHeight: 19,
  },
  myDocMeta: {
    fontFamily: F.regular,
    fontSize: 12,
    color: C.body,
    marginTop: 3,
  },
  myDocActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  myDocOpenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  myDocOpenText: {
    fontFamily: F.semi,
    fontSize: 12.5,
    color: '#101D83',
  },
  myDocQrBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  myDocMoreBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      web: { cursor: 'pointer' },
    }),
  },
  emptyDocCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8EEF5',
    borderStyle: 'dashed',
  },
  emptyDocTitle: {
    fontFamily: F.bold,
    fontSize: 14.5,
    color: C.ink,
    marginTop: 10,
  },
  emptyDocSub: {
    fontFamily: F.regular,
    fontSize: 12,
    color: C.body,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  uploadDocBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#101D83',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  uploadDocBtnText: {
    fontFamily: F.semi,
    fontSize: 13,
    color: '#FFFFFF',
  },
  addMoreDocBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    marginTop: 4,
  },
  addMoreDocText: {
    fontFamily: F.semi,
    fontSize: 13,
    color: C.primary,
  },

  filterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
});