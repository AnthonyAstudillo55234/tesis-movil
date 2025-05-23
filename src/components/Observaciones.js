import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/RepresentanteStyles4.js';

const ObservacionesEstudiante = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [observaciones, setObservaciones] = useState([]);
  const [loadingEstudiantes, setLoadingEstudiantes] = useState(true);
  const [loadingObservaciones, setLoadingObservaciones] = useState(false);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch('https://escuela-descubrir.vercel.app/api/estudiantes-registrados', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const lista = data.estudiantes || [];
        setEstudiantes(lista);
        setItems(
          lista.map((e) => ({
            label: `${e.nombre} ${e.apellido}`,
            value: e.id,
          }))
        );
      } catch (error) {
        console.error('Error cargando estudiantes:', error);
      } finally {
        setLoadingEstudiantes(false);
      }
    };

    fetchEstudiantes();
  }, []);

  useEffect(() => {
    const fetchObservaciones = async () => {
      if (!selectedEstudiante) return;

      setLoadingObservaciones(true);
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch(`https://escuela-descubrir.vercel.app/api/ver-observaciones-estudiante/${selectedEstudiante}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setObservaciones(data.observaciones || []);
      } catch (error) {
        console.error('Error cargando observaciones:', error);
        setObservaciones([]);
      } finally {
        setLoadingObservaciones(false);
      }
    };

    fetchObservaciones();
  }, [selectedEstudiante]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consultar Observaciones</Text>

      {loadingEstudiantes ? (
        <ActivityIndicator size="large" />
      ) : (
        <DropDownPicker
          open={open}
          value={selectedEstudiante}
          items={items}
          setOpen={setOpen}
          setValue={setSelectedEstudiante}
          setItems={setItems}
          placeholder="Selecciona un Estudiante"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />
      )}

      {selectedEstudiante && (
        loadingObservaciones ? (
          <ActivityIndicator size="large" />
        ) : (
          <ScrollView>
            <View style={styles.tableContainer}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, { flex: 2, fontWeight: 'bold' }]}>Observación</Text>
                <Text style={[styles.tableCell, { flex: 2, fontWeight: 'bold' }]}>Profesor</Text>
                <Text style={[styles.tableCell, { flex: 1, fontWeight: 'bold' }]}>Fecha</Text>
              </View>

              {observaciones.length === 0 ? (
                <View style={styles.tableRow}>
                  <Text style={styles.noDataText}>No hay observaciones registradas.</Text>
                </View>
              ) : (
                observaciones.map((obs, idx) => (
                  <View
                    key={idx}
                    style={styles.tableRow}
                  >
                    <Text style={[styles.tableCell, { flex: 2 }]}>{obs.observacion}</Text>
                    <Text style={[styles.tableCell, { flex: 2 }]}>
                      {obs.profesor?.nombre} {obs.profesor?.apellido}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>{obs.fecha}</Text>
                  </View>
                ))
              )}
            </View>
          </ScrollView>
        )
      )}
    </View>
  );
};

export default ObservacionesEstudiante;
