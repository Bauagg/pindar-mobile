import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  TouchableOpacity,
  Dimensions,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute } from '@react-navigation/native';

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

const RedirectScreen = () => {
  const route = useRoute();
  const { directLink, imageLink, lenderName } = route.params;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 5000,
      useNativeDriver: false,
    }).start(() => {
      handleRedirect();
    });
  }, []);

  const handleRedirect = () => {
    if (directLink) {
      Linking.openURL(directLink).catch((err) =>
        console.error('Gagal membuka link:', err)
      );
    }
  };

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
      <Image
        source={{ uri: `${process.env.EXPO_PUBLIC_IMAGE_BASE_URL}${imageLink}` }}
        style={{ width: 80, height: 80, marginBottom: 10 }}
        resizeMode="contain"
      />

      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 10,
          fontFamily: 'Poppins-Bold',
        }}>
        {lenderName}
      </Text>

      <View style={{ width: Dimensions.get('window').width - 200 }}>
        <Text style={{ textAlign: 'center', marginBottom: 20 }}>
          Anda akan dialihkan ke halaman aplikasi {lenderName}
        </Text>
      </View>

      {/* Progress Bar */}
      <View
        style={{
          width: '80%',
          height: 10,
          backgroundColor: '#ddd',
          borderRadius: 5,
          overflow: 'hidden',
        }}>
        <AnimatedGradient
          colors={['#CC1C22', '#F86469']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            width: progressWidth,
            height: '100%',
            borderRadius: 5,
          }}
        />
      </View>

      <View style={{ width: Dimensions.get('window').width - 120 }}>
        <Text style={{ marginTop: 10, textAlign: 'center' }}>
          Jika anda tidak dialihkan dalam waktu 5 detik,{' '}
          <Text style={{ color: 'blue' }} onPress={handleRedirect}>
            klik di sini
          </Text>{' '}
          untuk melanjutkan
        </Text>
      </View>
    </View>
  );
};

export default RedirectScreen;
