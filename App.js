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
        <Stack.Screen name="Admin" component={AdminScreen} options={{ headerShown: false }}/>

        {/* Representante */}
        <Stack.Screen 
          name="Representante" component={RepresentanteHome}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Estudiantes Asignados" component={EstudiantesAsignados} options={{ headerShown: false }}/>
        <Stack.Screen name="Calificaciones" component={Calificaciones} options={{ headerShown: false }}/>
        <Stack.Screen name="Asistencias" component={Asistencias} options={{ headerShown: false }}/>
        <Stack.Screen name="Observaciones" component={Observaciones} options={{ headerShown: false }}/>
        <Stack.Screen name="Perfil" component={RepresentantePerfil} options={{ headerShown: false }}/>
        <Stack.Screen name="Actualizar Datos" component={ActualizarDatos} options={{ headerShown: false }}/>
        <Stack.Screen name="Cambiar Contrasena" component={CambiarPassword} options={{ headerShown: false }}/>
        <Stack.Screen name="Notificaciones" component={Notificaciones}/>

        {/* Profesor */}
        <Stack.Screen name="Profesor" component={ProfesorHome} options={{ headerShown: false }}/>
        <Stack.Screen name="Profesor Perfil" component={ProfesorPerfil} options={{ headerShown: false }}/>
        <Stack.Screen name="Registrar Notas" component={RegistrarNotas} options={{ headerShown: false }}/>
        <Stack.Screen name="Actualizar Notas" component={ActualizarNotas} options={{ headerShown: false }}/>
        <Stack.Screen name="Registrar Observaciones" component={RegistrarObservaciones} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
