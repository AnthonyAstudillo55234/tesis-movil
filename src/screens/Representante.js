import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener esto en tu proyecto
import CurvedHeaderLayout from '../components/CurvedHeaderLayout';

const RepresentanteHome = () => {
  const navigation = useNavigation();

  const menuItems = [
    { icon: 'person-outline', label: 'Perfil', onPress: () => navigation.navigate('Perfil') },
    { icon: 'school-outline', label: 'Estudiantes Asignados', onPress: () => navigation.navigate('Estudiantes Asignados') },
    { icon: 'book-outline', label: 'Calificaciones', onPress: () => navigation.navigate('Calificaciones') },
    { icon: 'checkmark-done-outline', label: 'Asistencias', onPress: () => navigation.navigate('Asistencias') },
    { icon: 'alert-circle-outline', label: 'Observaciones', onPress: () => navigation.navigate('Observaciones') },
    { icon: 'create-outline', label: 'Actualizar Datos', onPress: () => navigation.navigate('Actualizar Datos') },
    { icon: 'key-outline', label: 'Cambiar Contraseña', onPress: () => navigation.navigate('Cambiar Contrasena') },
    { icon: 'notifications-outline', label: 'Notificaciones', onPress: () => navigation.navigate('Notificaciones') },
  ];

  return (
    <CurvedHeaderLayout
      userName="Representante"
      avatarUrl="https://cdn-icons-png.flaticon.com/512/3884/3884879.png"
      content={
        <View style={{ maxHeight: 500 }}>
          <ScrollView showsVerticalScrollIndicator={true}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={item.onPress}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 16,
                  paddingHorizontal: 24,
                  borderBottomWidth: 1,
                  borderBottomColor: '#ccc',
                  backgroundColor: 'white'
                }}
              >
                <Ionicons name={item.icon} size={30} color="#28a745" style={{ marginRight: 16 }} />
                <Text style={{ fontSize: 16, color: '#333' }}>{item.label}</Text>
              </TouchableOpacity>
            ))}
            {/* Botón de Cerrar Sesión */}
            <TouchableOpacity
              onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 16,
                paddingHorizontal: 24,
                borderTopColor: '#ccc',
                backgroundColor: 'white',
              }}
            >
              <Ionicons name="log-out-outline" size={30} color="red" style={{ marginRight: 16 }} />
              <Text style={{ fontSize: 16, color: 'red' }}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      }
    />
  );
};

export default RepresentanteHome;
