import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  StatusBar,
  Animated,
  Dimensions
} from 'react-native';
import { 
  ChevronLeft, 
  Smartphone, 
  Monitor, 
  LogOut, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Globe,
  SmartphoneNfc,
  Laptop
} from 'lucide-react-native';
import Colors from '../../constants/Colors';
import client from '../../api/client';
import { format } from 'date-fns';

const { width, height } = Dimensions.get('window');

const DeviceManagementScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const fetchSessions = async () => {
    try {
      const response = await client.get('auth/sessions');
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách thiết bị');
    } finally {
      setLoading(false);
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
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleLogoutSession = (sessionId) => {
    Alert.alert(
      'Đăng xuất thiết bị',
      'Thiết bị này sẽ không còn quyền truy cập vào tài khoản của bạn. Tiếp tục?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Đăng xuất', 
          style: 'destructive',
          onPress: async () => {
            try {
              await client.delete(`auth/sessions/${sessionId}`);
              setSessions(sessions.filter(s => s.id !== sessionId));
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể đăng xuất thiết bị');
            }
          }
        }
      ]
    );
  };

  const getDeviceDetails = (platform) => {
    const plat = platform?.toLowerCase() || '';
    if (plat.includes('ios')) return { icon: Smartphone, color: '#0ea5e9' };
    if (plat.includes('android')) return { icon: SmartphoneNfc, color: '#10b981' };
    return { icon: Laptop, color: '#6366f1' };
  };

  const renderItem = ({ item }) => {
    const { icon: DeviceIcon, color } = getDeviceDetails(item.platform);

    return (
      <TouchableOpacity 
        style={styles.card} 
        activeOpacity={0.8}
        onPress={() => {}}
      >
        <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
          <DeviceIcon size={24} color={color} />
        </View>
        <View style={styles.cardInfo}>
          <View style={styles.cardHeader}>
            <Text style={styles.deviceName} numberOfLines={1}>{item.device_name || 'Thiết bị lạ'}</Text>
            {item.is_active && (
              <View style={styles.currentBadge}>
                <CheckCircle2 size={10} color="#10b981" />
                <Text style={styles.currentText}>Hiện tại</Text>
              </View>
            )}
          </View>
          <Text style={styles.ipText}>{item.ip_address} • {item.platform || 'Hệ điều hành ẩn'}</Text>
          <View style={styles.timeBox}>
            <Clock size={12} color="#94a3b8" />
            <Text style={styles.timeVal}>
              Lần cuối: {format(new Date(item.last_active), 'HH:mm - dd/MM/yyyy')}
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.logoutBtnSmall}
          onPress={() => handleLogoutSession(item.id)}
        >
          <LogOut size={18} color="#ef4444" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (loading) {
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

      {/* Hero Header */}
      <Animated.View style={[styles.hero, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quản lý thiết bị</Text>
          <View style={{ width: 44 }} />
        </View>
        
        <View style={styles.securityBanner}>
          <View style={styles.bannerIconBox}>
            <ShieldCheck size={28} color="#fff" />
          </View>
          <View style={styles.bannerTextContent}>
            <Text style={styles.bannerTitle}>Bảo mật phiên bản 2.0</Text>
            <Text style={styles.bannerSubtitle}>Kiểm soát mọi cổng truy cập vào tài khoản của bạn.</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View style={[styles.mainWrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <FlatList
          data={sessions}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <Text style={styles.sectionTitle}>Danh sách thiết bị tin cậy</Text>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Monitor size={56} color="#cbd5e1" strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>Chưa có thiết bị nào</Text>
            </View>
          }
        />
        <View style={styles.footerNote}>
          <Globe size={14} color="#94a3b8" />
          <Text style={styles.footerNoteText}>Tất cả các phiên làm việc đều được mã hóa SSL/TLS</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  hero: {
    backgroundColor: '#0f172a',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  securityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 16,
  },
  bannerIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  bannerTextContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
    lineHeight: 18,
  },
  mainWrapper: {
    flex: 1,
    marginTop: -20,
  },
  listContent: {
    padding: 24,
    paddingTop: 40,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 20,
    marginLeft: 4,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  deviceName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#334155',
  },
  currentBadge: {
    flexDirection: 'row',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignItems: 'center',
    gap: 4,
  },
  currentText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10b981',
  },
  ipText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 8,
  },
  timeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeVal: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  logoutBtnSmall: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff1f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#94a3b8',
    marginTop: 16,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 20,
  },
  footerNoteText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default DeviceManagementScreen;
