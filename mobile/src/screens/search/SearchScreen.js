import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TextInput, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  StatusBar,
  Animated,
  Dimensions,
  Image
} from 'react-native';
import { 
  Search as SearchIcon, 
  Filter, 
  MapPin, 
  X, 
  History, 
  Trash2, 
  ArrowRight,
  TrendingUp,
  Stars,
  Sparkles
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constants/Colors';

const { width, height } = Dimensions.get('window');
const SEARCH_HISTORY_KEY = '@search_history';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState([]);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    loadHistory();
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
  }, []);

  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const saveHistory = async (query) => {
    if (!query.trim()) return;
    try {
      const newHistory = [
        query,
        ...history.filter(item => item !== query)
      ].slice(0, 10);
      setHistory(newHistory);
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  const removeHistoryItem = async (query) => {
    try {
      const newHistory = history.filter(item => item !== query);
      setHistory(newHistory);
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error removing history item:', error);
    }
  };

  const clearAllHistory = async () => {
    setHistory([]);
    await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
  };

  const handleSearch = (query) => {
    const q = query || searchQuery;
    if (!q.trim()) return;
    
    saveHistory(q);
    navigation.navigate('SearchResults', { q: q });
  };

  const suggestedLocations = [
    { city: 'Hồ Chí Minh', districts: ['Quận 10', 'Bình Thạnh', 'Quận 7', 'Thủ Đức'] },
    { city: 'Đà Nẵng', districts: [' Ngũ Hành Sơn', 'Thanh Khê ', ' Liên chiểu', 'Hải Châu'] },
    { city: 'Hà Nội', districts: ['Cầu Giấy', 'Đống Đa', 'Hai Bà Trưng'] }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Decorative Background Elements */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
        {/* Hero Section */}
        <Animated.View style={[styles.hero, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.heroTextContent}>
            <Text style={styles.heroTitle}>Tìm kiếm{'\n'}không gian sống</Text>
            <Text style={styles.heroSubtitle}>Hàng ngàn căn phòng đang chờ đón bạn khám phá.</Text>
          </View>
          <View style={styles.heroDecoration}>
            <Sparkles size={40} color="rgba(255,255,255,0.3)" style={styles.sparkle1} />
            <Stars size={30} color="rgba(255,255,255,0.2)" style={styles.sparkle2} />
          </View>
        </Animated.View>

        {/* Search Bar - Sticky */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBarWrapper}>
            <View style={styles.searchBar}>
              <SearchIcon size={20} color={Colors.primary} style={styles.searchIcon} />
              <TextInput 
                style={styles.input} 
                placeholder="Khu vực, tên đường, dự án..." 
                placeholderTextColor="#94a3b8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={() => handleSearch()}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
                  <X size={18} color="#94a3b8" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity 
              style={styles.searchButton}
              onPress={() => handleSearch()}
              activeOpacity={0.8}
            >
              <ArrowRight size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {/* Recent Searches */}
          {history.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.titleWithIcon}>
                  <History size={20} color="#1e293b" />
                  <Text style={styles.sectionTitle}>Gần đây</Text>
                </View>
                <TouchableOpacity onPress={clearAllHistory}>
                  <Text style={styles.clearText}>Xóa tất cả</Text>
                </TouchableOpacity>
              </View>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.historyChips}
              >
                {history.map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.historyChip}
                    onPress={() => handleSearch(item)}
                  >
                    <Text style={styles.historyChipText}>{item}</Text>
                    <TouchableOpacity 
                      onPress={() => removeHistoryItem(item)}
                      style={styles.chipDelete}
                    >
                      <X size={12} color="#94a3b8" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Popular Locations */}
          <View style={styles.section}>
            <View style={styles.titleWithIcon}>
              <TrendingUp size={20} color="#1e293b" />
              <Text style={styles.sectionTitle}>Địa điểm nổi bật</Text>
            </View>
            {suggestedLocations.map((group, groupIndex) => (
              <View key={groupIndex} style={styles.locationGroup}>
                <Text style={styles.cityLabel}>{group.city}</Text>
                <View style={styles.chipContainer}>
                  {group.districts.map((district, dIndex) => (
                    <TouchableOpacity 
                      key={dIndex} 
                      style={styles.locationChip}
                      onPress={() => handleSearch(district)}
                      activeOpacity={0.7}
                    >
                      <MapPin size={14} color={Colors.primary} style={{marginRight: 6}} />
                      <Text style={styles.locationChipText}>{district}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </View>

          {/* Smart Banner */}
          <TouchableOpacity 
            style={styles.smartBanner}
            onPress={() => navigation.navigate('SearchResults', {})}
            activeOpacity={0.9}
          >
            <View style={styles.bannerInfo}>
              <View style={styles.bannerIconWrapper}>
                <Filter size={24} color="#fff" />
              </View>
              <View style={styles.bannerText}>
                <Text style={styles.bannerTitle}>Bộ lọc nhanh</Text>
                <Text style={styles.bannerSubtitle}>Tìm Kiếm căn phòng phù hợp với lý tưởng của bạn</Text>
              </View>
            </View>
            <ArrowRight size={20} color="#fff" opacity={0.6} />
          </TouchableOpacity>
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
    opacity: 0.2,
  },
  blob1: {
    width: 300,
    height: 300,
    backgroundColor: Colors.primary,
    top: -100,
    right: -100,
  },
  blob2: {
    width: 200,
    height: 200,
    backgroundColor: '#38bdf8',
    bottom: 100,
    left: -50,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  hero: {
    backgroundColor: Colors.primary,
    paddingTop: 60,
    paddingBottom: 50,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    position: 'relative',
    overflow: 'hidden',
  },
  heroTextContent: {
    zIndex: 1,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 40,
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 22,
    maxWidth: '80%',
  },
  heroDecoration: {
    position: 'absolute',
    right: -10,
    bottom: 20,
  },
  sparkle1: {
    position: 'absolute',
    right: 40,
    top: -60,
  },
  sparkle2: {
    position: 'absolute',
    right: 100,
    top: -20,
  },
  searchContainer: {
    marginTop: -30,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  clearBtn: {
    padding: 4,
  },
  searchButton: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1e293b',
  },
  clearText: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '600',
  },
  historyChips: {
    gap: 12,
    paddingRight: 24,
  },
  historyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  historyChipText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  chipDelete: {
    marginLeft: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 2,
  },
  locationGroup: {
    marginBottom: 24,
  },
  cityLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748b',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  locationChipText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '600',
  },
  smartBanner: {
    margin: 24,
    marginTop: 10,
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  bannerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 15,
  },
  bannerIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 16,
  },
});

export default SearchScreen;
