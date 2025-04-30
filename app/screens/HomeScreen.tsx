import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { styles as baseStyles } from '../styles/HomeStyles';
import ProfileScreen from './ProfileScreen';
import { useToast } from '../utils/ToastContext';

// Importar datos de muestra
const sampleProducts = [
  {
    id: "0000105000011",
    name: "Chamomile Herbal Tea",
    brand: "Lagg's",
    category: "Herbal Tea",
    image: "🌼",
    ingredients: "CHAMOMILE FLOWERS."
  },
  {
    id: "0000105000042",
    name: "Lagg's, herbal tea, peppermint",
    brand: "Lagg's",
    category: "Herbal Tea",
    image: "🌿",
    ingredients: "Peppermint."
  },
  {
    id: "0000105000059",
    name: "Linden Flowers Tea",
    brand: "Lagg's",
    category: "Herbal Tea",
    image: "🌸",
    ingredients: "LINDEN FLOWERS."
  },
  {
    id: "0000105000073",
    name: "Herbal Tea, Hibiscus",
    brand: "Lagg's",
    category: "Herbal Tea",
    image: "🌺",
    ingredients: "Hibiscus flowers."
  },
  {
    id: "0000105000196",
    name: "Apple & Cinnamon Tea",
    brand: "Lagg's",
    category: "Flavored Tea",
    image: "🍎",
    ingredients: "TEA, CINNAMON & NATURAL APPLE FLAVOR."
  },
  {
    id: "0000105000219",
    name: "Green Tea",
    brand: "Lagg's",
    category: "Green Tea",
    image: "🍵",
    ingredients: "GREEN TEA."
  }
];

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
  // Inicializar con solo los 2 primeros productos
  const [searchResults, setSearchResults] = useState(sampleProducts.slice(0, 2));
  const { showToast } = useToast();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Función para manejar la búsqueda
  const handleSearch = (text: string) => {
    setSearchText(text);
    
    if (text.trim() === '') {
      // Cuando no hay término de búsqueda, mostrar solo los 2 primeros productos
      setSearchResults(sampleProducts.slice(0, 2));
    } else {
      const filtered = sampleProducts.filter(product => 
        product.name.toLowerCase().includes(text.toLowerCase()) ||
        product.brand.toLowerCase().includes(text.toLowerCase()) ||
        product.category.toLowerCase().includes(text.toLowerCase()) ||
        product.ingredients.toLowerCase().includes(text.toLowerCase())
      );
      setSearchResults(filtered);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header con botón de perfil */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Home</Text>
          <TouchableOpacity style={styles.profileButton} onPress={() => setShowProfile(true)}>
            <Text style={styles.profileButtonText}>Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Nuevo buscador simple */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchText}
            onChangeText={handleSearch}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => {
              // Solo cambiamos a no enfocado si no hay texto de búsqueda
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

        {/* Resultados de búsqueda */}
        <View style={styles.resultsContainer}>
          <Text style={styles.sectionTitle}>
            {searchText ? 'Search Results' : 'Featured Products (2 of 3)'}
          </Text>
          
          {searchResults.length > 0 ? (
            <>
              {searchResults.map(product => (
                <TouchableOpacity 
                  key={product.id} 
                  style={styles.productItem}
                  onPress={() => {}}
                >
                  <View style={styles.productImageContainer}>
                    <Text style={styles.productEmoji}>{product.image}</Text>
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productBrand}>{product.brand}</Text>
                    <Text style={styles.productCategory}>{product.category}</Text>
                    <Text style={styles.productIngredients} numberOfLines={1}>
                      {product.ingredients}
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

        {/* Sección de categorías de alimentos - solo visible cuando la búsqueda no está enfocada */}
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

// Estilos combinados
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
  resultsContainerFocused: {
    marginTop: 10, // Agregar espacio adicional arriba cuando está enfocado
  },
  sectionTitleFocused: {
    fontSize: 22, // Título más grande cuando está enfocado
    marginBottom: 15,
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
  productCategory: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
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