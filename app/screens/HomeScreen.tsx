import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { styles as baseStyles } from '../styles/HomeStyles';
import ProfileScreen from './ProfileScreen';
import { useToast } from '../utils/ToastContext';
import { sampleProducts } from '../data/productData';

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
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState(sampleProducts.slice(0, 2));
  const { showToast } = useToast();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Function to handle search
  const handleSearch = (text: string) => {
    setSearchText(text);

    if (text.trim() === '') {
      setSearchResults(sampleProducts.slice(0, 2));
    } else {
      const filtered = sampleProducts.filter(product =>
        product.product_name.toLowerCase().includes(text.toLowerCase()) ||
        product.brands.toLowerCase().includes(text.toLowerCase()) ||
        product.ingredients_text.toLowerCase().includes(text.toLowerCase())
      );

      setSearchResults(filtered.slice(0, 15)); // Show only up to 15 results
    }
  };

  const getDefaultEmoji = (product: typeof sampleProducts[0]): string => {
    const name = product.product_name.toLowerCase();
    const ingredients = product.ingredients_text.toLowerCase();

    if (name.includes('erdnuss') || ingredients.includes('erdnüsse')) return '🥜';
    if (name.includes('hafer') || ingredients.includes('hafer')) return '🌾';
    if (name.includes('sekt')) return '🍾';
    if (name.includes('kuchen') || name.includes('back')) return '🍰';
    if (name.includes('quinoa')) return '🌿';
    return '🍽️';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Home</Text>
          <TouchableOpacity style={styles.profileButton} onPress={() => setShowProfile(true)}>
            <Text style={styles.profileButtonText}>Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchText}
            onChangeText={handleSearch}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => {
              if (!searchText) {
                setIsSearchFocused(false);
              }
            }}
          />
          {searchText ? (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                handleSearch('');
                setIsSearchFocused(false);
              }}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.resultsContainer}>
          <Text style={styles.sectionTitle}>
            {searchText ? 'Search Results' : 'Featured Products (2 of 6)'}
          </Text>

          {searchResults.length > 0 ? (
            <>
              {searchResults.map(product => (
                <TouchableOpacity
                  key={product.code}
                  style={styles.productItem}
                  onPress={() => {}}
                >
                  <View style={styles.productImageContainer}>
                    {product.image_url ? (
                      <Image
                        source={{ uri: product.image_url }}
                        style={styles.productImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={styles.productEmoji}>{getDefaultEmoji(product)}</Text>
                    )}
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.product_name}</Text>
                    <Text style={styles.productBrand}>{product.brands}</Text>
                    <Text style={styles.productIngredients} numberOfLines={1}>
                      {product.ingredients_text}
                    </Text>
                  </View>
                  <Text style={styles.arrowIcon}>→</Text>
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No products found for "{searchText}"</Text>
              <Text style={styles.noResultsSubtext}>Try a different search term</Text>
            </View>
          )}
        </View>

        {!isSearchFocused && (
          <>
            <Text style={styles.sectionTitle}>Food Categories</Text>
            <View style={styles.categoriesContainer}>
              {[
                { icon: '🥛', text: 'Dairy', color: '#FFCC66' },
                { icon: '🍎', text: 'Fruits', color: '#66CC99' },
                { icon: '🌾', text: 'Grains', color: '#FF8888' },
                { icon: '🫘', text: 'Legumes', color: '#77AAFF' },
                { icon: '🥩', text: 'Meat', color: '#FFAA99' },
                { icon: '🥜', text: 'Nuts', color: '#AAAAAA' },
                { icon: '🐟', text: 'Seafood', color: '#9999FF' },
                { icon: '🥬', text: 'Vegetables', color: '#88DDAA' },
              ].map((category) => (
                <TouchableOpacity
                  key={category.text}
                  style={[styles.categoryItem, { backgroundColor: category.color }]}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={styles.categoryText}>{category.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ...baseStyles,
  profileButtonText: {
    color: '#007BFF',
    fontWeight: '600',
    fontSize: 16,
  },
  resultsContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f2f2f7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  productImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  productEmoji: {
    fontSize: 24,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  productBrand: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  productIngredients: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  noResultsContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginTop: 10,
  },
  noResultsText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  noResultsSubtext: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 8,
  }
});
