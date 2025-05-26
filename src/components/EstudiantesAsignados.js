import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CurvedHeaderLayout from '../components/CurvedHeaderLayout';
import styles from '../styles/RepresentanteStyles2';

const EstudiantesAsignados = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        // Obtener estudiantes
        const resEstudiantes = await fetch('https://escuela-descubrir.vercel.app/api/estudiantes-registrados', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dataEstudiantes = await resEstudiantes.json();
        setEstudiantes(Array.isArray(dataEstudiantes.estudiantes) ? dataEstudiantes.estudiantes : []);

        // Obtener perfil para mostrar en el encabezado
        const resPerfil = await fetch('https://escuela-descubrir.vercel.app/api/perfil', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dataPerfil = await resPerfil.json();
        setPerfil(dataPerfil);
      } catch (error) {
        console.error('Error:', error);
        setEstudiantes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !perfil) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <CurvedHeaderLayout
      userName={`${perfil.nombre} ${perfil.apellido}`}
      avatarUrl="https://cdn-icons-png.flaticon.com/512/3884/3884879.png"
      showBackButton={true}
      showViewButton={false}
      content={
        <View style={styles.container}>
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
        </View>
      }
    />
  );
};

export default EstudiantesAsignados;
