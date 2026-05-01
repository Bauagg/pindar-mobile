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

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

const RedirectScreenKartu = ({ route, navigation }) => {
  const { imageLink, redirectLink, title } = route.params || {};
    console.log('DATA DARI NAVIGASI:');
  console.log('imageLink:', imageLink);
  console.log('redirectLink:', redirectLink);
  console.log('title:', title);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 5000,
      useNativeDriver: false,
    }).start(() => {
      if (redirectLink) {
        Linking.openURL(redirectLink).catch((err) =>
          console.error('Failed to open URL:', err)
        );
      }
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
      <Image
        source={{ uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${imageLink}`}}
        style={{
          width: 200,
          height: 80,
          marginBottom: 10,
          resizeMode: 'contain',
        }}
      />

      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 10,
          fontFamily: 'Poppins-Bold',
        }}>
        {title || 'BCA Mastercard'}
      </Text>
      <View style={{ width: Dimensions.get('window').width - 200 }}>
        <Text style={{ textAlign: 'center', marginBottom: 20 }}>
          Anda akan dialihkan ke halaman aplikasi Akulaku
        </Text>
      </View>

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
          Jika anda tidak dialihkan dalam waktu 5 detik, klik{' '}
          <Text
            style={{ color: 'blue' }}
            onPress={() => {
              if (redirectLink) {
                Linking.openURL(redirectLink);
              }
            }}>
            di sini
          </Text>{' '}
          untuk melanjutkan
        </Text>
      </View>
    </View>
  );
};

export default RedirectScreenKartu;
