import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/Login.js';
import AdminScreen from './src/screens/Admin.js';

const Stack = createStackNavigator();

const App = () => {
  const [userRole, setUserRole] = useState('admin'); // temporal para pruebas

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Ocultar encabezado en la pantalla de login */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        
        {/* Mostrar solo si el usuario es admin */}
        {userRole === 'admin' && (
          <Stack.Screen name="Admin" component={AdminScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
