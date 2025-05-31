import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CurvedHeaderLayout from './CurvedHeaderLayout';

const ProfesorPerfil = () => {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch('https://escuela-descubrir.vercel.app/api/perfil', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setPerfil(data);
      } catch (error) {
        console.error('Error al cargar perfil:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <CurvedHeaderLayout
      userName={`${perfil.nombre} ${perfil.apellido}`}
      avatarUrl="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
      showBackButton={true}
       showViewButton={false}
      content={
        <View contentContainerStyle={{ padding: 20 }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 15,
            padding: 20,
            marginTop: 30,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
            elevation: 8,
          }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#333' }}>
              Mi Perfil
            </Text>

            <Field label="Nombre Completo" value={`${perfil.nombre} ${perfil.apellido}`} />
            <Field label="Email" value={perfil.email} />
            <Field label="Cédula" value={perfil.cedula} />
            <Field label="Dirección" value={perfil.direccion} />
            <Field label="Teléfono" value={perfil.telefono} />
          </View>
        </View>
      }
    />
  );
};

// Componente para campos individuales
const Field = ({ label, value }) => (
  <View style={{ marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#ddd', paddingBottom: 10 }}>
    <Text style={{ fontSize: 18, fontWeight: '600', color: '#555' }}>{label}</Text>
    <Text style={{ fontSize: 16, color: '#111' }}>{value}</Text>
  </View>
);

export default ProfesorPerfil;
