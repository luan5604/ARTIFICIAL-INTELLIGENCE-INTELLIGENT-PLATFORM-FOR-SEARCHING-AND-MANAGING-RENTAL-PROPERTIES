import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import { 
  ChevronLeft, 
  Receipt, 
  Calendar, 
  Download, 
  CheckCircle2,
  TrendingUp,
  Zap,
  Droplets,
  Wifi,
  Trash2,
  Info
} from 'lucide-react-native';
import Colors from '../../constants/Colors';

const { width } = Dimensions.get('window');

const InvoiceDetailScreen = ({ navigation, route }) => {
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

  // Mock invoice data
  const invoice = {
    id: 'INV-2024-03-012',
    month: 'Tháng 03/2024',
    roomName: 'Phòng 302 - Căn hộ G8',
    status: 'Đã thanh toán',
    paymentDate: '14/03/2024',
    items: [
      { name: 'Tiền thuê phòng', icon: Receipt, value: '4.500.000đ', color: '#3b82f6' },
      { name: 'Tiền điện (120kWh x 3.5k)', icon: Zap, value: '420.000đ', color: '#f59e0b' },
      { name: 'Tiền nước (5m3 x 15k)', icon: Droplets, value: '75.000đ', color: '#10b981' },
      { name: 'Tiền Internet', icon: Wifi, value: '100.000đ', color: '#8b5cf6' },
      { name: 'Phí vệ sinh', icon: Trash2, value: '50.000đ', color: '#64748b' },
    ],
    total: '5.145.000đ'
  };

  const InvoiceItem = ({ icon: Icon, name, value, color }) => (
    <View style={styles.invoiceItem}>
      <View style={[styles.itemIconBox, { backgroundColor: color + '10' }]}>
        <Icon size={18} color={color} />
      </View>
      <Text style={styles.itemName}>{name}</Text>
      <Text style={styles.itemValue}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Decorative Blobs */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <Animated.View style={[styles.hero, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Chi tiết hóa đơn</Text>
            <TouchableOpacity style={styles.downloadBtn}>
              <Download size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.invoiceHeaderCard}>
            <View style={styles.statusBadge}>
              <CheckCircle2 size={12} color="#10b981" />
              <Text style={styles.statusText}>{invoice.status}</Text>
            </View>
            <Text style={styles.invoiceMonth}>{invoice.month}</Text>
            <Text style={styles.invoiceId}>#{invoice.id}</Text>
            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Tổng cộng</Text>
              <Text style={styles.totalValue}>{invoice.total}</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.mainContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {/* Items Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Receipt size={16} color="#64748b" />
              <Text style={styles.sectionTitle}>Chi tiết các khoản</Text>
            </View>
            <View style={styles.itemsCard}>
              {invoice.items.map((item, index) => (
                <View key={index}>
                  <InvoiceItem {...item} />
                  {index < invoice.items.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
              <View style={[styles.divider, { backgroundColor: '#e2e8f0', height: 1, marginVertical: 20 }]} />
              <View style={styles.totalRow}>
                <Text style={styles.totalRowLabel}>Tổng thanh toán</Text>
                <Text style={styles.totalRowValue}>{invoice.total}</Text>
              </View>
            </View>
          </View>

          {/* History Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Calendar size={16} color="#64748b" />
              <Text style={styles.sectionTitle}>Thông tin giao dịch</Text>
            </View>
            <View style={styles.historyCard}>
              <View style={styles.historyItem}>
                <View style={styles.historyIndicator}>
                  <View style={styles.indicatorDot} />
                  <View style={styles.indicatorLine} />
                </View>
                <View style={styles.historyContent}>
                  <Text style={styles.historyTitle}>Đã thanh toán thành công</Text>
                  <Text style={styles.historyTime}>{invoice.paymentDate} • 09:45 AM</Text>
                </View>
              </View>
              <View style={styles.historyItem}>
                <View style={styles.historyIndicator}>
                  <View style={[styles.indicatorDot, { backgroundColor: '#cbd5e1' }]} />
                </View>
                <View style={styles.historyContent}>
                  <Text style={[styles.historyTitle, { color: '#94a3b8' }]}>Hóa đơn được tạo</Text>
                  <Text style={styles.historyTime}>01/03/2024 • 08:00 AM</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.noteBox}>
            <Info size={16} color={Colors.primary} />
            <Text style={styles.noteText}>Mọi thắc mắc về hóa đơn, vui lòng liên hệ chủ trọ trong vòng 48h kể từ khi nhận được hóa đơn.</Text>
          </View>

          <View style={{ height: 40 }} />
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
  scrollContent: {
    paddingBottom: 40,
  },
  hero: {
    backgroundColor: '#0f172a',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
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
  downloadBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  invoiceHeaderCard: {
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  statusText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: 'bold',
  },
  invoiceMonth: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 4,
  },
  invoiceId: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '600',
    marginBottom: 24,
  },
  totalBox: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  totalLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
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
  itemsCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  invoiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  itemIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  itemValue: {
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: '#f8fafc',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalRowLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
  },
  totalRowValue: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.primary,
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  historyItem: {
    flexDirection: 'row',
    gap: 16,
  },
  historyIndicator: {
    alignItems: 'center',
    width: 20,
  },
  indicatorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    borderWidth: 3,
    borderColor: '#dcfce7',
    zIndex: 1,
  },
  indicatorLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 4,
  },
  historyContent: {
    flex: 1,
    paddingBottom: 24,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 4,
  },
  historyTime: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  noteBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: Colors.primary + '05',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.primary + '10',
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
    lineHeight: 20,
  }
});

export default InvoiceDetailScreen;
