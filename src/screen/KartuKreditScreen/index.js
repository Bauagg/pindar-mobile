import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import FilterModalKartu from './FilterModalKartu';
import api from '../../utils/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KartuKreditScreen = (props) => {
  const [activeTab, setActiveTab] = useState('Semua');
  const [selectedIssuer, setSelectedIssuer] = useState('Semua');
  const [selectedItems, setSelectedItems] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [dataCC, setDataCC] = useState([]);
  const [loading, setLoading] = useState(false);

  const tabs = ['Semua', 'Premium', 'First Card'];
  const issuers = ['Semua', 'BCA', 'BNI', 'Mandiri'];

  const toggleSelection = (item) => {
    setSelectedItems((prevSelected) => {
      const isSelected = prevSelected.some(
        (selected) => selected.id === item.id
      );
  
      let newSelected;
      if (isSelected) {
        newSelected = prevSelected.filter((selected) => selected.id !== item.id);
      } else {
        newSelected = [...prevSelected, item];
      }
  
      console.log('Selected IDs:', newSelected.map(i => i.id));
      return newSelected;
    });
  };

  const data = [
    {
      id: '1',
      name: 'BCA Black Visa',
      fee: 'Rp 450.000*',
      benefit: 'Gratis 1 tahun pertama',
      features: [
        'Fasilitas Cicilan BCA 0% untuk transaksi luar negeri',
        'Dining Promo di hotel berbintang 5 di kota tertentu',
        'Diterima di seluruh jaringan Visa',
      ],
      logo: require('../../assets/bca.png'),
    },
    {
      id: '2',
      name: 'BNI Mastercard Gold',
      fee: 'Rp 300.000*',
      benefit: 'Gratis 1 tahun pertama',
      features: [
        'Fasilitas cicilan tetap',
        'BNI Rewards Point',
        'Rp2.500 = 1 reward point',
      ],
      logo: require('../../assets/bni.png'),
    },
  ];

  const renderItem = ({ item }) => {
    const isChecked = selectedItems.some((selected) => selected.id === item.id);
    console.log('Image link:', item);
    return (
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View>
            <Image
              source={{ uri: `https://be.pindar.id/api${item.imageLink}` }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            {/* Biaya dan Benefit */}
            <Text style={styles.cardFee}>
              Rp {item.yearlyFee.toLocaleString('id-ID')}
            </Text>
            <Text style={styles.cardBenefit}>{item.benefit}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Fitur */}
        <Text style={styles.featureTitle}>Fitur</Text>
        {item.features.map(({ feature }, index) => (
          <View key={index} style={styles.featureItem}>
            <FontAwesome name="check-circle" size={16} color="#34C759" />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}


        {/* Tombol Lihat Detail */}
        <TouchableOpacity style={styles.detailButton}>
          <Text style={styles.detailText}>Lihat Detail</Text>
          <FontAwesome name="external-link" size={14} color="red" />
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.compareButton}
            onPress={() => toggleSelection(item)}>
            <FontAwesome
              name={isChecked ? 'check-square' : 'square-o'}
              size={20}
              color="red"
            />
            <Text style={styles.compareText}>Bandingkan</Text>
          </TouchableOpacity>

          <TouchableOpacity>
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
  const getDataCC = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const response = await api.get(
        `/credit-card/search?featureId=7113c3c7-d046-4824-82e9-d5bcf261495c,f64d11a9-ec99-43a6-a27c-9ab6ef4d73b9&minYearlyFee=0&maxYearlyFee=10000000&sortBy=yearly_fee&sortDirection=asc`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.data.creditCards); // bisa disimpan ke state juga kalau mau
      setDataCC(response.data.data.creditCards);
    } catch (error) {
      console.error('Gagal mengambil data lenders:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    getDataCC();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Penerbit Kartu</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedIssuer}
            onValueChange={(itemValue) => setSelectedIssuer(itemValue)}
            style={styles.picker}>
            {issuers.map((issuer) => (
              <Picker.Item key={issuer} label={issuer} value={issuer} />
            ))}
          </Picker>
        </View>
      </View>
      <View style={styles.filterContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={styles.filterWrapper}>
            {activeTab === tab ? (
              <LinearGradient
                colors={['#CC1C22', '#F86469']}
                style={styles.activeFilter}>
                <Text style={styles.filterTextActive}>{tab}</Text>
              </LinearGradient>
            ) : (
              <View style={styles.filterButton}>
                <Text style={styles.filterText}>{tab}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={dataCC}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContainer}
      />
      {selectedItems.length > 0 && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => {
            const selectedIds = selectedItems.map(item => item.id);
            props.navigation.navigate('Compare Kartu', { selectedItems: selectedItems }); // ini benar

          }}>
          <View style={styles.overlayContent}>
            <View style={{ alignItems: 'center', marginRight: 10 }}>
              <Text style={styles.number}>{selectedItems.length}</Text>
              <Image source={require('../../assets/menu2.png')} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}> Pinjaman yang anda bandingkan</Text>
              <Text style={styles.subtitle}>
                Anda dapat membandingkan Max 3 Pinjaman
              </Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>
      )}
      {/* Floating Button */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <LinearGradient
          colors={['#CC1C22', '#F86469']}
          style={styles.filterFloating}>
          <FontAwesome5
            name="filter"
            size={14}
            color="white"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.filterFloatingText}>FILTER</Text>
        </LinearGradient>
      </TouchableOpacity>
      <FilterModalKartu
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 70,
    paddingVertical: 10,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    // color: '#4B4B63',
    marginRight: 10,
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 25,
    elevation: 3, // Efek shadow untuk Android
    shadowColor: '#000', // Efek shadow untuk iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    overflow: 'hidden', // Agar border radius diterapkan ke Picker
  },
  picker: {
    width: 150,
    height: 50,
    color: '#4B4B63',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },
  filterWrapper: { marginHorizontal: 5, borderRadius: 10, overflow: 'hidden' },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  activeFilter: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 10 },
  filterText: {
    color: 'gray',
    fontWeight: 'bold',
    fontFamily: 'Lexend-Regular',
  },
  filterTextActive: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Lexend-Regular',
  },
  flatListContainer: { paddingHorizontal: 16, paddingBottom: 100 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: { width: 100, height: 80, marginRight: 10, resizeMode: 'contain' },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Lexend-Regular',
  },
  cardFee: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardBenefit: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 10 },
  featureTitle: { fontSize: 14, fontWeight: 'bold' },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  featureText: { marginLeft: 5, fontSize: 12, fontFamily: 'Lexend-Regular' },
  filterFloating: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    marginLeft: -75,
    width: 150,
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  detailButton: {
    backgroundColor: '#F2F2F2',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  detailText: {
    color: '#474864',
    marginRight: 5,
    fontFamily: 'Lexend-Regular',
  },
  filterFloatingText: { color: 'white', fontWeight: 'bold' },
  compareText: { color: 'black', marginLeft: 5, fontFamily: 'Lexend-Regular' },
  compareButton: { flexDirection: 'row', alignItems: 'center' },
  applyGradient: {
    // backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  applyText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Lexend-Regular',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  overlay: {
    position: 'absolute',
    bottom: 70,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  overlayContent: { flexDirection: 'row', alignItems: 'center' },
  number: { fontSize: 22, fontWeight: 'bold', color: '#CC1C22' },
  textContainer: { flex: 1, fontFamily: 'Lexend-Regular' },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#CC1C22',
    fontFamily: 'Lexend-Regular',
  },
  subtitle: { fontSize: 12, color: '#666', fontFamily: 'Lexend-Regular' },
  arrow: { fontSize: 20, color: '#CC1C22', fontWeight: 'bold' },
});

export default KartuKreditScreen;
