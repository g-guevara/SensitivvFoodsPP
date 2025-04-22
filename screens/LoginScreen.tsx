// screens/LoginScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  StyleSheet 
} from 'react-native';
import { useAuth } from '../components/AuthContext';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setError('');
    
    try {
      await login(email, password);
      // No need to navigate - AuthContext will handle authentication state
    } catch (error) {
      // Error is already handled in AuthContext
      console.log('Login failed');
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google authentication logic
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
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
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
      
      <TouchableOpacity
        onPress={() => navigation.navigate('SignUp')}
        disabled={isLoading}
      >
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4285F4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  errorText: {
    color: '#ff3b30',
    marginBottom: 15,
    textAlign: 'center',
  },
  loadingIndicator: {
    marginVertical: 15,
  },
  loginButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    width: 40,
    textAlign: 'center',
    color: '#888',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 15,
  },
  googleButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  linkText: {
    marginTop: 15,
    textAlign: 'center',
    color: '#4285F4',
  },
});

export default LoginScreen;