import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const FilterModal = ({ visible, onClose, onApply}) => {
  const [selectedFilters, setSelectedFilters] = useState([]);

  const toggleFilter = (id) => {
    const newFilters = selectedFilters.includes(id)
      ? selectedFilters.filter((item) => item !== id)
      : [...selectedFilters, id];

    setSelectedFilters(newFilters);
    if (onApply) {
      onApply(newFilters); // otomatis kirim ke parent
    }
  };

  const filters = [
    { id: '', label: 'Semua' },
    { id: 'LOAN_TYPE_1', label: 'Kurang dari 1 Juta' },
    { id: 'LOAN_TYPE_2', label: '0 - 1 Juta' },
  ];

  const loanTypes = [
    { id: '', label: 'Semua Pinjaman' },
    { id: 'PAYMENT_TYPE_1', label: 'Sekali Bayar' },
    { id: 'PAYMENT_TYPE_2', label: 'Cicilan' },
  ];

  const sortingOptions = [
    { id: 'recommended', label: 'Produk Pilihan' },
    { id: 'lowest', label: 'Plafond Terendah' },
    { id: 'highest', label: 'Plafond Tertinggi' },
  ];



  const selectAll = () => {
    if (
      selectedFilters.length ===
      filters.length + loanTypes.length + sortingOptions.length
    ) {
      setSelectedFilters([]);
    } else {
      setSelectedFilters([
        ...filters.map((f) => f.id),
        ...loanTypes.map((t) => t.id),
        ...sortingOptions.map((s) => s.id),
      ]);
    }
  };

  useEffect(() => {
    if (onApply) {
      onApply(selectedFilters);
    }
  }, [selectedFilters]);
  

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
                  selectedFilters.length ===
                  filters.length + loanTypes.length + sortingOptions.length
                    ? 'check-square'
                    : 'square-o'
                }
                size={20}
                color="#CC1C22"
              />
              <Text style={styles.selectAllText}> Select all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <Text style={styles.sectionTitle}>Jumlah Pinjaman</Text>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={styles.option}
                onPress={() => toggleFilter(filter.id)}>
                <FontAwesome
                  name={
                    selectedFilters.includes(filter.id)
                      ? 'check-square'
                      : 'square-o'
                  }
                  size={20}
                  color="#CC1C22"
                />
                <Text style={styles.optionText}>{filter.label}</Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.sectionTitle}>Jenis Pinjaman</Text>
            {loanTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={styles.option}
                onPress={() => toggleFilter(type.id)}>
                <FontAwesome
                  name={
                    selectedFilters.includes(type.id)
                      ? 'check-square'
                      : 'square-o'
                  }
                  size={20}
                  color="#CC1C22"
                />
                <Text style={styles.optionText}>{type.label}</Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.sectionTitle}>Urutkan</Text>
            {sortingOptions.map((sort) => (
              <TouchableOpacity
                key={sort.id}
                style={styles.option}
                onPress={() => toggleFilter(sort.id)}>
                <FontAwesome
                  name={
                    selectedFilters.includes(sort.id)
                      ? 'check-square'
                      : 'square-o'
                  }
                  size={20}
                  color="#CC1C22"
                />
                <Text style={styles.optionText}>{sort.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Tutup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Lexend-Regular',
  },
  selectAllButton: { flexDirection: 'row', alignItems: 'center' },
  selectAllText: {
    color: '#CC1C22',
    marginLeft: 5,
    fontWeight: 'bold',
    fontFamily: 'Lexend-Regular',
  },
  content: { marginTop: 10 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    fontFamily: 'Lexend-Regular',
  },
  option: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  optionText: {
    fontSize: 14,
    marginLeft: 10,
    color: '#333',
    fontFamily: 'Lexend-Regular',
  },
  closeButton: {
    backgroundColor: '#CC1C22',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Lexend-Regular',
  },
};

export default FilterModal;
