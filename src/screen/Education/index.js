import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Entypo, Feather } from '@expo/vector-icons';

const categories = ['All', 'Keuangan', 'Regulasi', 'Keamanan', 'Investasi'];

const articles = [
  {
    id: '1',
    title: '5 Kesalahan Pengguna Kartu Kredit yang Harus Dihindari',
    time: '5 menit yang lalu',
    image: require('../../assets/education2.png'),
  },
  {
    id: '2',
    title: 'Strategi Cerdas Mengelola Pinjaman Online Agar Tak Merugikan',
    time: '10 menit yang lalu',
    image: require('../../assets/education3.png'),
  },
];

export default function Education(props) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const navEducationDetail = () => {
    props.navigation.navigate('EducationDetail');
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Entypo
          name="magnifying-glass"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput placeholder="Search here.." style={styles.searchInput} />
      </View>

      <Text style={styles.sectionTitle}>Trending</Text>
      <TouchableOpacity
        style={styles.trendingContainer}
        onPress={navEducationDetail}>
        <Image
          source={require('../../assets/education1.png')}
          style={styles.trendingImage}
        />
        <Text style={styles.trendingTitle}>
          Bunga Pinjaman Online: Cara Menghitung dan Menghindari Beban Berlebih
        </Text>
        <Text style={styles.time}>4 jam yang lalu</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Terbaru</Text>
      <View style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}>
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.activeCategory,
              ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.articleContainer}>
            <Image source={item.image} style={styles.articleImage} />
            <View style={styles.articleTextContainer}>
              <Text style={styles.articleTitle}>{item.title}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 15 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchIcon: { marginRight: 5 },
  searchInput: { flex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  trendingContainer: { borderRadius: 10, overflow: 'hidden' },
  trendingImage: { width: '100%', height: 150, borderRadius: 10 },
  trendingTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 5 },
  time: { color: '#888', fontSize: 12 },
  categoryContainer: { flexDirection: 'row', marginVertical: 10 },
  categoryText: { marginRight: 15, fontSize: 14, color: '#777' },
  activeCategory: { fontWeight: 'bold', color: '#000' },
  articleContainer: { flexDirection: 'row', marginBottom: 15 },
  articleImage: { width: 80, height: 80, borderRadius: 10, marginRight: 10 },
  articleTextContainer: { flex: 1 },
  articleTitle: { fontSize: 14, fontWeight: 'bold' },
});
