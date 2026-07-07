import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  StatusBar,
  Modal,
  Dimensions,
  Animated,
  ScrollView,
  TextInput,
  Platform
} from 'react-native';
import { 
  ChevronLeft, 
  Filter, 
  MapPin, 
  Search, 
  X, 
  Heart, 
  SlidersHorizontal, 
  Flame, 
  Sparkles, 
  CheckCircle2,
  Grid,
  History,
  Compass
} from 'lucide-react-native';
import Colors from '../../constants/Colors';
import client from '../../api/client';

const { width, height } = Dimensions.get('window');
const COLUMN_SPACING = 15;
const CARD_WIDTH = (width - 32 - COLUMN_SPACING) / 2;

const ResultCard = ({ item, index, navigation, favoriteIds, toggleFavorite }) => {
  const room = item.Room || {};
  const property = room.Property || {};
  const price = room.base_price ? Number(room.base_price).toLocaleString() : '0';
  const isFavorite = favoriteIds.has(item.id);
  const locationStr = property.district ? `${property.district}, ${property.city}` : property.city || 'Chưa cập nhật';

  // Item entrance animation (staggered)
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
        onPress={() => navigation.navigate('PostDetail', { post: item })}
        activeOpacity={0.9}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: item.PostImages?.[0]?.image_url || 'https://via.placeholder.com/400' }} 
            style={styles.cardImage} 
          />
          <View style={styles.cardOverlay}>
            <TouchableOpacity 
              style={styles.favoriteBtn}
              onPress={() => toggleFavorite(item.id)}
            >
              <Heart size={16} color={isFavorite ? '#ef4444' : '#fff'} fill={isFavorite ? '#ef4444' : 'transparent'} />
            </TouchableOpacity>
            {item.view_count > 100 && (
              <View style={styles.hotBadge}>
                <Flame size={10} color="#fff" />
                <Text style={styles.hotText}>PHỔ BIẾN</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.typeRow}>
            <Text style={styles.cardType}>{room.type || 'Phòng trọ'}</Text>
            <View style={styles.dotSeparator} />
            <Text style={styles.areaText}>{room.area}m²</Text>
          </View>
          <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
          <View style={styles.cardLocation}>
            <MapPin size={10} color="#94a3b8" />
            <Text style={styles.locationText} numberOfLines={1}>{locationStr}</Text>
          </View>
          <View style={styles.cardFooter}>
            <View style={styles.priceColumn}>
              <Text style={styles.cardPrice}>{price}đ</Text>
              <Text style={styles.priceUnit}>/tháng</Text>
            </View>
            <View style={styles.occupantBadge}>
              <Text style={styles.occupantText}>{room.max_occupants} người</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const SearchResultsScreen = ({ route, navigation }) => {
  const { q, type } = route.params || {};
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Filter States
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    type: type || 'Tất cả',
  });

  const propertyTypes = ['Tất cả', 'Phòng trọ', 'Căn hộ', 'Ký túc xá', 'Nhà nguyên căn'];

  useEffect(() => {
    fetchResults(1, true);
    fetchFavorites();
    
    // Start entrance animation
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
  }, [q, type]);

  const fetchResults = async (pageNumber = 1, isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      else setLoadingMore(true);

      const params = {
        q: q,
        page: pageNumber,
        limit: 20,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        type: filters.type !== 'Tất cả' ? filters.type : undefined,
      };

      const response = await client.get('posts', { params });
      
      if (isInitial) {
        setPosts(response.data.data);
      } else {
        setPosts(prev => [...prev, ...response.data.data]);
      }

      setTotalPages(response.data.pagination.totalPages);
      setTotalItems(response.data.pagination.totalItems);
      setPage(pageNumber);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      if (isInitial) setLoading(false);
      setLoadingMore(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await client.get('favorites');
      setFavoriteIds(new Set(response.data.map(f => f.id)));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleFavorite = async (postId) => {
    try {
      const response = await client.post('favorites/toggle', { post_id: postId });
      const newIds = new Set(favoriteIds);
      if (response.data.isFavorite) newIds.add(postId);
      else newIds.delete(postId);
      setFavoriteIds(newIds);
    } catch (error) {
      console.error('Toggle favorite error:', error);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && page < totalPages) {
      fetchResults(page + 1);
    }
  };

  const applyFilters = () => {
    setIsFilterVisible(false);
    fetchResults(1, true);
  };

  const renderItem = ({ item, index }) => (
    <ResultCard 
      item={item} 
      index={index} 
      navigation={navigation} 
      favoriteIds={favoriteIds} 
      toggleFavorite={toggleFavorite} 
    />
  );

  const FilterModal = () => (
    <Modal
      visible={isFilterVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsFilterVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalDragHandle} />
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Bộ lọc nâng cao</Text>
              <Text style={styles.modalSubtitle}>Tìm kiếm không gian sống lý tưởng</Text>
            </View>
            <TouchableOpacity 
              style={styles.closeBtn}
              onPress={() => setIsFilterVisible(false)}
            >
              <X size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
            <View style={styles.filterSection}>
              <View style={styles.sectionTitleRow}>
              <Grid size={16} color={Colors.primary} />
                <Text style={styles.filterLabel}>Loại nhà bạn mong muốn</Text>
              </View>
              <View style={styles.typeChips}>
                {propertyTypes.map(t => (
                  <TouchableOpacity 
                    key={t} 
                    style={[styles.typeChip, filters.type === t && styles.activeChip]}
                    onPress={() => setFilters({...filters, type: t})}
                  >
                    <Text style={[styles.chipText, filters.type === t && styles.activeChipText]}>{t}</Text>
                    {filters.type === t && <CheckCircle2 size={14} color={Colors.primary} style={{ marginLeft: 6 }} />}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <View style={styles.sectionTitleRow}>
                <Compass size={16} color={Colors.primary} />
                <Text style={styles.filterLabel}>Khoảng giá mong muốn</Text>
              </View>
              <View style={styles.priceInputs}>
                <View style={styles.inputField}>
                  <Text style={styles.inputPrefix}>Từ</Text>
                  <TextInput 
                    style={styles.priceInput} 
                    placeholder="0" 
                    keyboardType="numeric"
                    value={filters.minPrice}
                    onChangeText={text => setFilters({...filters, minPrice: text})}
                  />
                </View>
                <View style={styles.priceDash} />
                <View style={styles.inputField}>
                  <Text style={styles.inputPrefix}>Đến</Text>
                  <TextInput 
                    style={styles.priceInput} 
                    placeholder="Vô cực" 
                    keyboardType="numeric"
                    value={filters.maxPrice}
                    onChangeText={text => setFilters({...filters, maxPrice: text})}
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.filterActions}>
            <TouchableOpacity 
              style={styles.resetBtn}
              onPress={() => setFilters({ minPrice: '', maxPrice: '', type: 'Tất cả' })}
            >
              <History size={18} color="#64748b" />
              <Text style={styles.resetText}>Đặt lại</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.applyBtn}
              onPress={applyFilters}
            >
              <Text style={styles.applyText}>Áp dụng kết quả</Text>
              <Sparkles size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Decorative Background Elements */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Premium Hero Header */}
        <Animated.View style={[styles.hero, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.searchSummaryHero}>
              <Text style={styles.searchTitleHero} numberOfLines={1}>
                {q ? `Kết quả cho "${q}"` : 'Tất cả phòng trống'}
              </Text>
              <View style={styles.countBadge}>
                <Text style={styles.searchCountHero}>{totalItems} căn phòng khả dụng</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.filterBtnHero}
              onPress={() => setIsFilterVisible(true)}
            >
              <SlidersHorizontal size={20} color="#fff" />
              {filters.type !== 'Tất cả' || filters.minPrice || filters.maxPrice ? (
                <View style={styles.filterActiveDot} />
              ) : null}
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={styles.contentContainer}>
          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Đang lấy dữ liệu tốt nhất cho bạn...</Text>
            </View>
          ) : (
            <Animated.FlatList
              data={posts}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
              numColumns={2}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                loadingMore ? (
                  <ActivityIndicator size="small" color={Colors.primary} style={{ marginVertical: 30 }} />
                ) : <View style={{ height: 20 }} />
              }
              ListEmptyComponent={
                <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
                  <View style={styles.emptyIconBox}>
                    <Search size={48} color={Colors.primary} strokeWidth={1.5} />
                  </View>
                  <Text style={styles.emptyTitle}>Rất tiếc, chưa có kết quả</Text>
                  <Text style={styles.emptySubtitle}>Chúng tôi không tìm thấy phòng nào khớp với yêu cầu của bạn. Hãy thử thay đổi bộ lọc hoặc từ khóa nhé!</Text>
                  <TouchableOpacity 
                    style={styles.clearFilterBtn}
                    onPress={() => {
                      setFilters({ minPrice: '', maxPrice: '', type: 'Tất cả' });
                      fetchResults(1, true);
                    }}
                  >
                    <Text style={styles.clearFilterText}>Xóa tất cả bộ lọc</Text>
                  </TouchableOpacity>
                </Animated.View>
              }
            />
          )}
        </View>
      </SafeAreaView>

      <FilterModal />
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
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSummaryHero: {
    flex: 1,
  },
  searchTitleHero: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 4,
  },
  countBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  searchCountHero: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  filterBtnHero: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterActiveDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  contentContainer: {
    flex: 1,
    marginTop: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
  },
  imageContainer: {
    position: 'relative',
    height: 140,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 10,
    justifyContent: 'space-between',
  },
  favoriteBtn: {
    alignSelf: 'flex-end',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(5px)',
  },
  hotBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  hotText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cardContent: {
    padding: 12,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardType: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    textTransform: 'uppercase',
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
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
    lineHeight: 20,
    height: 40,
  },
  cardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 5,
  },
  locationText: {
    fontSize: 11,
    color: '#94a3b8',
    flex: 1,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f8fafc',
    paddingTop: 10,
  },
  priceColumn: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ef4444',
  },
  priceUnit: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
  },
  occupantBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  occupantText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#475569',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    marginTop: 60,
  },
  emptyIconBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1e293b',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  clearFilterBtn: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 18,
  },
  clearFilterText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 24,
    paddingTop: 12,
    maxHeight: height * 0.85,
  },
  modalDragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#e2e8f0',
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScroll: {
    paddingBottom: 20,
  },
  filterSection: {
    marginBottom: 32,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
  },
  typeChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 15,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
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
    fontWeight: '800',
  },
  priceInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  inputField: {
    flex: 1,
    position: 'relative',
  },
  inputPrefix: {
    position: 'absolute',
    top: -10,
    left: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    zIndex: 1,
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  priceInput: {
    height: 56,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '700',
    borderWidth: 1.5,
    borderColor: '#f1f5f9',
  },
  priceDash: {
    width: 15,
    height: 2,
    backgroundColor: '#cbd5e1',
    borderRadius: 1,
  },
  filterActions: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
  },
  resetBtn: {
    flex: 1,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: '#f1f5f9',
  },
  resetText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#64748b',
  },
  applyBtn: {
    flex: 2,
    height: 60,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  applyText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
  },
});

export default SearchResultsScreen;
