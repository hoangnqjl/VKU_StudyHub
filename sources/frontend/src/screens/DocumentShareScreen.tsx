import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { StudyDocItem } from '../types';

const INITIAL_DOCS: StudyDocItem[] = [
  {
    id: 'doc_1',
    title: 'Đề cương & Ngân hàng câu hỏi QLDA phần mềm',
    courseCode: 'IT001',
    courseName: 'Quản lý dự án phần mềm',
    category: 'exam',
    qrCodeToken: 'VKU-DOC-IT001-EXAM-2026',
    uploaderName: 'Nguyễn Quang Hoàng',
    downloadsCount: 42
  },
  {
    id: 'doc_2',
    title: 'Tổng hợp Hooks & Thư viện Expo React Native',
    courseCode: 'IT002',
    courseName: 'Lập trình di động',
    category: 'summary',
    qrCodeToken: 'VKU-DOC-IT002-EXPO-CHEATSHEET',
    uploaderName: 'Nguyễn Thị Diễm Quỳnh',
    downloadsCount: 28
  },
  {
    id: 'doc_3',
    title: 'Slide bài giảng & Bài tập SQL/MySQL CSDL Nâng cao',
    courseCode: 'IT003',
    courseName: 'Cơ sở dữ liệu nâng cao',
    category: 'lecture',
    qrCodeToken: 'VKU-DOC-IT003-MYSQL-LECTURE',
    uploaderName: 'Đoàn Hữu Khánh',
    downloadsCount: 19
  }
];

export const DocumentShareScreen: React.FC = () => {
  const [docs, setDocs] = useState<StudyDocItem[]>(INITIAL_DOCS);

  const handleScanQR = () => {
    Alert.alert(
      '📷 Quét mã QR tài liệu',
      'Hướng camera về phía mã QR trên điện thoại của bạn học để nhận tài liệu trong 2 giây!',
      [
        {
          text: 'Giả lập quét thành công mã QR',
          onPress: () => {
            Alert.alert(
              '🎉 Thành công!',
              'Đã lưu tài liệu "Slide bài giảng & Bài tập SQL/MySQL" vào Tài liệu của tôi!'
            );
          }
        },
        { text: 'Hủy', style: 'cancel' }
      ]
    );
  };

  const handleShowDocQR = (item: StudyDocItem) => {
    Alert.alert(
      'Mã QR Tài Liệu',
      `Token: ${item.qrCodeToken}\nĐưa mã này để bạn học quét và tải ngay "${item.title}"!`
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📄 Chia sẻ tài liệu QR</Text>
        <Text style={styles.subtitle}>Tạo & quét mã QR chia sẻ tài liệu ôn thi chỉ trong 2 giây</Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.qrButton} onPress={handleScanQR}>
          <Text style={styles.qrButtonText}>📷 Quét QR nhận tài liệu</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => Alert.alert('Tải lên', 'Tính năng tải lên tài liệu mới đang kết nối BaaS')}
        >
          <Text style={styles.uploadButtonText}>+ Tải lên PDF</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Kho tài liệu ôn tập theo môn</Text>

      <FlatList
        data={docs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.courseCode}</Text>
              </View>
              <Text style={styles.downloads}>⬇ {item.downloadsCount} lượt tải</Text>
            </View>

            <Text style={styles.docTitle}>{item.title}</Text>
            <Text style={styles.docCourse}>Môn: {item.courseName}</Text>
            <Text style={styles.uploader}>Người chia sẻ: {item.uploaderName}</Text>

            <View style={styles.cardFooter}>
              <TouchableOpacity
                style={styles.showQrBtn}
                onPress={() => handleShowDocQR(item)}
              >
                <Text style={styles.showQrBtnText}>Tạo mã QR chia sẻ</Text>
              </TouchableOpacity>
            </View>
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
  actionRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  qrButton: {
    flex: 1,
    backgroundColor: '#0284C7',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  qrButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  uploadButton: {
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  uploadButtonText: { color: '#334155', fontWeight: '600', fontSize: 13 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 12 },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  badge: { backgroundColor: '#E0E7FF', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { color: '#3730A3', fontWeight: '700', fontSize: 12 },
  downloads: { fontSize: 12, color: '#64748B' },
  docTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  docCourse: { fontSize: 13, color: '#475569', marginBottom: 2 },
  uploader: { fontSize: 12, color: '#94A3B8', marginBottom: 10 },
  cardFooter: { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 10, alignItems: 'flex-end' },
  showQrBtn: {
    backgroundColor: '#EEF2FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C7D2FE'
  },
  showQrBtnText: { color: '#4338CA', fontWeight: '600', fontSize: 12 }
});
