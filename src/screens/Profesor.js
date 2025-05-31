import React from 'react';
import { useNavigation } from '@react-navigation/native';
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
      menuItems={menuItems}
      onViewPress={() => {}}
    />
  );
};

export default ProfesorHome;
