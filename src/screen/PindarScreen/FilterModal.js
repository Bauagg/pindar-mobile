import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from '@expo-google-fonts/lexend';

const FilterModal = ({ visible, onClose, onApply }) => {
  const [fontsLoaded] = useFonts({ Lexend_400Regular, Lexend_700Bold });

  const [selectedLoanTypes, setSelectedLoanTypes] = useState([]);
  const [selectedPaymentTypes, setSelectedPaymentTypes] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  const loanTypes = [
    { id: 'KTA', label: 'KTA' },
    { id: 'KPR', label: 'KPR' },
    { id: 'KKB', label: 'KKB' },
    { id: 'MULTIGUNA', label: 'Multiguna' },
  ];

  const paymentTypes = [
    { id: 'BULANAN', label: 'Bulanan' },
    { id: 'MINGGUAN', label: 'Mingguan' },
    { id: 'HARIAN', label: 'Harian' },
  ];

  const sortOptions = [
    { id: 'lender_name', label: 'Nama Pinjaman' },
    { id: 'max_loan', label: 'Plafond' },
    { id: 'max_tenor', label: 'Tenor' },
  ];

  const toggleMulti = (id, selected, setSelected) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const reset = () => {
    setSelectedLoanTypes([]);
    setSelectedPaymentTypes([]);
    setSortBy('');
    setSortDirection('asc');
  };

  const applyFilters = () => {
    const filters = {
      loanType: selectedLoanTypes.join(','),
      paymentType: selectedPaymentTypes.join(','),
      sortBy,
      sortDirection,
    };
    if (onApply) onApply(filters);
  };

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

            {/* Jenis Pinjaman — multiple */}
            <Text style={styles.sectionTitle}>Jenis Pinjaman</Text>
            {loanTypes.map(item => (
              <CheckOption
                key={item.id}
                id={item.id}
                label={item.label}
                selected={selectedLoanTypes.includes(item.id)}
                onPress={() => toggleMulti(item.id, selectedLoanTypes, setSelectedLoanTypes)}
              />
            ))}

            {/* Tipe Pembayaran — multiple */}
            <Text style={styles.sectionTitle}>Tipe Pembayaran</Text>
            {paymentTypes.map(item => (
              <CheckOption
                key={item.id}
                id={item.id}
                label={item.label}
                selected={selectedPaymentTypes.includes(item.id)}
                onPress={() => toggleMulti(item.id, selectedPaymentTypes, setSelectedPaymentTypes)}
              />
            ))}

            {/* Urutkan — single */}
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

            {/* Arah — hanya muncul kalau sortBy dipilih */}
            {sortBy !== '' && (
              <>
                <Text style={styles.sectionTitle}>Urutan</Text>
                <RadioOption
                  id="asc"
                  label="Ascending (A–Z / Terkecil)"
                  selected={sortDirection === 'asc'}
                  onPress={() => setSortDirection('asc')}
                />
                <RadioOption
                  id="desc"
                  label="Descending (Z–A / Terbesar)"
                  selected={sortDirection === 'desc'}
                  onPress={() => setSortDirection('desc')}
                />
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
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    width: '100%',
    height: '80%',
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
  resetText: {
    fontSize: 13,
    fontFamily: 'Lexend_400Regular',
    color: '#CC1C22',
  },
  closeButton: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#F0F0F0',
    alignItems: 'center', justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Lexend_700Bold',
    color: '#1A1A2E',
    marginTop: 16,
    marginBottom: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  checkbox: {
    width: 20, height: 20, borderRadius: 6,
    borderWidth: 2, borderColor: '#DDD',
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: '#CC1C22', borderColor: '#CC1C22' },
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
    fontSize: 13,
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
