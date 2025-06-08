import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificacionesRepresentante = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarNotificaciones = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Error', 'No estás autenticado');
        setLoading(false);
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const estudiantesRes = await axios.get('https://escuela-descubrir.vercel.app/api/estudiantes-registrados', config);
      const estudiantes = estudiantesRes.data.estudiantes || [];
      console.log('Estudiantes:', estudiantes);

      let mensajesTotales = [];

      for (const estudiante of estudiantes) {
        const estudianteId = estudiante._id || estudiante.id;

        const materiasRes = await axios.get(`https://escuela-descubrir.vercel.app/api/materias-estudiante/${estudianteId}`, config);
        const materias = materiasRes.data || [];
        console.log(`Materias de ${estudiante.nombre}:`, materias);

        for (const materia of materias) {
          try {
            const idMateria = materia._id || materia.id;
            if (!idMateria) continue;

            console.log(`Consultando notas, asistencias y observaciones para estudianteId=${estudianteId} y materiaId=${idMateria}`);

            const [notasRes, asistenciasRes, observacionesRes] = await Promise.all([
              axios.get(`https://escuela-descubrir.vercel.app/api/ver-notas-estudiante/${estudianteId}/${idMateria}`, config)
                .catch(error => {
                  if (error.response && error.response.status === 404) {
                    // No hay notas para esta materia, devolvemos evaluaciones vacías
                    return { data: { evaluaciones: [] } };
                  }
                  throw error;
                }),
              axios.get(`https://escuela-descubrir.vercel.app/api/ver-asistencia-estudiante/${estudianteId}`, config),
              axios.get(`https://escuela-descubrir.vercel.app/api/ver-observaciones-estudiante/${estudianteId}`, config),
            ]);

            const nuevas = {
              notas: notasRes.data?.evaluaciones?.length || 0,
              asistencias: asistenciasRes.data?.registrosAsistencia?.length || 0,
              observaciones: observacionesRes.data?.observaciones?.length || 0,
            };

            const key = `notificaciones_${estudianteId}_${idMateria}`;
            const almacenadasStr = await AsyncStorage.getItem(key);
            const almacenadas = almacenadasStr ? JSON.parse(almacenadasStr) : { notas: 0, asistencias: 0, observaciones: 0 };

            if (nuevas.notas > almacenadas.notas) {
              const diff = nuevas.notas - almacenadas.notas;
              mensajesTotales.push(`${estudiante.nombre} tiene ${diff} nueva(s) nota(s) en ${materia.nombre}.`);
            }
            if (nuevas.asistencias > almacenadas.asistencias) {
              const diff = nuevas.asistencias - almacenadas.asistencias;
              mensajesTotales.push(`${estudiante.nombre} tiene ${diff} nueva(s) asistencia(s) registrada(s).`);
            }
            if (nuevas.observaciones > almacenadas.observaciones) {
              const diff = nuevas.observaciones - almacenadas.observaciones;
              mensajesTotales.push(`${estudiante.nombre} tiene ${diff} nueva(s) observación(es).`);
            }

            await AsyncStorage.setItem(key, JSON.stringify(nuevas));

          } catch (error) {
            if (error.response && error.response.status === 404) {
              // No hacer nada, error esperado
            } else {
              console.error(`Error cargando datos para materia ${materia.nombre}:`, error.message);
            }
          }
        }
      }

      setNotificaciones(mensajesTotales);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
      Alert.alert('Error', 'No se pudieron cargar las notificaciones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarNotificaciones();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🔔 Notificaciones</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : notificaciones.length === 0 ? (
        <Text style={styles.noData}>No hay nuevas notificaciones.</Text>
      ) : (
        notificaciones.map((msg, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.message}>{msg}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default NotificacionesRepresentante;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#e6f0ff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  message: {
    fontSize: 16,
  },
  noData: {
    fontSize: 16,
    color: '#555',
  },
});
