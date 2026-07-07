import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  StatusBar, 
  ActivityIndicator,
  RefreshControl,
  Animated,
  Dimensions,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  ChevronRight, 
  ArrowRight,
  LogOut, 
  FileText, 
  Heart, 
  HelpCircle, 
  Info,
  MapPin,
  Star,
  Activity,
  Award,
  CircleUser,
  Crown,
  Share2,
  Sparkles
} from 'lucide-react-native';
import Colors from '../../constants/Colors';
import client from '../../api/client';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const fetchProfile = async () => {
    try {
      const response = await client.get('auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        })
      ]).start();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfile();
  };

  const menuSections = [
    {
      title: 'Quản lý cá nhân',
      items: [
        { icon: FileText, label: 'Hợp đồng vữa thuê', color: '#8b5cf6', onPress: () => navigation.navigate('RentalHistory') },
        { icon: Activity, label: 'Lịch sử thanh toán', color: '#10b981', onPress: () => navigation.navigate('RentalHistory') },
        { icon: Heart, label: 'Phòng đã lưu', color: '#ef4444', onPress: () => navigation.navigate('Favorites') },
      ]
    },
    {
      title: 'Tài khoản & Bảo mật',
      items: [
        { icon: User, label: 'Chỉnh sửa hồ sơ', color: Colors.primary, onPress: () => navigation.navigate('EditProfile') },
        { icon: Shield, label: 'Bảo mật & Mật khẩu', color: '#f59e0b', onPress: () => navigation.navigate('Security') },
        { icon: Bell, label: 'Cài đặt thông báo', color: '#3b82f6', onPress: () => navigation.navigate('Notifications') },
      ]
    },
    {
      title: 'Hỗ trợ & Thông tin',
      items: [
        { icon: Sparkles, label: 'Trợ lý ảo AI (24/7)', color: '#f59e0b', onPress: () => navigation.navigate('AIChat') },
        { icon: HelpCircle, label: 'Trung tâm trợ giúp', color: '#64748b', onPress: () => navigation.navigate('Support') },
        { icon: Share2, label: 'Chia sẻ ứng dụng', color: '#ec4899', onPress: () => {} },
        { icon: Info, label: 'Về chúng tôi', color: '#94a3b8', onPress: () => navigation.navigate('About') },
      ]
    }
  ];

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Decorative Background Elements */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
      >
        {/* Premium Hero Header */}
        <Animated.View style={[styles.hero, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.heroTop}>
            <View style={styles.headerInfo}>
              <Text style={styles.headerWelcome}>Xin chào,</Text>
              <Text style={styles.headerName} numberOfLines={1}>
                {user?.Profile?.full_name || 'Người dùng'}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.settingsBtn}
              onPress={() => navigation.navigate('Settings')}
            >
              <Settings size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileCard}>
            <View style={styles.profileInfoContent}>
              <View style={styles.avatarWrapper}>
                {user?.Profile?.avatar ? (
                  <Image source={{ uri: user.Profile.avatar }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.placeholderAvatar}>
                    <Text style={styles.avatarInitial}>
                      {user?.Profile?.full_name ? user.Profile.full_name.charAt(0).toUpperCase() : '?'}
                    </Text>
                  </View>
                )}
                <View style={styles.verifiedBadge}>
                  <Award size={12} color="#fff" />
                </View>
              </View>
              
              <View style={styles.userMeta}>
                <View style={styles.rankRow}>
                  <Crown size={14} color="#f59e0b" fill="#f59e0b" />
                  <Text style={styles.userRank}>Thành viên Vàng</Text>
                </View>
                <Text style={styles.userEmail}>{user?.email || 'N/A'}</Text>
                <TouchableOpacity 
                  style={styles.editProfileBtn}
                  onPress={() => navigation.navigate('EditProfile')}
                >
                  <Text style={styles.editProfileText}>Chỉnh sửa hồ sơ</Text>
                  <Sparkles size={12} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.statsDivider} />

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Tin đã lưu</Text>
              </View>
              <View style={styles.statsVerticalDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>02</Text>
                <Text style={styles.statLabel}>Hợp đồng</Text>
              </View>
              <View style={styles.statsVerticalDivider} />
              <View style={styles.statItem}>
                <View style={styles.ratingValueRow}>
                  <Text style={styles.statValue}>4.9</Text>
                  <Star size={12} color="#f59e0b" fill="#f59e0b" />
                </View>
                <Text style={styles.statLabel}>Tin cậy</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Menu Sections */}
        <Animated.View style={[styles.mainContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {menuSections.map((section, sIndex) => (
            <View key={sIndex} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.menuCard}>
                {section.items.map((item, iIndex) => (
                  <TouchableOpacity 
                    key={iIndex} 
                    style={[styles.menuItem, iIndex === section.items.length - 1 && { borderBottomWidth: 0 }]}
                    onPress={item.onPress}
                  >
                    <View style={[styles.menuIconBox, { backgroundColor: item.color + '15' }]}>
                      <item.icon size={20} color={item.color} />
                    </View>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                    <ChevronRight size={18} color="#cbd5e1" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          <TouchableOpacity 
            style={styles.logoutBtn}
            activeOpacity={0.8}
            onPress={async () => {
              Alert.alert(
                'Đăng xuất',
                'Bạn có chắc chắn muốn đăng xuất?',
                [
                  { text: 'Hủy', style: 'cancel' },
                  { 
                    text: 'Đăng xuất', 
                    style: 'destructive', 
                    onPress: async () => {
                      await AsyncStorage.removeItem('userToken');
                      navigation.replace('Auth');
                    }
                  }
                ]
              );
            }}
          >
            <View style={styles.logoutContent}>
              <LogOut size={20} color="#ef4444" />
              <Text style={styles.logoutText}>Rời khỏi ứng dụng</Text>
            </View>
            <ArrowRight size={18} color="#ef4444" opacity={0.5} />
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerApp}>TimThueTro</Text>
            <Text style={styles.footerVersion}>Phiên bản 1.0.8 • Made with Love</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blob: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.1,
  },
  blob1: {
    width: 300,
    height: 300,
    backgroundColor: Colors.primary,
    top: -50,
    right: -100,
  },
  blob2: {
    width: 250,
    height: 250,
    backgroundColor: '#3b82f6',
    bottom: 50,
    left: -80,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  hero: {
    backgroundColor: '#0f172a', // Premium dark
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerInfo: {
    flex: 1,
    paddingRight: 16,
  },
  headerWelcome: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  headerName: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    marginTop: 4,
  },
  settingsBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  profileInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 20,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#f8fafc',
  },
  placeholderAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#f8fafc',
  },
  avatarInitial: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#10b981',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userMeta: {
    flex: 1,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  userRank: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#f59e0b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 10,
  },
  editProfileBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  editProfileText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statsDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1e293b',
    marginBottom: 2,
  },
  ratingValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsVerticalDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#f1f5f9',
  },
  mainContent: {
    paddingHorizontal: 24,
    marginTop: 30,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#94a3b8',
    marginBottom: 12,
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: '#334155',
    fontWeight: '600',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#fee2e2',
    marginTop: 10,
    marginBottom: 40,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ef4444',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerApp: {
    fontSize: 16,
    fontWeight: '900',
    color: '#cbd5e1',
    letterSpacing: 2,
    marginBottom: 4,
  },
  footerVersion: {
    fontSize: 12,
    color: '#e2e8f0',
    fontWeight: '500',
  },
});

export default ProfileScreen;
