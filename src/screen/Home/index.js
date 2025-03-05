import React from 'react';
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Entypo } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
// import AksenGaris from '../../assets/aksen.svg';
import { LinearGradient } from 'expo-linear-gradient';
import TrendingCard from './TredingCard';
import PopularPlus from './PopularPlus';
import PopularDeal from './PopularDeal';

const { width } = Dimensions.get('window');

export default function Home(props) {
  const navPindarScreen = () => {
    props.navigation.navigate('Pindar');
  };
  const navKartuKreditScreen = () => {
    props.navigation.navigate('Kartu Kredit');
  };
  const navCompareScreen = () => {
    props.navigation.navigate('Compare');
  };
  const navKartuKreditDetail = () => {
    props.navigation.navigate('Kartu Kredit Detail');
  };
  const navNotifikasi = () => {
    props.navigation.navigate('Notifikasi');
  };
  return (
    <>
      <StatusBar
        translucent={true}
        backgroundColor={'transparent'}
        {...props}
      />

      {/* Header */}
      <View style={styles.header}>
        {/* <Image
          source={require('../../assets/aksen.png')}
          style={styles.svgStyle}
        /> */}
        {/* SVG Aksen Garis */}
        <Svg
          width={width}
          height={234}
          fill={'none'}
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 237 234`}
          style={styles.svgStyle}>
          <Path
            d="M 101.5,-0.5 C 108.167,-0.5 114.833,-0.5 121.5,-0.5C 123.643,13.4935 122.309,27.1602 117.5,40.5C 130.562,49.5625 141.229,60.8959 149.5,74.5C 163.461,74.5446 177.461,74.7113 191.5,75C 209.612,77.0546 224.612,84.8879 236.5,98.5C 236.5,132.167 236.5,165.833 236.5,199.5C 228.257,213.078 217.59,224.411 204.5,233.5C 197.167,233.5 189.833,233.5 182.5,233.5C 181.032,229.63 181.532,225.964 184,222.5C 218.006,203.164 233.673,173.83 231,134.5C 225.675,110.507 210.842,97.0071 186.5,94C 177.151,93.3897 167.817,93.5564 158.5,94.5C 166.411,130.144 155.744,158.644 126.5,180C 103.675,195.942 78.3417,203.608 50.5,203C 35.9833,202.324 24.15,196.491 15,185.5C 7.88241,171.252 8.54908,157.252 17,143.5C 33.8815,120.29 55.7148,103.457 82.5,93C 97.9544,87.5539 113.621,82.8873 129.5,79C 125.5,74.3333 121.5,69.6667 117.5,65C 114.926,62.7574 112.092,60.924 109,59.5C 89.7213,85.5767 63.888,100.577 31.5,104.5C 14.3545,104.345 3.68787,96.0119 -0.5,79.5C -0.5,76.5 -0.5,73.5 -0.5,70.5C 3.55912,57.5955 11.5591,47.7622 23.5,41C 47.643,26.9633 72.8096,24.7967 99,34.5C 103.117,22.9774 103.95,11.3107 101.5,-0.5 Z M 55.5,48.5 C 67.0704,47.7551 78.4037,48.9218 89.5,52C 74.3494,70.9143 54.6827,82.0809 30.5,85.5C 23.3834,85.5491 19.7167,82.0491 19.5,75C 21.5457,67.2777 26.2124,61.6111 33.5,58C 40.584,53.9504 47.9174,50.7837 55.5,48.5 Z M 136.5,97.5 C 137.75,97.5774 138.583,98.244 139,99.5C 145.792,125.792 138.292,146.959 116.5,163C 95.9029,177.977 72.9029,184.644 47.5,183C 31.3337,180.493 26.1671,171.66 32,156.5C 45.9933,136.186 64.4933,121.353 87.5,112C 103.626,106.057 119.959,101.224 136.5,97.5 Z"
            strokeWidth={7}
            opacity={0.951}
            fill="rgba(254, 255, 254, 0.5)"
            fillRule="evenodd"
          />
        </Svg>

        {/* Konten Header */}
        <View style={styles.headerContent}>
          {/* Informasi User */}
          <View style={styles.userInfo}>
            <Image
              source={require('../../assets/avatar.png')}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.greeting}>Hi Putri!</Text>
              <Text style={styles.location}>Jakarta, Indonesia</Text>
            </View>
          </View>

          {/* Ikon Notifikasi */}
          <TouchableOpacity onPress={navNotifikasi}>
            <MaterialCommunityIcons
              name="bell-badge-outline"
              size={28}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Image
            source={require('../../assets/loginlogo.png')}
            style={styles.logo}
          />
          <Ionicons name="search-outline" size={24} color="black" />
          <TextInput
            placeholder="Search here..."
            style={styles.input}
            placeholderTextColor="#aaa"
          />
        </View>
      </View>
      <>
        <FlatList
          ListFooterComponent={
            <>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 85,
                  paddingVertical: 12,
                }}>
                <TouchableOpacity
                  style={styles.containerTopButton}
                  onPress={navPindarScreen}>
                  <LinearGradient
                    colors={['#CC1C22', 'rgba(255,255,255,0)']} // Warna gradient (bisa disesuaikan)
                    style={styles.gradient}
                  />

                  {/* Image */}
                  <Image
                    source={require('../../assets/menu1.png')}
                    style={styles.image}
                  />
                  <Text style={styles.text}>Pindar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.containerTopButton}
                  onPress={navKartuKreditScreen}>
                  <LinearGradient
                    colors={['#CC1C22', 'rgba(255,255,255,0)']} // Warna gradient (bisa disesuaikan)
                    style={styles.gradient}
                  />

                  {/* Image */}
                  <Image
                    source={require('../../assets/menu2.png')}
                    style={styles.image}
                  />
                  <Text style={styles.text}>Kartu Kredit</Text>
                </TouchableOpacity>
              </View>
              {/* Trending Product */}
              <View>
                <TrendingCard />
              </View>
              {/* Popular Plus */}
              <View>
                <PopularPlus />
              </View>
              <View>
                <PopularDeal />
              </View>
              <View style={{ height: 100 }} />
            </>
          }
        />
      </>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#CC1C22',
    width: width,
    height: 220,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 40,
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  svgStyle: {
    position: 'absolute',
    top: 0,
    left: 90,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  greeting: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  location: {
    color: 'white',
    fontSize: 12,
  },
  searchBar: {
    backgroundColor: 'white',
    height: 50,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 40,
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  gradient: {
    width: 65,
    height: 90,
    borderRadius: 20, // Agar sudut melengkung
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
    position: 'absolute', // Agar gambar ada di atas gradient
    top: 10, // Posisikan gambar agar sesuai dengan desain
    left: 15,
  },
  imageTopRight: {
    width: 70,
    height: 70,
    position: 'absolute', // Agar gambar ada di atas gradient
    top: 30, // Posisikan gambar agar sesuai dengan desain
    left: 30,
  },
  text: {
    marginTop: 10, // Jarak antara gambar dan teks
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333', // Warna teks
  },
  containerTopButton: {
    alignItems: 'center',
  },
  containerTopButtonRight: {
    alignItems: 'center',
    paddingTop: 20,
  },
});
