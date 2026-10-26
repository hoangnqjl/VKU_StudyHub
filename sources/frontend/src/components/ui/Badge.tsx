import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize } from '../constants/typography';
import { BorderRadius, Spacing } from '../constants/spacing';

type BadgeVariant = 'primary' | 'danger' | 'accent' | 'success' | 'warning' | 'ghost';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  dot = false,
}) => {
  const bg = {
    primary: Colors.primary,
    danger: Colors.danger,
    accent: Colors.accent,
    success: Colors.success,
    warning: Colors.warning,
    ghost: Colors.bgCardAlt,
  }[variant];

  const color = variant === 'primary' ? Colors.textInvert : Colors.white;

  return (
    <View style={[styles.badge, { backgroundColor: bg }, size === 'sm' && styles.sm]}>
      {dot && <View style={[styles.dot, { backgroundColor: color }]} />}
      <Text style={[styles.label, { color }, size === 'sm' && styles.smText]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  sm: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    letterSpacing: 0.3,
  },
  smText: {
    fontSize: 10,
  },
});
