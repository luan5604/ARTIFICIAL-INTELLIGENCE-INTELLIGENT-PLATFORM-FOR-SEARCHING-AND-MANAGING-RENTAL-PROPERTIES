import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  ActivityIndicator, 
  RefreshControl, 
  Modal, 
  Dimensions, 
  Animated,
  Platform
} from 'react-native';
import { 
  Filter, 
  MapPin, 
  X, 
  Check, 
  Heart, 
  SlidersHorizontal,
  Sparkles,
  Zap,
  ChevronLeft,
  Search as SearchIcon
} from 'lucide-react-native';
import Colors from '../../constants/Colors';
import client from '../../api/client';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const COLUMN_SPACING = 15;
const CARD_WIDTH = (width - 40 - COLUMN_SPACING) / 2;

const PostCard = ({ item, index, navigation, favoriteIds, toggleFavorite }) => {
  const title = item.title;
  const price = item.Room?.base_price ? Number(item.Room.base_price).toLocaleString() : '0';
  const p = item.Room?.Property;
  const location = p ? `${p.district}, ${p.city}` : 'Chưa xác định';
  const area = item.Room?.area || 0;
  const occupants = item.Room?.max_occupants || 0;
  const type = item.Room?.type || 'Phòng trọ';
  const imageUrl = item.PostImages?.[0]?.image_url || item.image;

  const itemFade = useRef(new Animated.Value(0)).current;
  const itemSlide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(itemFade, {
        toValue: 1,
        duration: 500,
        delay: (index % 10) * 100,
        useNativeDriver: true,
      }),
      Animated.timing(itemSlide, {
        toValue: 0,
        duration: 500,
        delay: (index % 10) * 100,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <Animated.View style={{ 
      opacity: itemFade, 
      transform: [{ translateY: itemSlide }],
      width: CARD_WIDTH,
      marginLeft: index % 2 === 0 ? 0 : COLUMN_SPACING,
      marginBottom: 20
    }}>
      <TouchableOpacity 
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('PostDetail', { post: { ...item, title, price, location, area, type, image: imageUrl } })}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: imageUrl || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop' }} 
            style={styles.cardImage} 
          />
          <TouchableOpacity 
            style={styles.favoriteBadge}
            onPress={() => toggleFavorite(item.id)}
          >
            <Heart 
              size={16} 
              color={favoriteIds.has(item.id) ? "#ef4444" : "#fff"} 
              fill={favoriteIds.has(item.id) ? "#ef4444" : "rgba(0,0,0,0.3)"} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.cardContent}>
          <View style={styles.typeRow}>
            <Text style={styles.typeTagText}>{type}</Text>
            <View style={styles.dotSeparator} />
            <Text style={styles.areaText}>{area}m²</Text>
          </View>
          
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          
          <View style={styles.locationRow}>
            <MapPin size={10} color="#94a3b8" />
            <Text style={styles.location} numberOfLines={1}>{location}</Text>
          </View>
          
          <View style={styles.cardFooter}>
            <View style={styles.priceColumn}>
              <Text style={styles.priceText}>{price}đ</Text>
              <Text style={styles.priceUnit}>/tháng</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const PostListScreen = ({ route, navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  
  // Filter States
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedType, setSelectedType] = useState(route.params?.type || 'All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const types = ['All', 'Phòng trọ', 'Căn hộ', 'Ký túc xá', 'Nhà nguyên căn'];
  const priceRanges = ['All', 'Dưới 3tr', '3tr - 5tr', '5tr - 10tr', 'Trên 10tr'];

  useEffect(() => {
    fetchPosts(1);
    fetchFavorites();
    startAnimations();
  }, [selectedType]); // Re-fetch if selectedType changes

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  };

  const fetchPosts = async (pageNumber = 1, isRefreshing = false) => {
    try {
      if (pageNumber === 1 && !isRefreshing) setLoading(true);
      
      const response = await client.get('posts', {
        params: {
          page: pageNumber,
          limit: 10,
          type: selectedType !== 'All' ? selectedType : undefined,
          categoryId: route.params?.categoryId || undefined,
          maxPrice: route.params?.maxPrice || undefined,
          sort: route.params?.sort || undefined,
        }
      });

      const newPosts = response.data && response.data.data ? response.data.data : [];
      const pagination = response.data.pagination || { totalPages: 1 };

      if (isRefreshing || pageNumber === 1) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
      
      setHasMore(pageNumber < pagination.totalPages);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await client.get('favorites');
      const ids = new Set(response.data.map(post => post.id));
      setFavoriteIds(ids);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchPosts(1, true);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage);
    }
  };

  const toggleFavorite = async (postId) => {
    try {
      const response = await client.post('favorites/toggle', { post_id: postId });
      const newIds = new Set(favoriteIds);
      if (response.data.isFavorite) {
        newIds.add(postId);
      } else {
        newIds.delete(postId);
      }
      setFavoriteIds(newIds);
    } catch (error) {
      console.error('Toggle favorite error:', error);
    }
  };

  const renderItem = ({ item, index }) => (
    <PostCard 
      item={item} 
      index={index} 
      navigation={navigation} 
      favoriteIds={favoriteIds} 
      toggleFavorite={toggleFavorite} 
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Decorative Background Elements */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      <Animated.View style={[styles.hero, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.heroNav}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.filterTrigger}
            onPress={() => setIsFilterVisible(true)}
          >
            <SlidersHorizontal size={20} color="#fff" />
            {(selectedType !== 'All' || selectedPriceRange !== 'All') && <View style={styles.notifBadge} />}
          </TouchableOpacity>
        </View>
        
        <View style={styles.heroText}>
          <Text style={styles.heroTitle}>{route.params?.categoryName || 'Danh sách phòng'}</Text>
          <Text style={styles.heroSubtitle}>Khám phá {posts.length} căn phòng khả dụng</Text>
        </View>
        <Sparkles size={40} color="rgba(255,255,255,0.1)" style={styles.sparkle} />
      </Animated.View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Đang tìm phòng cho bạn...</Text>
          </View>
        ) : (
          <FlatList
            data={posts}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loadingMore ? (
                <ActivityIndicator size="small" color={Colors.primary} style={{ marginVertical: 20 }} />
              ) : <View style={{ height: 20 }} />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Image 
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/6134/6134065.png' }} 
                  style={styles.emptyImage} 
                />
                <Text style={styles.emptyText}>Hiện chưa có phòng phù hợp.</Text>
                <TouchableOpacity style={styles.resetBtn} onPress={() => { setSelectedType('All'); setSelectedPriceRange('All'); fetchPosts(1); }}>
                  <Text style={styles.resetBtnText}>Đặt lại bộ lọc</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}
      </View>

      {/* Filter Modal */}
      <Modal
        visible={isFilterVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsFilterVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bộ lọc thông minh</Text>
              <TouchableOpacity onPress={() => setIsFilterVisible(false)}>
                <X size={24} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Loại hình bất động sản</Text>
              <View style={styles.chipContainer}>
                {types.map(t => (
                  <TouchableOpacity 
                    key={t}
                    style={[styles.chip, selectedType === t && styles.activeChip]}
                    onPress={() => setSelectedType(t)}
                  >
                    <Text style={[styles.chipText, selectedType === t && styles.activeChipText]}>{t}</Text>
                    {selectedType === t && <Check size={14} color={Colors.primary} style={{ marginLeft: 6 }} />}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Khoảng giá thuê</Text>
              <View style={styles.chipContainer}>
                {priceRanges.map(r => (
                  <TouchableOpacity 
                    key={r}
                    style={[styles.chip, selectedPriceRange === r && styles.activeChip]}
                    onPress={() => setSelectedPriceRange(r)}
                  >
                    <Text style={[styles.chipText, selectedPriceRange === r && styles.activeChipText]}>{r}</Text>
                    {selectedPriceRange === r && <Check size={14} color={Colors.primary} style={{ marginLeft: 6 }} />}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity 
              style={styles.applyBtn}
              onPress={() => { setIsFilterVisible(false); fetchPosts(1); }}
            >
              <Text style={styles.applyBtnText}>Áp dụng bộ lọc</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  hero: {
    backgroundColor: '#0f172a',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    position: 'relative',
    overflow: 'hidden',
  },
  heroNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterTrigger: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    borderWidth: 1.5,
    borderColor: '#0f172a',
  },
  heroText: {
    zIndex: 1,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
  },
  sparkle: {
    position: 'absolute',
    bottom: -10,
    right: 20,
    opacity: 0.3,
  },
  content: {
    flex: 1,
    marginTop: -20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  loadingText: {
    marginTop: 15,
    color: '#64748b',
    fontSize: 15,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#f1f5f9',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 140,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f8fafc',
  },
  favoriteBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 12,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dotSeparator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#cbd5e1',
    marginHorizontal: 8,
  },
  areaText: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '700',
  },
  typeTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeTagText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    lineHeight: 20,
    marginBottom: 6,
    height: 40, // Ensure alignment
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  location: {
    fontSize: 11,
    color: '#64748b',
    flex: 1,
  },
  cardFooter: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  priceColumn: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#ef4444',
  },
  priceUnit: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
    opacity: 0.6,
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '600',
    marginBottom: 20,
  },
  resetBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
  },
  resetBtnText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f172a',
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  activeChip: {
    backgroundColor: '#eff6ff',
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  activeChipText: {
    color: Colors.primary,
  },
  applyBtn: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  applyBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PostListScreen;
