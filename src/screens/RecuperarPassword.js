import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import { styles } from '../styles/LoginStyles'; 
import { useNavigation } from '@react-navigation/native';

const RecuperarPassword = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const handleRecuperar = async () => {
    if (!email) {
      Alert.alert('Advertencia', 'Por favor escribe tu correo electrónico');
      return;
    }

    try {
      const response = await fetch('https://escuela-descubrir.vercel.app/api/recuperar-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Éxito', data.message || 'Revisa tu correo para recuperar la contraseña');
        navigation.goBack();
      } else {
        Alert.alert('Error', data.message || 'No se pudo enviar el correo');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Ocurrió un error al conectar con el servidor');
    }
  };

  return (
    <ImageBackground
      source={require('../images/fondo2.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}></Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={handleRecuperar}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default RecuperarPassword;
