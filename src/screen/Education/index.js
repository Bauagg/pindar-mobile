import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Entypo, Feather, Ionicons } from '@expo/vector-icons';
import { Row } from 'react-native-table-component';

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
  const navEducationAllTerbaru = () => {
    props.navigation.navigate('Education All Terbaru');
  };
  const navEducationAllTreding = () => {
    props.navigation.navigate('Education All Treding');
  };

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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <Text style={styles.sectionTitle}>Trending</Text>
        </View>
        <TouchableOpacity
          style={{ marginTop: 13 }}
          onPress={navEducationAllTreding}>
          <Text>Lihat Semua</Text>
        </TouchableOpacity>
      </View>
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row' }}>
            <Ionicons
              name="time-outline"
              size={10}
              color="black"
              style={{ marginTop: 3, marginRight: 5 }}
            />
            <Text style={styles.time}>4 jam yang lalu</Text>
          </View>
          <Entypo name="dots-three-horizontal" size={10} color="black" />
        </View>
      </TouchableOpacity>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 20,
        }}>
        <View>
          <Text style={styles.sectionTitle}>Terbaru</Text>
        </View>
        <TouchableOpacity
          style={{ marginTop: 13 }}
          onPress={navEducationAllTerbaru}>
          <Text>Lihat Semua</Text>
        </TouchableOpacity>
      </View>

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
            {selectedCategory === category && <View style={styles.underline} />}
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
              <View style={{ flexDirection: 'row', marginTop: 5 }}>
                <Ionicons
                  name="time-outline"
                  size={10}
                  color="black"
                  style={{ marginTop: 3, marginRight: 5 }}
                />
                <Text style={styles.time}>{item.time}</Text>
              </View>
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
    width: '85%',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchIcon: { marginRight: 5 },
  searchInput: { flex: 1 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    fontFamily: 'Lexend-Regular',
  },
  trendingContainer: { borderRadius: 10, overflow: 'hidden' },
  trendingImage: { width: '100%', height: 150, borderRadius: 10 },
  trendingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    fontFamily: 'Lexend-Regular',
  },
  time: { color: '#888', fontSize: 12 },
  categoryContainer: { flexDirection: 'row', marginVertical: 10 },
  categoryText: {
    marginRight: 15,
    fontSize: 14,
    color: '#777',
    fontFamily: 'Lexend-Regular',
  },
  activeCategory: { fontWeight: 'bold', color: '#000' },
  articleContainer: { flexDirection: 'row', marginBottom: 15 },
  articleImage: { width: 80, height: 80, borderRadius: 10, marginRight: 10 },
  articleTextContainer: { flex: 1 },
  articleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Lexend-Regular',
  },
  underline: {
    height: 2,
    width: 20,
    backgroundColor: '#1877F2',
    marginTop: 5,
  },
});
