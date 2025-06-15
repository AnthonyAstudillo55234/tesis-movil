import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/ActDatosStyles.js';
import CurvedHeaderLayout from './CurvedHeaderLayout.js';

const ActualizarDatos = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch('https://escuela-descubrir.vercel.app/api/perfil', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        setNombre(data.nombre || '');
        setApellido(data.apellido || '');
        setEmail(data.email || '');
        setTelefono(data.telefono || '');
        setDireccion(data.direccion || '');
        setPerfil(data);
      } catch (error) {
        console.error('Error al cargar perfil:', error);
        Alert.alert('Error', 'No se pudo cargar la información del perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, []);

  const handleActualizar = async () => {
    if (!nombre.trim() || !apellido.trim() || !email.trim() || !telefono.trim() || !direccion.trim()) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    setUpdating(true);

    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch('https://escuela-descubrir.vercel.app/api/cambiar-datos', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nombre, apellido, email, telefono, direccion }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Éxito', data.message || 'Datos actualizados correctamente');
      } else {
        Alert.alert('Error', data.message || 'No se pudieron actualizar los datos');
      }
    } catch (error) {
      console.error('Error al actualizar datos:', error);
      Alert.alert('Error', 'Error de conexión con el servidor');
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !perfil) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  // Selección de avatar según el rol
  const avatarUrl = perfil.rol === 'representante'
    ? 'https://cdn-icons-png.flaticon.com/512/3884/3884879.png'
    : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
  return (
    <CurvedHeaderLayout
      userName={`${perfil.nombre} ${perfil.apellido}`}
      avatarUrl={avatarUrl}
      showBackButton={true}
      showViewButton={false}
      content={
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.formContainer}
        >
          <View style={{ maxHeight: 500 }}>
            <ScrollView>
              <Text style={styles.formTitle}>Actualizar Datos</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nuevo Nombre</Text>
                <TextInput
                  style={styles.input}
                  value={nombre}
                  onChangeText={setNombre}
                  placeholder="Escribe tu nuevo nombre"
                  placeholderTextColor="#aaa"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nuevo Apellido</Text>
                <TextInput
                  style={styles.input}
                  value={apellido}
                  onChangeText={setApellido}
                  placeholder="Escribe tu nuevo apellido"
                  placeholderTextColor="#aaa"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nuevo Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Escribe tu nuevo email"
                  placeholderTextColor="#aaa"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nuevo Teléfono</Text>
                <TextInput
                  style={styles.input}
                  value={telefono}
                  onChangeText={setTelefono}
                  placeholder="Escribe tu nuevo teléfono"
                  placeholderTextColor="#aaa"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nueva Dirección</Text>
                <TextInput
                  style={styles.input}
                  value={direccion}
                  onChangeText={setDireccion}
                  placeholder="Escribe tu nueva dirección"
                  placeholderTextColor="#aaa"
                  multiline
                />
              </View>

              <TouchableOpacity
                style={[styles.button, updating && { opacity: 0.7 }]}
                onPress={handleActualizar}
                disabled={updating}
              >
                <Text style={styles.buttonText}>
                  {updating ? 'Actualizando...' : 'Actualizar'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      }
    />
  );
};

export default ActualizarDatos;
