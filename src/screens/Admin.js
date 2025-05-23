import React, { useEffect, useState } from 'react';
import { View, Text, Alert, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import Checkbox from 'expo-checkbox';
import { styles } from '../styles/AdminStyles';

const AdminAttendanceScreen = () => {
  const [cursos, setCursos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState('');
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
      } catch (error) {
        console.error('Error al cargar cursos:', error);
      }
    };
    fetchCursos();
  }, []);

  const handleCursoChange = async (cursoId) => {
    setSelectedCurso(cursoId);
    setEstudiantes([]);
    setAsistencias({});

    if (!cursoId) return;

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`https://escuela-descubrir.vercel.app/api/cursos/${cursoId}/estudiantes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (Array.isArray(data)) {
        setEstudiantes(data);

        // Inicializar asistencias como false (ausente por defecto)
        const asistenciasIniciales = {};
        data.forEach(est => {
          asistenciasIniciales[est._id] = false;
        });
        setAsistencias(asistenciasIniciales);
      } else {
        console.warn('Respuesta inesperada de estudiantes:', data);
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
      [estudianteId]: !prev[estudianteId], // true si presente, false si ausente
    }));
  };

  const handleSubmit = async () => {
    if (!selectedCurso || Object.keys(asistencias).length === 0) {
      Alert.alert('Error', 'Selecciona un curso y registra al menos una asistencia');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Asistencias a enviar:', asistencias);
      const response = await fetch('https://escuela-descubrir.vercel.app/api/registro-asistencia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          curso: selectedCurso,
          asistencias, // todos los valores serán true (presente) o false (ausente)
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Éxito', data.message || 'Asistencias registradas');
        setAsistencias({});
        setSelectedCurso('');
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro de Asistencia</Text>

      <Picker
        selectedValue={selectedCurso}
        onValueChange={(itemValue) => handleCursoChange(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Selecciona un curso" value="" />
        {cursos.map((curso) => (
          <Picker.Item key={curso._id} label={curso.nombre} value={curso._id} />
        ))}
      </Picker>

      {estudiantes.map((estudiante) => (
        <View key={estudiante._id} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
          <Text style={{ flex: 1 }}>
            {estudiante.nombre} {estudiante.apellido}
          </Text>
          <Checkbox
            value={asistencias[estudiante._id]}
            onValueChange={() => toggleAsistencia(estudiante._id)}
          />
          <Text style={{ marginLeft: 10 }}>
            {asistencias[estudiante._id] ? 'Presente' : 'Ausente'}
          </Text>
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Registrar Asistencias</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AdminAttendanceScreen;
