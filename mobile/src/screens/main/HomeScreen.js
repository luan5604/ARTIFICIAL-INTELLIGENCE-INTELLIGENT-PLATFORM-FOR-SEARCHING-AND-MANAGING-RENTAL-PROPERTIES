import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  StatusBar, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  Dimensions, 
  Animated, 
  ActivityIndicator,
  RefreshControl,
  Platform
} from 'react-native';
import { 
  Search, 
  Bell, 
  MapPin, 
  Flame, 
  Sparkles, 
  LayoutGrid, 
  Home, 
  Building2, 
  Users, 
  ChevronRight, 
  Star,
  Zap,
  Clock,
  Navigation,
  ArrowRight
} from 'lucide-react-native';
import Colors from '../../constants/Colors';
import client from '../../api/client';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [budgetPosts, setBudgetPosts] = useState([]);
  const [premiumPosts, setPremiumPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;


  const popularLocations = [
    { id: '1', name: 'Quận Hải Châu', image: 'https://images.unsplash.com/photo-1555432329-3999ad55e19d?q=80&w=400&auto=format&fit=crop' },
    { id: '2', name: 'Thanh khê', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc18a593?q=80&w=400&auto=format&fit=crop' },
    { id: '3', name: 'Quận Liên Chiểu', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=400&auto=format&fit=crop' },
  ];

  useEffect(() => {
    fetchData();
    startAnimations();
  }, []);

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

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch dynamic categories
      const catResp = await client.get('posts/categories');
      setCategories(catResp.data);

      // Fetch latest posts
      const latestResp = await client.get('posts', { params: { limit: 10 } });
      setLatestPosts(latestResp.data.data);

      // Fetch featured posts (Randomize)
      const featuredResp = await client.get('posts', { params: { limit: 10, sort: 'random' } });
      setFeaturedPosts(featuredResp.data.data);

      // Fetch budget posts (Randomize < 3M)
      const budgetResp = await client.get('posts', { params: { limit: 10, maxPrice: 3000000, sort: 'random' } });
      setBudgetPosts(budgetResp.data.data);

      // Fetch premium posts (Randomize Type: Căn hộ)
      const premiumResp = await client.get('posts', { params: { limit: 10, type: 'Căn hộ', sort: 'random' } });
      setPremiumPosts(premiumResp.data.data);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('SearchResults', { q: searchQuery });
    } else {
      navigation.navigate('Search');
    }
  };

  const renderPostCard = (item, type = 'horizontal') => {
    const room = item.Room || {};
    const property = room.Property || {};
    const price = room.base_price ? Number(room.base_price).toLocaleString() : '0';
    const isHorizontal = type === 'horizontal';

    return (
      <TouchableOpacity 
        key={item.id}
        style={isHorizontal ? styles.hCard : styles.vCard}
        onPress={() => navigation.navigate('PostDetail', { post: item })}
        activeOpacity={0.9}
      >
        <Image 
          source={{ uri: item.PostImages?.[0]?.image_url || 'https://via.placeholder.com/400' }} 
          style={isHorizontal ? styles.hCardImage : styles.vCardImage} 
        />
        <View style={styles.cardOverlay}>
          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeText}>{price}đ</Text>
          </View>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <View style={styles.locationRow}>
            <MapPin size={10} color="#94a3b8" />
            <Text style={styles.locationText} numberOfLines={1}>{property.district}, {property.city}</Text>
          </View>
          <View style={styles.specsRow}>
            <View style={styles.specItem}>
              <Zap size={10} color={Colors.primary} />
              <Text style={styles.specText}>{room.area}m²</Text>
            </View>
            <View style={styles.specDivider} />
            <View style={styles.specItem}>
              <Users size={10} color={Colors.primary} />
              <Text style={styles.specText}>{room.max_occupants}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Decorative Blobs */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
      >
        {/* Hero Section */}
        <Animated.View style={[styles.hero, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.userNameRow}>
            <View>
              <Text style={styles.welcomeText}>Xin chào,</Text>
              <Text style={styles.userName}>Người tìm kiếm phòng!</Text>
            </View>
            <TouchableOpacity style={styles.notificationBtn} onPress={() => navigation.navigate('Notifications')}>
              <Bell size={24} color="#fff" />
              <View style={styles.notifBadge} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.heroMainTitle}>Tìm kiếm căn phòng {'\n'}phù hợp với lý tưởng của bạn !</Text>
        </Animated.View>

        {/* Search Bar Wrapper (Sticky) */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#94a3b8" />
            <TextInput 
              style={styles.input} 
              placeholder="Bạn muốn thuê ở đâu?" 
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity style={styles.filterBtn} onPress={handleSearch}>
              <ArrowRight size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {/* Categories */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Phân loại phòng</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PostList')}>
              <Text style={styles.seeAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.categoryScroll}
          >
            {categories.map((cat) => {
              const IconComponent = { Home, Building2, Users, LayoutGrid }[cat.icon_name] || Home;
              return (
                <TouchableOpacity 
                  key={cat.id} 
                  style={styles.categoryItem}
                  onPress={() => navigation.navigate('SearchResults', { categoryId: cat.id, categoryName: cat.name })}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: cat.color + '15' }]}>
                    <IconComponent size={24} color={cat.color} />
                  </View>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Featured Section */}
          <View style={styles.sectionHeader}>
            <View style={styles.titleWithIcon}>
              <Flame size={20} color="#ef4444" fill="#ef4444" />
              <Text style={styles.sectionTitle}>Nổi bật nhất</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('PostList', { sort: 'view_count' })}>
              <Text style={styles.seeAll}>Xem thêm</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.featuredScroll}
          >
            {loading ? (
              <ActivityIndicator color={Colors.primary} style={{ marginLeft: 20 }} />
            ) : (
              featuredPosts.map(post => renderPostCard(post, 'horizontal'))
            )}
          </ScrollView>

          {/* Latest Section */}
          <View style={styles.sectionHeader}>
            <View style={styles.titleWithIcon}>
              <Clock size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Phòng mới đăng</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('PostList')}>
              <Text style={styles.seeAll}>Xem thêm</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.featuredScroll}
          >
            {loading ? (
              <ActivityIndicator color={Colors.primary} style={{ marginLeft: 20 }} />
            ) : (
              latestPosts.map(post => renderPostCard(post, 'horizontal'))
            )}
          </ScrollView>

          {/* Budget Section */}
          <View style={styles.sectionHeader}>
            <View style={styles.titleWithIcon}>
              <Sparkles size={20} color="#10b981" />
              <Text style={styles.sectionTitle}>Phòng giá rẻ (Dưới 3M)</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('PostList', { maxPrice: 3000000 })}>
              <Text style={styles.seeAll}>Xem thêm</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.featuredScroll}
          >
            {loading ? (
              <ActivityIndicator color={Colors.primary} style={{ marginLeft: 20 }} />
            ) : (
              budgetPosts.length > 0 ? (
                budgetPosts.map(post => renderPostCard(post, 'horizontal'))
              ) : (
                <Text style={styles.emptyText}>Đang cập nhật...</Text>
              )
            )}
          </ScrollView>

          {/* Popular Locations */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Khu vực phổ biến</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Tất cả</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.locationScroll}
          >
            {popularLocations.map((loc) => (
              <TouchableOpacity 
                key={loc.id} 
                style={styles.locationCard}
                onPress={() => navigation.navigate('SearchResults', { q: loc.name })}
              >
                <Image source={{ uri: loc.image }} style={styles.locationImage} />
                <View style={styles.locationOverlay}>
                  <Text style={styles.locationName}>{loc.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Premium Section */}
          <View style={styles.sectionHeader}>
            <View style={styles.titleWithIcon}>
              <Building2 size={20} color="#8b5cf6" />
              <Text style={styles.sectionTitle}>Căn hộ cao cấp</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('PostList', { type: 'Căn hộ' })}>
              <Text style={styles.seeAll}>Xem thêm</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.featuredScroll}
          >
            {loading ? (
              <ActivityIndicator color={Colors.primary} style={{ marginLeft: 20 }} />
            ) : (
              premiumPosts.length > 0 ? (
                premiumPosts.map(post => renderPostCard(post, 'horizontal'))
              ) : (
                <Text style={styles.emptyText}>Đang cập nhật...</Text>
              )
            )}
          </ScrollView>

          <View style={{ height: 40 }} />
        </Animated.View>
      </ScrollView>

      {/* Floating AI Assistant Button */}
      <TouchableOpacity 
        style={styles.floatingAIBtn}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('AIChat')}
      >
        <View style={styles.floatingAIBtnContent}>
          <Sparkles size={22} color="#ffffff" />
          <Text style={styles.floatingAIText}>Trợ lý AI</Text>
        </View>
      </TouchableOpacity>
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
    paddingBottom: 60,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  userNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  welcomeText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '600',
  },
  userName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    borderWidth: 1.5,
    borderColor: '#0f172a',
  },
  heroMainTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 38,
  },
  searchContainer: {
    marginHorizontal: 20,
    marginTop: -30,
    marginBottom: 10,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 64,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
    marginLeft: 12,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 30,
    marginBottom: 16,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
  },
  seeAll: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  categoryScroll: {
    paddingLeft: 24,
    paddingRight: 12,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 24,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  featuredScroll: {
    paddingLeft: 24,
    paddingRight: 12,
  },
  hCard: {
    width: 250,
    backgroundColor: '#fff',
    borderRadius: 24,
    marginRight: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  hCardImage: {
    width: '100%',
    height: 150,
  },
  vCard: {
    width: (width - 60) / 2,
    backgroundColor: '#fff',
    borderRadius: 24,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  vCardImage: {
    width: '100%',
    height: 120,
  },
  cardOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  priceBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backdropFilter: 'blur(5px)',
  },
  priceBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 11,
    color: '#94a3b8',
    flex: 1,
  },
  specsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  specText: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '700',
  },
  specDivider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#cbd5e1',
  },
  locationScroll: {
    paddingLeft: 24,
    paddingRight: 12,
  },
  locationCard: {
    width: 140,
    height: 180,
    borderRadius: 24,
    marginRight: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  locationImage: {
    width: '100%',
    height: '100%',
  },
  locationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  locationName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  emptyText: {
    paddingLeft: 24,
    color: '#94a3b8',
    fontSize: 14,
    fontStyle: 'italic',
  },
  floatingAIBtn: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#f59e0b',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 1000,
  },
  floatingAIBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  floatingAIText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 15,
  }
});

export default HomeScreen;
