import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Button, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import styles from '../styles/LoginStyles'; // Ensure this path is correct

const API_URL = Config.API_URL || 'http://localhost:5008/api';

const LoginScreen = ({ onLogin, navigation }: any) => {
  // If navigation is undefined, initialize with an object that has an empty navigate method
  const nav = navigation || { navigate: () => console.log('Navigation not available') };
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          // User is already logged in
          onLogin();
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setIsLoading(true);
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
        setError(data.error || 'Authentication failed');
        return;
      }

      // Store user data in AsyncStorage
      await AsyncStorage.setItem('userId', data.userId);
      await AsyncStorage.setItem('userName', data.name);
      if (data.language) {
        await AsyncStorage.setItem('userLanguage', data.language);
      }

      console.log('Login successful:', data);
      onLogin(); // Call this function after successful login
    } catch (error) {
      console.error('Error during login:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google authentication logic
    // This would typically use Expo's AuthSession or react-native-google-signin
    Alert.alert('Google Login', 'Google login functionality will be implemented here');
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
        editable={!isLoading}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#4285F4" style={styles.loadingIndicator} />
      ) : (
        <Button 
          title="Login" 
          onPress={handleLogin} 
          color="#4285F4" 
          disabled={isLoading} 
        />
      )}
      
      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>
      
      <TouchableOpacity 
        style={styles.googleButton} 
        onPress={handleGoogleLogin}
        disabled={isLoading}
      >
        <Text style={styles.googleButtonText}>Login with Google</Text>
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