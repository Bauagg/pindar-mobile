import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const CompareScreen = (props) => {
  const navDetails = () => {
    props.navigation.navigate('Informasi Detail');
  };
  const selectedItems = [
    {
      id: '1',
      name: 'Akulaku',
      amount: 'Rp 50.000.000',
      duration: '24 Bulan',
      logo: require('../../assets/akulaku.png'),
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
      name: 'Indodana',
      amount: 'Rp 50.000.000',
      duration: '24 Bulan',
      logo: require('../../assets/indodana.png'),
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
      name: 'Kredivo',
      amount: 'Rp 75.000.000',
      duration: '36 Bulan',
      logo: require('../../assets/akulaku.png'),
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
    { title: 'Provider Kartu', key: 'provider' },
    { title: 'Iuran Tahunan', key: 'annualFee' },
    { title: 'Biaya tahunan Kartu tambahan', key: 'extraCardFee' },
    { title: 'Purchase Rate', key: 'purchaseRate' },
    { title: 'Cashback Rate', key: 'cashbackRate' },
    { title: 'Biaya penarikan tunai minimum', key: 'withdrawalFee' },
    { title: 'Denda keterlambatan pembayaran', key: 'lateFee' },
    { title: 'Penghasilan Minimal', key: 'minimumIncome' },
    { title: 'Usia maks. pemegang kartu utama', key: 'maxAge' },
    { title: 'Usia min. pemegang kartu utama', key: 'minAge' },
    { title: 'Usia min. pemegang kartu tambahan', key: 'minExtraAge' },
  ];

  return (
    <View style={styles.container}>
      <View
        style={{
          marginBottom: 45,
          marginTop: 10,
          paddingHorizontal: 10,
          width: Dimensions.get('window').width,
        }}>
        <FlatList
          data={selectedItems}
          horizontal
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.logoList}
          renderItem={({ item }) => (
            <View style={styles.logoContainer}>
              <Image source={item.logo} style={styles.logo} />
              <Text style={styles.logoText}>{item.name}</Text>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={navDetails}>
                <Text style={{ color: 'red', marginRight: 5 }}>
                  Baca Selengkapnya
                </Text>
                <MaterialIcons name="open-in-new" color={'red'} />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <View style={styles.floatingColumn}>
        {tableData.map((row) => (
          <View key={row.key} style={styles.cellFloating}>
            <Text style={styles.cellTextFloating}>{row.title}</Text>
          </View>
        ))}
      </View>

      <ScrollView horizontal style={{ marginTop: -35 }}>
        <View style={styles.tableContent}>
          {selectedItems.map((item) => (
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
  logo: { width: 50, height: 50, resizeMode: 'contain' },
  logoText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },

  floatingColumn: {
    position: 'absolute',
    left: 10,
    top: 130,
    backgroundColor: 'white',
    width: 150,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 50, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 10,
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

export default CompareScreen;
