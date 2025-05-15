import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from '@expo-google-fonts/lexend';
import { Entypo, Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utils/axios';

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
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
  });
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryData, setCategoryData] = useState([]);
    const [dataContent, setDataContent] = useState([]);
    console.log("INi data content", dataContent);
  

    const getCategories = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await api.get('/content/content-category', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = response.data.data.categories;
        console.log("INI RESULT", result);
        setCategories([{ id: null, name: 'All' }, ...result]); // tambahkan 'All'
        setSelectedCategory(null); // default All
        getDataEducation(); // ambil semua data
      } catch (error) {
        console.log('Error ambil kategori:', error);
      }
    };

    const getDataEducation = async (categoryId = null) => {
      try {
        console.log('Ambil data konten untuk kategoriId:', categoryId);
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        const endpoint = categoryId
          ? `/content/list?categoryId=${categoryId}`
          : `/content/list`;
    
        const response = await api.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("INI data", response.data.data.contents);
        setDataContent(response.data.data.contents);
      } catch (error) {
        console.log("Error ambil konten:", error);
      } finally {
        setLoading(false);
      }
    };
    
    useEffect(() => {
      getCategories();
      getDataEducation();
    }, []);

    
    

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <Image
        source={{ uri: `https://be.pindar.id/api${item.imageLink}` }}
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
        <View style={styles.searchContainer}>
          <Entypo
            name="magnifying-glass"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput placeholder="Search here.." style={styles.searchInput} />
        </View>
      </View>
      <View style={{ paddingHorizontal: 10, paddingTop: 20 }}>
        <Text style={styles.header}>Terbaru</Text>
        <View style={styles.categoryContainer}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={category.id ?? `category-${index}`}
              onPress={() => {
                setSelectedCategory(category);
                getDataEducation(category.id);
              }}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory?.id === category.id && styles.activeCategory,
                ]}
              >
                {category.name}
              </Text>
              {selectedCategory?.id === category.id && (
                <View style={styles.underline} />
              )}
            </TouchableOpacity>
          ))}

        </View>
      </View>
      <FlatList
        data={dataContent}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  categoryContainer: { flexDirection: 'row', marginVertical: 10 },
  categoryText: {
    marginRight: 15,
    fontSize: 14,
    color: '#777',
    fontFamily: 'Lexend-Regular',
  },
  activeCategory: { fontWeight: 'bold', color: '#000' },
  underline: {
    height: 2,
    width: 20,
    backgroundColor: '#1877F2',
    marginTop: 5,
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
    resizeMode: 'contain',
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
