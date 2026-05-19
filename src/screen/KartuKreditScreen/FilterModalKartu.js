import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from '@expo-google-fonts/lexend';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utils/axios';

const FilterModalKartu = ({ visible, onClose, onApply }) => {
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
  });

  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedSorting, setSelectedSorting] = useState('');
  const [selectedIssuer, setSelectedIssuer] = useState('Semua');
  const [minIuran, setMinIuran] = useState(0);
  const [maxIuran, setMaxIuran] = useState(3500000);
  const [minPenghasilan, setMinPenghasilan] = useState(0);
  const [maxPenghasilan, setMaxPenghasilan] = useState(3500000);
  const [features, setFeatures] = useState([]);
  const [publishers, setPublishers] = useState([]);

const issuers = [{ id: '', name: 'Semua' }, ...publishers.map((p) => ({
  id: p.id,
  name: p.publisherName,
}))];


  const urutData = [
    { id: 'terbaru', label: 'Iuran Tahunan Terendah' },
    { id: 'terlama', label: 'Iuran Tahunan Tertinggi' },
  ];

  const getFeatures = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await api.get('/credit-card/card-feature', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeatures(response.data.data.features);
    } catch (error) {
      console.error('Gagal mengambil fitur kartu kredit:', error);
    }
  };

  const getPublishers = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await api.get('/credit-card/card-publisher', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPublishers(response.data.data.publishers);
    } catch (error) {
      console.error('Gagal mengambil penerbit kartu:', error);
    }
  };

  const toggleFilter = (id) => {
    setSelectedFilters((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedFilters(
      selectedFilters.length === features.length ? [] : features.map((f) => f.id)
    );
  };

  const toggleSorting = (id) => {
    setSelectedSorting(id === selectedSorting ? '' : id);
  };

  const applyFilters = () => {
  const filterPayload = {
    issuer: selectedIssuer, // Sekarang ini ID, bukan nama
    features: selectedFilters,
    sort: selectedSorting,
    minIuran,
    maxIuran,
    minPenghasilan,
    maxPenghasilan,
  };
  if (onApply) onApply(filterPayload);
  onClose();
};


  useEffect(() => {
    if (visible) {
      getFeatures();
      getPublishers();
    }
  }, [visible]);

  if (!fontsLoaded) return null;
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={() => {}}>
          <View style={styles.dragHandle} />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.headerText}>Filter</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <TouchableOpacity onPress={selectAll} style={styles.selectAllButton}>
                  <FontAwesome
                    name={selectedFilters.length === features.length ? 'check-square' : 'square-o'}
                    size={20}
                    color="#CC1C22"
                  />
                  <Text style={styles.selectAllText}> Select all</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <FontAwesome name="times" size={18} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Penerbit */}
            <Text style={styles.sectionTitle}>Penerbit Kartu</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                  selectedValue={selectedIssuer}
                  onValueChange={(itemValue) => setSelectedIssuer(itemValue)}
                >
                  {issuers.map((issuer, index) => (
                    <Picker.Item key={index} label={issuer.name} value={issuer.id} />
                  ))}
                </Picker>

            </View>

            {/* Fitur */}
            <Text style={styles.sectionTitle}>Fitur</Text>
            {features.map((feature) => (
              <TouchableOpacity
                key={feature.id}
                style={styles.option}
                onPress={() => toggleFilter(feature.id)}
              >
                <FontAwesome
                  name={
                    selectedFilters.includes(feature.id)
                      ? 'check-square'
                      : 'square-o'
                  }
                  size={20}
                  color="#CC1C22"
                />
                <Text style={styles.optionText}>{feature.featureName}</Text>
              </TouchableOpacity>
            ))}

            {/* Iuran Tahunan */}
            <Text style={styles.sectionTitle}>Iuran Tahunan</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Min"
                keyboardType="numeric"
                value={minIuran.toString()}
                onChangeText={(text) => setMinIuran(Number(text) || 0)}
              />
              <TextInput
                style={styles.input}
                placeholder="Max"
                keyboardType="numeric"
                value={maxIuran.toString()}
                onChangeText={(text) => setMaxIuran(Number(text) || 3500000)}
              />
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={3500000}
              value={maxIuran}
              onValueChange={setMaxIuran}
              minimumTrackTintColor="#CC1C22"
              maximumTrackTintColor="#E0DDDD"
              thumbTintColor="#CC1C22"
            />
            <View style={styles.sliderLabels}>
              <Text>Rp 0</Text>
              <Text>Rp {maxIuran.toLocaleString()}</Text>
            </View>

            {/* Penghasilan Tahunan */}
            <Text style={styles.sectionTitle}>Penghasilan Tahunan</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Min"
                keyboardType="numeric"
                value={minPenghasilan.toString()}
                onChangeText={(text) => setMinPenghasilan(Number(text) || 0)}
              />
              <TextInput
                style={styles.input}
                placeholder="Max"
                keyboardType="numeric"
                value={maxPenghasilan.toString()}
                onChangeText={(text) => setMaxPenghasilan(Number(text) || 3500000)}
              />
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={3500000}
              value={maxPenghasilan}
              onValueChange={setMaxPenghasilan}
              minimumTrackTintColor="#CC1C22"
              maximumTrackTintColor="#E0DDDD"
              thumbTintColor="#CC1C22"
            />
            <View style={styles.sliderLabels}>
              <Text>Rp 0</Text>
              <Text>Rp {maxPenghasilan.toLocaleString()}</Text>
            </View>

            {/* Urutkan */}
            <Text style={styles.sectionTitle}>Urutkan</Text>
            {urutData.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.option}
                onPress={() => toggleSorting(item.id)}
              >
                <FontAwesome
                  name={
                    selectedSorting === item.id ? 'check-square' : 'square-o'
                  }
                  size={20}
                  color="#CC1C22"
                />
                <Text style={styles.optionText}>{item.label}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
              <Text style={styles.applyText}>Terapkan Filter</Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    width: '100%',
    height: '85%',
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  dragHandle: {
    backgroundColor: '#E0DDDD',
    height: 5,
    width: 50,
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'Lexend_700Bold',
    color: '#333',
  },
  selectAllButton: { flexDirection: 'row', alignItems: 'center' },
  closeButton: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center',
  },
  selectAllText: {
    color: '#CC1C22',
    marginLeft: 5,
    fontFamily: 'Lexend_400Regular',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Lexend_700Bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  optionText: {
    fontSize: 14,
    marginLeft: 10,
    fontFamily: 'Lexend_400Regular',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  applyButton: {
    marginTop: 20,
    backgroundColor: '#CC1C22',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  applyText: {
    color: 'white',
    fontFamily: 'Lexend_700Bold',
  },
};

export default FilterModalKartu;
