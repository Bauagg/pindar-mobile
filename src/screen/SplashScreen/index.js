import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import Logo from '../../assets/logo_pindar_2.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        console.log('token', token);

        if (token) {
          navigation.replace('AppScreen'); // Redirect ke Home kalau token ada
        } else {
          navigation.replace('AuthScreen'); // Kalau token kosong, ke Auth
        }
      } catch (error) {
        console.error('Gagal cek token:', error);
        navigation.replace('AuthScreen'); // Error handling ke Auth juga
      }
    };

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      checkLogin(); // Panggil cek login setelah splash selesai
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={Logo}
        style={[styles.image, { opacity: fadeAnim }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
});
