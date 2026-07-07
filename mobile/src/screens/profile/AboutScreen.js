import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  StatusBar,
  Animated,
  Dimensions
} from 'react-native';
import { 
  ChevronLeft, 
  Globe, 
  Facebook, 
  Instagram, 
  ShieldCheck, 
  Heart, 
  Sparkles,
  Zap,
  Twitter,
  Mail
} from 'lucide-react-native';
import Colors from '../../constants/Colors';

const { width, height } = Dimensions.get('window');

const AboutScreen = ({ navigation }) => {
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
            <Text style={styles.headerTitle}>TimThueTro Story</Text>
            <View style={{ width: 44 }} />
          </View>
          
          <View style={styles.logoSection}>
            <View style={styles.logoWrapper}>
              <View style={[styles.logoContainer, { backgroundColor: '#c1d5d5' }]}>
                <Text style={styles.logoText}><Text style={{color: 'red'}}>V</Text><Text style={{color: 'yellow'}}>K</Text><Text style={{color: 'blue'}}>U</Text></Text>
                <View style={styles.logoSparkle}>
                  <Sparkles size={16} color="#fff" />
                </View>
              </View>
            </View>
            <Text style={styles.appName}>TimThueTro</Text>
            <View style={styles.versionBadge}>
              <Text style={styles.versionText}>Phiên bản 1.0.3 (Premium)</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.mainContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.card}>
            <View style={styles.cardIconBox}>
              <Zap size={24} color={Colors.primary} />
            </View>
            <Text style={styles.cardTitle}>Sứ mệnh của chúng tôi</Text>
            <Text style={styles.description}>
              TimThueTro sinh ra với mục tiêu đơn giản hóa việc tìm kiếm nơi ở. Chúng tôi tin rằng ai cũng xứng đáng có một không gian sống tuyệt vời mà không phải tốn quá nhiều công sức để tìm kiếm.
            </Text>
          </View>

          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>10K+</Text>
              <Text style={styles.statLabel}>Người dùng</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5K+</Text>
              <Text style={styles.statLabel}>Tin đăng</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24/7</Text>
              <Text style={styles.statLabel}>Hỗ trợ</Text>
            </View>
          </View>

          <View style={styles.connectSection}>
            <Text style={styles.connectTitle}>Kết nối cộng đồng</Text>
            <View style={styles.socialGrid}>
              <TouchableOpacity style={styles.socialBox} activeOpacity={0.7}>
                <View style={[styles.socialIconBox, { backgroundColor: '#eff6ff' }]}>
                  <Facebook size={24} color="#3b82f6" />
                </View>
                <Text style={styles.socialName}>Facebook</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialBox} activeOpacity={0.7}>
                <View style={[styles.socialIconBox, { backgroundColor: '#fdf2f8' }]}>
                  <Instagram size={24} color="#ec4899" />
                </View>
                <Text style={styles.socialName}>Instagram</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialBox} activeOpacity={0.7}>
                <View style={[styles.socialIconBox, { backgroundColor: '#f5f3ff' }]}>
                  <Globe size={24} color="#8b5cf6" />
                </View>
                <Text style={styles.socialName}>Website</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialBox} activeOpacity={0.7}>
                <View style={[styles.socialIconBox, { backgroundColor: '#fff7ed' }]}>
                  <Mail size={24} color="#f59e0b" />
                </View>
                <Text style={styles.socialName}>Hợp tác</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.heartRow}>
              <Text style={styles.footerText}>Xây dựng với</Text>
              <Heart size={14} color="#ef4444" fill="#ef4444" />
              <Text style={styles.footerText}>bởi Nguyễn ĐÌnh Luân </Text>
            </View>
            <View style={styles.safetyRow}>
              <ShieldCheck size={14} color="#94a3b8" />
              <Text style={styles.safetyText}>Bảo mật bởi hệ thống Cloud mã hóa</Text>
            </View>
            <Text style={styles.copyright}>© 2026 Design By Nguyễn Đình Luân. All rights reserved.</Text>
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
    backgroundColor: '#8b5cf6',
    bottom: 50,
    left: -80,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  hero: {
    backgroundColor: '#0f172a',
    paddingTop: 60,
    paddingBottom: 50,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 40,
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
  logoSection: {
    alignItems: 'center',
  },
  logoWrapper: {
    position: 'relative',
    marginBottom: 24,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 10,
  },
  logoText: {
    color: '#fff',
    fontSize: 50,
    fontWeight: '900',
  },
  logoSparkle: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#f59e0b',
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#0f172a',
  },
  appName: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 10,
    letterSpacing: 1,
  },
  versionBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  versionText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '700',
  },
  mainContent: {
    paddingHorizontal: 24,
    marginTop: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  cardIconBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#f5f3ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1e293b',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 26,
    textAlign: 'center',
    fontWeight: '500',
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    padding: 20,
    marginTop: 30,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e2e8f0',
  },
  connectSection: {
    marginTop: 40,
  },
  connectTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#cbd5e1',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 24,
    textAlign: 'center',
  },
  socialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  socialBox: {
    width: (width - 48 - 16) / 2,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  socialIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  socialName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  footer: {
    marginTop: 60,
    alignItems: 'center',
    paddingBottom: 20,
  },
  heartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  safetyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  safetyText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  copyright: {
    fontSize: 11,
    color: '#cbd5e1',
    fontWeight: '600',
  }
});

export default AboutScreen;
