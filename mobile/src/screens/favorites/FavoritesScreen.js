import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  FlatList, 
  Image, 
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
  TextInput,
  RefreshControl,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
  Dimensions,
  ScrollView
} from 'react-native';
import { 
  Heart, 
  MapPin, 
  Trash2, 
  ArrowRight, 
  Search, 
  SlidersHorizontal, 
  Info, 
  CheckCircle2, 
  Circle,
  SortAsc,
  SortDesc,
  Wifi,
  Wind,
  Car,
  Utensils,
  Share2,
  Flame,
  Clock,
  Bookmark,
  Sparkles,
  Zap
} from 'lucide-react-native';
import { Share } from 'react-native';
import Colors from '../../constants/Colors';
import client from '../../api/client';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FavoritesScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState('newest'); // newest, price_asc, price_desc
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [suggestions, setSuggestions] = useState([]);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const fetchFavorites = async () => {
    try {
      const response = await client.get('favorites');
      setFavorites(response.data);
      if (response.data.length === 0) {
        fetchSuggestions();
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const response = await client.get('posts');
      const posts = response.data && response.data.data ? response.data.data : [];
      setSuggestions(posts.slice(0, 4));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
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
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchFavorites();
  };

  const toggleFavorite = async (postId) => {
    try {
      await client.post('favorites/toggle', { post_id: postId });
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setFavorites(prev => prev.filter(item => item.id !== postId));
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể bỏ yêu thích');
    }
  };

  const deleteSelected = () => {
    if (selectedIds.size === 0) return;
    
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc muốn xóa ${selectedIds.size} tin đã chọn khỏi danh sách yêu thích?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive', 
          onPress: async () => {
            setLoading(true);
            try {
              await Promise.all(
                Array.from(selectedIds).map(id => client.post('favorites/toggle', { post_id: id }))
              );
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setFavorites(prev => prev.filter(item => !selectedIds.has(item.id)));
              setSelectedIds(new Set());
              setIsSelectionMode(false);
            } catch (error) {
              Alert.alert('Lỗi', 'Có lỗi xảy ra khi xóa danh sách');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleShare = async (item) => {
    try {
      await Share.share({
        message: `Xem phòng này nè: ${item.title}\nGiá: ${item.Room?.base_price?.toLocaleString()}đ/tháng\nLink: http://timthuetro.vn/post/${item.id}`,
      });
    } catch (error) {
      console.error('Sharing error:', error);
    }
  };

  const toggleSelection = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredFavorites.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredFavorites.map(item => item.id)));
    }
  };

  const filteredFavorites = favorites
    .filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.Room?.Property?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortMode === 'price_asc') return (a.Room?.base_price || 0) - (b.Room?.base_price || 0);
      if (sortMode === 'price_desc') return (b.Room?.base_price || 0) - (a.Room?.base_price || 0);
      return new Date(b.created_at || b.updatedAt || 0) - new Date(a.created_at || a.updatedAt || 0);
    });

  const AmenitiesRow = ({ amenities }) => {
    if (!amenities || amenities.length === 0) return null;
    return (
      <View style={styles.amenitiesContainer}>
        {amenities.includes('Wifi') && <Wifi size={14} color="#64748b" style={styles.amenityIcon} />}
        {amenities.includes('Điều hòa') && <Wind size={14} color="#64748b" style={styles.amenityIcon} />}
        {amenities.includes('Chỗ để xe') && <Car size={14} color="#64748b" style={styles.amenityIcon} />}
        {amenities.includes('Bếp') && <Utensils size={14} color="#64748b" style={styles.amenityIcon} />}
      </View>
    );
  };

  const renderFavoriteItem = ({ item }) => {
    const thumbnail = item.PostImages?.[0]?.image_url || 'https://via.placeholder.com/400';
    const priceFormatted = item.Room?.base_price ? Number(item.Room.base_price).toLocaleString() : '0';
    const p = item.Room?.Property;
    const location = p ? [p.district, p.city].filter(Boolean).join(', ') : 'Chưa cập nhật địa chỉ';
    const isSelected = selectedIds.has(item.id);
    const amenityNames = item.Room?.Amenities?.map(a => a.name) || [];

    return (
      <View style={styles.cardWrapper}>
        {isSelectionMode && (
          <TouchableOpacity 
            style={styles.selectionIndicator} 
            onPress={() => toggleSelection(item.id)}
          >
            {isSelected ? (
              <CheckCircle2 size={24} color={Colors.primary} fill={Colors.primary + '20'} />
            ) : (
              <Circle size={24} color="#cbd5e1" />
            )}
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.card, isSelected && styles.selectedCard]}
          activeOpacity={0.9}
          onPress={() => {
            if (isSelectionMode) {
              toggleSelection(item.id);
            } else {
              navigation.navigate('PostDetail', { post: item });
            }
          }}
          onLongPress={() => {
            if (!isSelectionMode) {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
              setIsSelectionMode(true);
              toggleSelection(item.id);
            }
          }}
        >
          <View style={styles.imageWrapper}>
            <Image source={{ uri: thumbnail }} style={styles.cardImage} />
            <View style={styles.badgeRow}>
              {item.Room?.status === 'AVAILABLE' ? (
                <View style={[styles.badge, styles.availableBadge]}>
                  <Text style={styles.badgeText}>Hiện trống</Text>
                </View>
              ) : (
                <View style={[styles.badge, styles.rentedBadge]}>
                  <Text style={styles.badgeText}>{item.Room?.status}</Text>
                </View>
              )}
              {item.view_count > 100 && (
                <View style={[styles.badge, styles.hotBadge]}>
                  <Flame size={12} color="#fff" />
                  <Text style={styles.badgeText}>Hot</Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
              <View style={styles.locationRow}>
                <MapPin size={12} color="#64748b" />
                <Text style={styles.cardLocation} numberOfLines={1}>{location}</Text>
              </View>
              
              <View style={styles.specsRow}>
                <View style={styles.specItem}>
                  <Text style={styles.specText}>{item.Room?.area || 0}m²</Text>
                </View>
                <View style={styles.specDivider} />
                <View style={styles.specItem}>
                  <Text style={styles.specText}>{item.Room?.max_occupants || 0} người</Text>
                </View>
              </View>

              <AmenitiesRow amenities={amenityNames} />
            </View>
            
            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardPrice}>{priceFormatted}đ<Text style={styles.monthLabel}>/tháng</Text></Text>
              </View>
              {!isSelectionMode && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    onPress={() => handleShare(item)} 
                    style={styles.actionCircle}
                  >
                    <Share2 size={18} color="#64748b" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => toggleFavorite(item.id)} 
                    style={styles.removeCircle}
                  >
                    <Heart size={20} color="#ef4444" fill="#ef4444" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Decorative Background Elements */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} tintColor="#fff" />
        }
      >
        {/* Hero Section */}
        <Animated.View style={[styles.hero, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.heroHeader}>
            {isSelectionMode ? (
              <View style={styles.selectionHeader}>
                <TouchableOpacity onPress={() => { setIsSelectionMode(false); setSelectedIds(new Set()); }}>
                  <Text style={styles.cancelTextText}>Đóng</Text>
                </TouchableOpacity>
                <Text style={styles.selectionTitleText}>Đã chọn {selectedIds.size}</Text>
                <TouchableOpacity onPress={toggleAll}>
                  <Text style={styles.selectAllTextText}>
                    {selectedIds.size === filteredFavorites.length ? 'Bỏ chọn' : 'Tất cả'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.defaultHeader}>
                <View>
                  <View style={styles.titleRow}>
                    <Text style={styles.heroTitle}>Yêu thích</Text>
                    <Heart size={24} color="#d31818" fill="#d77171" style={styles.titleHeart} />
                  </View>
                  <Text style={styles.heroSubtitle}>{favorites.length} tin đăng đã được bạn lưu lại</Text>
                </View>
                <TouchableOpacity 
                  style={styles.infoBtn}
                  onPress={() => Alert.alert('Gợi ý', 'Nhấn giữ một tin bất kỳ để chọn nhiều mục.')}
                >
                  <Info size={20} color="rgba(255,255,255,0.7)" />
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          {!isSelectionMode && (
            <View style={styles.searchRow}>
              <View style={styles.searchBar}>
                <Search size={18} color="#94a3b8" />
                <TextInput 
                  style={styles.searchInput}
                  placeholder="Tìm trong danh sách..."
                  placeholderTextColor="#94a3b8"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <X size={16} color="#94a3b8" />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity 
                style={styles.sortBtn}
                onPress={() => {
                  const modes = ['newest', 'price_asc', 'price_desc'];
                  const nextMode = modes[(modes.indexOf(sortMode) + 1) % modes.length];
                  setSortMode(nextMode);
                }}
              >
                {sortMode === 'price_asc' ? <SortAsc size={20} color={Colors.primary} /> : 
                 sortMode === 'price_desc' ? <SortDesc size={20} color={Colors.primary} /> :
                 <SlidersHorizontal size={20} color={Colors.primary} />}
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        <Animated.View style={[styles.mainContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : filteredFavorites.length > 0 ? (
            <View style={styles.listWrapper}>
              {filteredFavorites.map((item) => (
                <View key={item.id}>
                  {renderFavoriteItem({ item })}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.iconCircle}>
                <Heart size={48} color={Colors.primary} fill={Colors.primary} opacity={0.1} />
                <View style={styles.plusIcon}>
                  <Bookmark size={16} color="#fff" fill="#fff" />
                </View>
              </View>
              <Text style={styles.emptyTitle}>
                {searchQuery ? 'Không có tin này' : 'Chưa có tin lưu'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery 
                  ? 'Thử tìm với tên hoặc địa chỉ khác nhé.'
                  : 'Hãy dạo quanh một vòng và "thả tim" những căn phòng bạn ưng ý nhé!'}
              </Text>
              
              {!searchQuery && (
                <TouchableOpacity 
                  style={styles.exploreButton}
                  onPress={() => navigation.navigate('Home')}
                >
                  <Text style={styles.exploreButtonText}>Khám phá ngay</Text>
                  <ArrowRight size={18} color="#fff" />
                </TouchableOpacity>
              )}

              {/* Suggestions Section */}
              {!searchQuery && suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  <View style={styles.titleWithIcon}>
                    <Zap size={20} color="#1e293b" fill="#1e293b" />
                    <Text style={styles.suggestionsTitle}>Gợi ý cho bạn</Text>
                  </View>
                  <View style={styles.suggestionGrid}>
                    {suggestions.map((item) => (
                      <TouchableOpacity 
                        key={item.id} 
                        style={styles.suggestionItem}
                        onPress={() => navigation.navigate('PostDetail', { post: item })}
                        activeOpacity={0.8}
                      >
                        <Image source={{ uri: item.PostImages?.[0]?.image_url || 'https://via.placeholder.com/400' }} style={styles.suggestionImage} />
                        <View style={styles.suggestionContent}>
                          <Text style={styles.suggestionItemTitle} numberOfLines={1}>{item.title}</Text>
                          <Text style={styles.suggestionPrice}>{item.Room?.base_price?.toLocaleString() || '0'}đ</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Floating Action for Selection Mode */}
      {isSelectionMode && selectedIds.size > 0 && (
        <TouchableOpacity style={styles.floatingDelete} onPress={deleteSelected} activeOpacity={0.8}>
          <Trash2 size={22} color="#fff" />
          <Text style={styles.floatingDeleteText}>Xóa {selectedIds.size} tin đã chọn</Text>
        </TouchableOpacity>
      )}
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
    opacity: 0.15,
  },
  blob1: {
    width: 300,
    height: 300,
    backgroundColor: '#ef4444',
    top: -100,
    right: -100,
  },
  blob2: {
    width: 200,
    height: 200,
    backgroundColor: '#f59e0b',
    bottom: 100,
    left: -50,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  hero: {
    backgroundColor: '#1e293b', // Dark premium theme for favorites
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  heroHeader: {
    marginBottom: 24,
  },
  defaultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
  },
  titleHeart: {
    marginTop: 4,
  },
  heroSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 6,
  },
  infoBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
  },
  selectionTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  cancelTextText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    fontWeight: '600',
  },
  selectAllTextText: {
    color: '#34d399',
    fontSize: 16,
    fontWeight: '600',
  },
  searchRow: {
    flexDirection: 'row',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '500',
  },
  sortBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  mainContent: {
    marginTop: 24,
  },
  listWrapper: {
    paddingHorizontal: 24,
  },
  cardWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  selectionIndicator: {
    paddingRight: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  selectedCard: {
    borderColor: Colors.primary,
    backgroundColor: '#f8fbff',
  },
  imageWrapper: {
    position: 'relative',
  },
  badgeRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  availableBadge: {
    backgroundColor: '#10b981',
  },
  rentedBadge: {
    backgroundColor: '#64748b',
  },
  hotBadge: {
    backgroundColor: '#ef4444',
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#f8fafc',
  },
  cardContent: {
    padding: 16,
    gap: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1e293b',
    lineHeight: 24,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    marginBottom: 8,
  },
  cardLocation: {
    fontSize: 13,
    color: '#64748b',
    flex: 1,
  },
  specsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  specItem: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  specText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  specDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#cbd5e1',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  amenityIcon: {
    opacity: 0.7,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 16,
    marginTop: 4,
  },
  cardPrice: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ef4444',
  },
  monthLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  removeCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffe4e6',
  },
  centerContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    position: 'relative',
  },
  plusIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1e293b',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  exploreButton: {
    backgroundColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 5,
  },
  exploreButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  suggestionsContainer: {
    width: '100%',
    marginTop: 40,
    paddingTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  suggestionsTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#1e293b',
  },
  suggestionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  suggestionItem: {
    width: (width - 80 - 12) / 2,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 12,
  },
  suggestionImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#f8fafc',
  },
  suggestionContent: {
    padding: 10,
  },
  suggestionItemTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  suggestionPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ef4444',
  },
  floatingDelete: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  floatingDeleteText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default FavoritesScreen;
