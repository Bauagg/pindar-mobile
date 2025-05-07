import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import FilterModal from './FilterModal';
import api from '../../utils/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PindarScreen = (props) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  console.log("DATA DARI FILTER", selectedFilters);
  const [dataLenders, setDataLenders] = useState([]);
  const tabs = ['Semua', 'Sekali bayar', 'Cicilan'];
  const [activeTab, setActiveTab] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApplyFilter = (filters) => {
    console.log('Filter diterapkan:', filters);
    setSelectedFilters(filters);
    getDataLenders(filters)
    // kamu bisa panggil API atau filter data di sini
  };


  const getDataLenders = async (paymtype,filters) => {
  try {
    setLoading(true);
    console.log("INI DATA DALAM", filters);
    const token = await AsyncStorage.getItem('token');
    console.log("token", token)
    const response = await api.get(
      `/lender/list?limit=5&offset=0&search=fin&sortBy=maxloan&sortDirection=desc&loanType=${filters}&paymentType=${paymtype}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data.data.lenders); // bisa disimpan ke state juga kalau mau
    await setDataLenders(response.data.data.lenders);
  } catch (error) {
    console.error('Gagal mengambil data lenders:', error);
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  getDataLenders(paymentType);
}, [paymentType]);


const handleTabPress = (tab) => {
  setActiveTab(tab);

  let paymtype = '';

  if (tab === 'Sekali bayar') {
    paymtype = 'PAYMENT_TYPE_1';
  } else if (tab === 'Cicilan') {
    paymtype = 'PAYMENT_TYPE_2';
  }

  setPaymentType(paymtype);
  getDataLenders(paymtype, selectedFilters); // tambahkan selectedFilters di sini
};

  const data = [
    {
      id: '1',
      name: 'Akulaku',
      amount: 'Rp 50.000.000',
      duration: '24 Bulan',
      logo: require('../../assets/akulaku.png'),
    },
    {
      id: '2',
      name: 'Indodana',
      amount: 'Rp 50.000.000',
      duration: '24 Bulan',
      logo: require('../../assets/indodana.png'),
    },
  ];
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
  
  
  const renderItem = ({ item }) => {
    const isChecked = selectedItems.some((selected) => selected.id === item.id);
    console.log('Image link:', item);
    return (
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <Image
            source={{ uri: `https://be.pindar.id${item.imagelink}` }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.cardTitle}>{item.lendername}</Text>
        </View>

        <View style={styles.divider} />

        {/* Content */}
        <View style={{ alignSelf: 'center' }}>
          <Text style={styles.cardSubtitle}>Maksimal Pinjaman</Text>
          <Text style={styles.cardAmount}>
  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.maxloan)}
</Text>

        </View>

        <View style={styles.row}>
          <Text style={styles.cardSubtitle}>Maksimal Lama Pinjam</Text>
          <Text style={styles.cardDuration}>{item.maxtenor} {""} Bulan</Text>
        </View>

        {/* Detail Button */}
        <TouchableOpacity style={styles.detailButton}>
          <Text style={styles.detailText}>Lihat Detail</Text>
          <FontAwesome name="external-link" size={14} color="red" />
        </TouchableOpacity>

        {/* Footer Buttons */}
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
  
 
  return (
    <View style={styles.container}>
       {/* contoh tampilkan hasil filter */}
       
       <Text style={{ marginTop: 20 }}>Filter aktif:</Text>
      {selectedFilters.map((f) => (
        <Text key={f}>- {f}</Text>
      ))}
      {/* Tab Filter */}
      <View style={styles.filterContainer}>
  {tabs.map((tab) => (
    <TouchableOpacity
      key={tab}
      onPress={() => handleTabPress(tab)}
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


      {/* FlatList untuk daftar kartu */}
      {loading ? (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#CC1C22" />
  </View>
) : (
  <FlatList
    data={dataLenders}
    renderItem={renderItem}
    keyExtractor={(item) => item.id}
    contentContainerStyle={styles.flatListContainer}
  />
)}


      {selectedItems.length > 0 && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => {
            const selectedIds = selectedItems.map(item => item.id);
            props.navigation.navigate('Compare', { selectedItems: selectedItems }); // ini benar

          }}
          >
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
      {!loading &&(
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
      )}
         <FilterModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onApply={handleApplyFilter}
      />

     
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },
  filterWrapper: { marginHorizontal: 5, borderRadius: 10, overflow: 'hidden' },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: 120,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
  },
  activeFilter: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: 120,
    alignItems: 'center',
  },
  filterText: {
    color: 'gray',
    fontWeight: 'bold',
    fontFamily: 'Lexend-Regular',
  },
  filterTextActive: {
    color: 'white',
    fontFamily: 'Lexend-Regular',
    fontWeight: 'bold',
  },
  flatListContainer: { paddingHorizontal: 16, paddingBottom: 100 },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: { width: 40, height: 40, marginRight: 10 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
  cardSubtitle: {
    textAlign: 'center',
    color: '#474864',
    fontSize: 12,
    fontFamily: 'Lexend-Regular',
    fontWeight: 'bold',
  },
  cardAmount: {
    fontSize: 20,
    // fontWeight: 'bold',
    fontFamily: 'Lexend-Regular',
    color: '#474864',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDuration: { fontSize: 14, fontWeight: 'bold', color: '#000' },
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
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  compareButton: { flexDirection: 'row', alignItems: 'center' },
  compareText: { color: 'black', marginLeft: 5, fontFamily: 'Lexend-Regular' },
  applyGradient: {
    // backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  applyText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Lexend-Regular',
  },

  bottomText: { color: 'gray', fontFamily: 'Lexend-Regular' },
  bottomAmount: { fontSize: 18, fontWeight: 'bold' },
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
  filterFloatingText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Lexend-Regular',
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
  textContainer: { flex: 1 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#CC1C22' },
  number: { fontSize: 22, fontWeight: 'bold', color: '#CC1C22' },
  subtitle: { fontSize: 12, color: '#666' },
  arrow: { fontSize: 20, color: '#CC1C22', fontWeight: 'bold' },
});

export default PindarScreen;
