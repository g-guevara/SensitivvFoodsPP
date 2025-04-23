// components/LoadingContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Modal } from 'react-native';

interface LoadingContextType {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
}

// Crear contexto
const LoadingContext = createContext<LoadingContextType>({
  showLoading: () => {},
  hideLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('Loading...');

  const showLoading = (msg?: string) => {
    if (msg) setMessage(msg);
    setVisible(true);
  };

  const hideLoading = () => {
    setVisible(false);
  };

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      {children}
      <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={hideLoading}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <ActivityIndicator size="large" color="#4285F4" />
            <Text style={styles.text}>{message}</Text>
          </View>
        </View>
      </Modal>
    </LoadingContext.Provider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    minWidth: 200,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});