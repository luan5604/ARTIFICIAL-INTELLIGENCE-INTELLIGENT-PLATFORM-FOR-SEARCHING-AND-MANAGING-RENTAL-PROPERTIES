import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  StatusBar,
  Animated,
  Dimensions,
  Image,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronLeft, 
  FileText, 
  Calendar, 
  DollarSign, 
  Clock, 
  Sparkles,
  ArrowRight,
  Receipt,
  CheckCircle2,
  AlertCircle,
  MapPin,
  QrCode,
  Info
} from 'lucide-react-native';
import Colors from '../../constants/Colors';

const { width } = Dimensions.get('window');

const RentalHistoryScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('contract'); // 'contract' or 'payments'
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
  }, [activeTab]);

  const historyData = [
    {
      id: '1',
      roomName: 'Phòng 104 - PG Apartment 2',
      date: '14/03/2025',
      amount: '4000000',
      status: 'Đã thanh toán',
      type: 'Thanh toán tháng 4',
    },
    {
      id: '2',
      roomName: 'Phòng 302 - Căn hộ G8',
      date: '10/02/2024',
      amount: '4.500.000',
      status: 'Đã thanh toán',
      type: 'Thanh toán tháng 2',
    },
    
  ];

  const currentContract = {
    id: 'CON-2024-089',
    status: 'Đang hiệu lực',
    roomName: 'Phòng 104 - PG Apartment 2',
    landlord: 'Nguyễn Đình Luân ',
    startDate: '01/01/2025',
    price: '4.500.000đ',
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Đã thanh toán':
      case 'Đang hiệu lực':
        return { bg: '#dcfce7', text: '#10b981', icon: CheckCircle2 };
      case 'Chưa thanh toán':
        return { bg: '#fff7ed', text: '#f59e0b', icon: Clock };
      case 'Quá hạn':
        return { bg: '#fef2f2', text: '#ef4444', icon: AlertCircle };
      default:
        return { bg: '#f1f5f9', text: '#64748b', icon: FileText };
    }
  };

  const renderPaymentItem = ({ item }) => {
    const statusStyle = getStatusStyle(item.status);
    const StatusIcon = statusStyle.icon;

    return (
      <TouchableOpacity 
        style={styles.card} 
        activeOpacity={0.9}
        onPress={() => navigation.navigate('InvoiceDetail', { invoiceId: item.id })}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: Colors.primary + '10' }]}>
            <Receipt size={22} color={Colors.primary} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.roomName}>{item.roomName}</Text>
            <Text style={styles.typeText}>{item.type}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <StatusIcon size={12} color={statusStyle.text} />
            <Text style={[styles.statusLabel, { color: statusStyle.text }]}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.cardFooter}>
          <View style={styles.footerInfoBox}>
            <Calendar size={14} color="#94a3b8" />
            <Text style={styles.footerVal}>{item.date}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.amountText}>{item.amount}</Text>
            <Text style={styles.currency}>đ</Text>
          </View>
        </View>

        <View style={styles.detailsBtn}>
          <Text style={styles.detailsText}>Xem hóa đơn</Text>
          <ArrowRight size={14} color={Colors.primary} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderContractTab = () => {
    const statusStyle = getStatusStyle(currentContract.status);
    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabScrollContent}>
        <View style={styles.contractOverviewCard}>
          <View style={styles.overviewHeader}>
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
              <CheckCircle2 size={12} color={statusStyle.text} />
              <Text style={[styles.statusLabel, { color: statusStyle.text }]}>{currentContract.status}</Text>
            </View>
            <Text style={styles.contractId}>#{currentContract.id}</Text>
          </View>
          
          <Text style={styles.overviewRoomName}>{currentContract.roomName}</Text>
          
          <View style={styles.overviewMeta}>
            <View style={styles.metaItem}>
              <Calendar size={14} color="#94a3b8" />
              <Text style={styles.metaText}>Bắt đầu: {currentContract.startDate}</Text>
            </View>
            <View style={styles.metaItem}>
              <DollarSign size={14} color="#94a3b8" />
              <Text style={styles.metaText}>Giá: {currentContract.price}/tháng</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.mainActionBtn}
            onPress={() => navigation.navigate('ContractDetail')}
          >
            <Text style={styles.mainActionText}>Xem chi tiết hợp đồng</Text>
            <ArrowRight size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.paymentMethodSection}>
          <Text style={styles.sectionLabel}>Thanh toán nhanh</Text>
          <View style={styles.qrCard}>
            <View style={styles.qrInfo}>
              <Text style={styles.bankName}>MB Bank</Text>
              <Text style={styles.accountName}>NGUYEN DINH LUAN</Text>
              <Text style={styles.accountNumber}>1234567890</Text>
              <View style={styles.noteBox}>
                <Info size={12} color="#94a3b8" />
                <Text style={styles.noteText}>Vui lòng quét QR để thanh toán nhanh</Text>
              </View>
            </View>
            <View style={styles.qrContainer}>
              <Image 
                source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://vietqr.net' }} 
                style={styles.qrImage} 
              />
              <TouchableOpacity style={styles.qrFullBtn}>
                <QrCode size={14} color={Colors.primary} />
                <Text style={styles.qrFullText}>Phóng to</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Decorative Background Elements */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      {/* Hero Header */}
      <View style={styles.hero}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dịch vụ đang thuê</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'contract' && styles.activeTab]} 
            onPress={() => setActiveTab('contract')}
          >
            <FileText size={18} color={activeTab === 'contract' ? '#fff' : 'rgba(255,255,255,0.4)'} />
            <Text style={[styles.tabText, activeTab === 'contract' && styles.activeTabText]}>Hợp đồng</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'payments' && styles.activeTab]} 
            onPress={() => setActiveTab('payments')}
          >
            <Receipt size={18} color={activeTab === 'payments' ? '#fff' : 'rgba(255,255,255,0.4)'} />
            <Text style={[styles.tabText, activeTab === 'payments' && styles.activeTabText]}>Thanh toán</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Animated.View style={[styles.contentWrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {activeTab === 'contract' ? (
          renderContractTab()
        ) : (
          <FlatList
            data={historyData}
            renderItem={renderPaymentItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => (
              <View style={styles.listHeader}>
                <Text style={styles.listTitle}>Lịch sử giao dịch</Text>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Clock size={48} color="#cbd5e1" />
                <Text style={styles.emptyText}>Chưa có giao dịch nào được ghi lại.</Text>
              </View>
            }
          />
        )}
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
    backgroundColor: '#8b5cf6',
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
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 16,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  contentWrapper: {
    flex: 1,
  },
  tabScrollContent: {
    padding: 24,
  },
  contractOverviewCard: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
    marginBottom: 24,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  contractId: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '700',
  },
  overviewRoomName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1e293b',
    marginBottom: 16,
  },
  overviewMeta: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  mainActionBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  mainActionText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  paymentMethodSection: {
    marginTop: 10,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 16,
    marginLeft: 8,
  },
  qrCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  qrInfo: {
    flex: 1,
  },
  bankName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1e293b',
    marginBottom: 4,
  },
  accountName: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 2,
  },
  accountNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 12,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 10,
  },
  noteText: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
    flex: 1,
  },
  qrContainer: {
    marginLeft: 16,
    alignItems: 'center',
  },
  qrImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginBottom: 8,
  },
  qrFullBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  qrFullText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  listContent: {
    padding: 24,
  },
  listHeader: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 2,
  },
  typeText: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#f8fafc',
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerVal: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  amountText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1e293b',
  },
  currency: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94a3b8',
    marginBottom: 2,
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f8fafc',
  },
  detailsText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 15,
    color: '#94a3b8',
    fontWeight: '500',
    textAlign: 'center',
  }
});

export default RentalHistoryScreen;

