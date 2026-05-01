import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import api from '../../utils/axios';
import { useAlertModal } from '../../contexts/AlertModalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';


const AboutUs = () => {
  const [loading, setLoading] = useState(false);
  const [dataAbout, setDataAbout] = useState(false);
  const navigation = useNavigation();

  const getAbout = async () => {
    try {
      console.log("JALANNNN")
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      console.log(token);
      const response = await api.get(`/parameter/ABOUT_US`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("INI RESPON",response.data.data);
      setDataAbout(response.data.data);
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }

  }
  useEffect(()=> {
    getAbout();
  },[]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Entypo name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>About Us</Text>
        <Entypo name="dots-three-vertical" size={20} color="black" />
      </View> */}
      <View style={styles.content}>
        <Image
          source={require('../../assets/loginlogo.png')}
          style={styles.logo}
        />
        <Text style={styles.description}>
          {dataAbout.param_value}
          {/* Pindar adalah aplikasi agregasi yang membantu Anda menemukan dan
          mengelola pinjaman online serta kartu kredit dalam satu platform.
          Dengan teknologi cerdas, kami menyediakan rekomendasi terbaik sesuai
          kebutuhan finansial Anda, memastikan kemudahan, transparansi, dan
          keamanan dalam setiap transaksi. */}
        </Text>
        <Text style={styles.version}>Version 1.0</Text>
        <Text style={styles.copyright}>© 2025 - 2026 Pindar</Text>
      </View>
      <Image
        source={require('../../assets/city.png')}
        style={styles.footerImage}
        resizeMode="stretch"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  description: {
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },
  version: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  copyright: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  footerImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.2,
    resizeMode: 'cover',
    position: 'absolute',
    bottom: 0,
  },
});

export default AboutUs;
