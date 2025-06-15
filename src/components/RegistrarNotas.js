import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  Image,
  ActivityIndicator,
  Platform,
  ScrollView
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/RegistrarNotasStyles.js';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const tiposNotas = [
  { label: 'Deberes', value: 'deberes' },
  { label: 'Exámenes', value: 'examenes' },
  { label: 'Talleres', value: 'talleres' },
  { label: 'Pruebas', value: 'pruebas' },
];

const RegistrarNotas = () => {
  const navigation = useNavigation();
  const [cursos, setCursos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);

  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);
  const [tipoNota, setTipoNota] = useState(null);
  const [notas, setNotas] = useState({});
  const [imagen, setImagen] = useState(null);

  const [loading, setLoading] = useState(true);

  const [openCurso, setOpenCurso] = useState(false);
  const [openMateria, setOpenMateria] = useState(false);
  const [openTipo, setOpenTipo] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso denegado', 'Se necesitan permisos para acceder a la galería');
        }
      }
    })();
  }, []);

  const getHeaders = async () => {
    const token = await AsyncStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchCursos = async () => {
    try {
      const headers = await getHeaders();
      const res = await fetch('https://escuela-descubrir.vercel.app/api/profesor/cursos', {
        headers,
      });
      const data = await res.json();
      console.log('Cursos recibidos del backend:', data.cursosAsociados);
      if (Array.isArray(data.cursosAsociados)) {
        const formateado = data.cursosAsociados.map((c) => ({ label: c.nombre, value: c.id }));
        setCursos(formateado);
      } else {
        Alert.alert('Error', 'Formato de cursos inesperado');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los cursos');
    }
  };

  const fetchMaterias = async (cursoId) => {
    try {
      const headers = await getHeaders();
      const res = await fetch(`https://escuela-descubrir.vercel.app/api/profesor/${cursoId}/materias`, {
        headers,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      if (Array.isArray(data.materias)) {
        const formateado = data.materias.map((m) => ({ label: m.nombre, value: m.id }));
        setMaterias(formateado);
      } else {
        throw new Error('Formato de materias inesperado');
      }
    } catch (error) {
      Alert.alert('Error', `No se pudieron cargar las materias: ${error.message}`);
      setMaterias([]);
    }
  };

  const fetchEstudiantes = async (cursoId) => {
    try {
      const headers = await getHeaders();
      const res = await fetch(`https://escuela-descubrir.vercel.app/api/estudiantes/${cursoId}`, {
        headers,
      });
      const data = await res.json();
      const lista = Array.isArray(data) ? data : data.estudiantes;
      if (Array.isArray(lista)) {
        setEstudiantes(lista);
      } else {
        throw new Error('Formato inesperado de datos de estudiantes');
      }
    } catch (error) {
      Alert.alert('Error', `No se pudieron cargar los estudiantes: ${error.message}`);
      setEstudiantes([]);
    }
  };

  const seleccionarImagen = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImagen(result.assets[0].uri);
    }
  };

  const subirEvidencia = async () => {
    if (!imagen || !tipoNota) {
      Alert.alert('Error', 'Debes seleccionar un tipo de nota y subir una imagen');
      return false;
    }

    if (!cursoSeleccionado || !materiaSeleccionada) {
      Alert.alert('Error', 'Debes seleccionar curso y materia antes de subir la evidencia');
      return false;
    }

    try {
      const headersToken = await getHeaders();
      const formData = new FormData();
      formData.append('imagen', {
        uri: imagen,
        name: 'evidencia.jpg',
        type: 'image/jpeg',
      });
      formData.append('tipo', tipoNota ? tipoNota.toString() : '');

      const url = `https://escuela-descubrir.vercel.app/api/subir-evidencia/${materiaSeleccionada}/${cursoSeleccionado}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          ...headersToken,
          // NO agregar 'Content-Type' aquí
        },
        body: formData,
      });

      const textResponse = await res.text();
      console.log('Respuesta raw del servidor:', textResponse);

      if (!res.ok) {
        let errorMessage = textResponse;
        try {
          const jsonError = JSON.parse(textResponse);
          errorMessage = jsonError.error || jsonError.message || textResponse;
        } catch {
          // no pudo parsear JSON, queda el texto tal cual
        }
        Alert.alert('Error', `No se pudo subir la imagen: ${errorMessage}`);
        return false;
      }

      console.log('Evidencia subida con éxito');
      return true;
    } catch (error) {
      console.error('Excepción en subirEvidencia:', error);
      Alert.alert('Error', 'Error inesperado al subir la imagen');
      return false;
    }
  };

  const registrarNotas = async () => {
    if (!imagen) {
      Alert.alert('Error', 'Debes subir una imagen antes de registrar notas');
      return;
    }
    if (!tipoNota) {
      Alert.alert('Error', 'El tipo de evaluación es obligatorio');
      return;
    }
    if (!cursoSeleccionado || !materiaSeleccionada) {
      Alert.alert('Error', 'Debes seleccionar curso y materia');
      return;
    }

    const subida = await subirEvidencia();
    if (!subida) {
      Alert.alert('Error', 'No se pudo subir la imagen');
      return;
    }

    const headers = await getHeaders();
    const notasPayload = {};
    estudiantes.forEach((est) => {
      let notaStr = notas[est._id];
      if (notaStr !== undefined && notaStr !== '') {
        notaStr = notaStr.replace(',', '.');
        const notaNum = parseFloat(notaStr);
        if (!isNaN(notaNum) && notaNum >= 1 && notaNum <= 10) {
          notasPayload[est._id] = notaNum;
        }
      }
    });

    console.log('Datos a enviar:', {
      tipo: tipoNota.toLowerCase(),
      notas: notasPayload,
      cursoId: cursoSeleccionado,
    });

    try {
      const res = await fetch(
        `https://escuela-descubrir.vercel.app/api/registro-nota/${materiaSeleccionada}`,
        {
          method: 'POST',
          headers: {
            ...headers,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tipo: tipoNota.toLowerCase(),
            notas: notasPayload,
            cursoId: cursoSeleccionado,
          }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        Alert.alert('Error', `No se pudieron registrar las notas: ${text}`);
        return;
      }

      const data = await res.json();
      console.log('Respuesta exitosa del servidor:', data);
      Alert.alert('Éxito', data.message || 'Notas registradas correctamente');
    } catch (error) {
      Alert.alert('Error', 'Hubo un error al registrar las notas');
    }
  };

  useEffect(() => {
    fetchCursos().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (cursoSeleccionado) {
      fetchMaterias(cursoSeleccionado);
    }
    setMateriaSeleccionada(null);
    setTipoNota(null);
    setEstudiantes([]);
    setNotas({});
    setImagen(null);
  }, [cursoSeleccionado]);

  useEffect(() => {
    if (materiaSeleccionada && cursoSeleccionado && tipoNota) {
      fetchEstudiantes(cursoSeleccionado);
    }
    setEstudiantes([]);
    setNotas({});
    setImagen(null);
  }, [materiaSeleccionada, tipoNota]);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;

  return (
    <ScrollView 
      style={styles.container} 
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
        <Text style={styles.title}>Registrar Nota</Text>

        <DropDownPicker
          placeholder="Selecciona un curso"
          items={cursos}
          open={openCurso}
          value={cursoSeleccionado}
          setValue={(value) => {
            console.log('Curso seleccionado en dropdown:', value);
            setCursoSeleccionado(value);
          }}
          setItems={setCursos}
          setOpen={setOpenCurso}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          dropDownMaxHeight={150}
          zIndex={3000}
        />

        {cursoSeleccionado && (
          <DropDownPicker
            placeholder="Selecciona una materia"
            items={materias}
            open={openMateria}
            value={materiaSeleccionada}
            setValue={setMateriaSeleccionada}
            setItems={setMaterias}
            setOpen={setOpenMateria}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            dropDownMaxHeight={150}
            zIndex={2000}
          />
        )}

        {materiaSeleccionada && (
          <DropDownPicker
            placeholder="Selecciona el tipo de nota"
            items={tiposNotas}
            open={openTipo}
            value={tipoNota}
            setValue={setTipoNota}
            setItems={() => {}}
            setOpen={setOpenTipo}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            dropDownMaxHeight={150}
            zIndex={1000}
          />
        )}

        {estudiantes.length > 0 && tipoNota && (
          <>
            <TouchableOpacity style={styles.imageButton} onPress={seleccionarImagen}>
              <Text style={styles.imageButtonText}>Subir Imagen</Text>
            </TouchableOpacity>

            {imagen && <Image source={{ uri: imagen }} style={styles.imagePreview} />}

            <Text style={styles.subtitle}>Lista de Estudiantes</Text>

            <FlatList
              style={{ maxHeight: 400, marginTop: 20 }}
              data={estudiantes}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  <Text style={styles.studentName}>
                    {item.nombre} {item.apellido}
                  </Text>
                  <TextInput
                    style={styles.inputNota}
                    keyboardType="numeric"
                    maxLength={5}
                    placeholder="Nota"
                    value={notas[item._id] ? String(notas[item._id]) : ''}
                    onChangeText={(text) => {
                      let valor = text.replace(',', '.');
                      const regex = /^\d{0,2}(\.\d{0,2})?$/;

                      if (regex.test(valor)) {
                        const numero = parseFloat(valor);
                        if (valor === '' || (numero >= 1 && numero <= 10)) {
                          setNotas((prev) => ({ ...prev, [item._id]: valor }));
                        }
                      }
                    }}
                  />
                </View>
              )}
            />

            <TouchableOpacity style={styles.registerButton} onPress={registrarNotas}>
              <Text style={styles.registerButtonText}>Registrar Nota</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default RegistrarNotas;
