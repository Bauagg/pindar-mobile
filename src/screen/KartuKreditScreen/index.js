import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from '@expo-google-fonts/lexend';
import FilterModalKartu from './FilterModalKartu';
import api from '../../utils/axios';

const { width } = Dimensions.get('window');

const KartuKreditScreen = (props) => {
  const [fontsLoaded] = useFonts({ Lexend_400Regular, Lexend_700Bold });
  const [selectedItems, setSelectedItems] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [dataCC, setDataCC] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const debounceRef = useRef(null);

  const getDataCC = async (searchVal = '', filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('limit', '20');
      params.append('offset', '0');
      if (searchVal) params.append('search', searchVal);
      if (filters.publisherId) params.append('publisherId', filters.publisherId);
      if (filters.featureIds) params.append('featureIds', filters.featureIds);
      params.append('minYearlyFee', filters.minYearlyFee ?? 0);
      params.append('maxYearlyFee', filters.maxYearlyFee ?? 5000000);
      params.append('minYearlyIncome', filters.minYearlyIncome ?? 0);
      params.append('maxYearlyIncome', filters.maxYearlyIncome ?? 500000000);
      if (filters.sortBy) {
        params.append('sortBy', filters.sortBy);
        params.append('sortDirection', filters.sortDirection || 'asc');
      }
      console.log('🔍 CC URL:', `/credit-card/search?${params.toString()}`);
      const response = await api.get(`/credit-card/search?${params.toString()}`);
      setDataCC(response.data.data.creditCards || []);
    } catch (error) {
      console.error('Gagal mengambil data credit card:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getDataCC(); }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      getDataCC(search);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const toggleSelection = (item) => {
    setSelectedItems(prev => {
      const isSelected = prev.some(s => s.id === item.id);
      return isSelected ? prev.filter(s => s.id !== item.id) : [...prev, item];
    });
  };

  if (!fontsLoaded) return null;

  const renderItem = ({ item }) => {
    const isChecked = selectedItems.some(s => s.id === item.id);
    const feeText = item.yearlyFee === '0' || item.yearlyFee === 0
      ? 'Gratis Tahunan'
      : `Rp ${parseInt(item.yearlyFee).toLocaleString('id-ID')}/thn`;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.logoWrapper}>
            <Image
              source={{ uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${item.imageLink}` }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
            <View style={styles.feeBadge}>
              <Text style={styles.feeBadgeText}>{feeText}</Text>
            </View>
            {item.benefitName && (
              <View style={styles.benefitRow}>
                <Ionicons name="gift-outline" size={12} color="#CC1C22" />
                <Text style={styles.benefitText}>{item.benefitName}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.divider} />

        {(item.features || []).length > 0 && (
          <>
            <Text style={styles.featureTitle}>Fitur Unggulan</Text>
            {item.features.slice(0, 4).map(({ feature }, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={14} color="#CC1C22" style={{ marginTop: 2, marginRight: 6 }} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </>
        )}

        <TouchableOpacity
          style={styles.detailButton}
          onPress={() => props.navigation.navigate('Kartu Kredit Detail', { id: item.id })}
        >
          <Text style={styles.detailText}>Lihat Detail</Text>
          <Ionicons name="arrow-forward" size={14} color="#CC1C22" />
        </TouchableOpacity>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.compareButton} onPress={() => toggleSelection(item)}>
            <View style={[styles.checkbox, isChecked && styles.checkboxActive]}>
              {isChecked && <Ionicons name="checkmark" size={12} color="white" />}
            </View>
            <Text style={styles.compareText}>Bandingkan</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85}>
            <LinearGradient colors={['#CC1C22', '#E8424A']} style={styles.applyGradient}>
              <Text style={styles.applyText}>Ajukan Sekarang</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <LinearGradient
        colors={['#CC1C22', '#E8424A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <Text style={styles.headerTitle}>Kartu Kredit</Text>
        <Text style={styles.headerSubtitle}>Temukan kartu kredit terbaik untukmu</Text>

        {/* Search + Filter */}
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <View style={[styles.searchBar, { flex: 1 }]}>
            <Ionicons name="search-outline" size={16} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari kartu kredit..."
              placeholderTextColor="#999"
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={16} color="#ccc" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={styles.filterIconBtn}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="options-outline" size={18} color="#CC1C22" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {loading ? (
        <ActivityIndicator size="large" color="#CC1C22" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={dataCC}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {selectedItems.length > 0 && (
        <TouchableOpacity
          style={styles.compareBar}
          onPress={() => props.navigation.navigate('Compare Kartu', { selectedItems })}
        >
          <View style={styles.compareBarLeft}>
            <View style={styles.compareBadge}>
              <Text style={styles.compareBadgeText}>{selectedItems.length}</Text>
            </View>
            <View>
              <Text style={styles.compareBarTitle}>Kartu yang dibandingkan</Text>
              <Text style={styles.compareBarSub}>Maks. 3 kartu</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CC1C22" />
        </TouchableOpacity>
      )}

      <FilterModalKartu
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onApply={(filters) => { setModalVisible(false); getDataCC(search, filters); }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },

  header: {
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  circle1: {
    position: 'absolute', width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.07)', top: -40, right: -20,
  },
  circle2: {
    position: 'absolute', width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)', bottom: 10, left: -10,
  },
  headerTitle: {
    color: 'white', fontSize: 22, fontFamily: 'Lexend_700Bold', marginBottom: 4,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: 'Lexend_400Regular', marginBottom: 14,
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'white', borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  searchInput: {
    flex: 1, fontSize: 12, fontFamily: 'Lexend_400Regular', color: '#1A1A2E',
  },
  filterIconBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center', justifyContent: 'center',
  },

  listContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40, gap: 14 },

  card: {
    backgroundColor: 'white', borderRadius: 20, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  cardHeader: { flexDirection: 'row', marginBottom: 12 },
  logoWrapper: {
    width: 90, height: 72, backgroundColor: '#F8F8F8',
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    marginRight: 14, overflow: 'hidden',
  },
  logo: { width: '90%', height: '90%' },
  cardInfo: { flex: 1, justifyContent: 'center' },
  cardTitle: {
    fontSize: 14, fontFamily: 'Lexend_700Bold', color: '#1A1A2E',
    lineHeight: 20, marginBottom: 6,
  },
  feeBadge: {
    alignSelf: 'flex-start', backgroundColor: '#FEE2E2',
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 5,
  },
  feeBadgeText: { fontSize: 11, color: '#CC1C22', fontFamily: 'Lexend_700Bold' },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  benefitText: { fontSize: 11, color: '#666', fontFamily: 'Lexend_400Regular' },

  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 12 },

  featureTitle: {
    fontSize: 12, fontFamily: 'Lexend_700Bold', color: '#1A1A2E', marginBottom: 8,
  },
  featureItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 5 },
  featureText: { flex: 1, fontSize: 12, color: '#555', fontFamily: 'Lexend_400Regular', lineHeight: 18 },

  detailButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: '#FEE2E2', borderRadius: 10,
    paddingVertical: 10, marginTop: 12,
  },
  detailText: { color: '#CC1C22', fontSize: 13, fontFamily: 'Lexend_700Bold' },

  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  compareButton: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: {
    width: 20, height: 20, borderRadius: 6, borderWidth: 2, borderColor: '#CC1C22',
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: '#CC1C22' },
  compareText: { fontSize: 13, color: '#555', fontFamily: 'Lexend_400Regular' },
  applyGradient: { paddingVertical: 9, paddingHorizontal: 18, borderRadius: 10 },
  applyText: { color: 'white', fontSize: 13, fontFamily: 'Lexend_700Bold' },

  compareBar: {
    position: 'absolute', bottom: 80, left: 16, right: 16,
    backgroundColor: 'white', borderRadius: 16, padding: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 10, elevation: 8,
  },
  compareBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  compareBadge: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center',
  },
  compareBadgeText: { fontSize: 16, fontFamily: 'Lexend_700Bold', color: '#CC1C22' },
  compareBarTitle: { fontSize: 13, fontFamily: 'Lexend_700Bold', color: '#1A1A2E' },
  compareBarSub: { fontSize: 11, color: '#999', fontFamily: 'Lexend_400Regular' },
});

export default KartuKreditScreen;
