import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener esta línea
import CurvedHeaderLayout from '../components/CurvedHeaderLayout';

const ProfesorHome = () => {
  const navigation = useNavigation();

  const menuItems = [
    { icon: 'person-outline', label: 'Profesor Perfil', onPress: () => navigation.navigate('Profesor Perfil') },
    { icon: 'create-outline', label: 'Actualizar Datos', onPress: () => navigation.navigate('Actualizar Datos') },
    { icon: 'key-outline', label: 'Cambiar Contraseña', onPress: () => navigation.navigate('Cambiar Contrasena') },
    { icon: 'document-text-outline', label: 'Registrar Notas', onPress: () => navigation.navigate('Registrar Notas') },
    { icon: 'refresh-outline', label: 'Actualizar Notas', onPress: () => navigation.navigate('Actualizar Notas') },
    { icon: 'chatbubble-ellipses-outline', label: 'Registrar Observaciones', onPress: () => navigation.navigate('Registrar Observaciones') },
  ];

  return (
    <CurvedHeaderLayout
      userName="Profesor"
      avatarUrl="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
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

export default ProfesorHome;
