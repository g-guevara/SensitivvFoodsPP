import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { useToast } from '../../utils/ToastContext';
import { User } from '../Login/User';
import { ApiService } from '../../services/api';

interface PersonalInfoFormProps {
  user: User;
  onUserUpdate: (updatedUser: User) => void;
  onClose: () => void;
}

// Datos predefinidos
const COMMON_ALLERGIES = [
  'Gluten', 'Lactosa', 'Frutos secos', 'Mariscos', 'Huevos', 'Soja', 'Pescado'
];

const COMMON_DISEASES = [
  'Diabetes', 'Hipertensión', 'Enfermedad celíaca', 'Intolerancia a la lactosa', 
  'Síndrome del intestino irritable', 'Enfermedad de Crohn'
];

const PAYMENT_METHODS = [
  { value: 'credit_card', label: 'Tarjeta de Crédito' },
  { value: 'debit_card', label: 'Tarjeta de Débito' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'bank_transfer', label: 'Transferencia Bancaria' },
];

export default function PersonalInfoForm({ user, onUserUpdate, onClose }: PersonalInfoFormProps) {
  const { showToast } = useToast();

  // Estados del formulario
  const [formData, setFormData] = useState({
    rut: user.personalInfo?.rut || '',
    phoneNumber: user.personalInfo?.phoneNumber || '',
    dateOfBirth: user.personalInfo?.dateOfBirth || '',
    allergies: user.personalInfo?.allergies || [],
    diagnosedDiseases: user.personalInfo?.diagnosedDiseases || [],
    paymentMethod: user.personalInfo?.paymentMethod || [],
  });

  // Estados para modales
  const [showAllergyModal, setShowAllergyModal] = useState(false);
  const [showDiseaseModal, setShowDiseaseModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Estados para inputs personalizados
  const [customAllergy, setCustomAllergy] = useState('');
  const [customDisease, setCustomDisease] = useState('');
  const [newPaymentType, setNewPaymentType] = useState('credit_card');
  const [newPaymentDetails, setNewPaymentDetails] = useState('');

  // Funciones de formateo
  const formatRUT = (rut: string) => {
    const cleaned = rut.replace(/[^0-9kK]/g, '');
    if (cleaned.length <= 1) return cleaned;
    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1);
    const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formatted}-${dv}`;
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length <= 4) return cleaned;
    if (cleaned.length <= 8) return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 6)} ${cleaned.slice(6, 10)}`;
  };

  const formatDateOfBirth = (date: string) => {
    const cleaned = date.replace(/\D/g, '');
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'rut') {
      formattedValue = formatRUT(value);
    } else if (field === 'phoneNumber') {
      formattedValue = formatPhoneNumber(value);
    } else if (field === 'dateOfBirth') {
      formattedValue = formatDateOfBirth(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  const addAllergy = (allergyName: string) => {
    if (!allergyName.trim() || formData.allergies.includes(allergyName)) return;
    
    setFormData(prev => ({
      ...prev,
      allergies: [...prev.allergies, allergyName]
    }));
    setCustomAllergy('');
    setShowAllergyModal(false);
  };

  const removeAllergy = (allergyToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter(allergy => allergy !== allergyToRemove)
    }));
  };

  const addDisease = (diseaseName: string) => {
    if (!diseaseName.trim() || formData.diagnosedDiseases.includes(diseaseName)) return;
    
    setFormData(prev => ({
      ...prev,
      diagnosedDiseases: [...prev.diagnosedDiseases, diseaseName]
    }));
    setCustomDisease('');
    setShowDiseaseModal(false);
  };

  const removeDisease = (diseaseToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      diagnosedDiseases: prev.diagnosedDiseases.filter(disease => disease !== diseaseToRemove)
    }));
  };

  const addPaymentMethod = () => {
    if (!newPaymentDetails.trim()) {
      showToast('Por favor ingresa los detalles del método de pago', 'error');
      return;
    }

    const newMethod = {
      type: newPaymentType as 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer',
      details: newPaymentDetails,
      isDefault: formData.paymentMethod.length === 0
    };

    setFormData(prev => ({
      ...prev,
      paymentMethod: [...prev.paymentMethod, newMethod]
    }));

    setNewPaymentDetails('');
    setShowPaymentModal(false);
  };

  const removePaymentMethod = (index: number) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: prev.paymentMethod.filter((_, i) => i !== index)
    }));
  };

  const calculateProfileCompleteness = () => {
    const fields = [
      formData.rut,
      formData.phoneNumber,
      formData.dateOfBirth,
      formData.allergies.length > 0,
      formData.diagnosedDiseases.length > 0,
      formData.paymentMethod.length > 0
    ];
    
    const completedFields = fields.filter(Boolean).length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const handleSave = async () => {
    try {
      const updatedUser: User = {
        ...user,
        personalInfo: formData,
        profileCompleteness: calculateProfileCompleteness(),
        lastUpdated: new Date().toISOString()
      };

      // Llamar al API para guardar
      await ApiService.updateUserPersonalInfo(updatedUser.userID, updatedUser.personalInfo);
      
      onUserUpdate(updatedUser);
      showToast('Información personal actualizada correctamente', 'success');
      onClose();
    } catch (error: any) {
      showToast(error.message || 'Error al actualizar información', 'error');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Información Personal</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Progreso del perfil */}
        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Completitud del perfil</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${calculateProfileCompleteness()}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{calculateProfileCompleteness()}% completado</Text>
        </View>

        {/* Información básica */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Básica</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>RUT</Text>
            <TextInput
              style={styles.input}
              value={formData.rut}
              onChangeText={(value) => handleInputChange('rut', value)}
              placeholder="12.345.678-9"
              maxLength={12}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Número de Teléfono</Text>
            <TextInput
              style={styles.input}
              value={formData.phoneNumber}
              onChangeText={(value) => handleInputChange('phoneNumber', value)}
              placeholder="+56 9123 4567"
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fecha de Nacimiento</Text>
            <TextInput
              style={styles.input}
              value={formData.dateOfBirth}
              onChangeText={(value) => handleInputChange('dateOfBirth', value)}
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
              maxLength={10}
            />
          </View>
        </View>

        {/* Alergias */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Alergias</Text>
            <TouchableOpacity 
              onPress={() => setShowAllergyModal(true)}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>+ Agregar</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.tagContainer}>
            {formData.allergies.map((allergy, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{allergy}</Text>
                <TouchableOpacity onPress={() => removeAllergy(allergy)}>
                  <Text style={styles.tagRemove}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
            {formData.allergies.length === 0 && (
              <Text style={styles.emptyText}>No hay alergias registradas</Text>
            )}
          </View>
        </View>

        {/* Enfermedades diagnosticadas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Enfermedades Diagnosticadas</Text>
            <TouchableOpacity 
              onPress={() => setShowDiseaseModal(true)}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>+ Agregar</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.tagContainer}>
            {formData.diagnosedDiseases.map((disease, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{disease}</Text>
                <TouchableOpacity onPress={() => removeDisease(disease)}>
                  <Text style={styles.tagRemove}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
            {formData.diagnosedDiseases.length === 0 && (
              <Text style={styles.emptyText}>No hay enfermedades registradas</Text>
            )}
          </View>
        </View>

        {/* Métodos de pago */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Métodos de Pago</Text>
            <TouchableOpacity 
              onPress={() => setShowPaymentModal(true)}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>+ Agregar</Text>
            </TouchableOpacity>
          </View>
          
          {formData.paymentMethod.map((method, index) => (
            <View key={index} style={styles.paymentMethodItem}>
              <View style={styles.paymentMethodInfo}>
                <Text style={styles.paymentMethodType}>
                  {PAYMENT_METHODS.find(pm => pm.value === method.type)?.label}
                </Text>
                <Text style={styles.paymentMethodDetails}>{method.details}</Text>
                {method.isDefault && (
                  <Text style={styles.defaultBadge}>Por defecto</Text>
                )}
              </View>
              <TouchableOpacity onPress={() => removePaymentMethod(index)}>
                <Text style={styles.removeButton}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          ))}
          {formData.paymentMethod.length === 0 && (
            <Text style={styles.emptyText}>No hay métodos de pago registrados</Text>
          )}
        </View>
      </ScrollView>

      {/* Modal para agregar alergias */}
      <Modal visible={showAllergyModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Alergia</Text>
            
            <Text style={styles.modalSubtitle}>Alergias comunes:</Text>
            <FlatList
              data={COMMON_ALLERGIES}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.optionItem}
                  onPress={() => addAllergy(item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            
            <Text style={styles.modalSubtitle}>O escribe una personalizada:</Text>
            <TextInput
              style={styles.customInput}
              value={customAllergy}
              onChangeText={setCustomAllergy}
              placeholder="Nombre de la alergia"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setShowAllergyModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalSaveButton}
                onPress={() => addAllergy(customAllergy)}
              >
                <Text style={styles.modalSaveText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para agregar enfermedades */}
      <Modal visible={showDiseaseModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Enfermedad</Text>
            
            <Text style={styles.modalSubtitle}>Enfermedades comunes:</Text>
            <FlatList
              data={COMMON_DISEASES}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.optionItem}
                  onPress={() => addDisease(item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            
            <Text style={styles.modalSubtitle}>O escribe una personalizada:</Text>
            <TextInput
              style={styles.customInput}
              value={customDisease}
              onChangeText={setCustomDisease}
              placeholder="Nombre de la enfermedad"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setShowDiseaseModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalSaveButton}
                onPress={() => addDisease(customDisease)}
              >
                <Text style={styles.modalSaveText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para agregar método de pago */}
      <Modal visible={showPaymentModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Método de Pago</Text>
            
            <Text style={styles.modalSubtitle}>Tipo de pago:</Text>
            <FlatList
              data={PAYMENT_METHODS}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.optionItem,
                    newPaymentType === item.value && styles.selectedOption
                  ]}
                  onPress={() => setNewPaymentType(item.value)}
                >
                  <Text style={[
                    styles.optionText,
                    newPaymentType === item.value && styles.selectedOptionText
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
            
            <Text style={styles.modalSubtitle}>Detalles del método:</Text>
            <TextInput
              style={styles.customInput}
              value={newPaymentDetails}
              onChangeText={setNewPaymentDetails}
              placeholder="Ej: **** **** **** 1234"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setShowPaymentModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalSaveButton}
                onPress={addPaymentMethod}
              >
                <Text style={styles.modalSaveText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  cancelButton: {
    padding: 8,
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  progressSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#1976d2',
    fontSize: 14,
    marginRight: 4,
  },
  tagRemove: {
    color: '#1976d2',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodType: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  paymentMethodDetails: {
    fontSize: 14,
    color: '#666',
  },
  defaultBadge: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
    marginTop: 2,
  },
  removeButton: {
    color: '#ff3b30',
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    marginTop: 16,
  },
  optionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
  },
  selectedOptionText: {
    color: '#1976d2',
    fontWeight: '500',
  },
  customInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalCancelButton: {
    flex: 1,
    padding: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#666',
    fontSize: 16,
  },
  modalSaveButton: {
    flex: 1,
    padding: 12,
    marginLeft: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalSaveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});