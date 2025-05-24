import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/RepresentanteStyles';

const RepresentanteHome = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Representante</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Perfil')}
      >
        <Text style={styles.buttonText}>Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Estudiantes Asignados')}
      >
        <Text style={styles.buttonText}>Estudiantes Asignados</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Calificaciones')}
      >
        <Text style={styles.buttonText}>Calificaciones</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Asistencias')}
      >
        <Text style={styles.buttonText}>Asistencias</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Observaciones')}
      >
        <Text style={styles.buttonText}>Observaciones</Text>
      </TouchableOpacity>

      {/* NUEVAS OPCIONES */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Actualizar Datos')}
      >
        <Text style={styles.buttonText}>Actualizar Datos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Cambiar Contrasena')}
      >
        <Text style={styles.buttonText}>Cambiar Contraseña</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RepresentanteHome;
