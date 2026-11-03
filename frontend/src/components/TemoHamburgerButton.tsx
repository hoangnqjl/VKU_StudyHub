import React, { useRef } from 'react';
import { Pressable, StyleSheet, View, Animated, Platform } from 'react-native';

interface TemoHamburgerButtonProps {
  onPress: () => void;
  isOpen?: boolean;
}

export default function TemoHamburgerButton({ onPress, isOpen = false }: TemoHamburgerButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: Platform.OS !== 'web',
      speed: 30,
      bounciness: 6,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: Platform.OS !== 'web',
      speed: 25,
      bounciness: 8,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Mở menu chuyển trang"
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.hamburgerButton}
      >
        <View style={styles.lineContainer}>
          {/* 3 Thanh ngang chuẩn TemoC2C & Threads */}
          <View style={[styles.line, styles.lineTop, isOpen && styles.lineTopOpen]} />
          <View style={[styles.line, styles.lineMiddle, isOpen && styles.lineMiddleOpen]} />
          <View style={[styles.line, styles.lineBottom, isOpen && styles.lineBottomOpen]} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  hamburgerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8EDF5',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 14px rgba(15, 23, 42, 0.08)',
        cursor: 'pointer',
      },
      default: {
        shadowColor: '#0F172A',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
      },
    }),
  },
  lineContainer: {
    width: 19,
    height: 14,
    justifyContent: 'space-between',
  },
  line: {
    height: 2.2,
    borderRadius: 2,
    backgroundColor: '#101D83',
  },
  lineTop: {
    width: 19,
  },
  lineMiddle: {
    width: 14,
    backgroundColor: '#FB9A40', // Điểm nhấn cam TemoC2C
  },
  lineBottom: {
    width: 19,
  },
  lineTopOpen: {
    transform: [{ translateY: 6 }, { rotate: '45deg' }],
  },
  lineMiddleOpen: {
    opacity: 0,
  },
  lineBottomOpen: {
    transform: [{ translateY: -6 }, { rotate: '-45deg' }],
  },
});

