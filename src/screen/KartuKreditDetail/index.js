import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { List } from 'react-native-paper';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const KartuKreditDetail = (props) => {
  const idDetail = props?.route?.params?.id;
  const [detail, setDetail] = useState(null);
  console.log("INI DATA DETAIl", detail);
  const [loading, setLoading] = useState(false);

  console.log("ID DARI SCRENN SEBELUMNYA", detail);
  const [expandedItems, setExpandedItems] = useState([]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      console.log(idDetail)
      const token = await AsyncStorage.getItem('accessToken'); // ← Token kamu di sini
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/credit-card/detail/${idDetail}`, {
        headers: {
          Authorization: token,
        },
      });
      setDetail(response.data.data);
      
    } catch (error) {
      console.error('Gagal ambil detail:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const navAjukan = () => {
    props.navigation.navigate('Redirect Kartu', {
      imageLink: detail.imageLink,
      redirectLink: detail.redicrectLink,
      title: detail.title
    });
  };


  const accordionData = [
    {
      id: 1,
      title: 'Detail Informasi',
      content: 'Kartu Kredit BCA Black Visa adalah kartu kredit premium...',
    },
    {
      id: 2,
      title: 'Fitur Utama',
      content:
        'Kartu ini menyediakan limit kredit tinggi, reward points, dan berbagai promo...',
    },
    {
      id: 3,
      title: 'Fasilitas Kartu',
      content:
        'Pemegang kartu dapat menikmati berbagai fasilitas eksklusif dan layanan prioritas...',
    },
    {
      id: 4,
      title: 'Biaya & Denda',
      content:
        'Kartu ini memiliki biaya tahunan Rp 450.000 dengan bunga rendah...',
    },
    {
      id: 5,
      title: 'Persyaratan',
      content:
        'Pengajuan kartu memerlukan penghasilan minimal dan dokumen pendukung...',
    },
    {
      id: 6,
      title: 'Cara Pengajuan',
      content:
        'Pengajuan kartu dapat dilakukan secara online melalui website resmi bank...',
    },
  ];

  const toggleExpand = (id) => {
    setExpandedItems(
      (prevExpanded) =>
        prevExpanded.includes(id)
          ? prevExpanded.filter((item) => item !== id) // Tutup jika sudah terbuka
          : [...prevExpanded, id] // Buka jika belum terbuka
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.accordionContainer}>
      <TouchableOpacity
        style={[
          styles.accordionHeader,
          expandedItems.includes(item?.id) && styles.expandedHeader,
        ]}
        onPress={() => toggleExpand(item.id)}>
        <Text style={styles.accordionTitle}>{item?.title}</Text>
        <Entypo
          name={expandedItems.includes(item.id) ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#555"
        />
      </TouchableOpacity>
      {expandedItems.includes(item.id) && (
        <View style={styles.contentBox}>
          <Text style={styles.contentText}>{item?.content}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: '#CC1C22',
          width: width,
          height: 220,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          paddingTop: 40,
          paddingHorizontal: 20,
          position: 'relative',
          overflow: 'hidden',
        }}>
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
      </View>

      {/* Gambar Kartu */}
      <View style={{ alignItems: 'center', marginTop: -150 }}>
        <View
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            width: 310,
            height: 200,
            alignItems: 'center',
            borderRadius: 10,
          }}>
          <Image
            source={{ uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${detail?.imageLink}`}}
            style={{ width: 280, height: 180, borderRadius: 10, marginTop: 20 }}
          />
        </View>
      </View>

      {/* Kartu Detail */}
      <View style={{ alignItems: 'center', marginVertical: 10 }}>
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'Lexend-Regular',
            fontWeight: 'semi-bold',
          }}>
          {detail?.title}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 14,
            alignItems: 'center',
            marginTop: 30,
          }}>
          <View style={{ alignItems: 'center', marginRight: 100 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#3D3D5C',
                fontFamily: 'Lexend-Regular',
              }}>
              Rp 450.000
              <Text
                style={{ fontSize: 14, fontWeight: 'bold', color: '#3D3D5C' }}>
                *
              </Text>
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: '#3D3D5C',
                fontFamily: 'Lexend-Regular',
              }}>
              Iuran Tahunan
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#3D3D5C',
                fontFamily: 'Lexend-Regular',
              }}>
              Premium
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: '#3D3D5C',
                fontFamily: 'Lexend-Regular',
              }}>
              Signature Card
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <FlatList
          data={accordionData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />

        <TouchableOpacity onPress={navAjukan}>
          <LinearGradient
            colors={['#CC1C22', '#F86469']}
            style={styles.applyGradient}>
            <Text style={styles.applyText}>Ajukan Sekarang</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100, // Supaya tombol tidak menutupi list
  },
  accordionContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  expandedHeader: {
    backgroundColor: '#F5F5F5',
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Lexend-Regular',
  },
  contentBox: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  contentText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#555',
    lineHeight: 20,
    fontFamily: 'Lexend-Regular',
  },

  applyGradient: {
    // backgroundColor: 'red',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 20,
    position: 'absolute',
    bottom: 20,
    width: '90%',
    alignSelf: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  applyText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Lexend-Regular',
  },
});

export default KartuKreditDetail;
