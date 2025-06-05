// Updated SearchComponent.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sampleProducts } from '../../data/productData';
import { searchStyles } from '../../styles/HomeComponentStyles';
import { ApiService } from '../../services/api'; // Asegúrate de que la ruta sea correcta
import type { Product } from '../../data/productData';

interface SearchComponentProps {
  onFocusChange: (focused: boolean) => void;
}

export default function SearchComponent({ onFocusChange }: SearchComponentProps) {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Función de búsqueda mejorada
  const handleSearch = async (text: string) => {
    if (!text.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      // Usar el texto de búsqueda en la llamada a la API
      const results = await ApiService.searchProducts(text.trim());
      setSearchResults(results.filter(product => 
        product.product_name.toLowerCase().includes(text.toLowerCase()) ||
        product.brands?.toLowerCase().includes(text.toLowerCase())
      ));
    } catch (error) {
      console.error('Error in search:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Implementar debounce para evitar demasiadas llamadas a la API
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchText) {
        handleSearch(searchText);
      }
    }, 300); // espera 300ms después de que el usuario deja de escribir

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  const getDefaultEmoji = (product: typeof sampleProducts[0]): string => {
    const name = product.product_name.toLowerCase();
    const ingredients = product.ingredients_text.toLowerCase();

    if (name.includes('peanut') || ingredients.includes('peanut')) return '🥜';
    if (name.includes('hafer') || ingredients.includes('hafer')) return '🌾';

    return '🍽️';
  };

  const handleProductPress = async (product: typeof sampleProducts[0]) => {
    try {
      // Store the selected product in AsyncStorage
      await AsyncStorage.setItem('selectedProduct', JSON.stringify(product));
      
      // Navigate to product detail screen
      router.push('/screens/ProductInfoScreen');
    } catch (error) {
      console.error('Error storing product in AsyncStorage:', error);
    }
  };

  const handleInputChange = (text: string) => {
    setSearchText(text);
    if (!text) {
      setSearchResults([]);
    }
  };

  return (
    <>
      <View style={searchStyles.searchContainer}>
        <TextInput
          style={searchStyles.searchInput}
          placeholder="Search"
          value={searchText}
          onChangeText={handleInputChange}
          onFocus={() => onFocusChange(true)}
          onBlur={() => {
            if (!searchText) {
              onFocusChange(false);
            }
          }}
        />
        {searchText ? (
          <TouchableOpacity
            style={searchStyles.clearButton}
            onPress={() => {
              handleSearch('');
              onFocusChange(false);
            }}
          >
            <Text style={searchStyles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={searchStyles.resultsContainer}>
        <Text style={searchStyles.sectionTitle}>
          {searchText ? 'Search Results' : 'History'}
        </Text>

        {searchResults.length > 0 ? (
          <>
            {searchResults.map(product => (
              <TouchableOpacity
                key={product.code}
                style={searchStyles.productItem}
                onPress={() => handleProductPress(product)}
              >
                <View style={searchStyles.productImageContainer}>
                  {product.image_url ? (
                    <Image
                      source={{ uri: product.image_url }}
                      style={searchStyles.productImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={searchStyles.productEmoji}>{getDefaultEmoji(product)}</Text>
                  )}
                </View>
                <View style={searchStyles.productInfo}>
                  <Text style={searchStyles.productName}>{product.product_name}</Text>
                  <Text style={searchStyles.productBrand}>{product.brands}</Text>
                </View>
                <Text style={searchStyles.arrowIcon}>›</Text>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <View style={searchStyles.noResultsContainer}>
            <Text style={searchStyles.noResultsText}>No products found for "{searchText}"</Text>
            <Text style={searchStyles.noResultsSubtext}>Try a different search term</Text>
          </View>
        )}
      </View>
    </>
  );
}