import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, Text, View, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { styles as baseStyles } from '../styles/HomeStyles';
import ProfileScreen from './ProfileScreen';
import ProductDetailScreen from './ProductDetailScreen';
import HomeHeaderAndSearch from '../components/home/HomeHeaderAndSearch';
import HomeContent from '../components/home/HomeContent';
import { useToast } from '../utils/ToastContext';

interface User {
  id?: string;
  name?: string;
  email?: string;
  language?: string;
  trialPeriodDays?: number;
}

interface HomeScreenProps {
  user?: User;
  onLogout?: () => void;
}

export default function HomeScreen({ user, onLogout }: HomeScreenProps) {
  const [showProfile, setShowProfile] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { showToast } = useToast();

  // Load the local food data on component mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        await LocalFoodDataService.loadData();
      } catch (error) {
        console.error('Error loading initial food data:', error);
        setErrorMessage('Failed to load food database. Please restart the app.');
      }
    }
    
    loadInitialData();
  }, []);

  const performSearch = async (text: string) => {
    if (text.trim().length > 0) {
      setIsSearching(true);
      setErrorMessage('');
      try {
        console.log('Starting search for:', text);
        const response = await LocalFoodDataService.searchProducts(text);
        
        if (response.products.length === 0) {
          setErrorMessage('No products found. Try different search terms.');
        } else {
          setSearchResults(response.products);
          setErrorMessage('');
          showToast(`Found ${response.products.length} products`, 'success');
        }
      } catch (error) {
        console.error('Search error:', error);
        setErrorMessage('Unable to search products. Please try again.');
        showToast('Search failed. Please try again.', 'error');
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
      setErrorMessage('');
    }
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const handleSearchSubmit = () => {
    if (searchText.trim().length === 0) {
      showToast('Please enter some text to search', 'warning');
      return;
    }
    performSearch(searchText);
  };

  const clearSearch = () => {
    setSearchText('');
    setSearchResults([]);
    setIsSearchFocused(false);
    setErrorMessage('');
  };

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductSelect = (product: Product) => {
    console.log('Selected product:', product);
    setSelectedProduct(product);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <HomeHeaderAndSearch
          searchText={searchText}
          onSearchTextChange={handleSearch}
          onClearSearch={clearSearch}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => {
            if (!searchText) setIsSearchFocused(false);
          }}
          onProfilePress={() => setShowProfile(true)}
          onSubmit={handleSearchSubmit}
        />

        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : (
          <HomeContent
            isSearchFocused={isSearchFocused}
            isSearching={isSearching}
            searchText={searchText}
            searchResults={searchResults}
            onProductSelect={handleProductSelect}
          />
        )}

        {isSearching && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#7d7d7d" />
            <Text style={styles.loadingText}>
              Searching...
            </Text>
          </View>
        )}
      </ScrollView>

      {showProfile && user && (
        <ProfileScreen
          user={{
            _id: user.id || '',
            userID: user.id || '',
            name: user.name || '',
            email: user.email || '',
            language: user.language || 'en',
            trialPeriodDays: user.trialPeriodDays || 5,
          }}
          onLogout={() => {
            setShowProfile(false);
            onLogout?.();
          }}
          onClose={() => setShowProfile(false)}
        />
      )}
      
      {selectedProduct && (
        <ProductDetailScreen 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </SafeAreaView>
  );
}

// Combine existing styles with error and loading styles
const styles = StyleSheet.create({
  ...baseStyles,
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
  },
  errorSubtext: {
    color: '#B91C1C',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.8,
  },
  infoContainer: {
    padding: 10,
    marginHorizontal: 20,
    marginTop: 10,
  },
  infoText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  loadingOverlay: {
    padding: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  loadingText: {
    color: '#666',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 10,
  },
});