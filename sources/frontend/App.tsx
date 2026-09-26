import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { RadarScreen } from './src/screens/RadarScreen';
import { DocumentShareScreen } from './src/screens/DocumentShareScreen';
import { PomodoroScreen } from './src/screens/PomodoroScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

type TabKey = 'radar' | 'documents' | 'pomodoro' | 'profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('radar');

  const renderContent = () => {
    switch (activeTab) {
      case 'radar':
        return <RadarScreen />;
      case 'documents':
        return <DocumentShareScreen />;
      case 'pomodoro':
        return <PomodoroScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <RadarScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Main Screen Content */}
      <View style={styles.content}>{renderContent()}</View>

      {/* Navigation Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'radar' && styles.tabItemActive]}
          onPress={() => setActiveTab('radar')}
        >
          <Text style={styles.tabIcon}>📡</Text>
          <Text style={[styles.tabLabel, activeTab === 'radar' && styles.tabLabelActive]}>Radar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'documents' && styles.tabItemActive]}
          onPress={() => setActiveTab('documents')}
        >
          <Text style={styles.tabIcon}>📄</Text>
          <Text style={[styles.tabLabel, activeTab === 'documents' && styles.tabLabelActive]}>Tài liệu QR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'pomodoro' && styles.tabItemActive]}
          onPress={() => setActiveTab('pomodoro')}
        >
          <Text style={styles.tabIcon}>⏱</Text>
          <Text style={[styles.tabLabel, activeTab === 'pomodoro' && styles.tabLabelActive]}>Pomodoro</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'profile' && styles.tabItemActive]}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={styles.tabIcon}>👤</Text>
          <Text style={[styles.tabLabel, activeTab === 'profile' && styles.tabLabelActive]}>Hồ sơ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: StatusBar.currentHeight || 0
  },
  content: {
    flex: 1
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingVertical: 8,
    paddingHorizontal: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 8
  },
  tabItemActive: {
    backgroundColor: '#EFF6FF'
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2
  },
  tabLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500'
  },
  tabLabelActive: {
    color: '#2563EB',
    fontWeight: '700'
  }
});
