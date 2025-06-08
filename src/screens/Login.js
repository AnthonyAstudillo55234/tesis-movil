import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../styles/LoginStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [years, setYears] = useState([]);
  const [loadingYears, setLoadingYears] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await fetch('https://escuela-descubrir.vercel.app/api/listar-anios');
        const data = await response.json();
        if (Array.isArray(data)) {
          setYears(data);
        } else {
          console.error("Formato inesperado:", data);
        }
      } catch (error) {
        console.error("Error al cargar años lectivos:", error);
        Alert.alert("Error", "No se pueden cargar los años lectivos");
      } finally {
        setLoadingYears(false);
      }
    };
    fetchYears();
  }, []);

  const handleLogin = async () => {
    if (!selectedYear) {
      Alert.alert('Error', 'Por favor selecciona un año lectivo');
      return;
    }

    try {
      const response = await fetch('https://escuela-descubrir.vercel.app/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          anioLectivo: selectedYear,
        }),
      });

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      if (response.ok) {
        await AsyncStorage.setItem('token', data.token); 
        await AsyncStorage.setItem('rol', data.rol); // guarda el rol
      
        Alert.alert('Éxito', data.message || 'Login exitoso');
      
        if (data.rol === 'administrador') {
          navigation.navigate('Admin');
        } else if (data.rol === 'representante') {
          navigation.navigate('Representante');
        } else if (data.rol === 'profesor') {
          navigation.navigate('Profesor');
        } else {
          Alert.alert('Info', 'Rol no soportado');
        }        
      } else {
        Alert.alert('Error', data.message || 'Credenciales inválidas');
      }
    } catch (error) {
      console.error("Error en login:", error);
      Alert.alert('Error', 'Ocurrió un error al conectar con el servidor');
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Advertencia', 'Por favor escribe tu correo electrónico');
      return;
    }

    try {
      const response = await fetch('https://escuela-descubrir.vercel.app/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Éxito', data.message || 'Revisa tu correo para recuperar la contraseña');
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
        <Image
          source={require('../images/logodsc.png')}
          style={styles.image}
        />

        <TextInput
          style={styles.input}
          placeholder="Correo"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
              color="#333"
            />
          </TouchableOpacity>
        </View>

        {loadingYears ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <View style={styles.picker}>
            <Picker
              selectedValue={selectedYear}
              onValueChange={(itemValue) => setSelectedYear(itemValue)}
            >
              <Picker.Item label="Selecciona un año lectivo" value="" />
              {years.map((year) => (
                <Picker.Item
                  key={year._id}
                  label={year.periodo}
                  value={year._id}
                />
              ))}
            </Picker>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('RecuperarPassword')}>
          <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;
