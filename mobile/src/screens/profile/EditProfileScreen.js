import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  Alert,
  StatusBar,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { ChevronLeft, User, Phone, Save, Mail, Camera, Sparkles, Check } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import client from '../../api/client';

const { width, height } = Dimensions.get('window');

const EditProfileScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState({
    fullName: '',
    phoneNumber: '',
    email: ''
  });

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    fetchProfile();
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

  const fetchProfile = async () => {
    try {
      const response = await client.get('auth/me');
      const data = response.data;
      setUserData({
        fullName: data.Profile?.full_name || '',
        phoneNumber: data.phone_number || '',
        email: data.email || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin cá nhân');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!userData.fullName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ tên');
      return;
    }

    setSaving(true);
    try {
      await client.put('auth/profile', {
        full_name: userData.fullName,
        phone_number: userData.phoneNumber
      });
      Alert.alert('Thành công', 'Thông tin đã được cập nhật', [
        { text: 'Tuyệt vời', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Decorative Background Elements */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Header */}
          <Animated.View style={[styles.hero, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.headerTop}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <ChevronLeft size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Hồ sơ cá nhân</Text>
              <View style={{ width: 44 }} />
            </View>

            <View style={styles.avatarContainer}>
              <View style={styles.avatarWrapper}>
                <View style={styles.placeholderAvatar}>
                  <Text style={styles.avatarInitial}>
                    {userData.fullName ? userData.fullName.charAt(0).toUpperCase() : '?'}
                  </Text>
                </View>
                <TouchableOpacity style={styles.cameraBtn}>
                  <Camera size={16} color="#fff" />
                </TouchableOpacity>
              </View>
              <Text style={styles.avatarName}>{userData.fullName || 'Người dùng'}</Text>
              <Text style={styles.avatarSubtitle}>Cập nhật thông tin để kết nối tốt hơn</Text>
            </View>
          </Animated.View>

          {/* Form Section */}
          <Animated.View style={[styles.formContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.inputSection}>
              <View style={styles.labelRow}>
                <User size={14} color={Colors.primary} />
                <Text style={styles.label}>Họ và tên</Text>
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={userData.fullName}
                  onChangeText={(text) => setUserData({ ...userData, fullName: text })}
                  placeholder="Nhập họ tên đầy đủ"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            <View style={styles.inputSection}>
              <View style={styles.labelRow}>
                <Phone size={14} color={Colors.primary} />
                <Text style={styles.label}>Số điện thoại</Text>
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={userData.phoneNumber}
                  onChangeText={(text) => setUserData({ ...userData, phoneNumber: text })}
                  placeholder="Nhập số điện thoại"
                  placeholderTextColor="#94a3b8"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputSection}>
              <View style={styles.labelRow}>
                <Mail size={14} color="#64748b" />
                <Text style={styles.label}>Email (Cố định)</Text>
              </View>
              <View style={[styles.inputWrapper, styles.disabledInput]}>
                <TextInput
                  style={[styles.input, { color: '#94a3b8' }]}
                  value={userData.email}
                  editable={false}
                />
                <Check size={16} color="#cbd5e1" />
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.saveBtn, saving && styles.disabledBtn]} 
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.8}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
                  <View style={styles.saveIconWrapper}>
                    <Sparkles size={20} color="#fff" />
                  </View>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Thông tin của bạn sẽ được bảo mật và chỉ dùng để liên hệ khi cần thiết.
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#111827', // Pitch dark for focus
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
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
  avatarContainer: {
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  placeholderAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatarInitial: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3b82f6',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#111827',
  },
  avatarName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 6,
  },
  avatarSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
  },
  formContainer: {
    paddingHorizontal: 24,
    marginTop: 30,
  },
  inputSection: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    marginLeft: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputWrapper: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 60,
    borderWidth: 1.5,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
  },
  disabledInput: {
    backgroundColor: '#f8fafc',
    borderColor: '#f1f5f9',
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    height: 64,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
    gap: 12,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  saveIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledBtn: {
    opacity: 0.7,
  },
  infoBox: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderStyle: 'dashed',
  },
  infoText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
});

export default EditProfileScreen;
