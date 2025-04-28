import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Product } from '../services/openFoodFactsApi';
import { Svg, Path } from 'react-native-svg';
import { useToast } from '../utils/ToastContext';
import { ApiService } from '../services/api';

interface ProductDetailsScreenProps {
  product: Product;
  onClose: () => void;
}

export default function ProductDetailsScreen({ product, onClose }: ProductDetailsScreenProps) {
  const [selectedReaction, setSelectedReaction] = useState<'Critic' | 'Sensitive' | 'Safe' | null>(null);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  const handleReactionSelect = (reaction: 'Critic' | 'Sensitive' | 'Safe') => {
    setSelectedReaction(reaction);
  };

  const saveReaction = async () => {
    if (!selectedReaction) {
      showToast('Please select a reaction first', 'warning');
      return;
    }

    setIsSaving(true);
    try {
      // Save to API - this would need to be implemented in ApiService
      await ApiService.addProductNote(product.code, notes, 
        selectedReaction === 'Safe' ? 5 : 
        selectedReaction === 'Sensitive' ? 3 : 1
      );
      
      showToast('Reaction saved successfully', 'success');
      onClose();
    } catch (error) {
      showToast('Failed to save reaction', 'error');
      console.error('Save reaction error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getReactionColor = (reaction: 'Critic' | 'Sensitive' | 'Safe') => {
    switch (reaction) {
      case 'Critic': return '#FF3B30';
      case 'Sensitive': return '#FFCC00';
      case 'Safe': return '#34C759';
      default: return '#CCCCCC';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="#000">
            <Path
              d="M15 19l-7-7 7-7"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={styles.backText}>Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Information</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.productImageContainer}>
          {product.image_url ? (
            <Image
              source={{ uri: product.image_url }}
              style={styles.productImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}
        </View>
        
        <View style={styles.productInfo}>
          <Text style={styles.productName}>
            {product.product_name || 'Unknown Product'}
            <Text style={styles.productQualifier}>
              {product.categories ? ' ' + product.categories.split(',')[0].toLowerCase() : ''}
            </Text>
          </Text>
          
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Brand:</Text>
            <Text style={styles.infoValue}>{product.brands || 'Unknown'}</Text>
          </View>
          
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Ingredients:</Text>
            <Text style={styles.infoValue}>{product.ingredients_text || product.product_name || 'No ingredients information'}</Text>
          </View>
        </View>
        
        <View style={styles.reactionSection}>
          <Text style={styles.sectionTitle}>Select Reaction</Text>
          
          <View style={styles.reactionButtons}>
            <TouchableOpacity
              style={styles.reactionButton}
              onPress={() => handleReactionSelect('Critic')}
            >
              <View 
                style={[
                  styles.reactionIndicator, 
                  { backgroundColor: getReactionColor('Critic') },
                  selectedReaction === 'Critic' && styles.selectedReaction
                ]} 
              />
              <Text style={styles.reactionText}>Critic</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.reactionButton}
              onPress={() => handleReactionSelect('Sensitive')}
            >
              <View 
                style={[
                  styles.reactionIndicator, 
                  { backgroundColor: getReactionColor('Sensitive') },
                  selectedReaction === 'Sensitive' && styles.selectedReaction
                ]} 
              />
              <Text style={styles.reactionText}>Sensitive</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.reactionButton}
              onPress={() => handleReactionSelect('Safe')}
            >
              <View 
                style={[
                  styles.reactionIndicator, 
                  { backgroundColor: getReactionColor('Safe') },
                  selectedReaction === 'Safe' && styles.selectedReaction
                ]} 
              />
              <Text style={styles.reactionText}>Safe</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.notesSection}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            multiline
            numberOfLines={4}
            placeholder="Add your notes here..."
            value={notes}
            onChangeText={setNotes}
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={saveReaction}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Reaction</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginRight: 24, // To offset the back button
  },
  scrollView: {
    flex: 1,
  },
  productImageContainer: {
    height: 300,
    width: '100%',
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    fontSize: 18,
    color: '#999',
  },
  productInfo: {
    paddingHorizontal: 20,
  },
  productName: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  productQualifier: {
    fontWeight: 'normal',
  },
  infoSection: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 15,
  },
  infoLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 18,
    color: '#444',
  },
  reactionSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 15,
  },
  reactionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  reactionButton: {
    width: '30%',
    height: 45,
    borderRadius: 10,
    backgroundColor: '#f5f5f7',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  reactionIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  selectedReaction: {
    borderWidth: 3,
    borderColor: '#000',
  },
  reactionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  notesSection: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    minHeight: 120,
    fontSize: 16,
    backgroundColor: '#f5f5f7',
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    margin: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});