// screens/SignUpScreen.tsx
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

interface SignUpScreenProps {
  navigation: any;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  
  const { register, isLoading } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Clear error when user starts typing again
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Email, password, and confirm password are required');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setError('');
    
    try {
      await register(formData.email, formData.password, formData.name);
      // AuthContext will handle the state change
    } catch (error) {
      // Error is already handled in AuthContext
      console.log('Registration failed');
    }
  };

  const handleGoogleSignUp = () => {
    // Implement Google authentication logic
    Alert.alert('Google Sign Up', 'Google sign up functionality will be implemented here');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Sensitivv</Text>
      </View>
      
      <Text style={styles.title}>Create Account</Text>
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <TextInput
        style={styles.input}
        placeholder="Name (Optional)"
        value={formData.name}
        onChangeText={(value) => handleInputChange('name', value)}
        autoCapitalize="words"
        editable={!isLoading}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(value) => handleInputChange('email', value)}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={formData.password}
        onChangeText={(value) => handleInputChange('password', value)}
        secureTextEntry
        editable={!isLoading}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChangeText={(value) => handleInputChange('confirmPassword', value)}
        secureTextEntry
        editable={!isLoading}
      />
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#4285F4" style={styles.loadingIndicator} />
      ) : (
        <TouchableOpacity 
          style={styles.signUpButton} 
          onPress={handleSignUp}
          disabled={isLoading}
        >
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
      )}
      
      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>
      
      <TouchableOpacity 
        style={styles.googleButton} 
        onPress={handleGoogleSignUp}
        disabled={isLoading}
      >
        <Text style={styles.googleButtonText}>Sign up with Google</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        disabled={isLoading}
      >
        <Text style={styles.linkText}>Already have an account? Login</Text>
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
  signUpButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  signUpButtonText: {
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

export default SignUpScreen;