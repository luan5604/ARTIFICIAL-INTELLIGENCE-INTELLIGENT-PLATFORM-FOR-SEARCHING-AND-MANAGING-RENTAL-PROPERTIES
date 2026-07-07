import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  StatusBar,
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import { 
  ChevronLeft, 
  FileText, 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  CreditCard,
  QrCode,
  Download,
  ShieldCheck,
  CheckCircle2,
  Info
} from 'lucide-react-native';
import Colors from '../../constants/Colors';

const { width } = Dimensions.get('window');

const ContractDetailScreen = ({ navigation, route }) => {
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

  // Mock contract data
  const contract = {
    id: 'CON-2026-089',
    status: 'Đang hiệu lực',
    roomName: 'Phòng 104 - PG Apartment 2',
    address: '59, Nguyễn Đình Hiến, Hòa Hải, Ngũ Hành Sơn, Đà Nẵng',
    startDate: '01/01/2025',
    endDate: '01/01/2027',
    price: '4.500.000đ/tháng',
    deposit: '4.500.000đ',
    landlord: {
      name: 'Nguyễn Đình Luân',
      phone: '0975 307 422',
      bankName: 'MB Bank (Ngân hàng Quân Đội)',
      accountNumber: '1234567890',
      accountName: 'NGUYEN DINH LUAN'
    }
  };

  const InfoRow = ({ icon: Icon, label, value, color = '#64748b' }) => (
    <View style={styles.infoRow}>
      <View style={[styles.infoIconBox, { backgroundColor: color + '10' }]}>
        <Icon size={18} color={color} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
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
            <Text style={styles.headerTitle}>Chi tiết hợp đồng</Text>
            <TouchableOpacity style={styles.downloadBtn}>
              <Download size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.contractStatusCard}>
            <View style={styles.statusHeader}>
              <View style={styles.statusBadge}>
                <CheckCircle2 size={12} color="#10b981" />
                <Text style={styles.statusText}>{contract.status}</Text>
              </View>
              <Text style={styles.contractId}>#{contract.id}</Text>
            </View>
            <Text style={styles.roomName}>{contract.roomName}</Text>
            <View style={styles.addressRow}>
              <MapPin size={14} color="#94a3b8" />
              <Text style={styles.addressText} numberOfLines={1}>{contract.address}</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.mainContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {/* Main Info Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <FileText size={16} color="#64748b" />
              <Text style={styles.sectionTitle}>Thông tin thuê</Text>
            </View>
            <View style={styles.infoCard}>
              <InfoRow icon={Calendar} label="Thời hạn hợp đồng" value={`${contract.startDate} - ${contract.endDate}`} color="#3b82f6" />
              <View style={styles.divider} />
              <InfoRow icon={CreditCard} label="Giá thuê hàng tháng" value={contract.price} color="#10b981" />
              <View style={styles.divider} />
              <InfoRow icon={ShieldCheck} label="Tiền đặt cọc" value={contract.deposit} color="#f59e0b" />
            </View>
          </View>

          {/* Landlord Info Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <User size={16} color="#64748b" />
              <Text style={styles.sectionTitle}>Chủ trọ</Text>
            </View>
            <View style={styles.infoCard}>
              <InfoRow icon={User} label="Họ tên" value={contract.landlord.name} color="#8b5cf6" />
              <View style={styles.divider} />
              <InfoRow icon={Phone} label="Số điện thoại" value={contract.landlord.phone} color="#3b82f6" />
            </View>
          </View>

          {/* Payment Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <QrCode size={16} color="#64748b" />
              <Text style={styles.sectionTitle}>Thanh toán định kỳ</Text>
            </View>
            <View style={styles.paymentCard}>
              <View style={styles.paymentInfo}>
                <Text style={styles.bankName}>{contract.landlord.bankName}</Text>
                <View style={styles.accountBox}>
                  <Text style={styles.accountLabel}>Số tài khoản:</Text>
                  <Text style={styles.accountValue}>{contract.landlord.accountNumber}</Text>
                </View>
                <View style={styles.accountBox}>
                  <Text style={styles.accountLabel}>Chủ tài khoản:</Text>
                  <Text style={styles.accountValue}>{contract.landlord.accountName}</Text>
                </View>
                <View style={styles.paymentNote}>
                  <Info size={12} color="#94a3b8" />
                  <Text style={styles.noteText}>Vui lòng ghi nội dung: [Tên phòng] - [Tháng]</Text>
                </View>
              </View>
              
              <View style={styles.qrContainer}>
                <Image 
                  source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://vietqr.net' }} 
                  style={styles.qrImage} 
                />
                <Text style={styles.qrLabel}>Quét để thanh toán</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.supportBtn}>
            <Text style={styles.supportBtnText}>Khiếu nại hợp đồng</Text>
          </TouchableOpacity>

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
  contractStatusCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 24,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: 'bold',
  },
  contractId: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontWeight: '600',
  },
  roomName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addressText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  mainContent: {
    paddingHorizontal: 24,
    marginTop: 30,
  },
  section: {
    marginBottom: 24,
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
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  infoIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#f8fafc',
    marginVertical: 16,
  },
  paymentCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  paymentInfo: {
    flex: 1,
  },
  bankName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1e293b',
    marginBottom: 12,
  },
  accountBox: {
    marginBottom: 8,
  },
  accountLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  accountValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
  },
  paymentNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 8,
  },
  noteText: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  qrContainer: {
    alignItems: 'center',
    marginLeft: 16,
  },
  qrImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginBottom: 8,
  },
  qrLabel: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  supportBtn: {
    padding: 18,
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fee2e2',
    borderStyle: 'dashed',
    marginTop: 10,
  },
  supportBtnText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '700',
  }
});

export default ContractDetailScreen;
