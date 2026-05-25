import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from '@expo-google-fonts/lexend';
import api from '../../utils/axios';

const { width } = Dimensions.get('window');

const LABEL_W = 130;
const COL_W   = 160;
const ROW_H   = 72;

const COLORS = ['#CC1C22', '#2563EB', '#16A34A', '#D97706', '#7C3AED', '#0891B2', '#DB2777', '#059669'];

const tableRows = [
  {
    title: 'Iuran Tahunan',
    icon: 'card-outline',
    format: (item) => {
      const v = item.yearlyFee;
      return v === '0' || v === 0 ? 'Gratis' : v ? `Rp ${parseInt(v).toLocaleString('id-ID')}` : '-';
    },
  },
  {
    title: 'Jenis Kartu',
    icon: 'pricetag-outline',
    format: (item) => item.type?.name ?? '-',
  },
  {
    title: 'Penerbit',
    icon: 'business-outline',
    format: (item) => item.publisher?.name ?? '-',
  },
  {
    title: 'Min. Penghasilan/Bln',
    icon: 'cash-outline',
    format: (item) => item.monthlyIncomeMinimum
      ? `Rp ${parseInt(item.monthlyIncomeMinimum).toLocaleString('id-ID')}`
      : '-',
  },
  {
    title: 'Min. Penghasilan/Thn',
    icon: 'wallet-outline',
    format: (item) => item.yearlyIncomeMinimum
      ? `Rp ${parseInt(item.yearlyIncomeMinimum).toLocaleString('id-ID')}`
      : '-',
  },
  {
    title: 'Usia Kartu Utama',
    icon: 'person-outline',
    format: (item) => item.mainCardMinimumAge
      ? `${item.mainCardMinimumAge} – ${item.mainCardMaximumAge} thn`
      : '-',
  },
  {
    title: 'Kartu Tambahan',
    icon: 'people-outline',
    format: (item) => item.additionalCardMinimumAge
      ? `Min. ${item.additionalCardMinimumAge} thn`
      : '-',
  },
];

const CompareScreenKartu = (props) => {
  const selectedItemsParam = props?.route?.params?.selectedItems || [];
  const selectedIds = selectedItemsParam.map((i) => i.id);
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({ Lexend_400Regular, Lexend_700Bold });
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState([]);

  useEffect(() => {
    if (selectedIds.length === 0) return;
    (async () => {
      setLoading(true);
      try {
        const responses = await Promise.all(
          selectedIds.map((id) => api.get(`/credit-card/detail/${id}`))
        );
        setDetails(responses.map((r) => r.data.data));
      } catch (e) {
        console.error('Error fetching compare kartu:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (!fontsLoaded) return null;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#CC1C22" />
      </View>
    );
  }

  const totalColW = details.length * COL_W;
  const logoCardH = 160;

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* ── HEADER ── */}
      <LinearGradient
        colors={['#CC1C22', '#E8424A']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: Math.max(insets.top + 12, 52) }]}
      >
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <Text style={styles.headerTitle}>Bandingkan Kartu Kredit</Text>
        <Text style={styles.headerSubtitle}>{details.length} kartu dibandingkan</Text>
      </LinearGradient>

      {details.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="git-compare-outline" size={52} color="#ddd" />
          <Text style={styles.emptyText}>Tidak ada data untuk dibandingkan</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

          {/* ── TABLE AREA ── */}
          <View style={styles.tableArea}>

            {/* Label kolom — FIXED kiri */}
            <View style={styles.fixedLabel}>
              <View style={[styles.labelCorner, { height: logoCardH }]} />
              {tableRows.map((row, ri) => (
                <View key={ri} style={[styles.labelCell, ri % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
                  <View style={styles.labelIconBox}>
                    <Ionicons name={row.icon} size={12} color="#CC1C22" />
                  </View>
                  <Text style={styles.labelText}>{row.title}</Text>
                </View>
              ))}
            </View>

            {/* Semua kolom scroll horizontal BERSAMA */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginLeft: LABEL_W }}
              contentContainerStyle={{ width: totalColW }}
            >
              <View style={{ flexDirection: 'row', width: totalColW }}>
                {details.map((item, ci) => {
                  const color = COLORS[ci % COLORS.length];
                  return (
                    <View key={ci} style={[styles.col, { width: COL_W }]}>

                      {/* Card image + info */}
                      <TouchableOpacity
                        activeOpacity={0.88}
                        style={[styles.cardHead, { borderTopColor: color, borderTopWidth: 3, height: logoCardH }]}
                        onPress={() => props.navigation.navigate('Kartu Kredit Detail', { id: item.id })}
                      >
                        <View style={styles.cardImgWrapper}>
                          <Image
                            source={{ uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${item.imageLink}` }}
                            style={styles.cardImg}
                            resizeMode="contain"
                          />
                        </View>
                        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                        <View style={[styles.feeBadge, { backgroundColor: `${color}18` }]}>
                          <Text style={[styles.feeBadgeText, { color }]}>
                            {item.yearlyFee === '0' || item.yearlyFee === 0 ? 'Gratis Tahunan' : `Rp ${parseInt(item.yearlyFee).toLocaleString('id-ID')}/thn`}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      {/* Nilai tiap baris */}
                      {tableRows.map((row, ri) => {
                        const val = row.format(item);
                        return (
                          <View key={ri} style={[styles.valueCell, ri % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
                            <Text style={[styles.valueText, { color }]} numberOfLines={3}>{val}</Text>
                          </View>
                        );
                      })}
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          {/* ── LEGENDA ── */}
          <View style={styles.legend}>
            {details.map((item, i) => (
              <View key={i} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: COLORS[i % COLORS.length] }]} />
                <Text style={styles.legendText} numberOfLines={1}>{item.title}</Text>
              </View>
            ))}
          </View>

        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  emptyText: { fontSize: 14, color: '#999', fontFamily: 'Lexend_400Regular' },

  /* Header */
  header: {
    paddingHorizontal: 20, paddingBottom: 24,
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32, overflow: 'hidden',
  },
  circle1: { position: 'absolute', width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.07)', top: -40, right: -20 },
  circle2: { position: 'absolute', width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.05)', bottom: 10, left: -10 },
  backBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  headerTitle: { color: 'white', fontSize: 20, fontFamily: 'Lexend_700Bold', marginBottom: 4 },
  headerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontFamily: 'Lexend_400Regular' },

  /* Table area */
  tableArea: {
    marginTop: 16, marginHorizontal: 16,
    borderRadius: 20, overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 4,
    flexDirection: 'row',
  },

  /* Fixed label column */
  fixedLabel: {
    position: 'absolute', left: 0, top: 0, bottom: 0,
    width: LABEL_W, zIndex: 10,
    backgroundColor: 'white',
    borderRightWidth: 1, borderRightColor: '#F0F0F0',
  },
  labelCorner: { borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  labelCell: {
    height: ROW_H, paddingHorizontal: 10,
    flexDirection: 'row', alignItems: 'center', gap: 7,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  labelIconBox: { width: 24, height: 24, borderRadius: 7, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  labelText: { fontSize: 10, fontFamily: 'Lexend_700Bold', color: '#1A1A2E', flex: 1, lineHeight: 14 },

  /* Columns */
  col: { borderRightWidth: 1, borderRightColor: '#F0F0F0' },

  /* Card header */
  cardHead: {
    paddingHorizontal: 10, paddingVertical: 10,
    alignItems: 'center', justifyContent: 'center', gap: 6,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  cardImgWrapper: {
    width: COL_W - 20, height: 68,
    backgroundColor: '#F8F8F8', borderRadius: 10,
    overflow: 'hidden',
  },
  cardImg: { width: '100%', height: '100%' },
  cardTitle: { fontSize: 10, fontFamily: 'Lexend_700Bold', color: '#1A1A2E', textAlign: 'center', lineHeight: 14 },
  feeBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  feeBadgeText: { fontSize: 9, fontFamily: 'Lexend_700Bold' },

  /* Value cells */
  valueCell: { height: ROW_H, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  valueText: { fontSize: 12, fontFamily: 'Lexend_700Bold', textAlign: 'center', lineHeight: 18 },
  rowEven: { backgroundColor: 'white' },
  rowOdd: { backgroundColor: '#FDF5F5' },

  /* Legenda */
  legend: {
    flexDirection: 'row', flexWrap: 'wrap',
    marginHorizontal: 16, marginTop: 12, gap: 10,
    backgroundColor: 'white', borderRadius: 16, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, fontFamily: 'Lexend_400Regular', color: '#444' },
});

export default CompareScreenKartu;
