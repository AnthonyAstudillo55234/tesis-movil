import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Pantallas comunes
import LoginScreen from './src/screens/Login';
import AdminScreen from './src/screens/Admin';
import RecuperarPasswordScreen from './src/screens/RecuperarPassword';

// Representante
import RepresentanteHome from './src/screens/Representante';
import EstudiantesAsignados from './src/components/EstudiantesAsignados';
import Calificaciones from './src/components/Calificaciones';
import Asistencias from './src/components/Asistencias';
import Observaciones from './src/components/Observaciones';
import RepresentantePerfil from './src/components/RepresentantePerfil';
import ActualizarDatos from './src/components/ActualizarDatos';
import CambiarPassword from './src/components/CambiarPassword';
import Notificaciones from './src/components/Notificaciones';

// Profesor
import ProfesorHome from './src/screens/Profesor';
import ProfesorPerfil from './src/components/ProfesorPerfil';
import RegistrarNotas from './src/components/RegistrarNotas';
import ActualizarNotas from './src/components/ActualizarNotas';
import RegistrarObservaciones from './src/components/RegistrarObservaciones';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Pantalla de login */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        {/* Recuperar contraseña */}
        <Stack.Screen
          name="RecuperarPassword"
          component={RecuperarPasswordScreen}
          options={{ title: 'Recuperar Contraseña' }}
        />

        {/* Admin */}
        <Stack.Screen name="Admin" component={AdminScreen} />

        {/* Representante */}
        <Stack.Screen name="Representante" component={RepresentanteHome} />
        <Stack.Screen name="Estudiantes Asignados" component={EstudiantesAsignados} />
        <Stack.Screen name="Calificaciones" component={Calificaciones} />
        <Stack.Screen name="Asistencias" component={Asistencias} />
        <Stack.Screen name="Observaciones" component={Observaciones} />
        <Stack.Screen name="Perfil" component={RepresentantePerfil} />
        <Stack.Screen name="Actualizar Datos" component={ActualizarDatos} />
        <Stack.Screen name="Cambiar Contrasena" component={CambiarPassword} />
        <Stack.Screen name="Notificaciones" component={Notificaciones} />

        {/* Profesor */}
        <Stack.Screen name="Profesor" component={ProfesorHome} />
        <Stack.Screen name="Profesor Perfil" component={ProfesorPerfil} />
        <Stack.Screen name="Registrar Notas" component={RegistrarNotas} />
        <Stack.Screen name="Actualizar Notas" component={ActualizarNotas} />
        <Stack.Screen name="Registrar Observaciones" component={RegistrarObservaciones} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
