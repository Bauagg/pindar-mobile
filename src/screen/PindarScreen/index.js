import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Dimensions,
  TextInput,
} from 'react-native';
import { Linking } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from '@expo-google-fonts/lexend';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FilterModal from './FilterModal';
import api from '../../utils/axios';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 16 * 2 - 10) / 2;

const PindarScreen = (props) => {
  const [fontsLoaded] = useFonts({ Lexend_400Regular, Lexend_700Bold });
  const insets = useSafeAreaInsets();

  const [selectedItems, setSelectedItems] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [dataLenders, setDataLenders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const debounceRef = useRef(null);

  const getDataLenders = async (searchVal = '', paymentType = '', loanType = '', sortBy = '', sortDirection = 'asc') => {
    try {
      setLoading(true);
      let url = `/lender/list?limit=20&offset=0&search=${encodeURIComponent(searchVal)}`;
      if (loanType) url += `&loanType=${loanType}`;
      if (paymentType) url += `&paymentType=${paymentType}`;
      if (sortBy) { url += `&sortBy=${sortBy}&sortDirection=${sortDirection}`; }
      console.log('🔍 URL:', url);
      const response = await api.get(url);
      console.log('📦 Lenders:', response.data.data.lenders?.length);
      setDataLenders(response.data.data.lenders || []);
    } catch (error) {
      console.error('Gagal mengambil data lenders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataLenders();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      getDataLenders(search);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    let paymentType = null;
    if (tab === 'Sekali bayar') paymentType = 'PAYMENT_TYPE_1';
    else if (tab === 'Cicilan') paymentType = 'PAYMENT_TYPE_2';
    getDataLenders(paymentType);
  };

  const handleApplyFilter = (filters) => {
    setModalVisible(false);
    getDataLenders(search, filters.paymentType, filters.loanType, filters.sortBy, filters.sortDirection);
  };

  const toggleSelection = (item) => {
    setSelectedItems((prev) => {
      const isSelected = prev.some((s) => s.id === item.id);
      return isSelected ? prev.filter((s) => s.id !== item.id) : [...prev, item];
    });
  };

  const getDetail = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/lender/detail/${id}`);
      const directLink = response?.data?.data?.directLink;
      if (directLink) Linking.openURL(directLink);
    } catch (error) {
      console.error('Error getting detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) return null;

  const renderItem = ({ item }) => {
    const isChecked = selectedItems.some((s) => s.id === item.id);
    const maxLoan = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(item.maxloan);

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.92}
        onPress={() => props.navigation.navigate('Informasi Detail', { id: item.id })}
      >
        {/* Logo area */}
        <View style={styles.logoBox}>
          <Image
            source={{ uri: `${process.env.EXPO_PUBLIC_IMAGE_BASE_URL}${item.imagelink}` }}
            style={styles.logo}
            resizeMode="contain"
          />
          {/* Bandingkan checkbox top-right */}
          <TouchableOpacity
            style={styles.checkWrap}
            onPress={(e) => { e.stopPropagation?.(); toggleSelection(item); }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <View style={[styles.checkbox, isChecked && styles.checkboxActive]}>
              {isChecked && <Ionicons name="checkmark" size={10} color="white" />}
            </View>
          </TouchableOpacity>
        </View>

        {/* Name */}
        <Text style={styles.cardName} numberOfLines={2}>{item.lendername}</Text>

        {/* Max loan */}
        <View style={styles.infoRow}>
          <Ionicons name="cash-outline" size={12} color="#CC1C22" />
          <Text style={styles.infoLabel} numberOfLines={1}>{maxLoan}</Text>
        </View>

        {/* Tenor */}
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={12} color="#888" />
          <Text style={styles.infoTenor}>{item.maxtenor} Bulan</Text>
        </View>

        <View style={styles.divider} />

        {/* Ajukan button */}
        <TouchableOpacity
          onPress={(e) => { e.stopPropagation?.(); getDetail(item.id); }}
          activeOpacity={0.85}
        >
          <LinearGradient colors={['#CC1C22', '#E8424A']} style={styles.applyBtn}>
            <Text style={styles.applyText}>Ajukan</Text>
          </LinearGradient>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Header Gradient */}
      <LinearGradient
        colors={['#CC1C22', '#E8424A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <Text style={styles.headerTitle}>Pindar</Text>
        <Text style={styles.headerSubtitle}>Temukan pinjaman terbaik untukmu</Text>

        {/* Search Bar + Filter */}
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <View style={[styles.searchBar, { flex: 1 }]}>
            <Ionicons name="search-outline" size={16} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari pinjaman..."
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

      {/* Grid List */}
      {loading ? (
        <ActivityIndicator size="large" color="#CC1C22" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          key="pindar-grid-2col"
          data={dataLenders}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Compare Bar */}
      {selectedItems.length > 0 && (
        <TouchableOpacity
          style={[styles.compareBar, { bottom: Math.max(insets.bottom + 16, 32) }]}
          onPress={() => props.navigation.navigate('Compare', { selectedItems })}
        >
          <View style={styles.compareBarLeft}>
            <View style={styles.compareBadge}>
              <Text style={styles.compareBadgeText}>{selectedItems.length}</Text>
            </View>
            <View>
              <Text style={styles.compareBarTitle}>Pinjaman yang dibandingkan</Text>
              <Text style={styles.compareBarSub}>Maks. 3 pinjaman</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CC1C22" />
        </TouchableOpacity>
      )}

      <FilterModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onApply={handleApplyFilter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },

  /* Header */
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
  tabRow: { flexDirection: 'row', gap: 8 },
  tab: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  tabActive: { backgroundColor: 'white' },
  tabText: { fontSize: 12, color: 'rgba(255,255,255,0.9)', fontFamily: 'Lexend_400Regular' },
  tabTextActive: { color: '#CC1C22', fontFamily: 'Lexend_700Bold' },

  /* Filter Row */
  filterRow: { paddingHorizontal: 16, paddingVertical: 12 },
  filterBtn: { alignSelf: 'flex-start', borderRadius: 20, overflow: 'hidden' },
  filterGradient: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 10, paddingHorizontal: 20,
  },
  filterBtnText: { color: 'white', fontSize: 13, fontFamily: 'Lexend_700Bold' },

  /* Grid */
  listContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 120 },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 10 },

  /* Card */
  card: {
    width: CARD_WIDTH,
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  logoBox: {
    width: '100%',
    height: 110,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  logo: { width: '100%', height: '100%' },
  checkWrap: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  checkbox: {
    width: 20, height: 20, borderRadius: 6,
    borderWidth: 2, borderColor: '#CC1C22',
    backgroundColor: 'white',
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: '#CC1C22', borderColor: '#CC1C22' },

  cardName: {
    fontSize: 12,
    fontFamily: 'Lexend_700Bold',
    color: '#1A1A2E',
    lineHeight: 17,
    marginBottom: 8,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 11,
    fontFamily: 'Lexend_700Bold',
    color: '#CC1C22',
    flex: 1,
  },
  infoTenor: {
    fontSize: 11,
    fontFamily: 'Lexend_400Regular',
    color: '#888',
  },

  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 10 },

  applyBtn: {
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: { color: 'white', fontSize: 12, fontFamily: 'Lexend_700Bold' },

  /* Compare Bar */
  compareBar: {
    position: 'absolute', left: 16, right: 16,
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

export default PindarScreen;
