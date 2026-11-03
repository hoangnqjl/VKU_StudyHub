import { useState, useRef, useEffect } from 'react';
import { Animated, Image, Platform, Pressable, StyleSheet, Text, View, Easing, type ImageSourcePropType } from 'react-native';
import { TemoPressable } from './temoEffects';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';

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

  useEffect(() => {
    setSelected(active);
  }, [active]);

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

  const renderContent = () => (
    <View style={s.tabContentRow}>
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
        <TemoPressable
          accessibilityRole="button"
          accessibilityLabel="Tạo mới"
          scaleDown={0.86}
          style={s.fab}
          onPress={() => router.push('/add-document' as any)}
        >
          <Image source={icons.plus} style={{ width: z(19), height: z(19) }} />
        </TemoPressable>
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

  return (
    <View style={[s.tabBarWrap, { bottom }]} pointerEvents="box-none">
      {Platform.OS === 'web' ? (
        <View style={s.tabBarWebGlass}>
          {renderContent()}
        </View>
      ) : (
        <BlurView intensity={80} tint="light" style={s.tabBarNativeBlur}>
          {renderContent()}
        </BlurView>
      )}
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
  const scale = useRef(new Animated.Value(1)).current;
  const iconBounce = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (active) {
      Animated.sequence([
        Animated.timing(iconBounce, {
          toValue: 1.25,
          duration: 150,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.spring(iconBounce, {
          toValue: 1,
          friction: 4,
          tension: 65,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    }
  }, [active, iconBounce]);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.88,
      speed: 35,
      bounciness: 6,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      speed: 25,
      bounciness: 8,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.label}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={s.tabItem}
    >
      <Animated.View style={[{ width: '100%', height: '100%', alignItems: 'center' }, { transform: [{ scale }] }]}>
        <Animated.View style={[s.tabIconBox, { transform: [{ scale: iconBounce }] }]}>
          <Image
            source={item.icon}
            style={{
              width: z(item.width),
              height: z(item.height),
              tintColor: active ? C.primary : C.muted,
            }}
          />
        </Animated.View>
        <Text style={[s.tabLabel, active ? s.tabLabelOn : s.tabLabelOff]}>
          {item.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const raw = StyleSheet.create({
  tabBarWrap: {
    position: 'absolute',
    left: 18,
    right: 18,
    height: 70,
    borderRadius: 35,
    shadowColor: '#0F172A',
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  tabBarWebGlass: {
    flex: 1,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      },
    }),
  },
  tabBarNativeBlur: {
    flex: 1,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    overflow: 'hidden',
  },
  tabContentRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
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
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
