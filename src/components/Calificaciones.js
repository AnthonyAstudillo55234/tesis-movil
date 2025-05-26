import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import CurvedHeaderLayout from '../components/CurvedHeaderLayout';
import styles from '../styles/RepresentanteStyles3.js';

const Calificaciones = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openEstudiante, setOpenEstudiante] = useState(false);
  const [openMateria, setOpenMateria] = useState(false);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);

  const [itemsEstudiantes, setItemsEstudiantes] = useState([]);
  const [itemsMaterias, setItemsMaterias] = useState([]);

  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        // Perfil del representante
        const resPerfil = await fetch('https://escuela-descubrir.vercel.app/api/perfil', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataPerfil = await resPerfil.json();
        setPerfil(dataPerfil);

        // Estudiantes
        const resEstudiantes = await fetch('https://escuela-descubrir.vercel.app/api/estudiantes-registrados', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await resEstudiantes.json();
        setEstudiantes(data.estudiantes || []);
        setItemsEstudiantes((data.estudiantes || []).map(e => ({
          label: `${e.nombre} ${e.apellido}`,
          value: e.id,
        })));
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchMaterias = async () => {
      if (!estudianteSeleccionado) return;
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch(`https://escuela-descubrir.vercel.app/api/materias-estudiante/${estudianteSeleccionado}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMaterias(Array.isArray(data) ? data : []);
        setItemsMaterias((Array.isArray(data) ? data : []).map(m => ({
          label: m.nombre,
          value: m.id,
        })));
      } catch (err) {
        console.error('Error al obtener materias:', err);
      }
    };
    fetchMaterias();
  }, [estudianteSeleccionado]);

  useEffect(() => {
    const fetchNotas = async () => {
      if (!materiaSeleccionada || !estudianteSeleccionado) return;
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch(
          `https://escuela-descubrir.vercel.app/api/ver-notas-estudiante/${estudianteSeleccionado}/${materiaSeleccionada}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setNotas(Array.isArray(data.evaluaciones) ? data.evaluaciones : []);
      } catch (err) {
        console.error('Error al obtener notas:', err);
        setNotas([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotas();
  }, [materiaSeleccionada, estudianteSeleccionado]);

  if (!perfil) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
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
          <Text style={styles.title}>Consultar Calificaciones</Text>

          <DropDownPicker
            open={openEstudiante}
            value={estudianteSeleccionado}
            items={itemsEstudiantes}
            setOpen={setOpenEstudiante}
            setValue={setEstudianteSeleccionado}
            setItems={setItemsEstudiantes}
            placeholder="Selecciona un Estudiante"
            zIndex={3000}
            zIndexInverse={1000}
            containerStyle={{ marginBottom: 20 }}
          />

          {estudianteSeleccionado && (
            <DropDownPicker
              open={openMateria}
              value={materiaSeleccionada}
              items={itemsMaterias}
              setOpen={setOpenMateria}
              setValue={setMateriaSeleccionada}
              setItems={setItemsMaterias}
              placeholder="Selecciona una Materia"
              zIndex={2000}
              zIndexInverse={2000}
              containerStyle={{ marginBottom: 20 }}
            />
          )}

          {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            estudianteSeleccionado && materiaSeleccionada && (
              <ScrollView>
                <View style={styles.tableContainer}>
                  <View style={[styles.tableRow, styles.tableHeader]}>
                    <Text style={[styles.tableCell, styles.headerCell]}>Nombre</Text>
                    <Text style={[styles.tableCell, styles.headerCell]}>Tipo</Text>
                    <Text style={[styles.tableCell, styles.headerCell]}>Nota</Text>
                    <Text style={[styles.tableCell, styles.headerCell]}>Fecha</Text>
                  </View>
                  {notas.length === 0 ? (
                    <View style={styles.tableRow}>
                      <Text style={styles.tableCell}>Sin calificaciones</Text>
                    </View>
                  ) : (
                    notas.map((n, i) => (
                      <View key={i} style={styles.tableRow}>
                        <Text style={styles.tableCell}>{n.descripcion}</Text>
                        <Text style={styles.tableCell}>{n.tipo}</Text>
                        <Text style={styles.tableCell}>{n.nota}</Text>
                        <Text style={styles.tableCell}>{n.fecha}</Text>
                      </View>
                    ))
                  )}
                </View>
              </ScrollView>
            )
          )}
        </KeyboardAvoidingView>
      }
    />
  );
};

export default Calificaciones;
