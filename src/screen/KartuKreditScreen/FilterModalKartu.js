import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from '@expo-google-fonts/lexend';
import api from '../../utils/axios';

const FilterModalKartu = ({ visible, onClose, onApply }) => {
  const [fontsLoaded] = useFonts({ Lexend_400Regular, Lexend_700Bold });

  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [minYearlyFee, setMinYearlyFee] = useState(0);
  const [maxYearlyFee, setMaxYearlyFee] = useState(5000000);
  const [minYearlyIncome, setMinYearlyIncome] = useState(0);
  const [maxYearlyIncome, setMaxYearlyIncome] = useState(500000000);
  const [sortBy, setSortBy] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  const [features, setFeatures] = useState([]);

  const sortOptions = [
    { id: 'yearly_fee', label: 'Iuran Tahunan' },
  ];

  const getFeatures = async () => {
    try {
      const res = await api.get('/credit-card/card-feature');
      setFeatures(res.data.data.features || []);
    } catch (e) {
      console.error('Gagal ambil fitur:', e);
    }
  };

  useEffect(() => {
    if (visible) getFeatures();
  }, [visible]);

  const toggleFeature = (id) => {
    setSelectedFeatures(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const reset = () => {
    setSelectedFeatures([]);
    setMinYearlyFee(0);
    setMaxYearlyFee(5000000);
    setMinYearlyIncome(0);
    setMaxYearlyIncome(500000000);
    setSortBy('');
    setSortDirection('asc');
  };

  const applyFilters = () => {
    const payload = {
      featureIds: selectedFeatures.join(','),
      minYearlyFee,
      maxYearlyFee,
      minYearlyIncome,
      maxYearlyIncome,
      sortBy,
      sortDirection,
    };
    if (onApply) onApply(payload);
  };

  const fmt = (val) => `Rp ${Math.round(val).toLocaleString('id-ID')}`;

  const CheckOption = ({ id, label, selected, onPress }) => (
    <TouchableOpacity style={styles.option} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.checkbox, selected && styles.checkboxActive]}>
        {selected && <Ionicons name="checkmark" size={11} color="white" />}
      </View>
      <Text style={styles.optionText}>{label}</Text>
    </TouchableOpacity>
  );

  const RadioOption = ({ id, label, selected, onPress }) => (
    <TouchableOpacity style={styles.option} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioDot} />}
      </View>
      <Text style={styles.optionText}>{label}</Text>
    </TouchableOpacity>
  );

  if (!fontsLoaded) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.container} activeOpacity={1} onPress={() => {}}>
          <View style={styles.dragHandle} />

          <View style={styles.header}>
            <Text style={styles.headerText}>Filter</Text>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <TouchableOpacity onPress={reset}>
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={18} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>

            {/* Fitur — multiple */}
            <Text style={styles.sectionTitle}>Fitur Kartu</Text>
            {features.map(f => (
              <CheckOption
                key={f.id}
                id={f.id}
                label={f.featureName}
                selected={selectedFeatures.includes(f.id)}
                onPress={() => toggleFeature(f.id)}
              />
            ))}

            {/* Iuran Tahunan */}
            <Text style={styles.sectionTitle}>Iuran Tahunan</Text>
            <View style={styles.rangeLabels}>
              <Text style={styles.rangeText}>{fmt(minYearlyFee)}</Text>
              <Text style={styles.rangeText}>{fmt(maxYearlyFee)}</Text>
            </View>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Min"
                keyboardType="numeric"
                value={minYearlyFee === 0 ? '' : minYearlyFee.toString()}
                onChangeText={t => setMinYearlyFee(Number(t) || 0)}
              />
              <TextInput
                style={styles.input}
                placeholder="Max"
                keyboardType="numeric"
                value={maxYearlyFee === 5000000 ? '' : maxYearlyFee.toString()}
                onChangeText={t => setMaxYearlyFee(Number(t) || 5000000)}
              />
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={5000000}
              step={50000}
              value={maxYearlyFee}
              onValueChange={setMaxYearlyFee}
              minimumTrackTintColor="#CC1C22"
              maximumTrackTintColor="#E0DDDD"
              thumbTintColor="#CC1C22"
            />

            {/* Penghasilan Tahunan */}
            <Text style={styles.sectionTitle}>Penghasilan Tahunan</Text>
            <View style={styles.rangeLabels}>
              <Text style={styles.rangeText}>{fmt(minYearlyIncome)}</Text>
              <Text style={styles.rangeText}>{fmt(maxYearlyIncome)}</Text>
            </View>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Min"
                keyboardType="numeric"
                value={minYearlyIncome === 0 ? '' : minYearlyIncome.toString()}
                onChangeText={t => setMinYearlyIncome(Number(t) || 0)}
              />
              <TextInput
                style={styles.input}
                placeholder="Max"
                keyboardType="numeric"
                value={maxYearlyIncome === 500000000 ? '' : maxYearlyIncome.toString()}
                onChangeText={t => setMaxYearlyIncome(Number(t) || 500000000)}
              />
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={500000000}
              step={1000000}
              value={maxYearlyIncome}
              onValueChange={setMaxYearlyIncome}
              minimumTrackTintColor="#CC1C22"
              maximumTrackTintColor="#E0DDDD"
              thumbTintColor="#CC1C22"
            />

            {/* Urutkan */}
            <Text style={styles.sectionTitle}>Urutkan</Text>
            {sortOptions.map(item => (
              <RadioOption
                key={item.id}
                id={item.id}
                label={item.label}
                selected={sortBy === item.id}
                onPress={() => setSortBy(sortBy === item.id ? '' : item.id)}
              />
            ))}
            {sortBy !== '' && (
              <>
                <Text style={styles.sectionTitle}>Urutan</Text>
                <RadioOption id="asc" label="Terendah" selected={sortDirection === 'asc'} onPress={() => setSortDirection('asc')} />
                <RadioOption id="desc" label="Tertinggi" selected={sortDirection === 'desc'} onPress={() => setSortDirection('desc')} />
              </>
            )}

            <View style={{ height: 20 }} />
          </ScrollView>

          <TouchableOpacity style={styles.applyButton} onPress={applyFilters} activeOpacity={0.85}>
            <Text style={styles.applyText}>Terapkan Filter</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end',
  },
  container: {
    width: '100%', height: '85%', backgroundColor: 'white',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 20, paddingBottom: 24,
  },
  dragHandle: {
    backgroundColor: '#E0DDDD', height: 5, width: 50,
    alignSelf: 'center', borderRadius: 10, marginBottom: 16,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 4,
  },
  headerText: { fontSize: 20, fontFamily: 'Lexend_700Bold', color: '#1A1A2E' },
  resetText: { fontSize: 13, fontFamily: 'Lexend_400Regular', color: '#CC1C22' },
  closeButton: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 13, fontFamily: 'Lexend_700Bold', color: '#1A1A2E',
    marginTop: 16, marginBottom: 8,
  },
  option: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 12 },
  checkbox: {
    width: 20, height: 20, borderRadius: 6, borderWidth: 2, borderColor: '#DDD',
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: '#CC1C22', borderColor: '#CC1C22' },
  radio: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#DDD',
    alignItems: 'center', justifyContent: 'center',
  },
  radioSelected: { borderColor: '#CC1C22' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#CC1C22' },
  optionText: { fontSize: 13, fontFamily: 'Lexend_400Regular', color: '#333' },
  rangeLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  rangeText: { fontSize: 11, color: '#999', fontFamily: 'Lexend_400Regular' },
  inputRow: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  input: {
    flex: 1, borderWidth: 1, borderColor: '#E0E0E0',
    borderRadius: 10, padding: 10, fontSize: 13,
    fontFamily: 'Lexend_400Regular', color: '#1A1A2E',
  },
  slider: { width: '100%', height: 36 },
  applyButton: {
    marginTop: 12, backgroundColor: '#CC1C22',
    paddingVertical: 14, borderRadius: 14, alignItems: 'center',
  },
  applyText: { color: 'white', fontSize: 14, fontFamily: 'Lexend_700Bold' },
});

export default FilterModalKartu;
