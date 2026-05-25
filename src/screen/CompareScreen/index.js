import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
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

const LABEL_W = 120;
const COL_W   = 150;
const ROW_H   = 70;

const COLORS = ['#CC1C22', '#2563EB', '#16A34A', '#D97706', '#7C3AED', '#0891B2', '#DB2777', '#059669'];

const tableRows = [
  { title: 'Jenis Pinjaman',  key: 'loanType',    icon: 'document-text-outline' },
  { title: 'Plafon Maksimum', key: 'maxLoan',     icon: 'cash-outline',   format: (v) => v ? `Rp ${parseInt(v).toLocaleString('id-ID')}` : '-' },
  { title: 'Tenor Maksimum',  key: 'maxTenor',    icon: 'time-outline',   format: (v) => v ? `${v} Bulan` : '-' },
  { title: 'Tipe Pembayaran', key: 'paymentType', icon: 'card-outline' },
];

const CompareScreen = (props) => {
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
          selectedIds.map((id) => api.get(`/lender/detail/${id}`))
        );
        setDetails(responses.map((r) => r.data.data));
      } catch (e) {
        console.error('Error fetching compare:', e);
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
        <Text style={styles.headerTitle}>Bandingkan Pinjaman</Text>
        <Text style={styles.headerSubtitle}>{details.length} pinjaman dibandingkan</Text>
      </LinearGradient>

      {details.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="git-compare-outline" size={52} color="#ddd" />
          <Text style={styles.emptyText}>Tidak ada data</Text>
        </View>
      ) : (
        /* ── VERTICAL SCROLL ── */
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

          {/* ── SATU ScrollView HORIZONTAL — logo + tabel bareng ── */}
          <View style={styles.tableArea}>

            {/* Kolom label — FIXED di kiri, di atas semua */}
            <View style={styles.fixedLabel}>
              {/* pojok kiri atas kosong sejajar logo row */}
              <View style={styles.labelCorner} />
              {tableRows.map((row, ri) => (
                <View key={ri} style={[styles.labelCell, ri % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
                  <View style={styles.labelIconBox}>
                    <Ionicons name={row.icon} size={12} color="#CC1C22" />
                  </View>
                  <Text style={styles.labelText}>{row.title}</Text>
                </View>
              ))}
            </View>

            {/* Semua kolom (logo + nilai) scroll horizontal BERSAMA */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginLeft: LABEL_W }}
              contentContainerStyle={{ width: totalColW }}
            >
              <View style={{ flexDirection: 'row', width: totalColW }}>
                {details.map((item, ci) => {
                  const name = item.lenderName ?? item.lendername ?? '';
                  const img  = item.imageLink  ?? item.imagelink  ?? '';
                  const link = item.directLink ?? item.directlink ?? '';
                  const color = COLORS[ci % COLORS.length];

                  return (
                    <View key={ci} style={[styles.col, { width: COL_W }]}>

                      {/* Logo card */}
                      <View style={[styles.logoCard, { borderTopColor: color, borderTopWidth: 3 }]}>
                        <View style={styles.logoImgWrapper}>
                          <Image
                            source={{ uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${img}` }}
                            style={styles.logoImg}
                            resizeMode="contain"
                          />
                        </View>
                        <Text style={styles.logoName} numberOfLines={2}>{name}</Text>
                        <TouchableOpacity
                          activeOpacity={0.85}
                          onPress={() => link && Linking.openURL(link)}
                          style={styles.ajukanBtn}
                        >
                          <LinearGradient
                            colors={['#CC1C22', '#E8424A']}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={styles.ajukanGradient}
                          >
                            <Ionicons name="paper-plane-outline" size={11} color="white" />
                            <Text style={styles.ajukanText}>Ajukan</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>

                      {/* Nilai tiap baris */}
                      {tableRows.map((row, ri) => {
                        const raw = item[row.key];
                        const val = row.format ? row.format(raw) : (raw ?? '-');
                        return (
                          <View key={ri} style={[styles.valueCell, ri % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
                            <Text style={[styles.valueText, { color }]} numberOfLines={3}>{val || '-'}</Text>
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
                <Text style={styles.legendText} numberOfLines={1}>
                  {item.lenderName ?? item.lendername}
                </Text>
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
  circle2: { position: 'absolute', width: 100, height: 100, borderRadius: 50,  backgroundColor: 'rgba(255,255,255,0.05)', bottom: 10, left: -10 },
  backBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  headerTitle: { color: 'white', fontSize: 20, fontFamily: 'Lexend_700Bold', marginBottom: 4 },
  headerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontFamily: 'Lexend_400Regular' },

  /* Table area */
  tableArea: {
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 4,
    flexDirection: 'row',
  },

  /* Fixed label column */
  fixedLabel: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: LABEL_W,
    zIndex: 10,
    backgroundColor: 'white',
    borderRightWidth: 1,
    borderRightColor: '#F0F0F0',
  },
  labelCorner: {
    height: 148, // sama tinggi logoCard
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  labelCell: {
    height: ROW_H,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  labelIconBox: { width: 24, height: 24, borderRadius: 7, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  labelText: { fontSize: 10, fontFamily: 'Lexend_700Bold', color: '#1A1A2E', flex: 1, lineHeight: 14 },

  /* Columns */
  col: { borderRightWidth: 1, borderRightColor: '#F0F0F0' },

  /* Logo card */
  logoCard: {
    height: 148,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  logoImgWrapper: { width: 52, height: 52, borderRadius: 12, backgroundColor: '#F8F8F8', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 1, borderColor: '#F0F0F0' },
  logoImg: { width: '100%', height: '100%' },
  logoName: { fontSize: 11, fontFamily: 'Lexend_700Bold', color: '#1A1A2E', textAlign: 'center', lineHeight: 15 },
  ajukanBtn: { width: '90%', borderRadius: 8, overflow: 'hidden' },
  ajukanGradient: { paddingVertical: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  ajukanText: { color: 'white', fontSize: 10, fontFamily: 'Lexend_700Bold' },

  /* Value cells */
  valueCell: { height: ROW_H, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  valueText: { fontSize: 12, fontFamily: 'Lexend_700Bold', textAlign: 'center', lineHeight: 18 },
  rowEven: { backgroundColor: 'white' },
  rowOdd:  { backgroundColor: '#FDF5F5' },

  /* Legenda */
  legend: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 16, marginTop: 12, gap: 10, backgroundColor: 'white', borderRadius: 16, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, fontFamily: 'Lexend_400Regular', color: '#444' },
});

export default CompareScreen;
