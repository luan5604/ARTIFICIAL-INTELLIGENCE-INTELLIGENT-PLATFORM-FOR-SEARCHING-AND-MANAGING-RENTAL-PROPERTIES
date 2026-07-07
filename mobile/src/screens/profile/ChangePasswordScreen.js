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
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
  Dimensions
} from 'react-native';
import { ChevronLeft, Lock, Eye, EyeOff, Save, ShieldAlert, Sparkles, KeyRound } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import client from '../../api/client';

const { width, height } = Dimensions.get('window');

const ChangePasswordScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Animation values
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

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ các thông tin mật khẩu.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Mật khẩu không khớp', 'Mật khẩu mới và xác nhận mật khẩu phải giống nhau.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Mật khẩu quá ngắn', 'Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    setLoading(true);
    try {
      await client.put('auth/change-password', {
        currentPassword,
        newPassword
      });

      Alert.alert('Thành công', 'Mật khẩu của bạn đã được cập nhật thành công.', [
        { text: 'Xác nhận', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Change password error:', error);
      const message = error.response?.data?.message || 'Không thể đổi mật khẩu. Vui lòng thử lại.';
      Alert.alert('Lỗi hệ thống', message);
    } finally {
      setLoading(false);
    }
  };

  const PasswordInput = ({ label, value, onChangeText, show, setShow, placeholder }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Lock size={18} color={value ? Colors.primary : '#94a3b8'} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          secureTextEntry={!show}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="#cbd5e1"
        />
        <TouchableOpacity onPress={() => setShow(!show)} style={styles.eyeBtn}>
          {show ? <EyeOff size={20} color="#94a3b8" /> : <Eye size={20} color="#94a3b8" />}
        </TouchableOpacity>
      </View>
    </View>
  );

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
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Hero Header */}
          <Animated.View style={[styles.hero, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.headerTop}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <ChevronLeft size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Bảo mật</Text>
              <View style={{ width: 44 }} />
            </View>
            <View style={styles.heroContent}>
              <View style={styles.iconBoxHero}>
                <KeyRound size={32} color="#fff" />
              </View>
              <Text style={styles.heroTitle}>Thay đổi mật khẩu</Text>
              <Text style={styles.heroSubtitle}>Hãy tạo một mật khẩu mạnh để bảo vệ tài khoản và thông tin cá nhân của bạn.</Text>
            </View>
          </Animated.View>

          <Animated.View style={[styles.formWrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.warningBox}>
              <ShieldAlert size={18} color="#1e40af" />
              <Text style={styles.warningText}>Mật khẩu mới yêu cầu độ dài từ 6 ký tự trở lên.</Text>
            </View>

            <View style={styles.form}>
              <PasswordInput 
                label="Mật khẩu hiện tại"
                placeholder="Nhập mật khẩu đang dùng"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                show={showCurrent}
                setShow={setShowCurrent}
              />

              <PasswordInput 
                label="Mật khẩu mới"
                placeholder="Tối thiểu 6 ký tự"
                value={newPassword}
                onChangeText={setNewPassword}
                show={showNew}
                setShow={setShowNew}
              />

              <PasswordInput 
                label="Xác nhận mật khẩu mới"
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                show={showConfirm}
                setShow={setShowConfirm}
              />

              <TouchableOpacity 
                style={[styles.saveBtn, loading && styles.disabledBtn]}
                onPress={handleSave}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.saveBtnText}>Cập nhật mật khẩu</Text>
                    <View style={styles.sparkleBox}>
                      <Sparkles size={18} color="#fff" />
                    </View>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.footerInfo}>
              <Text style={styles.footerNote}>
                Nếu bạn quên mật khẩu cũ, vui lòng đăng xuất và sử dụng tính năng "Quên mật khẩu" tại màn hình đăng nhập.
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
    backgroundColor: '#ef4444',
    bottom: 50,
    left: -80,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  hero: {
    backgroundColor: '#0f172a',
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
  heroContent: {
    alignItems: 'center',
  },
  iconBoxHero: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  formWrapper: {
    paddingHorizontal: 24,
    marginTop: 30,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    gap: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  warningText: {
    fontSize: 13,
    color: '#1e40af',
    fontWeight: '600',
    flex: 1,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1e293b',
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '700',
  },
  eyeBtn: {
    padding: 8,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    height: 64,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
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
  sparkleBox: {
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
  footerInfo: {
    marginTop: 40,
    padding: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderStyle: 'dashed',
  },
  footerNote: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '500',
  },
});

export default ChangePasswordScreen;
