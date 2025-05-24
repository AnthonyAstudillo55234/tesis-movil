import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/Login.js';
import AdminScreen from './src/screens/Admin.js';

import RepresentanteHome from './src/screens/Representante.js';
import EstudiantesAsignados from './src/components/EstudiantesAsignados.js';
import Calificaciones from './src/components/Calificaciones.js';
import Asistencias from './src/components/Asistencias.js';
import Observaciones from './src/components/Observaciones.js';

import RepresentantePerfil from './src/components/RepresentantePerfil.js';
import ActualizarDatos from './src/components/ActualizarDatos.js';
import CambiarPassword from './src/components/CambiarPassword.js';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen name="Admin" component={AdminScreen} />
        <Stack.Screen name="Representante" component={RepresentanteHome} />
        <Stack.Screen name="Estudiantes Asignados" component={EstudiantesAsignados} />
        <Stack.Screen name="Calificaciones" component={Calificaciones} />
        <Stack.Screen name="Asistencias" component={Asistencias} />
        <Stack.Screen name="Observaciones" component={Observaciones} />
        <Stack.Screen name="Perfil" component={RepresentantePerfil} />
        <Stack.Screen name="Actualizar Datos" component={ActualizarDatos} />
        <Stack.Screen name="Cambiar Contrasena" component={CambiarPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
