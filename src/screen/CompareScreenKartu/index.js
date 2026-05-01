import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import api from '../../utils/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const CompareScreenKartu = (props) => {
  const selectedItemsid = props?.route?.params?.selectedItems || [];
  const selectedIds = selectedItemsid.map(item => item.id);
  console.log("INI ID", selectedIds)
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState([]);
  console.log("INI DATA Detail", JSON.stringify(details, null, 2));


  const fetchAllDetails = async () => {
    setLoading(true);
    console.log("JALANN");
    try {
      const token = await AsyncStorage.getItem('accessToken');

      const requests = selectedIds.map((id) => {
        const url = `${process.env.EXPO_PUBLIC_API_BASE_URL}/credit-card/detail/${id}`;
        console.log("Request URL:", url); // Log URL to verify
        return axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      });

      console.log("Headers:", {
        Authorization: `Bearer ${token}`,
      });

      const responses = await Promise.all(requests);

      // Logging status code and response for debugging
      responses.forEach(response => {
        console.log("Status Code:", response.status);
        console.log("Response Data:", response.data);
      });

      const allData = responses.map((res) => res.data.data);
      setDetails(allData);
    } catch (error) {
      console.error('Error fetching details:', error.response ? error.response.data : error.message);
      if (error.response) {
        console.log("Error Status:", error.response.status);
        console.log("Error Headers:", error.response.headers);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedIds.length > 0) {
      fetchAllDetails();
    }
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00aaff" />
      </View>
    );
  }


  const navDetails = () => {
    props.navigation.navigate('Informasi Detail');
  };

  const selectedItems = [
    {
      id: '1',
      name: 'BCA MasterCard',
      amount: 'Rp 50.000.000',
      duration: '24 Bulan',
      logo: require('../../assets/bca.png'),
      provider: 'Visa',
      annualFee: 'Rp 300.000',
      extraCardFee: 'Rp 150.000',
      purchaseRate: '1,75%',
      cashbackRate: '-',
      withdrawalFee: '6% dari jumlah penarikan atau min Rp 150.000',
      lateFee: '1% dari total tagihan atau max Rp 100.000',
      minimumIncome: 'Rp 3.000.000 / Bulan',
      maxAge: '65 tahun',
      minAge: '21 tahun',
      minExtraAge: '17 tahun',
    },
    {
      id: '2',
      name: 'BNI Mastercard Gold',
      amount: 'Rp 50.000.000',
      duration: '24 Bulan',
      logo: require('../../assets/bni.png'),
      provider: 'MasterCard',
      annualFee: 'Rp 300.000',
      extraCardFee: 'Rp 150.000',
      purchaseRate: '1,75%',
      cashbackRate: '-',
      withdrawalFee: '6% dari jumlah penarikan atau min Rp 150.000',
      lateFee: '1% dari total tagihan atau max Rp 100.000',
      minimumIncome: 'Rp 3.000.000 / Bulan',
      maxAge: '65 tahun',
      minAge: '21 tahun',
      minExtraAge: '17 tahun',
    },
    {
      id: '3',
      name: 'BCA Mastercard',
      amount: 'Rp 75.000.000',
      duration: '36 Bulan',
      logo: require('../../assets/bca.png'),
      provider: 'Visa',
      annualFee: 'Rp 250.000',
      extraCardFee: 'Rp 120.000',
      purchaseRate: '1,50%',
      cashbackRate: '2%',
      withdrawalFee: '5% dari jumlah penarikan atau min Rp 100.000',
      lateFee: '2% dari total tagihan atau max Rp 200.000',
      minimumIncome: 'Rp 4.000.000 / Bulan',
      maxAge: '60 tahun',
      minAge: '21 tahun',
      minExtraAge: '18 tahun',
    },
  ];

  const tableData = [
    { title: 'Provider Kartu', key: 'title' },
    { title: 'Iuran Tahunan', key: 'yearlyFee' },
    { title: 'Biaya tahunan Kartu tambahan', key: 'additionalCardAnnualFee' },
    { title: 'Purchase Rate', key: 'purchaseRate' },
    { title: 'Cashback Rate', key: 'cashbackRate' },
    { title: 'Biaya penarikan tunai minimum', key: 'monthlyIncomeMinimum' },
    { title: 'Denda keterlambatan pembayaran', key: 'yearlyIncomeMinimum' },
    { title: 'Penghasilan Minimal', key: 'minimumIncome' },
    { title: 'Usia maks. pemegang kartu utama', key: 'mainCardMinimumAge' },
    { title: 'Usia min. pemegang kartu utama', key: 'mainCardMaximumAge' },
    { title: 'Usia min. pemegang kartu tambahan', key: 'additionalCardMinimumAge' },
  ];

  return (
    <View style={styles.container}>
      <View
        style={{
          marginBottom: 45,
          marginTop: 10,
          paddingLeft: 100,
          width: Dimensions.get('window').width,
        }}>
        <FlatList
          data={details}
          horizontal
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.logoList}
          renderItem={({ item }) => (
            <View style={styles.logoContainer}>
              <Image source={{ uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${item.imageLink}`}} style={styles.logo} />
              <Text style={styles.logoText}>{item.title}</Text>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => props.navigation.navigate('Kartu Kredit Detail', { idDetail: item.id })}
              >
                <Text style={{ color: 'red', marginRight: 5 }}>Selengkapnya</Text>
                <MaterialIcons name="open-in-new" color={'red'} />
              </TouchableOpacity>

            </View>
          )}
        />
      </View>

      <View style={styles.floatingColumn}>
        <View style={{ marginTop: 140 }} />
        {tableData.map((row) => (
          <View key={row.key} style={styles.cellFloating}>
            <Text style={styles.cellTextFloating}>{row.title}</Text>
          </View>
        ))}
      </View>

      <ScrollView horizontal style={{ marginTop: -35 }}>
        <View style={styles.tableContent}>
          {details.map((item) => (
            <View key={item.id} style={styles.tableColumn}>
              {tableData.map((row) => (
                <View key={row.key} style={styles.cell}>
                  <Text style={styles.cellText}>{item[row.key] || '-'}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: 'white' },
  logoList: { paddingBottom: 10 },
  logoContainer: { alignItems: 'center', marginHorizontal: 50 },
  logo: { width: 120, height: 80, resizeMode: 'contain' },
  logoText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },

  floatingColumn: {
    position: 'absolute',
    left: 5,
    top: 10,
    backgroundColor: 'white',
    height: Dimensions.get('window').height - 100,
    width: 150,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 50, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 10,
    borderTopRightRadius: 20,
  },
  cellFloating: {
    width: 150,
    maxHeight: 60, // Pastikan tinggi minimal sama dengan table cell
    padding: 15,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center', // Biar teks sejajar tengah
  },
  tableContent: {
    flexDirection: 'row',
    marginLeft: 160,

    alignItems: 'flex-start', // Pastikan konten rata atas
  },
  tableColumn: {
    flexDirection: 'column',
  },
  cell: {
    width: 150,
    maxHeight: 55, // Samakan tinggi dengan cellFloating
    padding: 15,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center', // Pastikan isi rata tengah
  },
  cellText: { textAlign: 'center' },
  cellTextFloating: { textAlign: 'left', fontSize: 11, fontWeight: 'bold' },
});

export default CompareScreenKartu;
