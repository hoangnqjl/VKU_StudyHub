import React, { useRef, useEffect } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
  Easing,
} from 'react-native';

/**
 * 1. Hook hiệu ứng trôi nổi nhẹ nhàng (Float Animation) từ TemoC2C
 * Chu kỳ 3 giây lặp vô hạn, transform: translateY(-6px)
 */
export function useTemoFloat(distance = 6, duration = 3000) {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -distance,
          duration: duration / 2,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: duration / 2,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [distance, duration, floatAnim]);

  return floatAnim;
}

/**
 * 2. Hook hiệu ứng đàn hồi khi nhấn nút (Press Bounce) từ TemoC2C
 * Co lại 0.94x khi chạm, bung về 1.0x kèm độ nảy spring khi nhả (Curves.easeOutCubic)
 */
export function usePressBounce(scaleDown = 0.94) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: scaleDown,
      useNativeDriver: Platform.OS !== 'web',
      speed: 35,
      bounciness: 6,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: Platform.OS !== 'web',
      speed: 25,
      bounciness: 8,
    }).start();
  };

  return { scale, onPressIn, onPressOut };
}

/**
 * 3. Component nút tương tác nảy xúc giác (TemoPressable)
 * Tự động scale 0.94x với spring tactile physics của Flutter AnimatedScale
 */
export interface TemoPressableProps extends PressableProps {
  children: React.ReactNode;
  scaleDown?: number;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

export const TemoPressable: React.FC<TemoPressableProps> = ({
  children,
  onPress,
  scaleDown = 0.94,
  style,
  containerStyle,
  ...props
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = (e: any) => {
    Animated.spring(scale, {
      toValue: scaleDown,
      useNativeDriver: Platform.OS !== 'web',
      speed: 35,
      bounciness: 6,
    }).start();
    props.onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: Platform.OS !== 'web',
      speed: 25,
      bounciness: 8,
    }).start();
    props.onPressOut?.(e);
  };

  return (
    <Pressable
      {...props}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={containerStyle}
    >
      <Animated.View style={[{ transform: [{ scale }] }, style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

/**
 * 4. Staggered Cascade List Entry (AnimationConfiguration.staggeredList từ TemoFlutter)
 * Hiệu ứng thác đổ trượt dọc (verticalOffset 30px) + fade-in so le từng hàng
 */
export interface TemoStaggeredViewProps {
  index?: number;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  verticalOffset?: number;
  duration?: number;
}

export const TemoStaggeredView: React.FC<TemoStaggeredViewProps> = ({
  index = 0,
  children,
  style,
  verticalOffset = 24,
  duration = 360,
}) => {
  const isWeb = Platform.OS === 'web';
  const opacity = useRef(new Animated.Value(isWeb ? 1 : 0)).current;
  const translateY = useRef(new Animated.Value(isWeb ? 0 : verticalOffset)).current;

  useEffect(() => {
    if (isWeb) return; // On web, render immediately to prevent invisible content
    const delay = Math.min(index * 60, 420);
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration,
          useNativeDriver: false,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 45,
          useNativeDriver: false,
        }),
      ]).start();
    }, delay);
    return () => clearTimeout(timer);
  }, [index, duration, verticalOffset, isWeb]);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
};

/**
 * 5. Skeleton Shimmer Sweep (Skeleton.dart từ TemoFlutter)
 * Hiệu ứng quét sóng gradient mềm mại 1400ms
 */
export interface TemoShimmerProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export const TemoShimmer: React.FC<TemoShimmerProps> = ({
  width,
  height,
  borderRadius = 12,
  style,
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.35, 0.8, 0.35],
  });

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: '#E2E8F0',
          opacity,
        },
        style,
      ]}
    />
  );
};

/**
 * 6. Các style chuẩn Glassmorphism & Hover Neon mang từ TemoC2C
 */
export const temoStyles = StyleSheet.create({
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(243, 244, 246, 0.8)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px -4px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.02)',
      },
      default: {
        shadowColor: '#0F172A',
        shadowOpacity: 0.06,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
        elevation: 3,
      },
    }),
  },
  neonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E8EDF5',
    ...Platform.select({
      web: {
        boxShadow: '0 12px 35px -8px rgba(251, 154, 64, 0.15), 0 4px 12px rgba(0, 0, 0, 0.04)',
      },
      default: {
        shadowColor: '#FB9A40',
        shadowOpacity: 0.15,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },
        elevation: 4,
      },
    }),
  },
  floatingCapsule: {
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(30px)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
      },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 8 },
        elevation: 6,
      },
    }),
  },
});

/**
 * 7. Screen Route Transition (smoothRoute từ TemoC2C/lib/app_router.dart)
 * Duration 350ms, SlideTransition(begin: Offset(28, 0)) + FadeTransition(begin: 0)
 * Curves: Curves.easeInOutCubic / Easing.bezier(0.65, 0.05, 0.36, 1.0)
 */
export interface TemoScreenTransitionProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  direction?: 'horizontal' | 'vertical' | 'none';
}

export const TemoScreenTransition: React.FC<TemoScreenTransitionProps> = ({
  children,
  style,
  direction = 'horizontal',
}) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 350,
      easing: Easing.bezier(0.65, 0.05, 0.36, 1.0), // Curves.easeInOutCubic from TemoFlutter
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [anim]);

  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const transform =
    direction === 'horizontal'
      ? [
          {
            translateX: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [28, 0],
            }),
          },
        ]
      : direction === 'vertical'
      ? [
          {
            translateY: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [24, 0],
            }),
          },
        ]
      : [];

  return (
    <Animated.View style={[{ flex: 1, opacity, transform }, style]}>
      {children}
    </Animated.View>
  );
};


