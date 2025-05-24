import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/PerfilRepre.js';

const CambiarPassword = () => {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updating, setUpdating] = useState(false);

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
        body: JSON.stringify({
          password,
          newPassword,
          confirmPassword
        }),
      });

      const data = await res.json();
      console.log('Respuesta:', data);

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

  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
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
    </ScrollView>
  );
};

export default CambiarPassword;
