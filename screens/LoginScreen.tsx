import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Button, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import styles from '../styles/LoginStyles';
import { useLoading } from '../components/LoadingContext'; // Importar useLoading
import { useToast } from '../components/ToastContext'; // Importar useToast

const API_URL = Config.API_URL || 'http://localhost:5008/api';

const LoginScreen = ({ onLogin, navigation }: any) => {
  // If navigation is undefined, initialize with an object that has an empty navigate method
  const nav = navigation || { navigate: () => console.log('Navigation not available') };
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Usar los hooks de loading y toast
  const { showLoading, hideLoading } = useLoading();
  const { success, error: showError, info } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        showLoading('Checking login status...');
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          // User is already logged in
          const userName = await AsyncStorage.getItem('userName') || 'User';
          success(`Welcome back, ${userName}!`);
          onLogin(userId, userName);
        }
        hideLoading();
      } catch (error) {
        hideLoading();
        console.error('Error checking login status:', error);
        showError('Error checking login status');
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      showError('Email and password are required');
      setError('Email and password are required');
      return;
    }

    showLoading('Signing in...');
    setError('');

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        hideLoading();
        setError(data.error || 'Authentication failed');
        showError(data.error || 'Authentication failed');
        return;
      }

      // Store user data in AsyncStorage
      await AsyncStorage.setItem('userId', data.userId);
      await AsyncStorage.setItem('userName', data.name);
      if (data.language) {
        await AsyncStorage.setItem('userLanguage', data.language);
      }

      hideLoading();
      success(`Welcome, ${data.name}!`);
      console.log('Login successful:', data);
      onLogin(data.userId, data.name); // Call this function after successful login
    } catch (error) {
      hideLoading();
      console.error('Error during login:', error);
      setError('Network error. Please try again.');
      showError('Network error. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google authentication logic
    info('Google login coming soon!');
  };

  const handleGuestLogin = async () => {
    try {
      showLoading('Entering as guest...');
      
      // Set guest data in AsyncStorage
      await AsyncStorage.setItem('isGuest', 'true');
      await AsyncStorage.setItem('userId', 'guest-user');
      await AsyncStorage.setItem('userName', 'Guest');
      
      hideLoading();
      success('Welcome, Guest!');
      console.log('Guest login successful');
      onLogin('guest-user', 'Guest');
    } catch (error) {
      hideLoading();
      console.error('Error during guest login:', error);
      setError('Error accessing storage. Please try again.');
      showError('Error accessing storage. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Sensitivv</Text>
      </View>
      
      <Text style={styles.title}>Login</Text>
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <Button 
        title="Login" 
        onPress={handleLogin} 
        color="#4285F4" 
      />
      
      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>
      
      <TouchableOpacity 
        style={styles.googleButton} 
        onPress={handleGoogleLogin}
      >
        <Text style={styles.googleButtonText}>Login with Google</Text>
      </TouchableOpacity>

      {/* Guest Login Button */}
      <TouchableOpacity 
        style={styles.guestButton} 
        onPress={handleGuestLogin}
      >
        <Text style={styles.guestButtonText}>Enter as Guest</Text>
      </TouchableOpacity>

      <Text
        style={styles.link}
        onPress={() => nav.navigate('SignUp')}
      >
        Don't have an account? Sign Up
      </Text>
    </View>
  );
};

export default LoginScreen;