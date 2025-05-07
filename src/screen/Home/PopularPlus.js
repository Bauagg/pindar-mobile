import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_900Black,
} from '@expo-google-fonts/lexend';
import api from '../../utils/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window'); // Mendapatkan lebar layar

const data = [
  {
    title: 'Life Insurance',
    subtitle: 'Masa Depan Aman, Mulai Rp100K/Bulan!',
    image: require('../../assets/family.png'), // Ganti dengan gambar kamu
  },
  {
    title: 'Health Plan',
    subtitle: 'Lindungi Kesehatan Keluarga!',
    image: require('../../assets/family.png'),
  },
];

const PopularPlus = () => {
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dataBanner, setDataBanner] = useState([]);
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
  });

  const handleScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slideIndex);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: `https://be.pindar.id/api${item.imageLink}` }}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.smallText}>{item.title}</Text>
        <Text style={styles.bigText}>{item.subtitle}</Text>
      </View>
    </View>
  );

  const refreshAccessToken = async () => {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!refreshToken) {
      alert('Refresh token tidak ditemukan. Silakan login kembali.');
      return null;
    }
  
    try {
      const response = await api.post('/auth/refresh', { refreshToken });
      if (response.code === 200) {
        const newAccessToken = response.data.accessToken;
        await AsyncStorage.setItem('accessToken', newAccessToken); // Simpan access token baru
        return newAccessToken;
      } else {
        alert('Gagal mendapatkan token baru. Silakan login kembali.');
        return null;
      }
    } catch (error) {
      console.error('Gagal refresh token:', error);
      return null;
    }
  };
  

  const getDataCC = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      console.log(token);
      const response = await api.get(`/announcement/active`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.data); // bisa disimpan ke state juga kalau mau
      setDataBanner(response.data.data);
    } catch (error) {
      console.error('Gagal mengambil data lenders:', error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    getDataCC();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Popular Plus</Text>
      <FlatList
        ref={flatListRef}
        data={dataBanner}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
      />
      <View style={styles.pagination}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, activeIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  title: {
    fontSize: 18,
    // fontWeight: 'bold',
    fontFamily: 'Lexend_700Bold',
    color: '#333',
    marginLeft: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#CC1C22',
    borderRadius: 15,
    width: width * 0.9,
    height: 150,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    position: 'relative',
  },
  image: {
    width: 135,
    height: 200,
    resizeMode: 'contain',
    position: 'absolute',
    left: 5,
    // bottom: 0,
  },
  textContainer: {
    flex: 1,
    marginLeft: 120,
  },
  smallText: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Lexend_400Regular',
  },
  bigText: {
    fontSize: 18,
    // fontWeight: 'bold',
    fontFamily: 'Lexend_700Bold',
    color: 'white',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: 'orange',
  },
});

export default PopularPlus;
