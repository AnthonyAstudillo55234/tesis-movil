import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/ActualizarNotasStyles.js';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ActualizarNotaScreen = () => {
  const navigation = useNavigation();
  const [cursos, setCursos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [tipos] = useState([
    { label: 'Deberes', value: 'deberes' },
    { label: 'Exámenes', value: 'examenes' },
    { label: 'Talleres', value: 'talleres' },
    { label: 'Pruebas', value: 'pruebas' },
  ]);
  const [subTipos, setSubTipos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [notas, setNotas] = useState({});
  const [loading, setLoading] = useState(false);

  const [curso, setCurso] = useState(null);
  const [materia, setMateria] = useState(null);
  const [tipo, setTipo] = useState(null);
  const [subTipo, setSubTipo] = useState(null);

  const [openCurso, setOpenCurso] = useState(false);
  const [openMateria, setOpenMateria] = useState(false);
  const [openTipo, setOpenTipo] = useState(false);
  const [openSubTipo, setOpenSubTipo] = useState(false);

  // Función para hacer fetch con token en headers
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
    const fetchCursos = async () => {
      try {
        const data = await fetchConToken(
          'https://escuela-descubrir.vercel.app/api/profesor/cursos'
        );
        console.log('Cursos recibidos:', data);
        const items = (data.cursosAsociados || []).map((c) => ({
          label: c.nombre,
          value: c.id,
        }));
        setCursos(items);
      } catch (error) {
        console.log('Error cargando cursos:', error);
      }
    };
    fetchCursos();
  }, []);

  useEffect(() => {
    if (curso) {
      const fetchMaterias = async () => {
        try {
          const data = await fetchConToken(
            `https://escuela-descubrir.vercel.app/api/profesor/${curso}/materias`
          );
          console.log('Materias recibidas:', data);
          const items = (data.materias || []).map((m) => ({
            label: m.nombre,
            value: m.id,
          }));
          setMaterias(items);
        } catch (error) {
          console.log('Error cargando materias:', error);
        }
      };
      fetchMaterias();
    } else {
      setMaterias([]);
      setMateria(null);
    }
  }, [curso]);

  useEffect(() => {
    if (materia && tipo) {
      const fetchSubTipos = async () => {
        try {
          const data = await fetchConToken(
            `https://escuela-descubrir.vercel.app/api/tipos/${materia}/${tipo}`
          );
          console.log('SubTipos recibidos:', data);
          const items = (data.descripciones || []).map((d) => ({
            label: d,
            value: d,
          }));
          setSubTipos(items);
        } catch (error) {
          console.error('Error cargando subtipos:', error);
          setSubTipos([]);
          setSubTipo(null);
        }
      };
      fetchSubTipos();
    } else {
      setSubTipos([]);
      setSubTipo(null);
    }
  }, [materia, tipo]);

  useEffect(() => {
    if (curso && materia && tipo && subTipo) {
      const fetchEstudiantes = async () => {
        try {
          setLoading(true);
          const data = await fetchConToken(
            `https://escuela-descubrir.vercel.app/api/estudiantes/${curso}`
          );
          console.log('Estudiantes recibidos:', data);
          const listaEstudiantes = data.estudiantes || [];
          setEstudiantes(listaEstudiantes);

          // Inicializar notas vacías o mantener actuales si ya hay
          const notasIniciales = {};
          listaEstudiantes.forEach((e) => {
            notasIniciales[e._id] = notas[e._id] || '';
          });
          setNotas(notasIniciales);
        } catch (error) {
          console.log('Error cargando estudiantes:', error);
          setEstudiantes([]);
          setNotas({});
        } finally {
          setLoading(false);
        }
      };
      fetchEstudiantes();
    } else {
      setEstudiantes([]);
      setNotas({});
    }
  }, [curso, materia, tipo, subTipo]);

  const handleChangeNota = (id, value) => {
    // Reemplaza coma por punto
    const nuevoValor = value.replace(',', '.');

    // Permitir solo números del 1 al 10, con hasta 2 decimales
    if (/^(10(\.0{0,2})?|[1-9](\.\d{0,2})?)?$/.test(nuevoValor)) {
      setNotas((prev) => ({ ...prev, [id]: nuevoValor }));
    }
  };

  const actualizarNotas = async () => {
    if (!materia || !tipo || !subTipo) {
      Alert.alert('Error', 'Debes seleccionar materia, tipo y sub-tipo.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');

      // Construir el objeto data con la estructura esperada:
      const data = {
        tipo: tipo,
        descripcion: subTipo,
        notas: {},
      };

      estudiantes.forEach((e) => {
        data.notas[e._id] = parseFloat(notas[e._id]) || 0;
      });

      console.log('Datos a enviar:', JSON.stringify(data, null, 2));

      const res = await fetch(
        `https://escuela-descubrir.vercel.app/api/actualizar-nota/${materia}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        const errorBody = await res.text();
        console.log('Error response:', res.status, errorBody);
        throw new Error('Error en el servidor');
      }

      Alert.alert('Éxito', 'Las notas se actualizaron correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudieron actualizar las notas');
      console.log('Error actualizando notas:', error);
    }
  };

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
        <Text style={styles.title}>Actualizar Notas</Text>

        <DropDownPicker
          placeholder="Selecciona un curso"
          items={cursos}
          open={openCurso}
          setOpen={setOpenCurso}
          value={curso}
          setValue={setCurso}
          style={styles.dropdown}
          dropDownMaxHeight={150}
          zIndex={4000}
        />

        <DropDownPicker
          placeholder="Selecciona una materia"
          items={materias}
          open={openMateria}
          setOpen={setOpenMateria}
          value={materia}
          setValue={setMateria}
          style={styles.dropdown}
          dropDownMaxHeight={150}
          zIndex={3000}
        />

        <DropDownPicker
          placeholder="Selecciona tipo de nota"
          items={tipos}
          open={openTipo}
          setOpen={setOpenTipo}
          value={tipo}
          setValue={setTipo}
          style={styles.dropdown}
          dropDownMaxHeight={150}
          zIndex={2000}
        />

        {tipo && (
          <DropDownPicker
            placeholder="Selecciona sub-tipo"
            items={subTipos}
            open={openSubTipo}
            setOpen={setOpenSubTipo}
            value={subTipo}
            setValue={setSubTipo}
            style={styles.dropdown}
            dropDownMaxHeight={150}
            zIndex={1000}
          />
        )}

        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        ) : (
          subTipo && (
            <FlatList
              style={{ maxHeight: 400, marginTop: 20 }}
              data={estudiantes}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  <Text style={styles.name}>
                    {item.nombre} {item.apellido}
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nota"
                    maxLength={5}
                    keyboardType="decimal-pad"
                    value={notas[item._id]}
                    onChangeText={(value) => handleChangeNota(item._id, value)}
                  />
                </View>
              )}
            />
          )
        )}

        <TouchableOpacity style={styles.button} onPress={actualizarNotas}>
          <Text style={styles.buttonText}>Actualizar Notas</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ActualizarNotaScreen;