import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  Alert,
  Modal,
  Platform,
  Dimensions,
  Linking,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { 
  ChevronLeft, 
  MapPin, 
  Maximize2, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Phone, 
  MessageSquare, 
  Users,
  Flag,
  Map as MapIcon,
  Navigation
} from 'lucide-react-native';
import Colors from '../../constants/Colors';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import client from '../../api/client';

const PostDetailScreen = ({ route, navigation }) => {
  const { post: initialPost } = route.params;
  const [post, setPost] = useState(initialPost);
  const [isRented, setIsRented] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [similarPosts, setSimilarPosts] = useState([]);
  const [isReporting, setIsReporting] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');

  const reportReasons = [
    'Lừa đảo / Đặt cọc giả',
    'Giá không đúng thực tế',
    'Hình ảnh không đúng / Giả mạo',
    'Phòng đã cho thuê / Không còn trống',
    'Nội dung không phù hợp / Vi phạm',
    'Khác'
  ];

  const handleReportPost = () => {
    setShowReportModal(true);
  };

  const handleConfirmReport = async () => {
    if (!reportReason) {
      Alert.alert('Thông báo', 'Vui lòng chọn lý do báo cáo.');
      return;
    }

    try {
      setIsReporting(true);
      await client.post('reports', {
        post_id: post.id,
        reported_user_id: post.Room?.Property?.landlord_id || post.User?.id,
        reason: reportReason,
        description: reportDescription || 'Người dùng báo cáo từ ứng dụng di động.'
      });
      setShowReportModal(false);
      setReportReason('');
      setReportDescription('');
      Alert.alert('Thành công', 'Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét bài đăng này sớm nhất có thể.');
    } catch (error) {
      console.error('Error reporting post:', error);
      Alert.alert('Lỗi', 'Không thể gửi báo cáo. Vui lòng thử lại sau.');
    } finally {
      setIsReporting(false);
    }
  };

  useEffect(() => {
    setPost(initialPost);
    fetchSimilarPosts(initialPost.id);
  }, [initialPost]);

  const fetchSimilarPosts = async (id) => {
    try {
      const response = await client.get(`posts/${id}/similar`);
      setSimilarPosts(response.data);
    } catch (error) {
      console.error('Error fetching similar posts:', error);
    }
  };

  // Derive data from the nested structure
  const room = post.Room || {};
  const property = room.Property || {};
  const price = room.base_price ? Number(room.base_price) : (post.price || 0);
  const location = property.address_street 
    ? [property.address_street, property.ward, property.district, property.city].filter(Boolean).join(', ')
    : (post.location || 'Chưa cập nhật địa chỉ');
  
  const amenities = room.Amenities?.map(a => a.name) || ['Wifi', 'Máy lạnh', 'Chỗ để xe'];
  const imageUrl = post.PostImages?.[0]?.image_url || post.image || 'https://via.placeholder.com/800';
  const area = room.area || post.area || 0;
  const occupants = room.max_occupants || post.occupants || 0;
  const updatedAt = post.updated_at || post.updatedAt;
  const formattedDate = updatedAt ? format(new Date(updatedAt), 'do MMMM, yyyy', { locale: vi }) : 'Vừa xong';
  const handleRentNow = () => {
    Alert.alert(
      'Xác nhận thuê',
      'Bạn có chắc chắn muốn liên hệ thuê căn phòng này?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xác nhận', 
          onPress: () => {
            setIsRented(true);
            setShowSuccessModal(true);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
          >
            {post.PostImages && post.PostImages.length > 0 ? (
              post.PostImages.map((img, index) => (
                <Image 
                  key={index}
                  source={{ uri: img.image_url }} 
                  style={styles.image} 
                />
              ))
            ) : (
              <Image source={{ uri: imageUrl }} style={styles.image} />
            )}
          </ScrollView>
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.reportButton}
            onPress={handleReportPost}
          >
            <Flag size={20} color="#fff" />
          </TouchableOpacity>

          {post.PostImages && post.PostImages.length > 1 && (
            <View style={styles.imageBadge}>
              <Text style={styles.imageBadgeText}>1/{post.PostImages.length}</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{post.type || 'Phòng trọ'}</Text>
            </View>
            <View style={styles.verifyBadge}>
              <ShieldCheck size={14} color={Colors.primary} />
              <Text style={styles.verifyText}>Đã xác minh</Text>
            </View>
          </View>

          <Text style={styles.title}>{post.title}</Text>
          
          <TouchableOpacity style={styles.locationCard}>
            <View style={styles.locationIconWrapper}>
              <MapPin size={20} color={Colors.primary} />
            </View>
            <Text style={styles.locationText} numberOfLines={2}>{location}</Text>
          </TouchableOpacity>

          {/* Key Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.gridItem}>
              <View style={[styles.gridIcon, { backgroundColor: '#fdf2f8' }]}>
                <Maximize2 size={20} color="#db2777" />
              </View>
              <Text style={styles.gridValue}>{area}m²</Text>
              <Text style={styles.gridLabel}>Diện tích</Text>
            </View>
            <View style={styles.gridItem}>
              <View style={[styles.gridIcon, { backgroundColor: '#f0fdf4' }]}>
                <Users size={20} color="#16a34a" />
              </View>
              <Text style={styles.gridValue}>{occupants}</Text>
              <Text style={styles.gridLabel}>Sức chứa</Text>
            </View>
            <View style={styles.gridItem}>
              <View style={[styles.gridIcon, { backgroundColor: '#fff7ed' }]}>
                <Users size={20} color="#ea580c" />
              </View>
              <Text style={styles.gridValue}>{room.gender === 'MALE' ? 'Nam' : room.gender === 'FEMALE' ? 'Nữ' : 'Tất cả'}</Text>
              <Text style={styles.gridLabel}>Đối tượng</Text>
            </View>
          </View>

          {/* Map Preview Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIndicator} />
              <Text style={styles.sectionTitle}>Vị trí trên bản đồ</Text>
            </View>
            <TouchableOpacity 
              style={styles.mapContainer} 
              activeOpacity={0.9}
              onPress={() => {
                const lat = 10.762622;
                const lng = 106.660172;
                const label = encodeURIComponent(post.title);
                const url = Platform.select({
                  ios: `maps:0,0?q=${label}@${lat},${lng}`,
                  android: `geo:0,0?q=${lat},${lng}(${label})`,
                });
                if (url) Linking.openURL(url);
              }}
            >
              <WebView
                scrollEnabled={false}
                pointerEvents="none"
                style={styles.mapImage}
                source={{ html: `
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
                    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
                    <style>
                      body { margin: 0; padding: 0; }
                      #map { height: 100vh; width: 100vw; }
                    </style>
                  </head>
                  <body>
                    <div id="map"></div>
                    <script>
                      var map = L.map('map', { zoomControl: false }).setView([10.762622, 106.660172], 15);
                      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
                      L.marker([10.762622, 106.660172]).addTo(map);
                    </script>
                  </body>
                  </html>
                ` }}
              />
              <View style={styles.mapOverlay}>
                <View style={styles.mapMarker}>
                  <View style={styles.markerDot} />
                  <View style={styles.markerPulse} />
                </View>
                <View style={styles.mapActionBtn}>
                  <Navigation size={16} color="#fff" />
                  <Text style={styles.mapActionText}>Chỉ đường</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Landlord Section */}
          <View style={styles.landlordSection}>
            <View style={styles.landlordInfo}>
              <View style={styles.landlordAvatarContainer}>
                {property.landlord?.Profile?.avatar ? (
                  <Image source={{ uri: property.landlord.Profile.avatar }} style={styles.landlordAvatar} />
                ) : (
                  <View style={styles.landlordPlaceholder}>
                    <Text style={styles.landlordLetter}>{property.landlord?.Profile?.full_name?.charAt(0) || 'C'}</Text>
                  </View>
                )}
                <View style={styles.onlineStatus} />
              </View>
              <View>
                <Text style={styles.landlordName}>{property.landlord?.Profile?.full_name || 'Chủ phòng'}</Text>
                <Text style={styles.landlordRole}>Chủ nhà / Quản lý</Text>
              </View>
            </View>
            <View style={styles.landlordActions}>
              <TouchableOpacity 
                style={styles.landlordChatBtn}
                onPress={() => {
                  setIsRented(true);
                  setShowSuccessModal(true);
                }}
              >
                <MessageSquare size={18} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.landlordCallBtn}
                onPress={() => {
                   const phone = property.landlord?.phone_number || post.User?.phone_number;
                   if (phone) Linking.openURL(`tel:${phone}`);
                   else Alert.alert('Lỗi', 'Không tìm thấy số điện thoại.');
                }}
              >
                <Phone size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIndicator} />
              <Text style={styles.sectionTitle}>Mô tả</Text>
            </View>
            <Text style={styles.description}>
              {post.content || post.description || 'Chưa có mô tả chi tiết cho phòng này.'}
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIndicator} />
              <Text style={styles.sectionTitle}>Tiện ích phòng</Text>
            </View>
            <View style={styles.amenitiesGrid}>
              {amenities.map((item, index) => (
                <View key={index} style={styles.amenityChip}>
                  <CheckCircle2 size={14} color={Colors.success} />
                  <Text style={styles.amenityText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {similarPosts.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIndicator} />
                <Text style={styles.sectionTitle}>Phòng cùng khu vực</Text>
              </View>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.similarScroll}
              >
                {similarPosts.map((item) => (
                  <TouchableOpacity 
                    key={item.id} 
                    style={styles.similarCard}
                    onPress={() => navigation.push('PostDetail', { post: item })}
                  >
                    <Image 
                      source={{ uri: item.PostImages?.[0]?.image_url || 'https://via.placeholder.com/150' }} 
                      style={styles.similarImage} 
                    />
                    <View style={styles.similarContent}>
                      <Text style={styles.similarType}>{item.type || 'Phòng trọ'}</Text>
                      <Text style={styles.similarTitle} numberOfLines={1}>{item.title}</Text>
                      <Text style={styles.similarPrice}>{item.Room?.base_price?.toLocaleString() || item.price?.toLocaleString()}đ</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
        <View style={{ height: 140 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceValue}>{price.toLocaleString()}đ<Text style={styles.pricePeriod}>/tháng</Text></Text>
          <Text style={styles.priceDetail}>Bao gồm phí bảo trì</Text>
        </View>
        <TouchableOpacity 
          style={[styles.rentButton, isRented && styles.rentedButton]} 
          onPress={handleRentNow}
          disabled={isRented}
        >
          <Text style={styles.rentButtonText}>{isRented ? 'Đã liên hệ' : 'Thuê ngay'}</Text>
        </TouchableOpacity>
      </View>

      {/* Report Modal */}
      <Modal
        visible={showReportModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.reportModalContent}>
            <View style={styles.reportHeader}>
              <Text style={styles.reportModalTitle}>Báo cáo vi phạm</Text>
              <TouchableOpacity onPress={() => setShowReportModal(false)}>
                <CheckCircle2 size={24} color="#94a3b8" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.reportLabel}>Chọn lý do báo cáo:</Text>
            <View style={styles.reasonsContainer}>
              {reportReasons.map((reason) => (
                <TouchableOpacity 
                  key={reason}
                  style={[
                    styles.reasonItem,
                    reportReason === reason && styles.reasonItemActive
                  ]}
                  onPress={() => setReportReason(reason)}
                >
                  <View style={[
                    styles.radioCircle,
                    reportReason === reason && styles.radioCircleActive
                  ]} />
                  <Text style={[
                    styles.reasonText,
                    reportReason === reason && styles.reasonTextActive
                  ]}>{reason}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.reportLabel}>Mô tả chi tiết (không bắt buộc):</Text>
            <TextInput
              style={styles.reportInput}
              placeholder="Nhập thêm thông tin để chúng tôi xử lý nhanh hơn..."
              multiline
              numberOfLines={4}
              value={reportDescription}
              onChangeText={setReportDescription}
            />

            <View style={styles.reportActions}>
              <TouchableOpacity 
                style={styles.cancelReportBtn}
                onPress={() => setShowReportModal(false)}
              >
                <Text style={styles.cancelReportText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.submitReportBtn, isReporting && { opacity: 0.7 }]}
                onPress={handleConfirmReport}
                disabled={isReporting}
              >
                <Text style={styles.submitReportText}>
                  {isReporting ? 'Đang gửi...' : 'Gửi báo cáo'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconContainer}>
              <CheckCircle2 size={48} color="#fff" />
            </View>
            <Text style={styles.modalTitle}>Yêu cầu đã gửi!</Text>
            <Text style={styles.modalSubtitle}>Thông tin của bạn đã được gửi đến chủ trọ. Họ sẽ liên hệ với bạn trong thời gian sớm nhất.</Text>
            
            <View style={styles.contactOptions}>
              <TouchableOpacity style={styles.contactButton}>
                <Phone size={20} color={Colors.primary} />
                <Text style={styles.contactButtonText}>Gọi điện</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.contactButton, { backgroundColor: Colors.primary }]}
                onPress={async () => {
                  try {
                    const landlord_id = post.Room?.Property?.landlord_id;
                    if (!landlord_id) {
                      Alert.alert('Lỗi', 'Không tìm thấy thông tin chủ nhà.');
                      return;
                    }
                    
                    const response = await client.post('chat/start', { landlord_id });
                    const conversation = response.data;
                    
                    setShowSuccessModal(false);
                    navigation.navigate('ChatDetail', { 
                      conversationId: conversation.id,
                      partner: post.Room.Property.landlord
                    });
                  } catch (error) {
                    console.error('Error starting conversation:', error);
                    Alert.alert('Lỗi', 'Không thể bắt đầu trò chuyện. Vui lòng thử lại.');
                  }
                }}
              >
                <MessageSquare size={20} color="#fff" />
                <Text style={[styles.contactButtonText, { color: '#fff' }]}>Nhắn tin</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.closeModalButtonText}>Quay lại</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: '#f1f5f9',
  },
  image: {
    width: Dimensions.get('window').width,
    height: 400,
  },
  imageBadge: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  imageBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  content: {
    padding: 24,
    marginTop: -25,
    backgroundColor: '#fff',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.04,
    shadowRadius: 15,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  tag: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  verifyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  verifyText: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 16,
    lineHeight: 34,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  reportButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(239, 68, 68, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  locationIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  gridItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginHorizontal: 4,
  },
  gridIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  gridLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  landlordSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0f172a',
    padding: 20,
    borderRadius: 24,
    marginBottom: 32,
  },
  landlordInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  landlordAvatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  landlordAvatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#1e293b',
  },
  landlordPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  landlordLetter: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  onlineStatus: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#0f172a',
  },
  landlordName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 2,
  },
  landlordRole: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
  },
  landlordActions: {
    flexDirection: 'row',
    gap: 8,
  },
  landlordChatBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  landlordCallBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIndicator: {
    width: 4,
    height: 20,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1e293b',
  },
  mapContainer: {
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapMarker: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 2,
  },
  markerPulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    opacity: 0.3,
  },
  mapActionBtn: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#0f172a',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  mapActionText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 28,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  amenityText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
  },
  similarScroll: {
    paddingRight: 24,
  },
  similarCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
  },
  similarImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f1f5f9',
  },
  similarContent: {
    padding: 12,
  },
  similarType: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  similarTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  similarPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ef4444',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 44 : 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  priceContainer: {
    flex: 1,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ef4444',
  },
  pricePeriod: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
  },
  priceDetail: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  rentButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 36,
    paddingVertical: 18,
    borderRadius: 18,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  rentedButton: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
  },
  rentButtonText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 32,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
  },
  reportModalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 24,
    maxHeight: '90%',
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  reportModalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f172a',
  },
  reportLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reasonsContainer: {
    marginBottom: 24,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  reasonItemActive: {
    backgroundColor: Colors.primary + '10',
    borderColor: Colors.primary,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: Colors.primary,
  },
  reasonText: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
  },
  reasonTextActive: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  reportInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    height: 100,
    textAlignVertical: 'top',
    fontSize: 15,
    color: '#0f172a',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 24,
  },
  reportActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelReportBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
  },
  cancelReportText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#64748b',
  },
  submitReportBtn: {
    flex: 2,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
  },
  submitReportText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  successIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 32,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 12,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  contactOptions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
    width: '100%',
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    paddingVertical: 18,
    borderRadius: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  contactButtonText: {
    fontWeight: '800',
    color: Colors.primary,
    fontSize: 15,
  },
  closeModalButton: {
    paddingVertical: 12,
  },
  closeModalButtonText: {
    color: '#94a3b8',
    fontWeight: '700',
    fontSize: 15,
  }
});

export default PostDetailScreen;
