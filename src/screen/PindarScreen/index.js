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
import FilterModal from './FilterModal';

const PindarScreen = (props) => {
  const [activeTab, setActiveTab] = useState('Semua');
  const [selectedItems, setSelectedItems] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  console.log(isModalVisible);

  const tabs = ['Semua', 'Sekali bayar', 'Cicilan'];
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
      if (isSelected) {
        return prevSelected.filter((selected) => selected.id !== item.id);
      } else {
        return [...prevSelected, item];
      }
    });
  };
  const renderItem = ({ item }) => {
    const isChecked = selectedItems.some((selected) => selected.id === item.id);

    return (
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <Image source={item.logo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.cardTitle}>{item.name}</Text>
        </View>

        <View style={styles.divider} />

        {/* Content */}
        <Text style={styles.cardSubtitle}>Maksimal Pinjaman</Text>
        <Text style={styles.cardAmount}>{item.amount}</Text>

        <View style={styles.row}>
          <Text style={styles.cardSubtitle}>Maksimal Lama Pinjam</Text>
          <Text style={styles.cardDuration}>{item.duration}</Text>
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
      {/* Tab Filter */}
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

      {/* FlatList untuk daftar kartu */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContainer}
      />

      {selectedItems.length > 0 && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={() =>
            props.navigation.navigate('Compare', { selectedItems })
          }>
          <View style={styles.overlayContent}>
            <Image
              source={require('../../assets/menu2.png')}
              style={styles.icon}
            />
            <View style={styles.textContainer}>
              <Text style={styles.title}>
                <Text style={styles.number}>{selectedItems.length}</Text>{' '}
                Pinjaman yang anda bandingkan
              </Text>
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
          <Text style={styles.filterFloatingText}>FILTER</Text>
        </LinearGradient>
      </TouchableOpacity>
      <FilterModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
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
  filterText: { color: 'gray', fontWeight: 'bold' },
  filterTextActive: { color: 'white', fontWeight: 'bold' },
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
  cardSubtitle: { color: 'gray', fontSize: 12 },
  cardAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
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
  detailText: { color: 'red', marginRight: 5 },
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
  compareText: { color: 'black', marginLeft: 5 },
  applyGradient: {
    // backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  applyText: { color: 'white', fontWeight: 'bold' },

  bottomText: { color: 'gray' },
  bottomAmount: { fontSize: 18, fontWeight: 'bold' },
  filterFloating: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    marginLeft: -40,
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    elevation: 5,
  },
  filterFloatingText: { color: 'white', fontWeight: 'bold' },
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
  number: { fontSize: 20, fontWeight: 'bold' },
  subtitle: { fontSize: 12, color: '#666' },
  arrow: { fontSize: 20, color: '#CC1C22', fontWeight: 'bold' },
});

export default PindarScreen;
