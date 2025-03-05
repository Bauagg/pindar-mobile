import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';

const KartuKreditScreen = () => {
  const [activeTab, setActiveTab] = useState('Semua');
  const [selectedIssuer, setSelectedIssuer] = useState('Semua');

  const tabs = ['Semua', 'Premium', 'First Card'];
  const issuers = ['Semua', 'BCA', 'BNI', 'Mandiri'];

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

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image source={item.logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.cardTitle}>{item.name}</Text>
      </View>
      <Text style={styles.cardFee}>{item.fee}</Text>
      <Text style={styles.cardBenefit}>{item.benefit}</Text>
      <View style={styles.divider} />
      <Text style={styles.featureTitle}>Fitur</Text>
      {item.features.map((feature, index) => (
        <View key={index} style={styles.featureItem}>
          <FontAwesome name="check-circle" size={16} color="green" />
          <Text style={styles.featureText}>{feature}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Penerbit Kartu</Text>
        <Picker
          selectedValue={selectedIssuer}
          onValueChange={(itemValue) => setSelectedIssuer(itemValue)}
          style={styles.picker}>
          {issuers.map((issuer) => (
            <Picker.Item key={issuer} label={issuer} value={issuer} />
          ))}
        </Picker>
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
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContainer}
      />
      <TouchableOpacity style={styles.filterFloating}>
        <Text style={styles.filterFloatingText}>FILTER</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  pickerLabel: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  picker: { width: 150, height: 40 },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },
  filterWrapper: { marginHorizontal: 5, borderRadius: 20, overflow: 'hidden' },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  activeFilter: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20 },
  filterText: { color: 'gray', fontWeight: 'bold' },
  filterTextActive: { color: 'white', fontWeight: 'bold' },
  flatListContainer: { paddingHorizontal: 16, paddingBottom: 100 },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 50, height: 50, marginRight: 10 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  cardFee: { fontSize: 16, fontWeight: 'bold', color: 'red', marginTop: 5 },
  cardBenefit: { color: 'gray', fontSize: 12 },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 10 },
  featureTitle: { fontSize: 14, fontWeight: 'bold' },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  featureText: { marginLeft: 5, fontSize: 12 },
  filterFloating: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    marginLeft: -40,
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 5,
  },
  filterFloatingText: { color: 'white', fontWeight: 'bold' },
});

export default KartuKreditScreen;
