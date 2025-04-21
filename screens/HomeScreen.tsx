import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TextInput, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { styles } from '../styles/HomeStyles'; // Adjust the import path as necessary

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.headerText}>Home</Text>
        
        <View style={styles.searchContainer}>

          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#999"
          />
        </View>
        
        <Text style={styles.sectionTitle}>Most Searched Products</Text>
        
        <TouchableOpacity style={styles.productItem}>
          <Text style={styles.productText}>FrostyCream</Text>
          <Text style={styles.arrowIcon}>→</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.productItem}>
          <Text style={styles.productText}>NutriFlakes</Text>
          <Text style={styles.arrowIcon}>→</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.productItem}>
          <Text style={styles.productText}>FizzUp</Text>
          <Text style={styles.arrowIcon}>→</Text>
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>Organic Categories</Text>
        
        <View style={styles.categoriesContainer}>
          <TouchableOpacity style={[styles.categoryItem, { backgroundColor: '#FFCC66' }]}>
            <Text style={styles.categoryIcon}>☕</Text>
            <Text style={styles.categoryText}>Dairy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.categoryItem, { backgroundColor: '#66CC99' }]}>
            <Text style={styles.categoryIcon}>🍎</Text>
            <Text style={styles.categoryText}>Fruits</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.categoryItem, { backgroundColor: '#FF8888' }]}>
            <Text style={styles.categoryIcon}>🌾</Text>
            <Text style={styles.categoryText}>Grains</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.categoryItem, { backgroundColor: '#77AAFF' }]}>
            <Text style={styles.categoryIcon}>🫘</Text>
            <Text style={styles.categoryText}>Legumes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.categoryItem, { backgroundColor: '#FFAA99' }]}>
            <Text style={styles.categoryIcon}>🥩</Text>
            <Text style={styles.categoryText}>Meat</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.categoryItem, { backgroundColor: '#AAAAAA' }]}>
            <Text style={styles.categoryIcon}>🥜</Text>
            <Text style={styles.categoryText}>Nuts</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.categoryItem, { backgroundColor: '#9999FF' }]}>
            <Text style={styles.categoryIcon}>🐟</Text>
            <Text style={styles.categoryText}>Seafood</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.categoryItem, { backgroundColor: '#88DDAA' }]}>
            <Text style={styles.categoryIcon}>🥕</Text>
            <Text style={styles.categoryText}>Vegetables</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      

    </SafeAreaView>
  );
}