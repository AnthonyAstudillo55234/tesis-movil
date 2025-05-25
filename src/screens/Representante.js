import React from 'react';
import { useNavigation } from '@react-navigation/native';
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
  ];

  return (
    <CurvedHeaderLayout
      userName="Representante"
      avatarUrl="https://cdn-icons-png.flaticon.com/512/3884/3884879.png"
      menuItems={menuItems.map(item => ({
        icon: item.icon,
        label: item.label,
        onPress: item.onPress
      }))}
      onViewPress={() => {}}
    />
  );
};

export default RepresentanteHome;
