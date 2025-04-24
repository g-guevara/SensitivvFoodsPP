import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import TabNavigator from './navigation/TabNavigation';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import { AuthProvider, useAuth } from './components/AuthContext';
import { ThemeProvider } from './components/ThemeContext';

const Stack = createStackNavigator();

// Main navigator component that checks auth state
const AppNavigator = () => {
  const { isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main">
          {() => <TabNavigator />}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="Login">
            {(props) => (
              <LoginScreen 
                {...props} 
                onLogin={(userId: string, name: string, token?: string) => login(userId, name, token)} 
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="SignUp">
            {(props) => (
              <SignUpScreen 
                {...props} 
                onSignUp={(userId: string, name: string, token?: string) => login(userId, name, token)} 
              />
            )}
          </Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  const [state, setState] = React.useState({
    loading: false,
    foods: [],
    url: 'https://world.openfoodfacts.org/api/v3/product/50184453.json',
  });

React.useEffect(() => {
  let isMounted = true; // Indicador para evitar fugas de memoria
  const url = state.url; // Guardar el valor actual de state.url

  const getFoods = async () => {
  try {
      setState((prevState) => ({ ...prevState, loading: true }));
      const response = await fetch(url);
      const data = await response.json();
      console.log('Datos recibidos de la API:', data); // Verificar los datos en la consola
      if (isMounted) {
          setState((prevState) => ({ ...prevState, loading: false, foods: data }));
      }
  } catch (error) {
      console.error('Error fetching data:', error);
      if (isMounted) {
          setState((prevState) => ({ ...prevState, loading: false }));
      }
  }
};

  getFoods();

  return () => {
    isMounted = false; // Limpiar al desmontar
  };
}, [state.url]);


  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
              <NavigationContainer>
                <AppNavigator />
              </NavigationContainer>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}