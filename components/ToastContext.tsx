// components/ToastContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';

// Definir tipos
type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastMessage {
  type: ToastType;
  text: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (options: ToastMessage) => void;
  hideToast: () => void;
  // Métodos de conveniencia
  success: (text: string, duration?: number) => void;
  error: (text: string, duration?: number) => void;
  info: (text: string, duration?: number) => void;
  warning: (text: string, duration?: number) => void;
}

// Crear contexto
const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
  hideToast: () => {},
  success: () => {},
  error: () => {},
  info: () => {},
  warning: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [toast, setToast] = useState<ToastMessage>({ type: 'info', text: '' });
  const fadeAnim = useState(new Animated.Value(0))[0];

  const showToast = (options: ToastMessage) => {
    setToast(options);
    setVisible(true);
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto hide after duration
    const duration = options.duration || 3000;
    setTimeout(hideToast, duration);
  };

  const hideToast = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  // Métodos de conveniencia
  const success = (text: string, duration?: number) => {
    showToast({ type: 'success', text, duration });
  };

  const error = (text: string, duration?: number) => {
    showToast({ type: 'error', text, duration });
  };

  const info = (text: string, duration?: number) => {
    showToast({ type: 'info', text, duration });
  };

  const warning = (text: string, duration?: number) => {
    showToast({ type: 'warning', text, duration });
  };

  // Determinar el color de fondo según el tipo
  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success': return '#4caf50';
      case 'error': return '#f44336';
      case 'warning': return '#ff9800';
      case 'info': default: return '#4285F4';
    }
  };

  return (
    <ToastContext.Provider value={{ 
      showToast, 
      hideToast, 
      success, 
      error, 
      info, 
      warning 
    }}>
      {children}
      {visible && (
        <Animated.View
          style={[
            styles.container,
            { backgroundColor: getBackgroundColor(), opacity: fadeAnim }
          ]}
        >
          <Text style={styles.text}>{toast.text}</Text>
          <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  text: {
    color: 'white',
    fontSize: 14,
    flex: 1,
  },
  closeButton: {
    marginLeft: 15,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});