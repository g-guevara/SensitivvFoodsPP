import React from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { styles } from '../../styles/HomeStyles';
import { Product } from '../../services/openFoodFactsApi';

interface ContentProps {
  isSearchFocused: boolean;
  isSearching: boolean;
  searchText: string;
  searchResults: Product[];
  onProductSelect: (product: Product) => void;
}

export default function HomeContent({
  isSearchFocused,
  isSearching,
  searchText,
  searchResults,
  onProductSelect
}: ContentProps) {
  if (isSearchFocused) {
    return (
      <View style={styles.searchResultsContainer}>
        {isSearching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#7d7d7d" />
          </View>
        ) : searchText.length > 2 && searchResults.length > 0 ? (
          searchResults.map((product) => (
            <TouchableOpacity
              key={product.code}
              style={styles.searchResultItem}
              onPress={() => onProductSelect(product)}
            >
              <View style={styles.productImageContainer}>
                {product.image_small_url ? (
                  <Image
                    source={{ uri: product.image_small_url }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Text style={styles.placeholderText}>No Image</Text>
                  </View>
                )}
              </View>
              <View style={styles.searchResultContent}>
                <Text style={styles.searchResultText} numberOfLines={2}>
                  {product.product_name || 'Unknown Product'}
                </Text>
                {product.brands && (
                  <Text style={styles.searchResultBrand} numberOfLines={1}>
                    {product.brands}
                  </Text>
                )}
              </View>
              <Text style={styles.arrowIcon}>→</Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              {searchText.length > 2
                ? `No results found for "${searchText}"`
                : 'Type at least 3 characters to search'}
            </Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <>
      <Text style={styles.sectionTitle}>Recently Searched</Text>
      {['FrostyCream', 'NutriFlakes', 'FizzUp'].map((item) => (
        <TouchableOpacity key={item} style={styles.productItem}>
          <Text style={styles.productText}>{item}</Text>
          <Text style={styles.arrowIcon}>→</Text>
        </TouchableOpacity>
      ))}

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
  );
}
