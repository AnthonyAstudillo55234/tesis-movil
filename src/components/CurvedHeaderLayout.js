import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/CurvedHeaderLayoutStyles.js';

const CurvedHeaderLayout = ({
  userName = '',
  avatarUrl = '',
  menuItems = [],
  content = null,
  showBackButton = false,
  showViewButton = true,
  onViewPress = () => {},
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Encabezado con curva */}
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

      {/* Contenido (menú o custom) */}
      <View style={styles.menuContainer}>
        {menuItems?.length > 0 ? (
          menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>

              <View style={{ position: 'relative' }}>
                <Ionicons name={item.icon} size={24} color="#28a745" style={styles.icon} />
                {/* Badge: solo si tiene badgeCount > 0 */}
                {item.badgeCount > 0 && (
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>
                      {item.badgeCount > 99 ? '99+' : item.badgeCount}
                    </Text>
                  </View>
                )}
              </View>

              <Text style={styles.label}>{item.label}</Text>
            </TouchableOpacity>
          ))
        ) : (
          content
        )}
      </View>
    </View>
  );
};

export default CurvedHeaderLayout;
