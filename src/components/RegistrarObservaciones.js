import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/ObservacionesStyles.js';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ObservacionesScreen = () => {
  const navigation = useNavigation();
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [openCurso, setOpenCurso] = useState(false);

  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [observacion, setObservacion] = useState('');
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);

  // Fetch con token
  const fetchConToken = async (url) => {
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  };

  useEffect(() => {
    const cargarCursos = async () => {
      try {
        const data = await fetchConToken('https://escuela-descubrir.vercel.app/api/profesor/cursos');
        const cursosItems = (data.cursosAsociados || []).map(c => ({ label: c.nombre, value: c.id }));
        setCursos(cursosItems);
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar los cursos');
        console.log(error);
      }
    };
    cargarCursos();
  }, []);

  useEffect(() => {
    const cargarEstudiantes = async () => {
      if (!cursoSeleccionado) {
        setEstudiantes([]);
        return;
      }
      try {
        setLoading(true);
        const data = await fetchConToken(`https://escuela-descubrir.vercel.app/api/estudiantes/${cursoSeleccionado}`);
        setEstudiantes(data.estudiantes || []);
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar los estudiantes');
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    cargarEstudiantes();
  }, [cursoSeleccionado]);

  const abrirModal = (estudiante) => {
    setEstudianteSeleccionado(estudiante);
    setObservacion('');
    setModalVisible(true);
  };

  const guardarObservacion = async () => {
    if (!observacion.trim()) {
      Alert.alert('Error', 'La observación no puede estar vacía');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch('https://escuela-descubrir.vercel.app/api/observacion-estudiante', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          idEstudiante: estudianteSeleccionado._id,
          cedula: estudianteSeleccionado.cedula, // 👈 esto es lo que faltaba
          observacion: observacion.trim(),
        }),
      });
  
      if (!res.ok) {
        const errorBody = await res.text();
        console.log('Error response:', res.status, errorBody);
        throw new Error('Error guardando la observación');
      }
  
      Alert.alert('Éxito', 'Observación registrada correctamente');
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar la observación');
      console.log(error);
    }
  };
  

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.name}>{item.nombre} {item.apellido}</Text>
      <TouchableOpacity style={styles.button} onPress={() => abrirModal(item)}>
        <Text style={styles.buttonText}>Registrar Observación</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView  
      contentContainerStyle={{ paddingBottom: 10 }} 
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
          onPress={() => navigation.navigate('Profesor')}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={{ marginLeft: 5, fontSize: 16 }}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Registrar Observaciones</Text>

        <DropDownPicker
          placeholder="Selecciona un curso"
          open={openCurso}
          setOpen={setOpenCurso}
          value={cursoSeleccionado}
          setValue={setCursoSeleccionado}
          items={cursos}
          style={styles.dropdown}
          dropDownMaxHeight={150} // 👈 límite de altura con scroll
          zIndex={3000}
        />

        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            style={{ maxHeight: 400, marginTop: 10 }} // 👈 altura máxima con scroll
            data={estudiantes}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            ListEmptyComponent={() => (
              <Text style={{ marginTop: 20, textAlign: 'center' }}>
                No hay estudiantes para este curso
              </Text>
            )}
          />
        )}
        
        {/* Modal para ingresar observación */}
        <Modal
              visible={modalVisible}
              animationType="slide"
              transparent={true}
              onRequestClose={() => setModalVisible(false)}
              >
              <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>
                      Observación para {estudianteSeleccionado?.nombre} {estudianteSeleccionado?.apellido}
                  </Text>

                  {/* Campo de cédula (solo lectura) */}
                  <Text style={styles.label}>Cédula:</Text>
                  <TextInput
                      style={[styles.textInput, { backgroundColor: '#eee' }]}
                      value={estudianteSeleccionado?.cedula}
                      editable={false}
                  />

                  {/* Campo de observación */}
                  <Text style={styles.label}>Observación:</Text>
                  <TextInput
                      style={styles.textInput}
                      multiline
                      placeholder="Escribe la observación aquí"
                      value={observacion}
                      onChangeText={setObservacion}
                  />

                  {/* Botones */}
                  <View style={styles.modalButtons}>
                      <TouchableOpacity style={styles.modalButtonCancel} onPress={() => setModalVisible(false)}>
                      <Text style={styles.buttonText}>Cancelar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.modalButtonSave} onPress={guardarObservacion}>
                      <Text style={styles.buttonText}>Guardar</Text>
                      </TouchableOpacity>
                  </View>
                  </View>
              </View>
          </Modal>
      </View>
    </ScrollView>
  );
};

export default ObservacionesScreen;
