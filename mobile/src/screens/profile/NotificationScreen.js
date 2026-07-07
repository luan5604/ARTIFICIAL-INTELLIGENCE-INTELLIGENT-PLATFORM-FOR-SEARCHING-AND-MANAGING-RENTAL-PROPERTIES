import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity, 
  StatusBar,
  Animated,
  Dimensions
} from 'react-native';
import { 
  ChevronLeft, 
  Bell, 
  Calendar, 
  Info, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  MessageCircle,
  Clock,
  CircleCheck
} from 'lucide-react-native';
import Colors from '../../constants/Colors';

const { width, height } = Dimensions.get('window');

const NotificationScreen = ({ navigation }) => {
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

  const notifications = [
    {
      id: '1',
      title: 'Nhắc nhở thanh toán',
      body: 'Tiền thuê phòng tháng 3 của bạn hết hạn trong 3 ngày tới. Vui lòng thanh toán sớm.',
      time: '1 giờ trước',
      type: 'warning',
      isRead: false,
    },
    {
      id: '2',
      title: 'Xác nhận cọc thành công',
      body: 'Bạn đã thanh toán cọc thành công cho Phòng 104 - PG Apartment 2.',
      time: '2 ngày trước',
      type: 'success',
      isRead: true,
    },
    {
      id: '3',
      title: 'Tin nhắn mới từ chủ trọ',
      body: 'Chủ nhà đã trả lời yêu cầu xem phòng của bạn tại Quận 10.',
      time: '3 ngày trước',
      type: 'info',
      isRead: true,
    }
  ];

  const getTheme = (type) => {
    switch (type) {
      case 'warning': return { color: '#f59e0b', icon: AlertCircle, bg: '#fff7ed' };
      case 'success': return { color: '#10b981', icon: CheckCircle2, bg: '#ecfdf5' };
      case 'info': return { color: '#3b82f6', icon: MessageCircle, bg: '#eff6ff' };
      default: return { color: Colors.primary, icon: Bell, bg: '#f5f3ff' };
    }
  };

  const renderItem = ({ item }) => {
    const theme = getTheme(item.type);
    const Icon = theme.icon;

    return (
      <TouchableOpacity 
        style={[styles.item, !item.isRead && styles.unreadItem]}
        activeOpacity={0.7}
      >
        <View style={[styles.iconBox, { backgroundColor: theme.bg }]}>
          <Icon size={22} color={theme.color} />
        </View>
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text style={[styles.itemTitle, !item.isRead && { fontWeight: '900', color: '#0f172a' }]}>{item.title}</Text>
            {!item.isRead && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.itemBody} numberOfLines={2}>{item.body}</Text>
          <View style={styles.timeRow}>
            <Clock size={12} color="#94a3b8" />
            <Text style={styles.itemTime}>{item.time}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
          <Text style={styles.headerTitle}>Trung tâm thông báo</Text>
          <View style={{ width: 44 }} />
        </View>
        <View style={styles.heroContent}>
          <View>
            <Text style={styles.heroMainTitle}>Chào bạn!</Text>
            <Text style={styles.heroSubtitle}>Bạn có {notifications.filter(n => !n.isRead).length} thông báo mới chưa đọc.</Text>
          </View>
          <TouchableOpacity style={styles.markReadBtn}>
            <CircleCheck size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View style={[styles.mainWrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <Text style={styles.listSectionTitle}>Gần đây</Text>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Bell size={64} color="#cbd5e1" strokeWidth={1} />
              <Text style={styles.emptyTitle}>Hộp thư trống</Text>
              <Text style={styles.emptySubtitle}>Hiện tại bạn không có thông báo nào mới.</Text>
            </View>
          }
        />
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
    backgroundColor: '#f59e0b',
    top: -50,
    right: -100,
  },
  blob2: {
    width: 250,
    height: 250,
    backgroundColor: Colors.primary,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  heroMainTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
  },
  markReadBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  mainWrapper: {
    flex: 1,
    marginTop: -20,
  },
  listContent: {
    padding: 24,
    paddingTop: 40,
  },
  listSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 20,
    marginLeft: 4,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  unreadItem: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
    flex: 1,
    paddingRight: 10,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    marginTop: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  itemBody: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 10,
    fontWeight: '500',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemTime: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1e293b',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 40,
  }
});

export default NotificationScreen;
