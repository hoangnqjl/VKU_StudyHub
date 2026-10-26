import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../src/constants/colors';
import { FontFamily, FontSize } from '../../src/constants/typography';

interface TabIconProps {
  emoji: string;
  label: string;
  focused: boolean;
}

const TabIcon = ({ emoji, label, focused }: TabIconProps) => (
  <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
    <Text style={styles.tabEmoji}>{emoji}</Text>
    <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{label}</Text>
  </View>
);

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Trang chủ" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="radar"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="📡" label="Radar" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="docs"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="📂" label="Tài liệu" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="pomodoro"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="⏱️" label="Pomodoro" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Hồ sơ" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#1A2540',
    borderTopColor: '#2A3A63',
    borderTopWidth: 1,
    height: 72,
    paddingBottom: 8,
    paddingTop: 4,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 54,
  },
  tabItemFocused: {
    backgroundColor: 'rgba(254, 208, 20, 0.1)',
  },
  tabEmoji: {
    fontSize: 22,
  },
  tabLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    color: Colors.textMuted,
  },
  tabLabelFocused: {
    color: Colors.primary,
  },
});
