import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  StatusBar, 
  Animated, 
  Dimensions,
  TextInput,
  Platform,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { 
  Search, 
  MessageSquare, 
  ChevronRight, 
  Circle, 
  MoreVertical,
  Edit,
  Sparkles,
  MessageCircle
} from 'lucide-react-native';
import Colors from '../../constants/Colors';

import { useFocusEffect } from '@react-navigation/native';
import client from '../../api/client';

const { width } = Dimensions.get('window');

const MessageListScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const fetchConversations = async () => {
    try {
      const response = await client.get('chat');
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await client.post('chat/mark-all-read');
      fetchConversations();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const partnerName = (conv.landlord?.Profile?.full_name || conv.tenant?.Profile?.full_name || '').toLowerCase();
    return partnerName.includes(searchQuery.toLowerCase());
  });

  useFocusEffect(
    React.useCallback(() => {
      fetchConversations();
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
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchConversations();
  };

  const renderChatItem = ({ item }) => {
    const lastMessage = item.Messages?.[0];
    const partner = item.landlord || item.tenant;
    const partnerProfile = partner?.Profile;
    
    // Check if there are unread messages from the partner
    const hasUnread = lastMessage && !lastMessage.is_read && lastMessage.sender_id === partner?.id;
    
    return (
      <TouchableOpacity 
        style={styles.chatItem}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('ChatDetail', { conversationId: item.id, partner })}
      >
        <View style={styles.avatarContainer}>
          {partnerProfile?.avatar ? (
            <Image source={{ uri: partnerProfile.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.placeholderAvatar]}>
              <Text style={styles.avatarText}>{partnerProfile?.full_name?.charAt(0) || '?'}</Text>
            </View>
          )}
          <View style={[styles.onlineBadge, { backgroundColor: '#10b981' }]} />
        </View>
        
        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName} numberOfLines={1}>{partnerProfile?.full_name || 'Người dùng'}</Text>
            <Text style={styles.chatTime}>
              {item.updated_at ? new Date(item.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
            </Text>
          </View>
          
          <View style={styles.chatFooter}>
            <Text 
              style={[styles.lastMessage, hasUnread && styles.unreadText]} 
              numberOfLines={1}
            >
              {lastMessage?.content || item.last_message || 'Bắt đầu trò chuyện'}
            </Text>
            {hasUnread && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>1</Text>
              </View>
            )}
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

      <Animated.View style={[styles.hero, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.welcomeText}>Hộp thư</Text>
            <Text style={styles.heroTitle}>Trò chuyện</Text>
          </View>
        </View>

        <View style={styles.searchBar}>
          <Search size={20} color="rgba(255,255,255,0.4)" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm tin nhắn..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </Animated.View>

      <Animated.View style={[styles.listWrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <FlatList
          data={filteredConversations}
          renderItem={renderChatItem}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
          ListHeaderComponent={() => (
            <View style={styles.listHeader}>
              <Text style={styles.sectionTitle}>Gần đây</Text>
              <TouchableOpacity onPress={handleMarkAllRead}>
                <Text style={styles.markAllText}>Đánh dấu đã đọc</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            loading ? (
              <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
            ) : (
              <View style={styles.emptyState}>
                <MessageCircle size={64} color="#cbd5e1" strokeWidth={1.5} />
                <Text style={styles.emptyText}>
                  {searchQuery ? 'Không tìm thấy tin nhắn' : 'Chưa có tin nhắn nào'}
                </Text>
                <Text style={styles.emptySubtext}>
                  {searchQuery 
                    ? `Không tìm thấy kết quả cho "${searchQuery}"` 
                    : 'Hãy bắt đầu trò chuyện với các chủ nhà để tìm được căn phòng ưng ý.'}
                </Text>
              </View>
            )
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
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    marginTop: 4,
  },
  actionBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  listWrapper: {
    flex: 1,
    marginTop: -20,
  },
  listContent: {
    padding: 24,
    paddingTop: 40,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  markAllText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '700',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  placeholderAvatar: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#fff',
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
    flex: 1,
    paddingRight: 10,
  },
  chatTime: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
    paddingRight: 10,
    fontWeight: '500',
  },
  unreadText: {
    color: '#1e293b',
    fontWeight: '700',
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCount: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1e293b',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
  }
});

export default MessageListScreen;
