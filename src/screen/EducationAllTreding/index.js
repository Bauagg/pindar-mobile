import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Entypo, Feather } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

const articles = [
  {
    id: '1',
    category: 'Solusi Keuangan',
    title:
      'Mengoptimalkan Kartu Kredit: Manfaat, Risiko, dan Cara Bijak Menggunakannya',
    time: '4h ago',
    image: 'https://via.placeholder.com/300x200', // Ganti dengan URL asli
  },
  {
    id: '2',
    category: 'Regulasi & Keamanan',
    title: 'Bijak Meminjam: Tips Menghindari Jeratan',
    time: '6h ago',
    image: 'https://via.placeholder.com/300x200', // Ganti dengan URL asli
  },
];

const EducationAllTreding = () => {
  const [fontsLoaded] = useFonts({
    Lexend: require('../../assets/fonts/Lexend-Regular.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      {/* Header Search Bar */}
      <View style={{ flexDirection: 'row' }}>
        <Image
          source={require('../../assets/loginlogo.png')}
          style={{
            width: 50,
            height: 50,
            marginRight: 10,
            resizeMode: 'contain',
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#f5f5f5',
            borderRadius: 20,
            width: '85%',
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}>
          <Feather name="search" size={20} color="#888" />
          <TextInput
            placeholder="Search here.."
            style={{ flex: 1, marginLeft: 10, fontFamily: 'Lexend' }}
          />
        </View>
      </View>

      {/* Title */}
      <Text
        style={{
          fontSize: 22,
          fontWeight: 'bold',
          marginVertical: 20,
          fontFamily: 'Lexend',
        }}>
        Trending
      </Text>

      {/* Articles */}
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 20 }}>
            <Image
              source={require('../../assets/education1.png')}
              style={{ width: '100%', height: 180, borderRadius: 10 }}
            />
            <Text style={{ color: '#666', marginTop: 8, fontFamily: 'Lexend' }}>
              {item.category}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                fontFamily: 'Lexend',
              }}>
              {item.title}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <Feather name="clock" size={14} color="#888" />
              <Text
                style={{ marginLeft: 5, color: '#888', fontFamily: 'Lexend' }}>
                {item.time}
              </Text>
              <TouchableOpacity style={{ marginLeft: 'auto' }}>
                <Entypo name="dots-three-horizontal" size={16} color="#888" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default EducationAllTreding;
