import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar,
  Animated,
  Dimensions
} from 'react-native';
import { 
  ChevronLeft, 
  Shield, 
  Lock, 
  Smartphone, 
  ChevronRight, 
  LogIn,
  History,
  Fingerprint,
  AlertTriangle,
  FileLock2,
  ShieldCheck
} from 'lucide-react-native';
import Colors from '../../constants/Colors';

const { width, height } = Dimensions.get('window');

const SecurityScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
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
  }, []);

  const SecurityItem = ({ icon: Icon, title, subtitle, color = Colors.primary, onPress }) => (
    <TouchableOpacity 
      style={styles.menuItem} 
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
        <Icon size={20} color={color} />
      </View>
      <View style={styles.menuText}>
        <Text style={styles.menuLabel}>{title}</Text>
        <Text style={styles.menuSubLabel}>{subtitle}</Text>
      </View>
      <ChevronRight size={18} color="#cbd5e1" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Decorative Background Elements */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Header */}
        <Animated.View style={[styles.hero, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Bảo mật & Quyền lợi</Text>
            <View style={{ width: 44 }} />
          </View>
          
          <View style={styles.shieldSection}>
            <View style={styles.shieldWrapper}>
              <View style={styles.shieldInner}>
                <ShieldCheck size={48} color="#fff" />
              </View>
              <View style={styles.verifiedDot}>
                <Fingerprint size={12} color={Colors.primary} />
              </View>
            </View>
            <Text style={styles.shieldTitle}>An toàn 100%</Text>
            <Text style={styles.shieldSubtitle}>Tài khoản của bạn đang được bảo vệ bởi công nghệ mã hóa đa lớp.</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.mainContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Lock size={16} color="#64748b" />
              <Text style={styles.sectionTitle}>Truy cập tài khoản</Text>
            </View>
            <View style={styles.menuCard}>
              <SecurityItem 
                icon={Lock} 
                title="Đổi mật khẩu" 
                subtitle="Cập nhật mật khẩu để bảo vệ tài khoản"
                color="#8b5cf6"
                onPress={() => navigation.navigate('ChangePassword')}
              />
              <SecurityItem 
                icon={History} 
                title="Lịch sử đăng nhập" 
                subtitle="Xem lại các phiên đăng nhập gần đây"
                color="#10b981"
                onPress={() => navigation.navigate('LoginHistory')}
              />
              <SecurityItem 
                icon={Smartphone} 
                title="Thiết bị tin cậy" 
                subtitle="Quản lý các thiết bị đã đăng nhập"
                color="#f59e0b"
                onPress={() => navigation.navigate('DeviceManagement')}
              />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <FileLock2 size={16} color="#64748b" />
              <Text style={styles.sectionTitle}>Chính sách & Pháp lý</Text>
            </View>
            <View style={styles.menuCard}>
              <TouchableOpacity style={styles.simpleMenuItem}>
                <Text style={styles.simpleMenuLabel}>Chính sách bảo mật dữ liệu</Text>
                <ChevronRight size={18} color="#cbd5e1" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.simpleMenuItem, { borderBottomWidth: 0 }]}>
                <Text style={styles.simpleMenuLabel}>Điều khoản dịch vụ khách hàng</Text>
                <ChevronRight size={18} color="#cbd5e1" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.warningCard}>
            <AlertTriangle size={24} color="#ef4444" />
            <View style={styles.warningTextContent}>
              <Text style={styles.warningTitle}>Cảnh báo</Text>
              <Text style={styles.warningDesc}>Nếu bạn thấy có hoạt động bất thường, hãy đổi mật khẩu ngay lập tức.</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.deleteBtn} activeOpacity={0.7}>
            <Text style={styles.deleteBtnText}>Kết thúc & Xóa tài khoản vĩnh viễn</Text>
          </TouchableOpacity>
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
    backgroundColor: '#ef4444',
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
  shieldSection: {
    alignItems: 'center',
  },
  shieldWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  shieldInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 6,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  verifiedDot: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#fff',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#0f172a',
  },
  shieldTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 8,
  },
  shieldSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    letterSpacing: 0.2,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  mainContent: {
    paddingHorizontal: 24,
    marginTop: 30,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#94a3b8',
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
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  menuSubLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  simpleMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  simpleMenuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: '#fef2f2',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fee2e2',
    gap: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  warningTextContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ef4444',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  warningDesc: {
    fontSize: 13,
    color: '#991b1b',
    fontWeight: '500',
    lineHeight: 18,
  },
  deleteBtn: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  deleteBtnText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '700',
    textDecorationLine: 'underline',
  }
});

export default SecurityScreen;
