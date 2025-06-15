import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CurvedHeaderLayout from '../components/CurvedHeaderLayout';
import styles from '../styles/RepresentanteStyles3.js';
import { FlatList } from 'react-native';

const ObservacionesEstudiante = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [observaciones, setObservaciones] = useState([]);
  const [loadingEstudiantes, setLoadingEstudiantes] = useState(true);
  const [loadingObservaciones, setLoadingObservaciones] = useState(false);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    const fetchEstudiantes = async () => {
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
        const res = await fetch(
          `https://escuela-descubrir.vercel.app/api/ver-observaciones-estudiante/${selectedEstudiante}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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

  if (!perfil) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

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
                <View style={{ maxHeight: 400, marginTop: 20 }}>
                  <FlatList
                    data={observaciones}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, { flex: 2 }]}>{item.observacion}</Text>
                        <Text style={[styles.tableCell, { flex: 2 }]}>{item.profesor?.nombre} {item.profesor?.apellido}</Text>
                        <Text style={[styles.tableCell, { flex: 1 }]}>{item.fecha}</Text>
                      </View>
                    )}
                    ListHeaderComponent={() => (
                      <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCell, { flex: 2, fontWeight: 'bold' }]}>Observación</Text>
                        <Text style={[styles.tableCell, { flex: 2, fontWeight: 'bold' }]}>Profesor</Text>
                        <Text style={[styles.tableCell, { flex: 1, fontWeight: 'bold' }]}>Fecha</Text>
                      </View>
                    )}
                    ListEmptyComponent={() => (
                      <View style={styles.tableRow}>
                        <Text style={styles.noDataText}>No hay observaciones registradas.</Text>
                      </View>
                    )}
                    showsVerticalScrollIndicator={true}
                  />
                </View>
              )
            )}
          </KeyboardAvoidingView>
        }
      />
    </ScrollView>
  );
};

export default ObservacionesEstudiante;