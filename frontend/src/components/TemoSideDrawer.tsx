import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  Platform,
  Image,
  Easing,
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { authService } from '../services';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_SLIDE = Math.min(SCREEN_WIDTH * 0.72, 260);

interface TemoSideDrawerProps {
  children: (helpers: {
    isOpen: boolean;
    openDrawer: () => void;
    closeDrawer: () => void;
    toggleDrawer: () => void;
  }) => React.ReactNode;
}

export default function TemoSideDrawer({ children }: TemoSideDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Animation controller matching TemoC2C (350ms, easeInOutQuart curve)
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    authService.getCurrentUser().then((u) => {
      if (u) setCurrentUser(u);
    }).catch(() => {});
  }, []);

  const openDrawer = () => {
    setIsOpen(true);
    Animated.timing(animValue, {
      toValue: 1,
      duration: 350,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1), // easeInOutQuart
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(animValue, {
      toValue: 0,
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => {
      setIsOpen(false);
    });
  };

  const toggleDrawer = () => {
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  };

  const handleNavigate = (path: string) => {
    closeDrawer();
    setTimeout(() => {
      router.push(path as any);
    }, 150);
  };

  const handleLogout = async () => {
    closeDrawer();
    try {
      await authService.logout().catch(() => {});
    } finally {
      router.replace('/login' as any);
    }
  };

  // 3D Scale & Slide interpolations from TemoC2C
  const translateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, DRAWER_SLIDE],
  });

  const scale = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.84], // Scaled down by 16% for authentic Threads/Temo depth
  });

  const borderRadius = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 30],
  });

  const displayName = currentUser?.fullName || 'Nguyễn Quang Hoàng';
  const studentId = currentUser?.studentId || '23IT.B063';
  const faculty = currentUser?.faculty || 'Khoa Công nghệ Thông tin';
  const initials = displayName
    .split(' ')
    .slice(-1)[0]
    .substring(0, 2)
    .toUpperCase();

  return (
    <View style={styles.container}>
      {/* ===== LAYER 1 (DƯỚI): TEMO SIDE MENU ===== */}
      <View style={styles.sideMenuLayer}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatarBorder}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
            </View>
            <View style={styles.onlineBadge}>
              <View style={styles.onlineDot} />
            </View>
          </View>

          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName} numberOfLines={1}>{displayName}</Text>
              <View style={styles.verifiedBadge}>
                <Feather name="check" size={10} color="#FFFFFF" />
              </View>
            </View>
            <Text style={styles.userStudentId}>MSSV: {studentId}</Text>
            <Text style={styles.userFaculty} numberOfLines={1}>{faculty}</Text>
          </View>
        </View>

        {/* Menu Navigation Items */}
        <View style={styles.menuItems}>
          <SideMenuItem
            icon="user"
            label="Hồ sơ sinh viên"
            onPress={() => handleNavigate('/profile')}
          />
          <SideMenuItem
            icon="file-text"
            label="Kho tài liệu số"
            badge="Mới"
            onPress={() => handleNavigate('/documents')}
          />
          <SideMenuItem
            icon="compass"
            label="Study Radar"
            onPress={() => handleNavigate('/radar')}
          />
          <SideMenuItem
            icon="clock"
            label="Phòng Pomodoro"
            onPress={() => handleNavigate('/focus')}
          />
          <SideMenuItem
            icon="grid"
            label="Tạo mã QR tài liệu"
            onPress={() => handleNavigate('/document-qr')}
          />
          <SideMenuItem
            icon="settings"
            label="Cài đặt hệ thống"
            onPress={() => handleNavigate('/app-settings')}
          />
        </View>

        {/* Divider & Logout */}
        <View style={styles.menuBottom}>
          <View style={styles.divider} />
          <Pressable
            accessibilityRole="button"
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.logoutButtonPressed,
            ]}
          >
            <View style={styles.logoutIconBox}>
              <Feather name="log-out" size={18} color="#EF4444" />
            </View>
            <Text style={styles.logoutText}>Đăng xuất tài khoản</Text>
          </Pressable>

          <View style={styles.footerNote}>
            <Text style={styles.versionText}>VKU StudyHub • Phiên bản 2.0</Text>
          </View>
        </View>
      </View>

      {/* ===== LAYER 2 (TRÊN): MAIN SCREEN TRANSFORM CONTAINER ===== */}
      <Animated.View
        style={[
          styles.mainScreenLayer,
          {
            transform: [{ translateX }, { scale }],
            borderRadius,
          },
          isOpen && styles.mainScreenShadow,
        ]}
      >
        {children({ isOpen, openDrawer, closeDrawer, toggleDrawer })}

        {/* Overlay tap blocker when drawer is open */}
        {isOpen && (
          <Pressable
            accessibilityLabel="Đóng thanh điều hướng"
            style={styles.drawerBackdrop}
            onPress={closeDrawer}
          />
        )}
      </Animated.View>
    </View>
  );
}

function SideMenuItem({
  icon,
  label,
  badge,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  badge?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        pressed && styles.menuItemPressed,
      ]}
    >
      <View style={styles.menuIconContainer}>
        <Feather name={icon} size={19} color="#101D83" />
      </View>
      <Text style={styles.menuItemLabel}>{label}</Text>
      {badge && (
        <View style={styles.badgePill}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      <Feather name="chevron-right" size={16} color="#94A3B8" style={{ marginLeft: 'auto' }} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1248', // Nền gradient xanh thẳm Temo/VKU phía sau SideMenu
  },
  sideMenuLayer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: DRAWER_SLIDE,
    paddingLeft: 22,
    paddingRight: 20,
    paddingTop: Platform.OS === 'ios' ? 56 : 42,
    paddingBottom: 24,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  profileSection: {
    marginBottom: 20,
  },
  avatarWrap: {
    position: 'relative',
    width: 66,
    height: 66,
    marginBottom: 12,
  },
  avatarBorder: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    padding: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    ...Platform.select({
      web: {
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
      },
      default: {
        elevation: 6,
      },
    }),
  },
  avatarCircle: {
    flex: 1,
    borderRadius: 30,
    backgroundColor: '#FB9A40', // Màu cam Temo rực rỡ đặc trưng
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
  },
  userInfo: {
    paddingLeft: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16.5,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userStudentId: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12.5,
    color: '#FFB86A', // Temo primary light
    marginTop: 2,
  },
  userFaculty: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11.5,
    color: '#94A3B8',
    marginTop: 2,
  },
  menuItems: {
    gap: 8,
    marginVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    transitionProperty: 'all',
    transitionDuration: '200ms',
  } as any,
  menuItemPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: [{ scale: 0.98 }],
  },
  menuIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
    }),
  },
  menuItemLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13.5,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  badgePill: {
    marginLeft: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#FB9A40',
  },
  badgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9.5,
    color: '#FFFFFF',
  },
  menuBottom: {
    marginTop: 'auto',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginBottom: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
  },
  logoutButtonPressed: {
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    transform: [{ scale: 0.98 }],
  },
  logoutIconBox: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoutText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13.5,
    color: '#F87171',
    fontWeight: '600',
  },
  footerNote: {
    marginTop: 14,
    paddingLeft: 4,
  },
  versionText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.45)',
  },

  /* MAIN SCREEN LAYER */
  mainScreenLayer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    zIndex: 2,
  },
  mainScreenShadow: {
    ...Platform.select({
      web: {
        boxShadow: '-15px 0 35px rgba(0, 0, 0, 0.28)',
      },
      default: {
        shadowColor: '#000000',
        shadowOpacity: 0.35,
        shadowRadius: 25,
        shadowOffset: { width: -10, height: 0 },
        elevation: 15,
      },
    }),
  },
  drawerBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    zIndex: 999,
  },
});
