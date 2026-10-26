import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../constants/colors';
import { FontFamily, FontSize } from '../constants/typography';
import { BorderRadius, Shadow, Spacing } from '../constants/spacing';

type Variant = 'primary' | 'danger' | 'accent' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  style,
  textStyle,
}) => {
  const gradientColors =
    variant === 'primary'
      ? Gradients.primary
      : variant === 'danger'
      ? Gradients.danger
      : Gradients.accent;

  const isGradient = ['primary', 'danger', 'accent'].includes(variant);
  const sizeStyle = sizes[size];

  if (isGradient) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.85}
        style={[
          styles.wrapper,
          fullWidth && styles.fullWidth,
          (disabled || loading) && styles.disabled,
          style,
        ]}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradient, sizeStyle.padding]}
        >
          {loading ? (
            <ActivityIndicator color={variant === 'primary' ? Colors.textInvert : Colors.white} size="small" />
          ) : (
            <>
              {icon && <>{icon}</>}
              <Text style={[styles.textGradient, sizeStyle.text, variant === 'primary' && styles.textDark, textStyle]}>
                {label}
              </Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.wrapper,
        styles.outlineBase,
        variant === 'outline' && styles.outline,
        variant === 'ghost' && styles.ghost,
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        sizeStyle.padding,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={Colors.primary} size="small" />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[styles.textOutline, sizeStyle.text, textStyle]}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const sizes = {
  sm: {
    padding: { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.md },
    text: { fontSize: FontSize.sm } as TextStyle,
  },
  md: {
    padding: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl },
    text: { fontSize: FontSize.base } as TextStyle,
  },
  lg: {
    padding: { paddingVertical: Spacing.lg, paddingHorizontal: Spacing['2xl'] },
    text: { fontSize: FontSize.md } as TextStyle,
  },
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    ...Shadow.md,
  },
  fullWidth: {
    width: '100%',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    width: '100%',
  },
  outlineBase: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  outline: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.45,
  },
  textGradient: {
    fontFamily: FontFamily.bold,
    color: Colors.white,
    letterSpacing: 0.3,
  },
  textDark: {
    color: Colors.textInvert,
  },
  textOutline: {
    fontFamily: FontFamily.bold,
    color: Colors.primary,
    letterSpacing: 0.3,
    fontSize: FontSize.base,
  },
});
