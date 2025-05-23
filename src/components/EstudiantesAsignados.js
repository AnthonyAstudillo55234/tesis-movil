import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/RepresentanteStyles2'; 

const EstudiantesAsignados = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch('https://escuela-descubrir.vercel.app/api/estudiantes-registrados', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        console.log('Data recibida:', data);
        setEstudiantes(Array.isArray(data.estudiantes) ? data.estudiantes : []);
      } catch (error) {
        console.error('Error fetching estudiantes:', error);
        setEstudiantes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEstudiantes();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.table}>
        <View style={[styles.row, styles.header]}>
          <Text style={styles.headerText}>Nombre</Text>
          <Text style={styles.headerText}>Apellido</Text>
          <Text style={styles.headerText}>Curso</Text>
        </View>

        {estudiantes.map((e) => (
          <View key={e.id} style={styles.row}>
            <Text style={styles.cellText}>{e.nombre}</Text>
            <Text style={styles.cellText}>{e.apellido}</Text>
            <Text style={styles.cellText}>{e.curso || 'Sin curso'}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default EstudiantesAsignados;