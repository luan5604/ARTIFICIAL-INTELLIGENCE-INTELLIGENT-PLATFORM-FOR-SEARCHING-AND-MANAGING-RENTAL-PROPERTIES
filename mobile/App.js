import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Search, Heart, User, MessageSquare } from 'lucide-react-native';

import Colors from './src/constants/Colors';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import PostListScreen from './src/screens/main/PostListScreen';
import HomeScreen from './src/screens/main/HomeScreen';
import PostDetailScreen from './src/screens/main/PostDetailScreen';
import SearchScreen from './src/screens/search/SearchScreen';
import SearchResultsScreen from './src/screens/search/SearchResultsScreen';
import FavoritesScreen from './src/screens/favorites/FavoritesScreen';
import MessageListScreen from './src/screens/chat/MessageListScreen';
import ChatDetailScreen from './src/screens/chat/ChatDetailScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import RentalHistoryScreen from './src/screens/profile/RentalHistoryScreen';
import NotificationScreen from './src/screens/profile/NotificationScreen';
import SecurityScreen from './src/screens/profile/SecurityScreen';
import SettingScreen from './src/screens/profile/SettingScreen';
import SupportScreen from './src/screens/profile/SupportScreen';
import AboutScreen from './src/screens/profile/AboutScreen';
import EditProfileScreen from './src/screens/profile/EditProfileScreen';
import ChangePasswordScreen from './src/screens/profile/ChangePasswordScreen';
import DeviceManagementScreen from './src/screens/profile/DeviceManagementScreen';
import LoginHistoryScreen from './src/screens/profile/LoginHistoryScreen';

import ContractDetailScreen from './src/screens/profile/ContractDetailScreen';
import InvoiceDetailScreen from './src/screens/profile/InvoiceDetailScreen';
import AIChatScreen from './src/screens/profile/AIChatScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 8,
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        }
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Khám phá',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{
          tabBarLabel: 'Tìm kiếm',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Messages" 
        component={MessageListScreen} 
        options={{
          tabBarLabel: 'Tin nhắn',
          tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesScreen} 
        options={{
          tabBarLabel: 'Yêu thích',
          tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarLabel: 'Cá nhân',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="PostList" component={PostListScreen} />
        <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
        <Stack.Screen name="PostDetail" component={PostDetailScreen} />
        <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
        <Stack.Screen name="RentalHistory" component={RentalHistoryScreen} />
        <Stack.Screen name="Notifications" component={NotificationScreen} />
        <Stack.Screen name="Security" component={SecurityScreen} />
        <Stack.Screen name="Settings" component={SettingScreen} />
        <Stack.Screen name="Support" component={SupportScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="DeviceManagement" component={DeviceManagementScreen} />
        <Stack.Screen name="LoginHistory" component={LoginHistoryScreen} />
        <Stack.Screen name="ContractDetail" component={ContractDetailScreen} />
        <Stack.Screen name="InvoiceDetail" component={InvoiceDetailScreen} />
        <Stack.Screen name="AIChat" component={AIChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
