import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, TouchableOpacity } from 'react-native';

const RedirectScreen = ({ navigation }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 100, // Nilai akhir progress bar
      duration: 5000, // 5 detik
      useNativeDriver: false,
    }).start(() => {
      // Simulasi navigasi setelah progress selesai
      console.log('Redirecting...');
    });
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        Pinjaman
      </Text>

      <Image
        source={{
          uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Akulaku_logo.svg/1200px-Akulaku_logo.svg.png',
        }}
        style={{ width: 80, height: 80, marginBottom: 10 }}
      />

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Akulaku
      </Text>
      <Text style={{ textAlign: 'center', marginBottom: 20 }}>
        Anda akan dialihkan ke halaman aplikasi Akulaku
      </Text>

      {/* Progress Bar */}
      <View
        style={{
          width: '80%',
          height: 10,
          backgroundColor: '#ddd',
          borderRadius: 5,
          overflow: 'hidden',
        }}>
        <Animated.View
          style={{
            width: progressWidth,
            height: '100%',
            backgroundColor: 'red',
          }}
        />
      </View>

      <Text style={{ marginTop: 10 }}>
        Jika anda tidak dialihkan dalam waktu 5 detik, klik{' '}
        <Text style={{ color: 'blue' }}>di sini</Text> untuk melanjutkan
      </Text>
    </View>
  );
};

export default RedirectScreen;
