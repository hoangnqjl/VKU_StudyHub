import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { BorderRadius, Shadow } from '../constants/spacing';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  gradient?: boolean;
  glassEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  gradient = false,
  glassEffect = false,
}) => {
  if (gradient) {
    return (
      <LinearGradient
        colors={['#1A2540', '#1F2D4E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, style]}
      >
        {children}
      </LinearGradient>
    );
  }

  if (glassEffect) {
    return (
      <View style={[styles.card, styles.glass, style]}>
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.md,
  },
  glass: {
    backgroundColor: 'rgba(26, 37, 64, 0.7)',
    borderColor: 'rgba(55, 79, 138, 0.3)',
  },
});
