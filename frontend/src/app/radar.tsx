import { useMemo, useState, useEffect } from 'react';
import { radarService, authService } from '../services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAlert } from '../components/AlertContext';
import DropdownMenu, { DropdownMenuItem } from '../components/DropdownMenu';
import {
  Bell,
  Search,
  SlidersHorizontal,
  Crosshair,
  ChevronDown,
  ChevronUp,
  MapPin,
  Navigation,
  BookOpen,
  Check,
} from 'lucide-react-native';
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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
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
import { TemoStaggeredView, TemoPressable, TemoScreenTransition } from '../components/temoEffects';

const IMG = {
  logo: require('../../assets/images/vku-logo.png'),
  bell: require('../../assets/images/home/bell.png'),
  target: require('../../assets/images/home/target.png'),
  search: require('../../assets/images/home/search.png'),
  filter: require('../../assets/images/home/filter.png'),
  avatar: require('../../assets/images/avatar.png'),
};

const C = {
  primary: '#101D83',
  brand: '#374F8A',
  ink: '#1E293B',
  body: '#71829B',
  muted: '#94A3B8',
  line: '#E8EEF5',
  soft: '#F5F8FC',
  green: '#10B981',
  orange: '#F15A00',
  white: '#FFFFFF',
};

const F = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semi: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extra: 'Inter_800ExtraBold',
};

const VKU_LOCATIONS: DropdownMenuItem[] = [
  {
    id: 'loc_v_self_study',
    label: 'Khu tự học Tầng 3 - Nhà V',
    sublabel: 'Không gian mở tự do, bàn học nhóm rộng rãi',
    badge: 'Sáng tạo',
    icon: 'map-pin',
  },
  {
    id: 'loc_lib_f2',
    label: 'Thư viện VKU - Tầng 2',
    sublabel: 'Khu vực bàn học nhóm và máy tính tra cứu',
    badge: 'Sôi nổi',
    icon: 'book-open',
  },
  {
    id: 'loc_lib_f3',
    label: 'Thư viện VKU - Tầng 3',
    sublabel: 'Khu vực yên tĩnh tự học và đọc sách',
    badge: 'Tập trung',
    icon: 'book',
  },
  {
    id: 'loc_k_hall',
    label: 'Sảnh mở Tòa K',
    sublabel: 'Bàn ghế ngoài trời thoáng mát',
    badge: 'Thoáng đãng',
    icon: 'sun',
  },
  {
    id: 'loc_canteen',
    label: 'Căn tin trường VKU',
    sublabel: 'Khu vực ăn uống, nghỉ trưa và ôn bài nhẹ',
    badge: 'Giải lao',
    icon: 'coffee',
  },
  {
    id: 'loc_coffee_shop',
    label: 'Quán Cà phê Sinh viên VKU',
    sublabel: 'Có ổ cắm điện & wifi tốc độ cao',
    badge: 'Thảo luận',
    icon: 'wifi',
  },
];
const SUBJECTS = ['Lập trình Web', 'Cấu trúc DL & GT', 'Trí tuệ nhân tạo'];

const DEFAULT_VKU_STUDENTS = [
  {
    id: 'thao-my',
    name: 'Lê Thảo My',
    faculty: 'Khoa CNTT • Khóa K22',
    subject: 'Lập trình Web (React / Tailwind)',
    location: 'Bàn B12 • Tầng 3 Nhà V',
    status: 'Cách 15m',
    distanceMeters: 15,
    goal: 'Ôn thi cuối kỳ',
    requestFaculty: 'Khoa CNTT & Truyền thông · K22',
    requestLocation: 'Bàn B12 · Tầng 3, Nhà V (Thư viện VKU)',
    requestSubject: 'Lập trình Web — React Router & State Management',
    initials: 'TM',
  },
  {
    id: 'minh-anh',
    name: 'Nguyễn Minh Anh',
    faculty: 'Khoa CNTT • Khóa K22',
    subject: 'Lập trình Web & Di động',
    location: 'Khu tự học • Tầng 3',
    status: 'Cách 40m',
    distanceMeters: 40,
    goal: 'Làm bài tập nhóm',
    initials: 'MA',
  },
  {
    id: 'hoang-nam',
    name: 'Trần Hoàng Nam',
    faculty: 'Khoa CNTT • Khóa K21',
    subject: 'Lập trình Web nâng cao',
    location: 'Thư viện • Tầng 2',
    status: 'Cách 80m',
    distanceMeters: 80,
    goal: 'Ôn thi cuối kỳ',
    initials: 'HN',
  },
  {
    id: 'phuc-thinh',
    name: 'Đặng Phúc Thịnh',
    faculty: 'Khoa Kỹ thuật Máy tính • K23',
    subject: 'Cấu trúc DL & GT',
    location: 'Khu tự học Tầng 3 - Nhà V',
    status: 'Cách 20m',
    distanceMeters: 20,
    goal: 'Luyện LeetCode',
    initials: 'PT',
  },
  {
    id: 'khanh-huyen',
    name: 'Võ Thị Khánh Huyền',
    faculty: 'Khoa Kinh tế số & TMĐT • K22',
    subject: 'Tiếng Anh chuyên ngành',
    location: 'Thư viện VKU - Tầng 2',
    status: 'Cách 65m',
    distanceMeters: 65,
    goal: 'Luyện đề TOEIC 750+',
    initials: 'KH',
  },
];
export default function RadarScreen() {
  const { s, z } = useDesign(raw);
  const unreadCount = useNotificationBadge();
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });
  const { showSuccess, showWarning } = useAlert();
  const [ready, setReady] = useState(true);
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [filter, setFilter] = useState('Cùng môn: Web');
  const [query, setQuery] = useState('');
  const [selectedLocId, setSelectedLocId] = useState('loc_v_self_study');
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

  const selectedLocation = useMemo(() => {
    return VKU_LOCATIONS.find((l) => l.id === selectedLocId) || VKU_LOCATIONS[0];
  }, [selectedLocId]);

  const [activeBuddies, setActiveBuddies] = useState<any[]>([]);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState(false);
  useEffect(() => {
    authService.getCurrentUser().then(u => {
      if (u?.avatarUrl) setUserAvatar(u.avatarUrl);
    }).catch(() => {});
    AsyncStorage.getItem('@vku_user_avatar').then(a => {
      if (a && !a.includes('avatar_usr_01_default.png')) {
        setUserAvatar(a);
      }
    }).catch(() => {});
  }, []);

  const handleToggleReady = async () => {
    const nextState = !ready;
    setReady(nextState);
    if (nextState) {
      try {
        await radarService.checkIn({
          locationId: selectedLocation.id,
          courseCode: 'IT002',
          customLocationName: selectedLocation.label,
          customCourseName: subject,
          studyNote: 'Bàn tự học số B12',
        });
        showSuccess('Đã bật trạng thái', 'Bạn đang sáng đèn trên Study Radar. Sinh viên cùng môn có thể thấy bạn!');
      } catch {}
    } else {
      try {
        await radarService.checkOut();
        showWarning('Đã tắt trạng thái', 'Bạn đã ẩn khỏi Study Radar.');
      } catch {}
    }
  };

  useEffect(() => {
    let mounted = true;
    const loadBuddies = () => {
      radarService.getBuddies().then(data => {
        if (mounted && data) {
          setActiveBuddies(data);
        }
      }).catch(() => {});
    };

    loadBuddies();
    const interval = setInterval(loadBuddies, 4000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleSeeAll = () => {
    if (filter === 'Tất cả' && !query) {
      setFilter('Cùng môn: Web');
      showSuccess('Bộ lọc', 'Đã quay lại danh sách cùng môn học.');
    } else {
      setFilter('Tất cả');
      setQuery('');
      showSuccess('Xem tất cả', 'Đang hiển thị bạn học đang online quanh trường.');
    }
  };

  const students = useMemo(() => {
    const dynamicFromApi = activeBuddies.map((b: any, idx: number) => ({
      id: b.userId || b.id || `b_${idx}`,
      name: b.studentName || 'Sinh viên VKU',
      faculty: b.studentId ? `Khoa CNTT • ${b.studentId}` : 'Khoa CNTT',
      subject: b.courseName || subject || 'Lập trình di động',
      location: b.locationName || selectedLocation.label || 'Khu tự học Tầng 3 - Nhà V',
      status: 'Đang online',
      distanceMeters: (idx + 1) * 20,
      goal: b.studyNote || 'Ôn tập học kỳ',
      initials: (b.studentName || 'VKU').split(' ').slice(-1)[0].substring(0, 2).toUpperCase()
    }));

    // Merge API buddies with DEFAULT_VKU_STUDENTS to always guarantee online students
    const sourceList = dynamicFromApi.length > 0 ? dynamicFromApi : DEFAULT_VKU_STUDENTS;

    const normalizedQuery = query.trim().toLocaleLowerCase('vi');
    return sourceList.filter((student: any) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${student.name} ${student.faculty} ${student.subject} ${student.location}`
          .toLocaleLowerCase('vi')
          .includes(normalizedQuery);
      if (filter === 'Tất cả') return matchesQuery;
      const matchesSubject =
        filter !== 'Cùng môn: Web' ||
        student.subject.toLocaleLowerCase('vi').includes('web') ||
        student.subject.toLocaleLowerCase('vi').includes('di động') ||
        student.subject.toLocaleLowerCase('vi').includes('cntt') ||
        student.subject.toLocaleLowerCase('vi').includes('it');
      const matchesDistance =
        filter !== 'Gần tôi (<100m)' || (student.distanceMeters !== undefined && student.distanceMeters <= 100);
      const matchesLocation =
        filter !== 'Khu tự học' ||
        student.location.toLocaleLowerCase('vi').includes('tự học') ||
        student.location.toLocaleLowerCase('vi').includes('nhà v') ||
        student.location.toLocaleLowerCase('vi').includes('thư viện');
      return matchesQuery && matchesSubject && matchesDistance && matchesLocation;
    });
  }, [activeBuddies, filter, query]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={s.header}>
          <View style={s.brand}>
            <Image source={IMG.logo} style={s.logo} />
            <Text style={s.brandName}>Study Hub</Text>
          </View>
          <View style={s.headerRight}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Xem lời mời ghép bàn"
              style={s.bellBtn}
              onPress={() => router.push('/table-invitation' as any)}
            >
              <Bell size={z(20)} color={C.primary} strokeWidth={2} />
              {unreadCount > 0 && <View style={s.bellDot} />}
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Mở hồ sơ"
              style={s.avatarBtn}
              onPress={() => router.push('/profile' as any)}
            >
              {!avatarError && userAvatar ? (
                <Image
                  source={{ uri: userAvatar }}
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

        <View style={s.radarCard}>
          <View style={[s.ring, s.ringOuter]} />
          <View style={[s.ring, s.ringMiddle]} />
          <View style={[s.ring, s.ringInner]} />
          <View style={s.radarBadge}>
            <Crosshair size={z(24)} color="#1E293B" strokeWidth={2.2} />
          </View>

          <Text style={s.radarLabel}>STUDY RADAR</Text>
          <Text style={s.radarTitle}>Tìm bạn học quanh bạn</Text>
          <Text style={s.radarDescription}>
            Kết nối cùng sinh viên đang học tập tại{'\n'}
            các khu tự học & thư viện trường.
          </Text>

          <Pressable
            accessibilityRole="switch"
            accessibilityState={{ checked: ready }}
            accessibilityLabel="Sẵn sàng ghép bàn"
            onPress={handleToggleReady}
            style={s.readyRow}
          >
            <View style={[s.readyDot, !ready && s.readyDotOff]} />
            <Text style={s.readyText}>
              {ready ? 'Sẵn sàng ghép bàn' : 'Đang tạm dừng'}
            </Text>
            <View style={[s.track, ready ? s.trackOn : s.trackOff]}>
              <View style={[s.thumb, ready ? s.thumbOn : s.thumbOff]} />
            </View>
          </Pressable>

          <Text style={s.fieldLabel}>Môn học đang tập trung</Text>
          <ScrollView
            horizontal
            style={s.subjectScroll}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.subjectChips}
          >
            {SUBJECTS.map((name) => {
              const isSelected = subject === name;
              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  key={name}
                  onPress={() => setSubject(name)}
                  style={[s.subjectChip, isSelected ? s.subjectChipOn : s.subjectChipOff]}
                >
                  <Text style={[s.subjectText, isSelected && s.subjectTextOn]}>
                    {name}
                  </Text>
                  {isSelected && <Text style={s.subjectCheck}>✓</Text>}
                </Pressable>
              );
            })}
          </ScrollView>

          <Text style={s.locationLabel}>Vị trí hiện tại</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Mở menu chọn vị trí hiện tại"
            onPress={() => setLocationDropdownOpen(true)}
            style={s.locationCard}
          >
            <View style={s.locationIconBox}>
              <MapPin size={z(20)} color={C.primary} strokeWidth={2.2} />
            </View>
            <View style={s.locationText}>
              <Text style={s.locationTitle}>
                {selectedLocation.label}
              </Text>
              <Text style={s.onlineText}>
                ● {activeBuddies.length} sinh viên đang online
              </Text>
            </View>
            {locationDropdownOpen ? (
              <ChevronUp size={z(20)} color={C.muted} strokeWidth={2} />
            ) : (
              <ChevronDown size={z(20)} color={C.muted} strokeWidth={2} />
            )}
          </Pressable>
        </View>

        <View style={s.searchBox}>
          <Search size={z(16)} color={C.muted} strokeWidth={2} />
          <TextInput
            accessibilityLabel="Tìm bạn, môn học, tài liệu"
            style={s.searchInput}
            placeholder="Tìm bạn, môn học, tài liệu..."
            placeholderTextColor={C.muted}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Lọc kết quả"
            style={s.filterButton}
            onPress={() => setFilter((value) => (value === 'Cùng môn: Web' ? 'Gần tôi (<100m)' : 'Cùng môn: Web'))}
          >
            <SlidersHorizontal size={z(15)} color={C.muted} strokeWidth={2} />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.filterChips}
        >
          {['Cùng môn: Web', 'Gần tôi (<100m)', 'Khu tự học'].map((name) => {
            const selected = filter === name;
            return (
              <Pressable
                key={name}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setFilter(name)}
                style={[s.filterChip, selected ? s.filterChipOn : s.filterChipOff]}
              >
                {name.startsWith('Gần') && (
                  <Navigation
                    size={z(12)}
                    color={selected ? '#FFFFFF' : C.body}
                    style={{ marginRight: 6 }}
                  />
                )}
                <Text style={[s.filterText, selected && s.whiteText]}>{name}</Text>
                {selected && <Text style={s.countBadge}>{students.length}</Text>}
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={s.sectionHeading}>
          <Text style={s.sectionTitle}>Đang học gần bạn</Text>
          <View style={s.onlineBadge}>
            <Text style={s.onlineBadgeText}>{students.length} online</Text>
          </View>
          <Pressable accessibilityRole="button" style={s.seeAll}>
            <Text style={s.seeAllText}>Xem tất cả</Text>
          </Pressable>
        </View>

        {students.length > 0 ? (
          students.map((student, index) => (
            <TemoStaggeredView key={student.id} index={index}>
              <View style={[s.studentCard, index > 0 && s.studentCardNext]}>
              <View style={s.studentHeader}>
                <View style={s.photoWrap}>
                  {index === 0 ? (
                    <Image source={IMG.avatar} style={s.photo} />
                  ) : (
                    <View style={[s.photo, s.initialsPhoto]}>
                      <Text style={s.initialsText}>{student.initials}</Text>
                    </View>
                  )}
                  <View style={s.onlineDot} />
                </View>
                <View style={s.studentInfo}>
                  <View style={s.nameRow}>
                    <Text style={s.studentName} numberOfLines={1}>{student.name}</Text>
                    <View style={s.verifiedBadge}>
                      <Check size={z(9)} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  </View>
                  <Text style={s.studentFaculty} numberOfLines={1}>{student.faculty}</Text>
                </View>
                <View style={s.goalBadge}>
                  <Text style={s.goalText} numberOfLines={1}>{student.goal}</Text>
                </View>
              </View>

              <View style={s.studyDetails}>
                <View style={s.studyTitleRow}>
                  <BookOpen size={z(14)} color={C.primary} strokeWidth={2.2} style={{ marginRight: 6 }} />
                  <Text style={s.studyTitle} numberOfLines={1}>{student.subject}</Text>
                </View>
                <View style={s.studyLocationRow}>
                  <Text style={s.smallPin}>●</Text>
                  <Text style={s.studyLocation} numberOfLines={1}>{student.location}</Text>
                  <Text style={s.distance}>{student.status}</Text>
                </View>
              </View>

              <TemoPressable
                accessibilityRole="button"
                style={s.connectButton}
                onPress={() =>
                  router.push({
                    pathname: '/join-table',
                    params: {
                      name: student.name,
                      faculty: student.faculty,
                      subject: student.subject,
                      location: student.location,
                      status: student.status,
                      goal: student.goal,
                      facultyDetail: (student as any).requestFaculty || student.faculty,
                      locationDetail: (student as any).requestLocation || student.location,
                      subjectDetail: (student as any).requestSubject || student.subject,
                    },
                  } as any)
                }
              >
                <Text style={s.connectButtonText}>Kết nối học cùng</Text>
              </TemoPressable>
            </View>
            </TemoStaggeredView>
          ))
        ) : (
          <View style={s.emptyState}>
            <Text style={s.emptyTitle}>Chưa có bạn học nào online</Text>
            <Text style={s.emptyText}>Hiện chưa có sinh viên nào bật Radar. Hãy bật "Sẵn sàng ghép bàn" để kết nối cùng bạn bè!</Text>
          </View>
        )}
      </ScrollView>

      <DropdownMenu
        visible={locationDropdownOpen}
        title="Chọn vị trí học tập tại VKU"
        subtitle="Hệ thống tự động cập nhật bạn học online theo vị trí"
        items={VKU_LOCATIONS}
        selectedId={selectedLocId}
        onSelect={async (item) => {
          setSelectedLocId(item.id);
          if (ready) {
            await radarService.checkIn({
              locationId: item.id,
              courseCode: 'IT002',
              customLocationName: item.label,
              customCourseName: subject,
              studyNote: 'Bàn tự học số B12',
            }).catch(() => {});
          }
          showSuccess('Đã đổi vị trí', `Vị trí hiện tại: ${item.label}`);
        }}
        onClose={() => setLocationDropdownOpen(false)}
      />
      <StudyHubTabBar active="radar" bottom={Math.max(insets.bottom - 20, 13)} />
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
  safe: { flex: 1, backgroundColor: C.white },
  scroll: { paddingHorizontal: 18, paddingTop: 15, paddingBottom: 150 },
  header: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 56.5, height: 33, marginLeft: 0.5 },
  brandName: {
    marginLeft: 13,
    fontFamily: F.bold,
    fontSize: 19.5,
    lineHeight: 24,
    letterSpacing: -0.4,
    color: C.brand,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  bellDot: {
    position: 'absolute',
    top: 7.25,
    left: 19.25,
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: '#D81A24',
    borderWidth: 1.5,
    borderColor: C.white,
  },
  avatarBtn: {
    marginLeft: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: F.bold, fontSize: 13, lineHeight: 18, color: C.white },
  radarCard: {
    height: 378,
    marginTop: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#EDF2F8',
    backgroundColor: C.white,
    overflow: 'hidden',
    ...cardShadow,
  },
  ring: { position: 'absolute', borderWidth: 1 },
  ringOuter: {
    width: 300,
    height: 300,
    borderRadius: 150,
    right: -91,
    top: -91,
    borderColor: '#FFF6E0',
  },
  ringMiddle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    right: -62,
    top: -62,
    borderColor: '#FFF0CE',
  },
  ringInner: {
    width: 180,
    height: 180,
    borderRadius: 90,
    right: -32,
    top: -32,
    borderColor: '#FFF6E0',
  },
  radarBadge: {
    position: 'absolute',
    right: 21,
    top: 21,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFB510',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F59E0B',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  radarIcon: { width: 28, height: 24.5 },
  radarLabel: {
    position: 'absolute',
    left: 20,
    top: 22,
    fontFamily: F.bold,
    fontSize: 11.5,
    lineHeight: 16,
    letterSpacing: 0.2,
    color: C.orange,
  },
  radarTitle: {
    position: 'absolute',
    left: 20,
    right: 78,
    top: 44,
    fontFamily: F.extra,
    fontSize: 20.5,
    lineHeight: 27,
    letterSpacing: -0.9,
    color: C.primary,
  },
  radarDescription: {
    position: 'absolute',
    left: 20,
    top: 74,
    fontFamily: F.regular,
    fontSize: 13,
    lineHeight: 21,
    letterSpacing: -0.15,
    color: C.body,
  },
  readyRow: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: 130,
    height: 50,
    borderRadius: 25,
    backgroundColor: C.soft,
    borderWidth: 1,
    borderColor: '#F0F4F8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  readyDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.green },
  readyDotOff: { backgroundColor: C.muted },
  readyText: {
    flex: 1,
    marginLeft: 9,
    fontFamily: F.semi,
    fontSize: 13,
    lineHeight: 18,
    color: '#334155',
  },
  track: { width: 48, height: 28, borderRadius: 14, justifyContent: 'center' },
  trackOn: { backgroundColor: C.primary },
  trackOff: { backgroundColor: '#CBD5E1' },
  thumb: { position: 'absolute', top: 2, width: 24, height: 24, borderRadius: 12, backgroundColor: C.white },
  thumbOn: { left: 22 },
  thumbOff: { left: 2 },
  fieldLabel: {
    position: 'absolute',
    top: 200,
    left: 20,
    fontFamily: F.medium,
    fontSize: 12.5,
    lineHeight: 18,
    color: C.body,
  },
  subjectChips: {
    alignItems: 'center',
    columnGap: 8,
  },
  subjectScroll: {
    position: 'absolute',
    top: 222,
    left: 20,
    right: 20,
    height: 34,
  },
  subjectChip: {
    minHeight: 30,
    borderRadius: 16,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subjectChipOn: { backgroundColor: C.primary },
  subjectChipOff: { backgroundColor: '#F1F5F9' },
  subjectText: { fontFamily: F.medium, fontSize: 12.5, lineHeight: 18, color: '#334155' },
  subjectTextOn: { fontFamily: F.semi, color: C.white },
  subjectCheck: { marginLeft: 8, color: C.white, fontFamily: F.bold, fontSize: 14 },
  locationLabel: {
    position: 'absolute',
    top: 274,
    left: 20,
    fontFamily: F.medium,
    fontSize: 12.5,
    lineHeight: 18,
    color: C.body,
  },
  locationCard: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: 298,
    height: 58,
    borderRadius: 30,
    backgroundColor: '#F9FBFD',
    borderWidth: 1,
    borderColor: C.line,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
  },
  locationIconBox: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#EFF5FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinOuter: {
    width: 12,
    height: 15,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 1,
    backgroundColor: C.primary,
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinInner: { width: 4, height: 4, borderRadius: 2, backgroundColor: C.white },
  locationText: { flex: 1, marginLeft: 10 },
  locationTitle: { fontFamily: F.semi, fontSize: 13, lineHeight: 18, color: C.ink },
  onlineText: { marginTop: 1, fontFamily: F.medium, fontSize: 11, lineHeight: 15, color: C.green },
  chevron: { marginLeft: 8, fontFamily: F.medium, fontSize: 23, lineHeight: 26, color: C.muted },
  searchBox: {
    height: 44,
    marginTop: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E7EDF5',
    backgroundColor: C.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 10,
    ...cardShadow,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: 12,
    padding: 0,
    fontFamily: F.regular,
    fontSize: 13,
    color: C.ink,
      ...Platform.select({ web: { outlineStyle: 'none' as any } }),
  },
  filterButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChips: { paddingTop: 10, columnGap: 8 },
  filterChip: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    ...cardShadow,
  },
  filterChipOn: { backgroundColor: C.primary, borderColor: C.primary },
  filterChipOff: { backgroundColor: C.white, borderColor: '#E5EBF3' },
  filterText: { fontFamily: F.medium, fontSize: 12.5, lineHeight: 17, color: '#334155' },
  whiteText: { color: C.white },
  nearbyIcon: { marginRight: 6, color: C.body, fontSize: 13 },
  countBadge: {
    marginLeft: 7,
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.24)',
    paddingHorizontal: 5,
    color: C.white,
    fontFamily: F.bold,
    fontSize: 10.5,
    lineHeight: 16,
  },
  sectionHeading: {
    minHeight: 29,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: F.extra,
    fontSize: 17,
    lineHeight: 23,
    letterSpacing: -0.5,
    color: C.primary,
  },
  onlineBadge: {
    marginLeft: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  onlineBadgeText: { fontFamily: F.semi, fontSize: 10.5, lineHeight: 14, color: C.orange },
  seeAll: { marginLeft: 'auto', paddingLeft: 4 },
  seeAllText: { fontFamily: F.semi, fontSize: 12.5, lineHeight: 18, color: C.primary },
  studentCard: {
    minHeight: 204,
    marginTop: 12,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#EDF2F8',
    backgroundColor: C.white,
    ...cardShadow,
  },
  studentCardNext: { marginTop: 12 },
  studentHeader: { minHeight: 52, flexDirection: 'row', alignItems: 'center' },
  photoWrap: { width: 48, height: 48 },
  photo: { width: 48, height: 48, borderRadius: 24 },
  initialsPhoto: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#DCE8F7' },
  initialsText: { fontFamily: F.bold, fontSize: 14, color: C.brand },
  onlineDot: {
    position: 'absolute',
    right: -2,
    bottom: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: C.white,
    backgroundColor: C.green,
  },
  studentInfo: { flex: 1, minWidth: 0, marginLeft: 11 },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  studentName: { flexShrink: 1, fontFamily: F.bold, fontSize: 14, lineHeight: 19, color: '#0F172A' },
  verifiedBadge: {
    width: 14,
    height: 14,
    marginLeft: 5,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.orange,
  },
  verifiedCheck: { color: C.white, fontFamily: F.bold, fontSize: 10, lineHeight: 12 },
  studentFaculty: { marginTop: 2, fontFamily: F.regular, fontSize: 11.5, lineHeight: 16, color: C.body },
  goalBadge: {
    maxWidth: 105,
    marginLeft: 6,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FDE7A4',
    backgroundColor: '#FFFCF1',
  },
  goalText: { fontFamily: F.semi, fontSize: 10, lineHeight: 14, color: '#9A4D12' },
  studyDetails: {
    minHeight: 58,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EDF2F8',
    backgroundColor: '#F9FBFD',
  },
  studyTitleRow: { flexDirection: 'row', alignItems: 'center' },
  bookIcon: { fontFamily: F.bold, fontSize: 15, color: C.primary },
  studyTitle: { flex: 1, marginLeft: 8, fontFamily: F.semi, fontSize: 12.5, lineHeight: 18, color: C.primary },
  studyLocationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 7 },
  smallPin: { fontSize: 9, color: C.muted },
  studyLocation: { flex: 1, marginLeft: 6, fontFamily: F.medium, fontSize: 10.5, lineHeight: 15, color: C.body },
  distance: { marginLeft: 6, fontFamily: F.bold, fontSize: 10, lineHeight: 15, color: C.orange },
  connectButton: {
    height: 34,
    marginTop: 10,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.primary,
  },
  connectButtonText: { fontFamily: F.semi, fontSize: 12, lineHeight: 17, color: C.white },
  emptyState: {
    marginTop: 14,
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.line,
    alignItems: 'center',
  },
  emptyTitle: { fontFamily: F.semi, fontSize: 14, lineHeight: 20, color: C.ink },
  emptyText: { marginTop: 5, fontFamily: F.regular, fontSize: 12, lineHeight: 18, color: C.body, textAlign: 'center' },
});
