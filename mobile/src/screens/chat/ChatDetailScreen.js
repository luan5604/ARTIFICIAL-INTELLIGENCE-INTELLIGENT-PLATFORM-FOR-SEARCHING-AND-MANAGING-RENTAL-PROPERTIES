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
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Animated,
  ActivityIndicator,
  Alert,
  Linking
} from 'react-native';
import { 
  ArrowLeft, 
  Send, 
  Image as ImageIcon, 
  Paperclip, 
  AlertTriangle,
  Phone,
  Camera,
  Smile,
  Check,
  CheckCheck,
  Plus
} from 'lucide-react-native';
import Colors from '../../constants/Colors';

import client from '../../api/client';

const ChatDetailScreen = ({ navigation, route }) => {
  const { conversationId, partner } = route.params || {};
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const flatListRef = useRef();

  const fetchMessages = async () => {
    if (!conversationId) return;
    try {
      const response = await client.get(`chat/${conversationId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 3 seconds for simplicity
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [conversationId]);

  const handleCall = () => {
    const phoneNumber = partner?.phone_number;
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      Alert.alert('Lỗi', 'Không tìm thấy số điện thoại chủ trọ.');
    }
  };

  const handleReport = () => {
    Alert.alert(
      'Báo cáo / Khiếu nại',
      'Bạn muốn báo cáo cuộc trò chuyện này với quản trị viên?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Báo cáo', 
          style: 'destructive',
          onPress: async () => {
            try {
              await client.post('reports', {
                reported_user_id: partner?.id,
                conversation_id: conversationId,
                reason: 'Người dùng có hành vi không phù hợp / Lừa đảo'
              });
              Alert.alert('Thành công', 'Báo cáo của bạn đã được gửi. Admin sẽ xem xét sớm nhất có thể.');
            } catch (error) {
              console.error('Error reporting:', error);
              Alert.alert('Lỗi', 'Không thể gửi báo cáo vào lúc này.');
            }
          }
        }
      ]
    );
  };

  const handleSend = async () => {
    if (message.trim() && conversationId) {
      const tempContent = message.trim();
      setMessage('');
      
      try {
        await client.post('chat/send', {
          conversation_id: conversationId,
          content: tempContent
        });
        fetchMessages(); // Refresh immediately
      } catch (error) {
        console.error('Error sending message:', error);
        Alert.alert('Lỗi', 'Không thể gửi tin nhắn. Vui lòng thử lại.');
      }
    }
  };

  const renderMessage = ({ item }) => {
    const isMe = item.sender_id !== partner?.id;
    return (
      <View style={[styles.messageRow, isMe ? styles.myMessageRow : styles.theirMessageRow]}>
        <View style={[styles.messageBubble, isMe ? styles.myBubble : styles.theirBubble]}>
          <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.theirMessageText]}>
            {item.content}
          </Text>
          <View style={styles.messageFooter}>
            <Text style={[styles.messageTime, isMe ? styles.myTime : styles.theirTime]}>
              {new Date(item.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            {isMe && (
              <View style={styles.statusIcon}>
                {item.is_read ? (
                  <CheckCheck size={12} color="#fff" opacity={0.8} />
                ) : (
                  <Check size={12} color="#fff" opacity={0.5} />
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const partnerProfile = partner?.Profile;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#1e293b" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.userInfo} activeOpacity={0.7}>
          <View style={styles.avatarWrapper}>
            {partnerProfile?.avatar ? (
              <Image source={{ uri: partnerProfile.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.placeholderAvatar]}>
                <Text style={styles.avatarText}>{partnerProfile?.full_name?.charAt(0) || '?'}</Text>
              </View>
            )}
            <View style={[styles.onlineDot, { backgroundColor: '#10b981' }]} />
          </View>
          <View>
            <Text style={styles.userName} numberOfLines={1}>{partnerProfile?.full_name || 'Người dùng'}</Text>
            <Text style={styles.userStatus}>Đang hoạt động</Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={handleCall}>
            <Phone size={20} color="#1e293b" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={handleReport}>
            <AlertTriangle size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages List */}
      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ flex: 1 }} />
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      )}

      {/* Input Area */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, { paddingHorizontal: 16 }]}
              placeholder="Nhập tin nhắn..."
              placeholderTextColor="#94a3b8"
              value={message}
              onChangeText={setMessage}
              multiline
              maxHeight={100}
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.sendBtn, !message.trim() && styles.sendBtnDisabled]} 
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Send size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: Colors.primary + '20',
  },
  placeholderAvatar: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  onlineDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1e293b',
  },
  userStatus: {
    fontSize: 11,
    color: '#10b981',
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
  },
  listContent: {
    padding: 20,
    paddingBottom: 20,
  },
  messageRow: {
    marginBottom: 16,
    maxWidth: '85%',
  },
  myMessageRow: {
    alignSelf: 'flex-end',
  },
  theirMessageRow: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  myBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  myMessageText: {
    color: '#fff',
  },
  theirMessageText: {
    color: '#334155',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 10,
    fontWeight: '600',
  },
  myTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  theirTime: {
    color: '#94a3b8',
  },
  statusIcon: {
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    paddingHorizontal: 8,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: '#f1f5f9',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 15,
    color: '#1e293b',
    maxHeight: 100,
  },
  inputIconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sendBtnDisabled: {
    backgroundColor: '#cbd5e1',
    shadowOpacity: 0,
    elevation: 0,
  }
});

export default ChatDetailScreen;
