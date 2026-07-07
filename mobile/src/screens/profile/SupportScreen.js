import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  StatusBar,
  Animated,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronLeft, 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Book, 
  ChevronRight, 
  Search,
  Sparkles,
  LifeBuoy,
  Mail,
  Instagram,
  Facebook
} from 'lucide-react-native';
import Colors from '../../constants/Colors';

const { width, height } = Dimensions.get('window');

const SupportScreen = ({ navigation }) => {
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

  const faqs = [
    { q: 'Làm thế nào để thuê phòng?', a: 'Bạn chỉ cần chọn phòng ưng ý và nhấn nút "Thuê ngay" để liên hệ với chủ trọ.' },
    { q: 'Tiền cọc thường là bao nhiêu?', a: 'Thông thường tiền cọc tương đương với 1-2 tháng tiền thuê phòng.' },
    { q: 'Làm sao để hủy yêu cầu thuê?', a: 'Bạn có thể vào lịch sử hoặc liên hệ trực tiếp cho chủ trọ để hủy.' },
  ];

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
            <Text style={styles.headerTitle}>Hỗ trợ khách hàng</Text>
            <View style={{ width: 44 }} />
          </View>
          
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Chúng tôi có thể giúp gì?</Text>
            <View style={styles.searchBar}>
              <Search size={20} color="#94a3b8" />
              <TextInput 
                placeholder="Tìm kiếm vấn đề bạn gặp phải..." 
                style={styles.searchInput}
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.mainContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <LifeBuoy size={16} color="#64748b" />
              <Text style={styles.sectionTitle}>Liên hệ nhanh</Text>
            </View>
            <View style={styles.contactContainer}>
              <TouchableOpacity 
                style={styles.contactCard} 
                activeOpacity={0.8}
                onPress={() => navigation.navigate('AIChat')}
              >
                <View style={[styles.iconBox, { backgroundColor: '#eff6ff' }]}>
                  <MessageSquare size={24} color={Colors.primary} />
                </View>
                <Text style={styles.contactLabel}>Chat hỗ trợ AI</Text>
                <Text style={styles.contactStatus}>Đang trực tuyến 24/7</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.contactCard} activeOpacity={0.8}>
                <View style={[styles.iconBox, { backgroundColor: '#f0fdf4' }]}>
                  <Phone size={24} color="#10b981" />
                </View>
                <Text style={styles.contactLabel}>Gọi tổng đài</Text>
                <Text style={styles.contactStatus}>1900 1234</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <HelpCircle size={16} color="#64748b" />
              <Text style={styles.sectionTitle}>Câu hỏi phổ biến</Text>
            </View>
            <View style={styles.faqCard}>
              {faqs.map((faq, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.faqItem, index === faqs.length - 1 && { borderBottomWidth: 0 }]}
                  onPress={() => navigation.navigate('AIChat', { initialQuestion: faq.q })}
                >
                  <Text style={styles.faqQuestion}>{faq.q}</Text>
                  <ChevronRight size={18} color="#cbd5e1" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.socialSection}>
            <Text style={styles.socialTitle}>Theo dõi chúng tôi</Text>
            <View style={styles.socialIcons}>
              <TouchableOpacity style={styles.socialIconBox}><Facebook size={20} color="#3b82f6" /></TouchableOpacity>
              <TouchableOpacity style={styles.socialIconBox}><Instagram size={20} color="#ec4899" /></TouchableOpacity>
              <TouchableOpacity style={styles.socialIconBox}><Mail size={20} color="#ef4444" /></TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.guideBtn}>
            <Book size={20} color="#fff" />
            <Text style={styles.guideBtnText}>Xem cẩm nang thuê trọ</Text>
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
    backgroundColor: '#10b981',
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
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 56,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: '#fff',
    fontWeight: '500',
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
  contactContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  contactCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  contactStatus: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  faqCard: {
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
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    color: '#334155',
    fontWeight: '600',
  },
  socialSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  socialTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#cbd5e1',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 20,
  },
  socialIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  guideBtn: {
    backgroundColor: Colors.primary,
    height: 60,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 40,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 4,
  },
  guideBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default SupportScreen;
