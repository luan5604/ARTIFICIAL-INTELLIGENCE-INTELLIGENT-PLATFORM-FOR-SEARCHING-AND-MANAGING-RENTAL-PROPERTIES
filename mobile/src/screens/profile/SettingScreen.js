import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Switch, 
  StatusBar,
  Animated,
  Dimensions,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronLeft, 
  Globe, 
  Bell, 
  Moon, 
  ChevronRight, 
  Volume2, 
  Sparkles,
  ShieldCheck,
  Eye,
  Eraser,
  HelpCircle
} from 'lucide-react-native';
import Colors from '../../constants/Colors';

const { width, height } = Dimensions.get('window');

const SettingScreen = ({ navigation }) => {
  const [isPushEnabled, setIsPushEnabled] = useState(true);
  const [isEmailEnabled, setIsEmailEnabled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  // Animation values
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

  const SettingRow = ({ icon: Icon, label, value, onValueChange, type = 'switch', color = '#3b82f6', onPress }) => (
    <TouchableOpacity 
      style={styles.menuItem} 
      activeOpacity={type === 'link' ? 0.7 : 1}
      onPress={type === 'link' ? onPress : undefined}
    >
      <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
        <Icon size={20} color={color} />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      {type === 'switch' ? (
        <Switch 
          value={value} 
          onValueChange={onValueChange}
          trackColor={{ false: '#e2e8f0', true: Colors.primary }} 
          thumbColor={Platform.OS === 'ios' ? undefined : value ? '#fff' : '#f8fafc'}
        />
      ) : type === 'link' ? (
        <View style={styles.rightContent}>
          {value && <Text style={styles.valueText}>{value}</Text>}
          <ChevronRight size={18} color="#cbd5e1" />
        </View>
      ) : null}
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
            <Text style={styles.headerTitle}>Cài đặt</Text>
            <View style={{ width: 44 }} />
          </View>
          <View style={styles.heroText}>
            <Text style={styles.heroMainTitle}>Trải nghiệm ứng dụng</Text>
            <Text style={styles.heroSubtitle}>Tùy chỉnh để TimThueTro hoạt động theo cách bạn muốn.</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.mainContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Bell size={16} color="#64748b" />
              <Text style={styles.sectionTitle}>Thông báo đẩy</Text>
            </View>
            <View style={styles.menuCard}>
              <SettingRow 
                icon={Sparkles} 
                label="Thông báo hệ thống" 
                value={isPushEnabled} 
                onValueChange={setIsPushEnabled}
                color="#8b5cf6"
              />
              <SettingRow 
                icon={Volume2} 
                label="Âm thanh & Rung" 
                value={isSoundEnabled} 
                onValueChange={setIsSoundEnabled}
                color="#ec4899"
              />
              <SettingRow 
                icon={Globe} 
                label="Thông báo qua Email" 
                value={isEmailEnabled} 
                onValueChange={setIsEmailEnabled}
                color="#10b981"
              />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Eye size={16} color="#64748b" />
              <Text style={styles.sectionTitle}>Giao diện & Bảo mật</Text>
            </View>
            <View style={styles.menuCard}>
              <SettingRow 
                icon={Moon} 
                label="Chế độ tối (Dark Mode)" 
                value={isDarkMode} 
                onValueChange={(val) => {
                  setIsDarkMode(val);
                  Alert.alert('Thông báo', 'Tính năng Chế độ tối sẽ được cập nhật hoàn thiện trong phiên bản tới.');
                }}
                color="#64748b"
              />
              <SettingRow 
                icon={Globe} 
                label="Ngôn ngữ hiển thị" 
                type="link"
                value="Tiếng Việt"
                color="#f59e0b"
                onPress={() => {}}
              />
              <SettingRow 
                icon={ShieldCheck} 
                label="Quyền riêng tư" 
                type="link"
                color="#3b82f6"
                onPress={() => navigation.navigate('EditProfile')}
              />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <HelpCircle size={16} color="#64748b" />
              <Text style={styles.sectionTitle}>Hệ thống</Text>
            </View>
            <View style={styles.menuCard}>
              <SettingRow 
                icon={Eraser} 
                label="Xóa bộ nhớ đệm" 
                type="link"
                value="24.5 MB"
                color="#ef4444"
                onPress={() => {}}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.resetBtn} activeOpacity={0.7}>
            <Text style={styles.resetBtnText}>Khôi phục cài đặt mặc định</Text>
          </TouchableOpacity>

          <View style={styles.footerInfo}>
            <Text style={styles.footerText}>Mã thiết bị: TTT-MOBILE-4921</Text>
            <Text style={styles.footerText}>Phiên bản 1.0.3 (Stable)</Text>
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
  heroText: {
    marginTop: 10,
  },
  heroMainTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 22,
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
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  valueText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  resetBtn: {
    marginTop: 20,
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  resetBtnText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '700',
  },
  footerInfo: {
    alignItems: 'center',
    marginTop: 40,
    gap: 4,
  },
  footerText: {
    fontSize: 11,
    color: '#cbd5e1',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default SettingScreen;
