import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { StudentUser } from '../types';

const CURRENT_USER: StudentUser = {
  id: 'usr_01',
  studentId: '23IT.B063',
  fullName: 'Nguyễn Quang Hoàng',
  email: 'hoangnq.23it@vku.udn.vn',
  major: 'Kỹ thuật Phần mềm (VKU)',
  enrolledCourses: [
    'Quản lý dự án phần mềm (TS. Nguyễn Thành Tuấn)',
    'Lập trình ứng dụng di động (React Native)',
    'Cơ sở dữ liệu nâng cao',
    'Kiến trúc phần mềm'
  ]
};

export const ProfileScreen: React.FC = () => {
  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng không?');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👤 Hồ sơ sinh viên VKU</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>H</Text>
        </View>
        <Text style={styles.name}>{CURRENT_USER.fullName}</Text>
        <Text style={styles.subInfo}>MSSV: {CURRENT_USER.studentId}</Text>
        <Text style={styles.subInfo}>{CURRENT_USER.email}</Text>
        <Text style={styles.majorBadge}>{CURRENT_USER.major}</Text>
      </View>

      <Text style={styles.sectionTitle}>Các môn học kỳ này ({CURRENT_USER.enrolledCourses.length})</Text>

      <FlatList
        data={CURRENT_USER.enrolledCourses}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.courseItem}>
            <Text style={styles.courseBullet}>📘</Text>
            <Text style={styles.courseName}>{item}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  header: { marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#1E293B' },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  avatarText: { fontSize: 28, fontWeight: '700', color: '#FFFFFF' },
  name: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  subInfo: { fontSize: 13, color: '#64748B', marginTop: 2 },
  majorBadge: {
    marginTop: 8,
    backgroundColor: '#EFF6FF',
    color: '#1D4ED8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600'
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 12 },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  courseBullet: { marginRight: 10, fontSize: 16 },
  courseName: { fontSize: 14, color: '#334155', fontWeight: '500', flex: 1 },
  logoutBtn: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#FEE2E2'
  },
  logoutText: { color: '#DC2626', fontWeight: '700', fontSize: 14 }
});
