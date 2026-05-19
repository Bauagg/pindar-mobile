import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from '@expo-google-fonts/lexend';

const FilterModal = ({ visible, onClose, onApply }) => {
  const [fontsLoaded] = useFonts({ Lexend_400Regular, Lexend_700Bold });

  const [selectedLoanType, setSelectedLoanType] = useState('');
  const [selectedPaymentType, setSelectedPaymentType] = useState('');
  const [selectedSort, setSelectedSort] = useState('recommended');

  const loanTypes = [
    { id: '', label: 'Semua' },
    { id: 'LOAN_TYPE_1', label: 'Kurang dari 1 Juta' },
    { id: 'LOAN_TYPE_2', label: '0 – 1 Juta' },
  ];

  const paymentTypes = [
    { id: '', label: 'Semua Pinjaman' },
    { id: 'PAYMENT_TYPE_1', label: 'Sekali Bayar' },
    { id: 'PAYMENT_TYPE_2', label: 'Cicilan' },
  ];

  const sortOptions = [
    { id: 'recommended', label: 'Produk Pilihan' },
    { id: 'lowest', label: 'Plafond Terendah' },
    { id: 'highest', label: 'Plafond Tertinggi' },
  ];

  const applyFilters = () => {
    const filters = [];
    if (selectedLoanType) filters.push(selectedLoanType);
    if (selectedPaymentType) filters.push(selectedPaymentType);
    if (selectedSort) filters.push(selectedSort);
    if (onApply) onApply(filters);
  };

  const RadioOption = ({ selected, onPress, label }) => (
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

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Filter</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={18} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            {/* Jumlah Pinjaman */}
            <Text style={styles.sectionTitle}>Jumlah Pinjaman</Text>
            {loanTypes.map((item) => (
              <RadioOption
                key={item.id}
                selected={selectedLoanType === item.id}
                onPress={() => setSelectedLoanType(item.id)}
                label={item.label}
              />
            ))}

            {/* Jenis Pinjaman */}
            <Text style={styles.sectionTitle}>Jenis Pinjaman</Text>
            {paymentTypes.map((item) => (
              <RadioOption
                key={item.id}
                selected={selectedPaymentType === item.id}
                onPress={() => setSelectedPaymentType(item.id)}
                label={item.label}
              />
            ))}

            {/* Urutkan */}
            <Text style={styles.sectionTitle}>Urutkan</Text>
            {sortOptions.map((item) => (
              <RadioOption
                key={item.id}
                selected={selectedSort === item.id}
                onPress={() => setSelectedSort(item.id)}
                label={item.label}
              />
            ))}

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
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 24,
  },
  dragHandle: {
    backgroundColor: '#E0DDDD',
    height: 5, width: 50,
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerText: {
    fontSize: 20,
    fontFamily: 'Lexend_700Bold',
    color: '#1A1A2E',
  },
  closeButton: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#F0F0F0',
    alignItems: 'center', justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Lexend_700Bold',
    color: '#1A1A2E',
    marginTop: 16,
    marginBottom: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    gap: 12,
  },
  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: '#DDD',
    alignItems: 'center', justifyContent: 'center',
  },
  radioSelected: { borderColor: '#CC1C22' },
  radioDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#CC1C22',
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Lexend_400Regular',
    color: '#333',
  },
  applyButton: {
    marginTop: 12,
    backgroundColor: '#CC1C22',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  applyText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Lexend_700Bold',
  },
});

export default FilterModal;
