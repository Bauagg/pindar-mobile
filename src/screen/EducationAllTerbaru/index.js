import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from '@expo-google-fonts/lexend';
import { Ionicons } from '@expo/vector-icons';

const articles = [
  {
    id: '1',
    title: '5 Kesalahan Pengguna Kartu Kredit yang Harus Dihindari',
    time: '5 menit yang lalu',
    image: '../../assets/education2.png',
  },
  {
    id: '2',
    title: 'Strategi Cerdas Mengelola Pinjaman Online Agar Tak Merugikan',
    time: '10 menit yang lalu',
    image: 'https://source.unsplash.com/random/100x100?loan',
  },
  {
    id: '3',
    title: 'Kartu Kredit: Kemudahan atau Beban? Pahami Sebelum Menggunakan',
    time: '10 menit yang lalu',
    image: 'https://source.unsplash.com/random/100x100?credit',
  },
  {
    id: '4',
    title: 'Kenali Ciri-Ciri Pinjol Legal Sebelum Terjebak Utang',
    time: '10 menit yang lalu',
    image: 'https://source.unsplash.com/random/100x100?savings',
  },
  {
    id: '5',
    title: 'Kartu Kredit untuk Pemula: Panduan Lengkap Agar Tak Terjebak Utang',
    time: '10 menit yang lalu',
    image: 'https://source.unsplash.com/random/100x100?finance',
  },
];

export default function EducationAllTerbaru() {
  let [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <Image
        source={require('../../assets/education2.png')}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.timeContainer}>
          <Ionicons name="time-outline" size={14} color="#666" />
          <Text style={styles.time}>{item.time}</Text>
        </View>
      </View>
      <Ionicons name="ellipsis-vertical" size={18} color="#666" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Terbaru</Text>
      <FlatList
        data={articles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 22,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 14,
    color: '#333',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  time: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
});
