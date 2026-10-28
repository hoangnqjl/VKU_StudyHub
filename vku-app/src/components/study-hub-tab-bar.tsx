import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { router } from 'expo-router';

import { useDesign } from './design-scale';

const icons = {
  home: require('../../assets/images/home/tab-home.png'),
  radar: require('../../assets/images/home/tab-radar.png'),
  docs: require('../../assets/images/home/tab-docs.png'),
  focus: require('../../assets/images/home/tab-timer.png'),
  plus: require('../../assets/images/home/plus.png'),
};

const F = {
  medium: 'Inter_500Medium',
  bold: 'Inter_700Bold',
};

const C = {
  primary: '#374F8A',
  muted: '#8C9AB5',
  white: '#FFFFFF',
};

type TabId = 'home' | 'radar' | 'docs' | 'focus';

const TAB_ITEMS: {
  id: TabId;
  label: string;
  icon: ImageSourcePropType;
  width: number;
  height: number;
}[] = [
  { id: 'home', label: 'Trang chủ', icon: icons.home, width: 18, height: 17.5 },
  { id: 'radar', label: 'Radar', icon: icons.radar, width: 20.5, height: 21 },
  { id: 'docs', label: 'Tài liệu', icon: icons.docs, width: 17.5, height: 21 },
  { id: 'focus', label: 'Tập trung', icon: icons.focus, width: 17, height: 20 },
];

export default function StudyHubTabBar({
  active,
  bottom,
}: {
  active: TabId;
  bottom: number;
}) {
  const { s, z } = useDesign(raw);
  const [selected, setSelected] = useState<TabId>(active);

  const selectTab = (id: TabId) => {
    setSelected(id);
    const routes = {
      home: '/home',
      radar: '/radar',
      docs: '/documents',
      focus: '/focus',
    } as const;
    router.replace(routes[id] as any);
  };

  return (
    <View style={[s.tabBar, { bottom }]} pointerEvents="box-none">
      {TAB_ITEMS.slice(0, 2).map((item) => (
        <TabBarItem
          key={item.id}
          item={item}
          active={selected === item.id}
          onPress={() => selectTab(item.id)}
          s={s}
          z={z}
        />
      ))}
      <View style={s.tabItem}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tạo mới"
          style={s.fab}
          onPress={() => router.push('/add-document' as any)}
        >
          <Image source={icons.plus} style={{ width: z(19), height: z(19) }} />
        </Pressable>
      </View>
      {TAB_ITEMS.slice(2).map((item) => (
        <TabBarItem
          key={item.id}
          item={item}
          active={selected === item.id}
          onPress={() => selectTab(item.id)}
          s={s}
          z={z}
        />
      ))}
    </View>
  );
}

function TabBarItem({
  item,
  active,
  onPress,
  s,
  z,
}: {
  item: (typeof TAB_ITEMS)[number];
  active: boolean;
  onPress: () => void;
  s: Record<string, any>;
  z: (value: number) => number;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.label}
      accessibilityState={{ selected: active }}
      style={s.tabItem}
      onPress={onPress}
    >
      <View style={s.tabIconBox}>
        <Image
          source={item.icon}
          style={{
            width: z(item.width),
            height: z(item.height),
            tintColor: active ? C.primary : C.muted,
          }}
        />
      </View>
      <Text style={[s.tabLabel, active ? s.tabLabelOn : s.tabLabelOff]}>
        {item.label}
      </Text>
    </Pressable>
  );
}

const raw = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 17,
    right: 17,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderWidth: 1,
    borderColor: 'rgba(241,245,249,0.9)',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  tabItem: { width: 67, height: 68 },
  tabIconBox: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    position: 'absolute',
    top: 40.3,
    left: -8,
    right: -8,
    textAlign: 'center',
    fontSize: 10.5,
    lineHeight: 14,
    letterSpacing: -0.3,
  },
  tabLabelOn: { fontFamily: F.bold, color: C.primary },
  tabLabelOff: { fontFamily: F.medium, color: C.muted },
  fab: {
    position: 'absolute',
    top: 12,
    left: 11.5,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
