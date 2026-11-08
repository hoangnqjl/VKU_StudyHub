import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import LucideIcon, { X, Check } from './DynamicLucideIcon';

export interface DropdownMenuItem {
  id: string;
  label: string;
  sublabel?: string;
  badge?: string;
  icon?: string;
  iconColor?: string;
  count?: number | string;
  danger?: boolean;
}

interface DropdownMenuProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  items: DropdownMenuItem[];
  selectedId?: string;
  onSelect: (item: DropdownMenuItem) => void;
  onClose: () => void;
}

export default function DropdownMenu({
  visible,
  title,
  subtitle,
  items,
  selectedId,
  onSelect,
  onClose,
}: DropdownMenuProps) {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Đóng menu"
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
        <View style={styles.menuCard}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerTitleBox}>
                  <Text style={styles.title}>{title}</Text>
                  {subtitle ? (
                    <Text style={styles.subtitle}>{subtitle}</Text>
                  ) : null}
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Đóng menu"
                  onPress={onClose}
                  style={styles.closeBtn}
                >
                  <X size={18} color="#64748B" strokeWidth={2} />
                </Pressable>
              </View>

              <View style={styles.divider} />

              {/* Items List */}
              <ScrollView
                style={styles.scrollList}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {items.map((item) => {
                  const isSelected = item.id === selectedId;
                  const isDanger = item.danger;
                  return (
                    <Pressable
                      key={item.id}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: isSelected }}
                      style={({ pressed }) => [
                        styles.itemRow,
                        isSelected && styles.itemRowSelected,
                        isDanger && styles.itemRowDanger,
                        pressed && (isDanger ? styles.itemRowDangerPressed : styles.itemRowPressed),
                      ]}
                      onPress={() => {
                        onSelect(item);
                        onClose();
                      }}
                    >
                      {item.icon && (
                        <View
                          style={[
                            styles.iconContainer,
                            isSelected && styles.iconContainerSelected,
                            isDanger && styles.iconContainerDanger,
                          ]}
                        >
                          <LucideIcon
                            name={item.icon}
                            size={18}
                            color={isDanger ? '#E11D48' : isSelected ? '#101D83' : item.iconColor || '#64748B'}
                            strokeWidth={2}
                          />
                        </View>
                      )}

                      <View style={styles.itemContent}>
                        <View style={styles.itemTopRow}>
                          <Text
                            style={[
                              styles.itemLabel,
                              isSelected && styles.itemLabelSelected,
                              isDanger && styles.itemLabelDanger,
                            ]}
                            numberOfLines={1}
                          >
                            {item.label}
                          </Text>
                          {item.badge ? (
                            <View
                              style={[
                                styles.badge,
                                isSelected && styles.badgeSelected,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.badgeText,
                                  isSelected && styles.badgeTextSelected,
                                ]}
                              >
                                {item.badge}
                              </Text>
                            </View>
                          ) : null}
                        </View>

                        {item.sublabel ? (
                          <Text style={styles.itemSublabel} numberOfLines={1}>
                            {item.sublabel}
                          </Text>
                        ) : null}
                      </View>

                      {isSelected ? (
                        <View style={styles.checkIconBox}>
                          <Check size={17} color="#101D83" />
                        </View>
                      ) : null}
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
        </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.30)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(6px)',
      },
    }),
  },
  menuCard: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E8EDF5',
    paddingVertical: 16,
    paddingHorizontal: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.15)',
      },
      default: {
        shadowColor: '#0F172A',
        shadowOpacity: 0.12,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingBottom: 10,
  },
  headerTitleBox: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#1E293B',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 6,
  },
  scrollList: {
    marginTop: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 11,
    borderRadius: 16,
    marginBottom: 4,
    backgroundColor: 'transparent',
  },
  itemRowSelected: {
    backgroundColor: '#EFF4FF',
  },
  itemRowPressed: {
    backgroundColor: '#F8FAFC',
  },
  itemRowDanger: {
    backgroundColor: '#FFF5F5',
  },
  itemRowDangerPressed: {
    backgroundColor: '#FFE4E6',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconContainerSelected: {
    backgroundColor: '#DBEAFE',
  },
  iconContainerDanger: {
    backgroundColor: '#FEE2E2',
  },
  itemContent: {
    flex: 1,
    minWidth: 0,
  },
  itemTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13.5,
    color: '#334155',
  },
  itemLabelSelected: {
    fontFamily: 'Inter_600SemiBold',
    color: '#101D83',
  },
  itemLabelDanger: {
    fontFamily: 'Inter_600SemiBold',
    color: '#E11D48',
  },
  itemSublabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  badgeSelected: {
    backgroundColor: '#DBEAFE',
  },
  badgeText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: '#64748B',
  },
  badgeTextSelected: {
    color: '#101D83',
    fontFamily: 'Inter_600SemiBold',
  },
  checkIconBox: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
});
