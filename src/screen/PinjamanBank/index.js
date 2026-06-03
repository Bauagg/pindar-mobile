import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
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
import { dummyPinjamanBank } from './data-dummy-pinjamaan-bank';

const IMAGE_MAP = {
  '/assets/images/mandiri.png': require('../../../assets/images/mandiri.png'),
  '/assets/images/bca.png':     require('../../../assets/images/bca.png'),
  '/assets/images/bri.png':     require('../../../assets/images/bri.png'),
  '/assets/images/bni.png':     require('../../../assets/images/bni.png'),
  '/assets/images/cimb.png':    require('../../../assets/images/cimb.png'),
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 16 * 2 - 10) / 2;

const PinjamanBank = (props) => {
  const [fontsLoaded] = useFonts({ Lexend_400Regular, Lexend_700Bold });
  const [search, setSearch] = useState('');

  const filtered = dummyPinjamanBank.filter((item) =>
    item.namaBank.toLowerCase().includes(search.toLowerCase()) ||
    item.publisher.toLowerCase().includes(search.toLowerCase())
  );

  if (!fontsLoaded) return null;

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.92}>
      {/* Logo */}
      <View style={styles.logoBox}>
        {IMAGE_MAP[item.imageLink] ? (
          <Image
            source={IMAGE_MAP[item.imageLink]}
            style={styles.logo}
            resizeMode="contain"
          />
        ) : (
          <Ionicons name="business-outline" size={36} color="#CC1C22" />
        )}
      </View>

      {/* Name */}
      <Text style={styles.cardName} numberOfLines={1}>{item.namaBank}</Text>
      <Text style={styles.cardPublisher} numberOfLines={1}>{item.publisher}</Text>

      {/* Detail */}
      <Text style={styles.cardDetail} numberOfLines={3}>{item.detailPinjaman}</Text>

      <View style={styles.divider} />

      {/* Dokumen */}
      <View style={styles.docsRow}>
        <Ionicons name="document-text-outline" size={12} color="#CC1C22" />
        <Text style={styles.docsText}>{item.dokumenDibutuhkan.length} dokumen dibutuhkan</Text>
      </View>

      {/* Detail */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={{ marginTop: 10 }}
        onPress={() => props.navigation.navigate('DetailPinjamanBank', { item })}
      >
        <LinearGradient colors={['#CC1C22', '#E8424A']} style={styles.applyBtn}>
          <Text style={styles.applyText}>Detail</Text>
        </LinearGradient>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={['#CC1C22', '#E8424A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.circle1} />
        <View style={styles.circle2} />

        <TouchableOpacity style={styles.backBtn} onPress={() => props.navigation.goBack()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Pinjaman Bank</Text>
        <Text style={styles.headerSubtitle}>Temukan pinjaman bank terbaik untukmu</Text>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={16} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari pinjaman bank..."
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
      </LinearGradient>

      {filtered.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="business-outline" size={52} color="#ddd" />
          <Text style={styles.emptyText}>Tidak ada data ditemukan</Text>
        </View>
      ) : (
        <FlatList
          key="bank-grid-2col"
          data={filtered}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  backBtn: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
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
    paddingHorizontal: 12, paddingVertical: 9,
  },
  searchInput: {
    flex: 1, fontSize: 12, fontFamily: 'Lexend_400Regular', color: '#1A1A2E',
  },

  listContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 120 },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 10 },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  emptyText: { fontSize: 14, color: '#999', fontFamily: 'Lexend_400Regular' },

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
    width: '100%', height: 90,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 10,
  },
  logo: { width: '100%', height: '100%' },
  cardName: {
    fontSize: 13, fontFamily: 'Lexend_700Bold', color: '#1A1A2E', marginBottom: 2,
  },
  cardPublisher: {
    fontSize: 11, fontFamily: 'Lexend_400Regular', color: '#CC1C22', marginBottom: 8,
  },
  cardDetail: {
    fontSize: 11, fontFamily: 'Lexend_400Regular', color: '#666', lineHeight: 16,
  },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 10 },
  docsRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  docsText: { fontSize: 10, fontFamily: 'Lexend_400Regular', color: '#888' },
  applyBtn: { borderRadius: 10, paddingVertical: 8, alignItems: 'center', justifyContent: 'center' },
  applyText: { color: 'white', fontSize: 12, fontFamily: 'Lexend_700Bold' },
});

export default PinjamanBank;
