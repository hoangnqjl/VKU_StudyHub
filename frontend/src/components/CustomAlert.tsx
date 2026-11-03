import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  Platform,
  ViewStyle,
  TextStyle,
} from 'react-native';

export type AlertType = 'error' | 'warning' | 'success' | 'info';

export interface AlertAction {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

export interface CustomAlertProps {
  visible: boolean;
  type?: AlertType;
  title: string;
  message: string;
  actions?: AlertAction[];
  onDismiss?: () => void;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  type = 'error',
  title,
  message,
  actions = [{ text: 'Đóng', style: 'cancel' }],
  onDismiss,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const iconScaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      iconScaleAnim.setValue(0);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.spring(iconScaleAnim, {
          toValue: 1,
          friction: 4.5,
          tension: 45,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.85,
          duration: 150,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(iconScaleAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  // Cấu hình màu sắc theo phân loại (Error / Warning / Success / Info)
  const typeConfig = {
    error: {
      iconBg: '#FEE2E2',
      iconBorder: '#FECACA',
      iconColor: '#DC2626',
      iconText: '⚠',
      btnBg: '#DC2626',
      btnText: '#FFFFFF',
    },
    warning: {
      iconBg: '#FEF3C7',
      iconBorder: '#FDE68A',
      iconColor: '#D97706',
      iconText: '!',
      btnBg: '#D97706',
      btnText: '#FFFFFF',
    },
    success: {
      iconBg: '#DCFCE7',
      iconBorder: '#BBF7D0',
      iconColor: '#16A34A',
      iconText: '✓',
      btnBg: '#16A34A',
      btnText: '#FFFFFF',
    },
    info: {
      iconBg: '#DBEAFE',
      iconBorder: '#BFDBFE',
      iconColor: '#2563EB',
      iconText: 'ℹ',
      btnBg: '#374F8A',
      btnText: '#FFFFFF',
    },
  }[type];

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} />
        </Animated.View>

        <Animated.View
          style={[
            styles.dialogContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Circular Badge Icon with Temo elasticOut spring */}
          <Animated.View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: typeConfig.iconBg,
                borderColor: typeConfig.iconBorder,
                transform: [{ scale: iconScaleAnim }],
              },
            ]}
          >
            <Text style={[styles.iconSymbol, { color: typeConfig.iconColor }]}>
              {typeConfig.iconText}
            </Text>
          </Animated.View>

          {/* Title & Body */}
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.messageText}>{message}</Text>

          {/* Action Buttons Stack */}
          <View style={styles.actionsContainer}>
            {actions.map((act, index) => {
              const isDestructive = act.style === 'destructive';
              const isCancel = act.style === 'cancel';
              const isDefault = !isDestructive && !isCancel;

              let btnStyle: ViewStyle = styles.defaultButton;
              let btnTextStyle: TextStyle = styles.defaultButtonText;

              if (isDestructive) {
                btnStyle = styles.destructiveButton;
                btnTextStyle = styles.destructiveButtonText;
              } else if (isCancel) {
                btnStyle = styles.cancelButton;
                btnTextStyle = styles.cancelButtonText;
              } else if (isDefault) {
                btnStyle = { ...styles.defaultButton, backgroundColor: typeConfig.btnBg };
                btnTextStyle = { ...styles.defaultButtonText, color: typeConfig.btnText };
              }

              return (
                <Pressable
                  key={index}
                  style={({ pressed }) => [
                    styles.buttonBase,
                    btnStyle,
                    pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
                  ]}
                  onPress={() => {
                    if (act.onPress) act.onPress();
                    if (onDismiss) onDismiss();
                  }}
                >
                  <Text style={[styles.buttonTextBase, btnTextStyle]}>
                    {act.text}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  dialogContainer: {
    width: Math.min(width - 56, 340),
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 26,
    paddingHorizontal: 22,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconSymbol: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: -2,
  },
  titleText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : undefined,
  },
  messageText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 22,
    paddingHorizontal: 6,
    fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : undefined,
  },
  actionsContainer: {
    width: '100%',
    flexDirection: 'column',
    gap: 10,
  },
  buttonBase: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextBase: {
    fontSize: 15,
    fontWeight: '600',
  },
  defaultButton: {
    backgroundColor: '#374F8A',
  },
  defaultButtonText: {
    color: '#FFFFFF',
  },
  destructiveButton: {
    backgroundColor: '#DC2626',
  },
  destructiveButtonText: {
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  cancelButtonText: {
    color: '#475569',
  },
});
