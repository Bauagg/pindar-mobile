import React, { useState } from 'react';
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
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_900Black,
} from '@expo-google-fonts/lexend';
import { Picker } from '@react-native-picker/picker';

const FilterModalKartu = ({ visible, onClose }) => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedSorting, setSelectedSorting] = useState('');
  const [selectedIssuer, setSelectedIssuer] = useState('Semua');
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(3500000);
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
    Lexend_500Medium,
    Lexend_600SemiBold,
    Lexend_900Black,
  });

  if (!fontsLoaded) {
    return null; // atau bisa diganti dengan loading screen
  }
  const selectAll = () => {
    if (selectedFilters.length === features.length) {
      setSelectedFilters([]); // Uncheck all
    } else {
      setSelectedFilters(features.map((f) => f.id)); // Check all
    }
  };
  const toggleSorting = (id) => {
    setSelectedSorting(id === selectedSorting ? '' : id);
  };

  const issuers = ['Semua', 'BCA', 'BNI', 'Mandiri'];
  const features = [
    { id: 'welcome_bonus', label: 'Welcome Bonus' },
    { id: 'dining', label: 'Dining' },
    { id: 'reward', label: 'Reward' },
    { id: 'travel', label: 'Travel' },
    { id: 'premium', label: 'Premium' },
    { id: 'gasoline', label: 'Gasoline' },
  ];

  const urutData = [
    { id: 'terbaru', label: 'Iuran Tahunan Terendah' },
    { id: 'terlama', label: 'Iuran Tahunan Tertinggi' },
  ];

  const toggleFilter = (id) => {
    setSelectedFilters((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            onPress={onClose}
            style={{
              backgroundColor: '#E0DDDD',
              height: 5,
              width: 50,
              alignItems: 'center',
              alignSelf: 'center',
              borderRadius: 10,
            }}
          />
          <View style={styles.header}>
            <Text style={styles.headerText}>Filter</Text>
            <TouchableOpacity
              onPress={selectAll}
              style={styles.selectAllButton}>
              <FontAwesome
                name={
                  selectedFilters.length === features.length
                    ? 'check-square'
                    : 'square-o'
                }
                size={20}
                color="#CC1C22"
              />
              <Text style={styles.selectAllText}> Select all</Text>
            </TouchableOpacity>
          </View>

          {/* OPTIONS */}
          <FlatList
            data={[{ id: 'dummy' }]} // Gunakan dummy data agar tetap bisa di-render
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            renderItem={() => (
              <View>
                <View style={styles.pickerContainer}>
                  <Text style={styles.sectionTitle}>Penerbit Kartu</Text>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={selectedIssuer}
                      onValueChange={(itemValue) =>
                        setSelectedIssuer(itemValue)
                      }
                      style={styles.picker}>
                      {issuers.map((issuer) => (
                        <Picker.Item
                          key={issuer}
                          label={issuer}
                          value={issuer}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
                <Text style={styles.sectionTitle}>Fitur</Text>
                {features.map((feature) => (
                  <TouchableOpacity
                    key={feature.id}
                    style={styles.option}
                    onPress={() => toggleFilter(feature.id)}>
                    <FontAwesome
                      name={
                        selectedFilters.includes(feature.id)
                          ? 'check-square'
                          : 'square-o'
                      }
                      size={20}
                      color="#CC1C22"
                    />
                    <Text style={styles.optionText}>{feature.label}</Text>
                  </TouchableOpacity>
                ))}

                {/* Iuran Tahunan */}
                <Text style={styles.sectionTitle}>Iuran Tahunan</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Min"
                    keyboardType="numeric"
                    value={minValue.toString()}
                    onChangeText={(text) => setMinValue(Number(text) || 0)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Max"
                    keyboardType="numeric"
                    value={maxValue.toString()}
                    onChangeText={(text) =>
                      setMaxValue(Number(text) || 3500000)
                    }
                  />
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={3500000}
                  minimumTrackTintColor="#CC1C22"
                  maximumTrackTintColor="#E0DDDD"
                  thumbTintColor="#CC1C22"
                  value={maxValue}
                  onValueChange={(value) => setMaxValue(value)}
                />
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabel}>Rp 0</Text>
                  <Text style={styles.sliderLabel}>
                    Rp {maxValue.toLocaleString()}
                  </Text>
                </View>
                <Text style={styles.sectionTitle}>Penghasilan Tahunan</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Min"
                    keyboardType="numeric"
                    value={minValue.toString()}
                    onChangeText={(text) => setMinValue(Number(text) || 0)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Max"
                    keyboardType="numeric"
                    value={maxValue.toString()}
                    onChangeText={(text) =>
                      setMaxValue(Number(text) || 3500000)
                    }
                  />
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={3500000}
                  minimumTrackTintColor="#CC1C22"
                  maximumTrackTintColor="#E0DDDD"
                  thumbTintColor="#CC1C22"
                  value={maxValue}
                  onValueChange={(value) => setMaxValue(value)}
                />
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabel}>Rp 0</Text>
                  <Text style={styles.sliderLabel}>
                    Rp {maxValue.toLocaleString()}
                  </Text>
                </View>
                <View style={{ marginTop: 20 }}>
                  <Text style={styles.headerText}>Urutkan</Text>
                  {urutData.map((urut) => (
                    <TouchableOpacity
                      key={urut.id}
                      style={styles.option}
                      onPress={() => toggleSorting(urut.id)}>
                      <FontAwesome
                        name={
                          selectedSorting === urut.id
                            ? 'check-square'
                            : 'square-o'
                        }
                        size={20}
                        color="#CC1C22"
                      />
                      <Text style={styles.optionText}>{urut.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          />

          {/* End OPTIONS */}
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  selectAllButton: { flexDirection: 'row', alignItems: 'center' },
  selectAllText: {
    color: '#CC1C22',
    marginLeft: 5,
    fontWeight: 'bold',
    fontFamily: 'Lexend-Regular',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    // paddingHorizontal: 10,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  modalContainer: {
    width: '100%',
    height: '60%', // Batasi tinggi modal ke 50%
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'Lexend_700Bold',
    // fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    alignSelf: 'flex-start',
    fontFamily: 'Lexend_700Bold',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  optionText: {
    fontSize: 14,
    marginLeft: 10,
    fontFamily: 'Lexend_400Regular',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0DDDD',
    borderRadius: 5,
    padding: 8,
    marginHorizontal: 5,
    textAlign: 'center',
  },
  slider: {
    width: '100%',
    marginTop: 10,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  sliderLabel: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'Lexend_400Regular',
  },
  closeButton: {
    backgroundColor: '#CC1C22',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickerContainer: {
    // flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    // paddingHorizontal: 70,
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
    marginLeft: -210,
    marginTop: 10,
    overflow: 'hidden', // Agar border radius diterapkan ke Picker
  },
  picker: {
    width: 150,
    height: 50,
    color: '#4B4B63',
  },
};

export default FilterModalKartu;
