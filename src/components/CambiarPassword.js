import React, { useState, useEffect } from 'react';
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
import styles from '../styles/PerfilRepre.js';
import CurvedHeaderLayout from './CurvedHeaderLayout.js';

const CambiarPassword = () => {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updating, setUpdating] = useState(false);
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch('https://escuela-descubrir.vercel.app/api/perfil', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setPerfil(data);
      } catch (error) {
        console.error('Error al obtener perfil:', error);
      }
    };

    fetchPerfil();
  }, []);

  const handleChangePassword = async () => {
    if (!password.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'La nueva contraseña y la confirmación no coinciden');
      return;
    }

    setUpdating(true);

    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch('https://escuela-descubrir.vercel.app/api/cambiar-password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ password, newPassword, confirmPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Éxito', data.message || 'Contraseña actualizada correctamente');
        setPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        Alert.alert('Error', data.message || 'No se pudo actualizar la contraseña');
      }
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      Alert.alert('Error', 'Error de conexión con el servidor');
    } finally {
      setUpdating(false);
    }
  };

  if (!perfil) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

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
          <View>
            <Text style={styles.formTitle}>Cambiar Contraseña</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña Actual</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Escribe tu contraseña actual"
                placeholderTextColor="#aaa"
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nueva Contraseña</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Escribe tu nueva contraseña"
                placeholderTextColor="#aaa"
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar Nueva Contraseña</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirma tu nueva contraseña"
                placeholderTextColor="#aaa"
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[styles.button, updating && { opacity: 0.7 }]}
              onPress={handleChangePassword}
              disabled={updating}
            >
              <Text style={styles.buttonText}>
                {updating ? 'Actualizando...' : 'Cambiar Contraseña'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      }
    />
  );
};

export default CambiarPassword;
