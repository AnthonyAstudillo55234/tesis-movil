import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import Checkbox from 'expo-checkbox';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { styles } from '../styles/AdminStyles';

const AdminAttendanceScreen = () => {
  const navigation = useNavigation();
  const [cursos, setCursos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [openCursos, setOpenCursos] = useState(false);
  const [itemsCursos, setItemsCursos] = useState([]);
  const [asistencias, setAsistencias] = useState({});

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch('https://escuela-descubrir.vercel.app/api/cursos', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setCursos(data);

        const dropdownItems = data.map(curso => ({
          label: curso.nombre,
          value: curso._id,
        }));
        setItemsCursos(dropdownItems);
      } catch (error) {
        console.error('Error al cargar cursos:', error);
      }
    };
    fetchCursos();
  }, []);

  useEffect(() => {
    if (selectedCurso) {
      fetchEstudiantes(selectedCurso);
    } else {
      setEstudiantes([]);
      setAsistencias({});
    }
  }, [selectedCurso]);

  const fetchEstudiantes = async (cursoId) => {
    setEstudiantes([]);
    setAsistencias({});
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(
        `https://escuela-descubrir.vercel.app/api/cursos/${cursoId}/estudiantes`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();

      if (Array.isArray(data)) {
        setEstudiantes(data);
        const asistenciasIniciales = {};
        data.forEach(est => {
          asistenciasIniciales[est._id] = false;
        });
        setAsistencias(asistenciasIniciales);
      } else {
        Alert.alert('Error', data.error || 'No se pudieron cargar los estudiantes');
      }
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
      Alert.alert('Error', 'No se pudieron cargar los estudiantes');
    }
  };

  const toggleAsistencia = (estudianteId) => {
    setAsistencias(prev => ({
      ...prev,
      [estudianteId]: !prev[estudianteId],
    }));
  };

  const handleSubmit = async () => {
    if (!selectedCurso || Object.keys(asistencias).length === 0) {
      Alert.alert('Error', 'Selecciona un curso y registra al menos una asistencia');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('https://escuela-descubrir.vercel.app/api/registro-asistencia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          curso: selectedCurso,
          asistencias,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Éxito', data.message || 'Asistencias registradas');
        setAsistencias({});
        setSelectedCurso(null);
        setEstudiantes([]);
      } else {
        Alert.alert('Error', data.message || 'Asistencia ya registrada');
      }
    } catch (error) {
      console.error('Error al registrar asistencia:', error);
      Alert.alert('Error', 'Error de conexión con el servidor');
    }
  };

  return (
    <ScrollView  
      contentContainerStyle={{ paddingBottom: 10 }} 
      keyboardShouldPersistTaps="handled"
    >
      <KeyboardAvoidingView
          style={{ flex: 1, padding: 16, backgroundColor: '#fff', marginTop: 25}} // 👈 Fondo blanco
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'android' ? 100 : 0}
        >
          <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
            onPress={() => navigation.navigate('Login')}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
            <Text style={{ marginLeft: 5, fontSize: 16 }}>Volver</Text>
          </TouchableOpacity>
            <Text style={styles.title}>Registro de Asistencia</Text>

            <DropDownPicker
              open={openCursos}
              value={selectedCurso}
              items={itemsCursos}
              setOpen={setOpenCursos}
              setValue={setSelectedCurso}
              setItems={setItemsCursos}
              placeholder="Selecciona un curso"
              style={{
                borderColor: '#0a0a0a',
                borderRadius: 8,
                marginVertical: 10,
                paddingHorizontal: 10,
                backgroundColor: '#fff',
              }}
              dropDownContainerStyle={{
                borderColor: '#0a0a0a',
                borderRadius: 8,
                backgroundColor: '#fff',
              }}
              dropDownMaxHeight={150} // 👈 Altura máxima con scroll
            />

            <ScrollView
              style={{ flex: 1, marginTop: 20, maxHeight: 400 }} // 👈 Scroll con altura limitada
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
            >
              {estudiantes.length > 0 && (
                <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      backgroundColor: '#28a745',
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                    }}
                  >
                    <Text style={{ flex: 2, color: 'white', fontWeight: 'bold' }}>Estudiante</Text>
                    <Text style={{ flex: 1, color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                      Asistencia
                    </Text>
                  </View>

                  {estudiantes.map((estudiante) => (
                    <View
                      key={estudiante._id}
                      style={{
                        flexDirection: 'row',
                        paddingVertical: 12,
                        paddingHorizontal: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: '#ddd',
                        backgroundColor: asistencias[estudiante._id] ? '#e6f0ff' : 'white',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ flex: 2 }}>
                        {estudiante.nombre} {estudiante.apellido}
                      </Text>
                      <View
                        style={{
                          flex: 1,
                          alignItems: 'center',
                          flexDirection: 'row',
                          justifyContent: 'center',
                        }}
                      >
                        <Checkbox
                          value={asistencias[estudiante._id]}
                          onValueChange={() => toggleAsistencia(estudiante._id)}
                          color={asistencias[estudiante._id] ? '#007AFF' : undefined}
                        />
                        <Text style={{ marginLeft: 8 }}>
                          {asistencias[estudiante._id] ? 'Presente' : 'Ausente'}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Registrar Asistencias</Text>
            </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default AdminAttendanceScreen;
