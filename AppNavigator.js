import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import AdminScreen from './screens/AdminScreen';
import RepresentanteHome from './screens/representante/RepresentanteHome';
import EstudiantesAsignados from './screens/representante/EstudiantesAsignados';
import Calificaciones from './screens/representante/Calificaciones';
import Asistencias from './screens/representante/Asistencias';
import Observaciones from './screens/representante/Observaciones';

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Admin" component={AdminScreen} />
      <Stack.Screen name="Representante" component={RepresentanteHome} />
      <Stack.Screen name="EstudiantesAsignados" component={EstudiantesAsignados} />
      <Stack.Screen name="Calificaciones" component={Calificaciones} />
      <Stack.Screen name="Asistencias" component={Asistencias} />
      <Stack.Screen name="Observaciones" component={Observaciones} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
