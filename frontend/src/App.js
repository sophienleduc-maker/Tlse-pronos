import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from './stores/authStore';
import * as SecureStore from 'expo-secure-store';

import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import PronosScreen from './screens/PronosScreen';
import PronoDetailScreen from './screens/PronoDetailScreen';
import BankrollScreen from './screens/BankrollScreen';
impor AccountScreen from './screens/AccountScreen';
import AcademyScreen from './screens/AcademyScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#0f0f1e' }
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#1a1a2e' },
      headerTintColor: '#00ff88',
      headerTitleStyle: { fontWeight: 'bold' },
      cardStyle: { backgroundColor: '#0f0f1e' }
    }}
  >
    <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Accueil' }} />
  </Stack.Navigator>
);

const PronosStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#1a1a2e' },
      headerTintColor: '#00ff88',
      headerTitleStyle: { fontWeight: 'bold' },
      cardStyle: { backgroundColor: '#0f0f1e' }
    }}
  >
    <Stack.Screen name="PronosList" component={PronosScreen} options={{ title: 'Pronostics' }} />
    <Stack.Screen name="PronoDetail" component={PronoDetailScreen} options={{ title: 'Détails' }} />
  </Stack.Navigator>
);

const BankrollStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#1a1a2e' },
      headerTintColor: '#00ff88',
      headerTitleStyle: { fontWeight: 'bold' },
      cardStyle: { backgroundColor: '#0f0f1e' }
    }}
  >
    <Stack.Screen name="BankrollMain" component={BankrollScreen} options={{ title: 'Bankroll' }} />
  </Stack.Navigator>
);

const AcademyStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#1a1a2e' },
      headerTintColor: '#00ff88',
      headerTitleStyle: { fontWeight: 'bold' },
      cardStyle: { backgroundColor: '#0f0f1e' }
    }}
  >
    <Stack.Screen name="AcademyMain" component={AcademyScreen} options={{ title: 'Académie' }} />
  </Stack.Navigator>
);

const AccountStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#1a1a2e' },
      headerTintColor: '#00ff88',
      headerTitleStyle: { fontWeight: 'bold' },
      cardStyle: { backgroundColor: '#0f0f1e' }
    }}
  >
    <Stack.Screen name="AccountMain" component={AccountScreen} options={{ title: 'Mon Compte' }} />
  </Stack.Navigator>
);

const AppTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: { backgroundColor: '#1a1a2e', borderTopColor: '#00ff88' },
      tabBarActiveTintColor: '#00ff88',
      tabBarInactiveTintColor: '#666',
      headerShown: false
    }}
  >
    <Tab.Screen
      name="HomeTab"
      component={HomeStack}
      options={{
        title: 'Accueil',
        tabBarLabel: 'Accueil'
      }}
    />
    <Tab.Screen
      name="PronosTab"
      component={PronosStack}
      options={{
        title: 'Pronostics',
        tabBarLabel: 'Pronostics'
      }}
    />
    <Tab.Screen
      name="BankrollTab"
      component={BankrollStack}
      options={{
        title: 'Bankroll',
        tabBarLabel: 'Bankroll'
      }}
    />
    <Tab.Screen
      name="AcademyTab"
      component={AcademyStack}
      options={{
        title: 'Académie',
        tabBarLabel: 'Académie'
      }}
    />
    <Tab.Screen
      name="AccountTab"
      component={AccountStack}
      options={{
        title: 'Compte',
        tabBarLabel: 'Compte'
      }}
    />
  </Tab.Navigator>
);

const App = () => {
  const { isAuthenticated, user, login, setLoading, isLoading } = useAuthStore();
  const [initializing, setInitializing] = React.useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (token) {
        // Verify token with backend
        setLoading(true);
        // Implementation would verify token
        setLoading(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setInitializing(false);
    }
  };

  if (initializing || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f1e' }}>
        <ActivityIndicator size="large" color="#00ff88" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated && user ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default App;
