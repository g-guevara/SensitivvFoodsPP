import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { useToast } from '../utils/ToastContext';
import { User } from '../components/Login/User';
import { ApiService } from '../services/api';

interface ProfileScreenProps {
  user: User;
  onLogout: () => void;
  onClose: () => void;
}

export default function ProfileScreen({ user, onLogout, onClose }: ProfileScreenProps) {
  // Estados existentes
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [trialDays, setTrialDays] = useState(user.trialPeriodDays.toString());
  const [loading, setLoading] = useState(false);
  
  // Nuevo estado para el formulario de información personal
  const [showPersonalInfoModal, setShowPersonalInfoModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(user);
  
  const { showToast } = useToast();

  // Funciones existentes
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    setLoading(true);
    try {
      await ApiService.changePassword(currentPassword, newPassword);
      showToast('Password changed successfully', 'success');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      showToast(error.message || 'Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTrialPeriod = async () => {
    const days = parseInt(trialDays);
    if (isNaN(days) || days < 0) {
      showToast('Please enter a valid number of days', 'error');
      return;
    }

    setLoading(true);
    try {
      await ApiService.updateTrialPeriod(days);
      showToast('Trial period updated successfully', 'success');
      setShowTrialModal(false);
      // Update local user data
      if (user) {
        user.trialPeriodDays = days;
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to update trial period', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Nueva función para manejar actualización de usuario
  const handleUserUpdate = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    showToast('Información personal actualizada correctamente', 'success');
  };

  // Funciones auxiliares para información personal
  const getProfileCompleteness = () => {
    return currentUser.profileCompleteness || 0;
  };

  const getPersonalInfoSummary = () => {
    const info = currentUser.personalInfo;
    if (!info) return null;

    const items = [];
    if (info.rut) items.push(`RUT: ${info.rut}`);
    if (info.phoneNumber) items.push(`Teléfono: ${info.phoneNumber}`);
    if (info.allergies && info.allergies.length > 0) {
      items.push(`Alergias: ${info.allergies.length} registrada(s)`);
    }
    if (info.diagnosedDiseases && info.diagnosedDiseases.length > 0) {
      items.push(`Enfermedades: ${info.diagnosedDiseases.length} registrada(s)`);
    }
    
    return items;
  };

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="formSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="#000">
              <Path
                d="M6 18L18 6M6 6l12 12"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Svg width={80} height={80} viewBox="0 0 24 24" fill="#4285F4">
                <Path 
                  fillRule="evenodd" 
                  d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" 
                  clipRule="evenodd" 
                />
              </Svg>
            </View>
            <Text style={styles.userName}>{currentUser.name}</Text>
            <Text style={styles.userEmail}>{currentUser.email}</Text>
          </View>

          {/* Nueva sección de completitud del perfil */}
          {getProfileCompleteness() > 0 && (
            <View style={styles.completenessSection}>
              <Text style={styles.completenessTitle}>Completitud del perfil</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${getProfileCompleteness()}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressPercentage}>{getProfileCompleteness()}%</Text>
              </View>
            </View>
          )}

          {/* Nueva sección de resumen de información personal */}
          {getPersonalInfoSummary() && getPersonalInfoSummary()!.length > 0 && (
            <View style={styles.personalInfoSummary}>
              <Text style={styles.summaryTitle}>Información Personal</Text>
              {getPersonalInfoSummary()!.map((item, index) => (
                <Text key={index} style={styles.summaryItem}>{item}</Text>
              ))}
            </View>
          )}

          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Trial Period</Text>
              <Text style={styles.infoValue}>{currentUser.trialPeriodDays} days</Text>
            </View>
          </View>

          <View style={styles.actionSection}>
            {/* Nuevo botón para información personal */}
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowPersonalInfoModal(true)}
            >
              <Text style={styles.actionButtonText}>Editar Información Personal</Text>
            </TouchableOpacity>

            {/* Botones existentes */}
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowPasswordModal(true)}
            >
              <Text style={styles.actionButtonText}>Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowTrialModal(true)}
            >
              <Text style={styles.actionButtonText}>Modify Trial Period</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.logoutButton]}
              onPress={() => {
                Alert.alert(
                  'Log Out',
                  'Are you sure you want to log out?',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Log Out',
                      style: 'destructive',
                      onPress: onLogout,
                    },
                  ]
                );
              }}
            >
              <Text style={[styles.actionButtonText, styles.logoutButtonText]}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Modal existente para cambio de contraseña */}
        <Modal
          visible={showPasswordModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowPasswordModal(false)}
        >
          <TouchableOpacity 
            style={styles.modalContainer}
            activeOpacity={1}
            onPress={() => setShowPasswordModal(false)}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={styles.modalContent}
              onPress={e => e.stopPropagation()}
            >
              <Text style={styles.modalTitle}>Change Password</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Current Password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowPasswordModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleChangePassword}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save</Text>
                  )}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        {/* Modal existente para período de prueba */}
        <Modal 
          visible={showTrialModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowTrialModal(false)}
        >
          <TouchableOpacity 
            style={styles.modalContainer}
            activeOpacity={1}
            onPress={() => setShowTrialModal(false)}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={styles.modalContent}
              onPress={e => e.stopPropagation()}
            >
              <Text style={styles.modalTitle}>Modify Trial Period</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Trial days"
                value={trialDays}
                onChangeText={setTrialDays}
                keyboardType="numeric"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowTrialModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleUpdateTrialPeriod}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save</Text>
                  )}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        {/* Nuevo modal para información personal */}
        <Modal
          visible={showPersonalInfoModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowPersonalInfoModal(false)}
        >
          <PersonalInfoForm
            user={currentUser}
            onUserUpdate={handleUserUpdate}
            onClose={() => setShowPersonalInfoModal(false)}
          />
        </Modal>
      </SafeAreaView>
    </Modal>
  );
}

// Importar el componente PersonalInfoForm aquí mismo para evitar problemas de dependencias
import PersonalInfoForm from '../components/Profile/PersonalInfoForm';

// Estilos existentes + nuevos estilos
const styles = StyleSheet.create({
  // ... todos los estilos existentes se mantienen igual
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  
  // Nuevos estilos para información personal
  completenessSection: {
    backgroundColor: '#fff',
    marginBottom: 16,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  completenessTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
  },
  personalInfoSummary: {
    backgroundColor: '#fff',
    marginBottom: 16,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  summaryItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  
  // Estilos existentes
  infoSection: {
    backgroundColor: '#fff',
    marginBottom: 16,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  actionSection: {
    padding: 20,
  },
  actionButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  actionButtonText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    borderColor: '#dc3545',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#333',
    textAlign: 'center',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007bff',
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});