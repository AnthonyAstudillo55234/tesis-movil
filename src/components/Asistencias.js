import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import CurvedHeaderLayout from '../components/CurvedHeaderLayout';
import styles from '../styles/RepresentanteStyles5.js';

const Asistencias = () => {
  const [perfil, setPerfil] = useState(null);
  const [estudiantes, setEstudiantes] = useState([]);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [asistenciasData, setAsistenciasData] = useState(null);
  const [loadingEstudiantes, setLoadingEstudiantes] = useState(true);
  const [loadingAsistencias, setLoadingAsistencias] = useState(false);

  const [openEstudiantes, setOpenEstudiantes] = useState(false);
  const [itemsEstudiantes, setItemsEstudiantes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        const resPerfil = await fetch('https://escuela-descubrir.vercel.app/api/perfil', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataPerfil = await resPerfil.json();
        setPerfil(dataPerfil);

        const res = await fetch('https://escuela-descubrir.vercel.app/api/estudiantes-registrados', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const estudiantesArray = Array.isArray(data.estudiantes) ? data.estudiantes : [];
        setEstudiantes(estudiantesArray);
        setItemsEstudiantes(estudiantesArray.map(e => ({
          label: `${e.nombre} ${e.apellido}`,
          value: e.id || e._id,
        })));
      } catch (error) {
        console.error('Error al cargar estudiantes:', error);
        setEstudiantes([]);
        setItemsEstudiantes([]);
      } finally {
        setLoadingEstudiantes(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!estudianteSeleccionado) {
      setAsistenciasData(null);
      return;
    }

    const fetchAsistencias = async () => {
      setLoadingAsistencias(true);
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch(
          `https://escuela-descubrir.vercel.app/api/ver-asistencia-estudiante/${estudianteSeleccionado}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setAsistenciasData(data);
      } catch (error) {
        console.error('Error al cargar asistencias:', error);
        setAsistenciasData(null);
      } finally {
        setLoadingAsistencias(false);
      }
    };

    fetchAsistencias();
  }, [estudianteSeleccionado]);

  if (!perfil || loadingEstudiantes) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <ScrollView  
      contentContainerStyle={{ paddingBottom: 10 }} 
      keyboardShouldPersistTaps="handled"
    >
      <CurvedHeaderLayout
        userName={`${perfil.nombre} ${perfil.apellido}`}
        avatarUrl="https://cdn-icons-png.flaticon.com/512/3884/3884879.png"
        showBackButton={true}
        showViewButton={false}
        content={
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
          >
            <Text style={styles.title}>Consultar Asistencias</Text>

            <DropDownPicker
              open={openEstudiantes}
              value={estudianteSeleccionado}
              items={itemsEstudiantes}
              setOpen={setOpenEstudiantes}
              setValue={setEstudianteSeleccionado}
              setItems={setItemsEstudiantes}
              placeholder="Selecciona un Estudiante"
              zIndex={3000}
              zIndexInverse={1000}
              containerStyle={{ marginBottom: 20 }}
            />
            {loadingAsistencias ? (
              <ActivityIndicator size="large" />
            ) : (
              estudianteSeleccionado && (
                asistenciasData ? (
                  <>
                    <View style={{ maxHeight: 400 }}>
                      <ScrollView showsVerticalScrollIndicator={true}>
                        <View style={styles.infoContainer}>
                          <Text style={styles.infoText}>
                            <Text style={styles.label}>Año Lectivo: </Text>
                            {asistenciasData.anioLectivo}
                          </Text>
                          <Text style={styles.infoText}>
                            <Text style={styles.label}>Total de Faltas: </Text>
                            {asistenciasData.totalFaltas}
                          </Text>
                        </View>

                        <View style={styles.tableContainer}>
                          <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={[styles.tableCell, styles.headerCell]}>Fecha</Text>
                            <Text style={[styles.tableCell, styles.headerCell]}>Presente</Text>
                            <Text style={[styles.tableCell, styles.headerCell]}>Justificación</Text>
                          </View>

                          {asistenciasData.registrosAsistencia.length === 0 ? (
                            <View style={styles.tableRow}>
                              <Text style={styles.tableCell}>Sin registros</Text>
                            </View>
                          ) : (
                            asistenciasData.registrosAsistencia.map((registro, index) => (
                              <View key={index} style={styles.tableRow}>
                                <Text style={styles.tableCell}>{registro.fecha}</Text>
                                <Text style={styles.tableCell}>{registro.presente ? 'Sí' : 'No'}</Text>
                                <Text style={styles.tableCell}>
                                  {registro.justificacion
                                    ? registro.justificacion
                                    : registro.presente
                                      ? 'No requiere'
                                      : 'Falta sin justificación'}
                                </Text>
                              </View>
                            ))
                          )}
                        </View>
                      </ScrollView>
                    </View>
                  </>
                ) : (
                  <Text style={{ marginTop: 20 }}>No se encontraron datos de asistencia para este estudiante.</Text>
                )
              )
            )}
          </KeyboardAvoidingView>
        }
      />
    </ScrollView>
  );
};

export default Asistencias;
