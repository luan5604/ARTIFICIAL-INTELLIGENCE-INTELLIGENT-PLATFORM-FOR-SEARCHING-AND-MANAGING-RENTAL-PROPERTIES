import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  StatusBar,
  Animated,
  Dimensions
} from 'react-native';
import { ChevronLeft, LogIn, MapPin, Clock, ShieldCheck, CheckCircle2, MonitorSmartphone } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import client from '../../api/client';
import { format } from 'date-fns';

const { width, height } = Dimensions.get('window');

const LoginHistoryScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await client.get('auth/sessions');
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching history:', error);
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
    fetchHistory();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.historyCard}>
      <View style={[styles.iconContainer, { backgroundColor: Colors.primary + '10' }]}>
        <LogIn size={20} color={Colors.primary} />
      </View>
      <View style={styles.historyContent}>
        <Text style={styles.deviceLabel} numberOfLines={1}>{item.device_name || 'Thiết bị không xác định'}</Text>
        <View style={styles.detailRow}>
          <MapPin size={12} color="#94a3b8" />
          <Text style={styles.detailText}>{item.ip_address}</Text>
        </View>
        <View style={styles.detailRow}>
          <Clock size={12} color="#94a3b8" />
          <Text style={styles.detailText}>
            {format(new Date(item.created_at), 'HH:mm - dd/MM/yyyy')}
          </Text>
        </View>
      </View>
      <View style={styles.statusBadge}>
        <CheckCircle2 size={12} color="#10b981" />
        <Text style={styles.statusText}>Thành công</Text>
      </View>
    </View>
  );

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
          <Text style={styles.headerTitle}>Giám sát đăng nhập</Text>
          <View style={{ width: 44 }} />
        </View>
        <View style={styles.heroContent}>
          <View style={styles.heroIconBox}>
            <MonitorSmartphone size={32} color="#fff" />
          </View>
          <Text style={styles.heroTitle}>Lịch sử hoạt động</Text>
          <Text style={styles.heroSubtitle}>Theo dõi các lần đăng nhập để đảm bảo tài khoản luôn nằm trong tầm kiểm soát của bạn.</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.mainWrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <FlatList
            data={history}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => (
              <Text style={styles.sectionTitle}>Các lần đăng nhập gần đây</Text>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Clock size={56} color="#cbd5e1" strokeWidth={1} />
                <Text style={styles.emptyTitle}>Chưa có dữ liệu</Text>
                <Text style={styles.emptySubtitle}>Các hoạt động đăng nhập sẽ được ghi lại tại đây.</Text>
              </View>
            }
          />
        )}

        <View style={styles.footerNote}>
          <ShieldCheck size={14} color="#94a3b8" />
          <Text style={styles.footerNoteText}>Dữ liệu được bảo mật bởi NguyenDinhLuan Security</Text>
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
    backgroundColor: '#10b981',
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
    alignItems: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
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
  heroIconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
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
  historyCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  historyContent: {
    flex: 1,
    gap: 4,
  },
  deviceLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#334155',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    color: '#10b981',
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  loadingContainer: {
    paddingTop: 100,
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  footerNoteText: {
    fontSize: 12,
    color: '#cbd5e1',
    fontWeight: '600',
  },
});

export default LoginHistoryScreen;
