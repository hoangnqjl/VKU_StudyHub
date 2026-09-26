import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { VKU_CAMPUS_LOCATIONS, VKU_DEFAULT_COURSES } from '../constants/locations';
import { RadarBuddy } from '../types';

const INITIAL_BUDDIES: RadarBuddy[] = [
  {
    id: 'b1',
    userId: 'usr_02',
    studentId: '23IT.B088',
    fullName: 'Tạ Kim Hương',
    courseCode: 'IT001',
    courseName: 'Quản lý dự án phần mềm',
    location: 'Thư viện Tầng 2',
    note: 'Đang ôn bài WBS & Charter',
    checkInTime: '10 phút trước'
  },
  {
    id: 'b2',
    userId: 'usr_03',
    studentId: '23IT.B196',
    fullName: 'Nguyễn Thị Diễm Quỳnh',
    courseCode: 'IT002',
    courseName: 'Lập trình di động',
    location: 'Khu tự học Tòa V',
    note: 'Thiết kế UI Expo React Native',
    checkInTime: '25 phút trước'
  },
  {
    id: 'b3',
    userId: 'usr_04',
    studentId: '23CE.B025',
    fullName: 'Phạm Nguyễn Phú Trọng',
    courseCode: 'IT002',
    courseName: 'Lập trình di động',
    location: 'Căn tin sinh viên VKU',
    note: 'Code module Camera & Barcode',
    checkInTime: '40 phút trước'
  }
];

export const RadarScreen: React.FC = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(VKU_CAMPUS_LOCATIONS[1].name);
  const [selectedCourse, setSelectedCourse] = useState(VKU_DEFAULT_COURSES[0].name);

  const handleToggleCheckIn = () => {
    setIsCheckedIn(!isCheckedIn);
    Alert.alert(
      !isCheckedIn ? '🎯 Đã bật Study Radar!' : '💤 Đã tắt Study Radar',
      !isCheckedIn
        ? `Bạn đang học môn: ${selectedCourse}\nTại: ${selectedLocation}`
        : 'Bạn đã rời khỏi danh sách tìm bạn học.'
    );
  };

  const handleRequestJoin = (buddy: RadarBuddy) => {
    Alert.alert('Gửi yêu cầu ghép bàn', `Đã gửi lời mời ghép bàn học đến ${buddy.fullName}!`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📡 Study Radar VKU</Text>
        <Text style={styles.subtitle}>Tìm bạn ghép bàn học tức thì trong khuôn viên trường</Text>
      </View>

      <View style={styles.statusCard}>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Trạng thái của bạn:</Text>
          <View style={[styles.badge, isCheckedIn ? styles.badgeActive : styles.badgeInactive]}>
            <Text style={styles.badgeText}>{isCheckedIn ? 'Đang sáng đèn' : 'Chưa check-in'}</Text>
          </View>
        </View>

        <Text style={styles.infoText}>📍 Vị trí: {selectedLocation}</Text>
        <Text style={styles.infoText}>📚 Môn: {selectedCourse}</Text>

        <TouchableOpacity
          style={[styles.button, isCheckedIn ? styles.buttonDanger : styles.buttonPrimary]}
          onPress={handleToggleCheckIn}
        >
          <Text style={styles.buttonText}>
            {isCheckedIn ? 'Tắt trạng thái Radar' : 'Bật Radar tìm bạn học ngay'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Các bạn đang học gần đây ({INITIAL_BUDDIES.length})</Text>

      <FlatList
        data={INITIAL_BUDDIES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.buddyCard}>
            <View style={styles.buddyAvatar}>
              <Text style={styles.avatarText}>{item.fullName.charAt(0)}</Text>
            </View>
            <View style={styles.buddyInfo}>
              <Text style={styles.buddyName}>{item.fullName} ({item.studentId})</Text>
              <Text style={styles.buddyCourse}>📖 {item.courseName}</Text>
              <Text style={styles.buddyLocation}>📍 {item.location}</Text>
              {item.note ? <Text style={styles.buddyNote}>💬 "{item.note}"</Text> : null}
              <Text style={styles.timeText}>🕒 {item.checkInTime}</Text>
            </View>
            <TouchableOpacity
              style={styles.joinBtn}
              onPress={() => handleRequestJoin(item)}
            >
              <Text style={styles.joinBtnText}>Ghép bàn</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  header: { marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#1E293B' },
  subtitle: { fontSize: 13, color: '#64748B', marginTop: 4 },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2
  },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  statusLabel: { fontSize: 15, fontWeight: '600', color: '#334155' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeActive: { backgroundColor: '#DCFCE7' },
  badgeInactive: { backgroundColor: '#F1F5F9' },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#166534' },
  infoText: { fontSize: 14, color: '#475569', marginBottom: 4 },
  button: { marginTop: 12, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  buttonPrimary: { backgroundColor: '#2563EB' },
  buttonDanger: { backgroundColor: '#EF4444' },
  buttonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 12 },
  buddyCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  buddyAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  avatarText: { fontSize: 18, fontWeight: '700', color: '#1E40AF' },
  buddyInfo: { flex: 1 },
  buddyName: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  buddyCourse: { fontSize: 13, color: '#2563EB', marginTop: 2 },
  buddyLocation: { fontSize: 12, color: '#475569', marginTop: 2 },
  buddyNote: { fontSize: 12, color: '#64748B', fontStyle: 'italic', marginTop: 2 },
  timeText: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  joinBtn: { backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  joinBtnText: { color: '#1D4ED8', fontWeight: '600', fontSize: 12 }
});
