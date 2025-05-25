import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/CurvedHeaderLayoutStyles.js'; // Tu archivo de estilos personalizado

const CurvedHeaderLayout = ({
  userName = '',
  avatarUrl = '',
  menuItems = [],
  content = null,
  showBackButton = false,
  showViewButton = true,
  onViewPress = () => {}
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
        {/* Header fijo */}
        <View style={styles.header}>
            {showBackButton && (
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ position: 'absolute', top: 40, left: 20 }}
            >
                <Ionicons name="arrow-back-outline" size={28} color="#fff" />
            </TouchableOpacity>
            )}
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            <Text style={styles.userName}>{userName}</Text>
        </View>

        {/* Contenido desplazable */}
        <View style={styles.menuContainer}>
            {menuItems?.length > 0 ? (
                menuItems.map((item, index) => (
                <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
                    <Ionicons name={item.icon} size={24} color="#28a745" style={styles.icon} />
                    <Text style={styles.label}>{item.label}</Text>
                </TouchableOpacity>
                ))
            ) : (
                content
            )}
        </View>


        {/* Botón opcional */}
        {showViewButton && onViewPress && (
            <TouchableOpacity style={styles.viewButton} onPress={onViewPress}>
            <Text style={styles.viewButtonText}>Notificaciones</Text>
            </TouchableOpacity>
        )}
        </View>
  );
};

export default CurvedHeaderLayout;
