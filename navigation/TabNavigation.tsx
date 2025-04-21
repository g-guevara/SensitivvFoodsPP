import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from 'react-native';

// Import screens - use relative paths
import HomeScreen from '../screens/HomeScreen';
import TestScreen from '../screens/TestScreen';
import ReactionsScreen from '../screens/ReactionScreen';
import WishlistScreen from '../screens/WishlistScreen';

// Define the type for the tab navigator
type TabParamList = {
  Home: undefined;
  Test: undefined;
  Reactions: undefined;
  Wishlist: undefined;
};

// Define types for the tab bar icon props
type TabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
};

// Define type for the tab label props
type TabLabelProps = {
  focused: boolean;
  label: string;
};

const Tab = createBottomTabNavigator<TabParamList>();

// Custom Tab Label Component with proper typing
const TabLabel = ({ label, focused }: TabLabelProps) => (
  <Text style={{ 
    fontSize: 12, 
    color: focused ? '#4285F4' : '#888',
    marginTop: -5, // Move the label closer to the icon
  }}>
    {label}
  </Text>
);

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
          backgroundColor: '#f8f8f8',
        },
        tabBarActiveTintColor: '#4285F4',
        tabBarInactiveTintColor: '#888',
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color, size }: TabBarIconProps) => (
            <Ionicons name="home" size={size} color={focused ? '#4285F4' : '#888'} />
          ),
          tabBarLabel: ({ focused }: { focused: boolean }) => <TabLabel label="Home" focused={focused} />
        }}
      />
      <Tab.Screen 
        name="Test" 
        component={TestScreen}
        options={{
          tabBarIcon: ({ focused, color, size }: TabBarIconProps) => (
            <MaterialIcons name="assignment" size={size} color={focused ? '#4285F4' : '#888'} />
          ),
          tabBarLabel: ({ focused }: { focused: boolean }) => <TabLabel label="Test" focused={focused} />
        }}
      />
      <Tab.Screen 
        name="Reactions" 
        component={ReactionsScreen}
        options={{
          tabBarIcon: ({ focused, color, size }: TabBarIconProps) => (
            <MaterialCommunityIcons name="molecule" size={size} color={focused ? '#4285F4' : '#888'} />
          ),
          tabBarLabel: ({ focused }: { focused: boolean }) => <TabLabel label="Reactions" focused={focused} />
        }}
      />
      <Tab.Screen 
        name="Wishlist" 
        component={WishlistScreen}
        options={{
          tabBarIcon: ({ focused, color, size }: TabBarIconProps) => (
            <MaterialIcons name="bookmark" size={size} color={focused ? '#4285F4' : '#888'} />
          ),
          tabBarLabel: ({ focused }: { focused: boolean }) => <TabLabel label="Wishlist" focused={focused} />
        }}
      />
      </Tab.Navigator>
    );
  }