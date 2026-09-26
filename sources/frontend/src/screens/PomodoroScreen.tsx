import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';

export const PomodoroScreen: React.FC = () => {
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [activeParticipants, setActiveParticipants] = useState<number>(5);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      if (mode === 'focus') {
        Alert.alert('⏰ Hết giờ tập trung!', 'Hãy nghỉ ngơi 5 phút trước khi bắt đầu chu kỳ mới.');
        setMode('break');
        setSecondsLeft(5 * 60);
      } else {
        Alert.alert('🔔 Hết giờ nghỉ!', 'Sẵn sàng bước vào phiên học tập trung tiếp theo.');
        setMode('focus');
        setSecondsLeft(25 * 60);
      }
      setIsRunning(false);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, secondsLeft, mode]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainderSecs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⏱ Pomodoro Học Nhóm</Text>
        <Text style={styles.subtitle}>Đồng bộ thời gian tự học nhóm tạo động lực tập trung</Text>
      </View>

      <View style={styles.roomCard}>
        <Text style={styles.roomName}>Phòng: Ôn thi QLDA phần mềm (Nhóm 05)</Text>
        <Text style={styles.participants}>👥 {activeParticipants} sinh viên đang cùng tập trung</Text>
      </View>

      <View style={[styles.timerCircle, mode === 'focus' ? styles.focusCircle : styles.breakCircle]}>
        <Text style={styles.modeText}>{mode === 'focus' ? '🎯 TẬP TRUNG HỌC' : '☕ NGHỈ GIẢI LAO'}</Text>
        <Text style={styles.timerDisplay}>{formatTime(secondsLeft)}</Text>
        <Text style={styles.subtext}>{isRunning ? 'Đang đếm ngược...' : 'Đang tạm dừng'}</Text>
      </View>

      <View style={styles.controlsRow}>
        <TouchableOpacity
          style={[styles.btn, isRunning ? styles.pauseBtn : styles.startBtn]}
          onPress={toggleTimer}
        >
          <Text style={styles.btnText}>{isRunning ? 'Tạm Dừng' : 'Bắt Đầu Tập Trung'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.resetBtn]} onPress={resetTimer}>
          <Text style={styles.resetBtnText}>Đặt lại (25p)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16, alignItems: 'center' },
  header: { width: '100%', marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#1E293B' },
  subtitle: { fontSize: 13, color: '#64748B', marginTop: 4 },
  roomCard: {
    width: '100%',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 10,
    padding: 12,
    marginBottom: 24
  },
  roomName: { fontSize: 14, fontWeight: '700', color: '#1D4ED8' },
  participants: { fontSize: 12, color: '#3B82F6', marginTop: 4 },
  timerCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 8,
    marginVertical: 20
  },
  focusCircle: { borderColor: '#3B82F6', backgroundColor: '#FFFFFF' },
  breakCircle: { borderColor: '#10B981', backgroundColor: '#FFFFFF' },
  modeText: { fontSize: 13, fontWeight: '700', color: '#64748B', letterSpacing: 1 },
  timerDisplay: { fontSize: 48, fontWeight: '800', color: '#0F172A', marginVertical: 8 },
  subtext: { fontSize: 12, color: '#94A3B8' },
  controlsRow: { flexDirection: 'row', gap: 12, marginTop: 24, width: '100%' },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  startBtn: { backgroundColor: '#2563EB' },
  pauseBtn: { backgroundColor: '#F59E0B' },
  resetBtn: { backgroundColor: '#E2E8F0' },
  btnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  resetBtnText: { color: '#334155', fontWeight: '700', fontSize: 15 }
});
