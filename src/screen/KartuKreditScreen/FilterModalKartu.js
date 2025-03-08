import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

const FilterModalKartu = ({ visible, onClose }) => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(3500000);

  const features = [
    { id: 'welcome_bonus', label: 'Welcome Bonus' },
    { id: 'dining', label: 'Dining' },
    { id: 'reward', label: 'Reward' },
    { id: 'travel', label: 'Travel' },
    { id: 'premium', label: 'Premium' },
    { id: 'gasoline', label: 'Gasoline' },
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
          <Text style={styles.headerText}>Filter</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Tutup</Text>
          </TouchableOpacity>

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

          <Text style={styles.sectionTitle}>Iuran Tahunan</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Min"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Max"
              keyboardType="numeric"
            />
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={3500000}
            minimumTrackTintColor="#CC1C22"
            maximumTrackTintColor="#E0DDDD"
            thumbTintColor="#CC1C22"
            onValueChange={(value) => setMaxValue(value)}
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>Rp 0</Text>
            <Text style={styles.sliderLabel}>
              Rp {maxValue.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    alignSelf: 'flex-start',
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
};

export default FilterModalKartu;
