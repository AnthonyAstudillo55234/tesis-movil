import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/RepresentanteStyles'; // Puedes mantener estilos generales

const RepresentantePerfil = () => {
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
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f0f2f5' }}>
      <View style={{
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
      }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#333' }}>
          Mi Perfil
        </Text>

        {/* Nombre y Apellido */}
        <View style={{ marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#ddd', paddingBottom: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#555' }}>Nombre Completo</Text>
          <Text style={{ fontSize: 16, color: '#111' }}>{perfil.nombre} {perfil.apellido}</Text>
        </View>

        {/* Email */}
        <View style={{ marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#ddd', paddingBottom: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#555' }}>Email</Text>
          <Text style={{ fontSize: 16, color: '#111' }}>{perfil.email}</Text>
        </View>

        {/* Cédula */}
        <View style={{ marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#ddd', paddingBottom: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#555' }}>Cédula</Text>
          <Text style={{ fontSize: 16, color: '#111' }}>{perfil.cedula}</Text>
        </View>

        {/* Dirección */}
        <View style={{ marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#ddd', paddingBottom: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#555' }}>Dirección</Text>
          <Text style={{ fontSize: 16, color: '#111' }}>{perfil.direccion}</Text>
        </View>

        {/* Teléfono */}
        <View>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#555' }}>Teléfono</Text>
          <Text style={{ fontSize: 16, color: '#111' }}>{perfil.telefono}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default RepresentantePerfil;
