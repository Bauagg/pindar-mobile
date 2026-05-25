import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Linking,
  Image,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from '@expo-google-fonts/lexend';
import RenderHtml from 'react-native-render-html';
import api from '../../utils/axios';

const InformasiDetail = (props) => {
  const { id } = props?.route?.params;
  const insets = useSafeAreaInsets();
  const { width: winWidth } = useWindowDimensions();
  const [fontsLoaded] = useFonts({ Lexend_400Regular, Lexend_700Bold });
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDetail = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/lender/detail/${id}`);
        setDetail(response.data.data);
      } catch (error) {
        console.error('Gagal ambil detail:', error);
      } finally {
        setLoading(false);
      }
    };
    getDetail();
  }, []);

  const navAjukan = () => {
    if (detail?.directLink) Linking.openURL(detail.directLink);
  };

  if (!fontsLoaded) return null;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#CC1C22" />
      </View>
    );
  }

  if (!detail) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#ccc" />
        <Text style={styles.emptyText}>Data tidak ditemukan</Text>
      </View>
    );
  }

  const maxLoanFormatted = detail.maxLoan
    ? `Rp ${parseInt(detail.maxLoan).toLocaleString('id-ID')}`
    : detail.maxloan
    ? `Rp ${parseInt(detail.maxloan).toLocaleString('id-ID')}`
    : '-';

  const maxTenorVal = detail.maxTenor ?? detail.maxtenor;
  const lenderName = detail.lenderName ?? detail.lendername ?? '';
  const imageLink = detail.imageLink ?? detail.imagelink ?? '';

  const infoItems = [
    { label: 'Jenis Pinjaman', value: detail.loanType, icon: 'document-text-outline' },
    { label: 'Plafon Maksimum', value: maxLoanFormatted, icon: 'cash-outline' },
    { label: 'Tenor Maksimum', value: maxTenorVal ? `${maxTenorVal} Bulan` : null, icon: 'time-outline' },
    { label: 'Tipe Pembayaran', value: detail.paymentType, icon: 'card-outline' },
  ].filter(i => i.value && i.value !== '-');

  const htmlTagsStyles = {
    p: { fontFamily: 'Lexend_400Regular', fontSize: 13, color: '#555', marginBottom: 6, lineHeight: 20 },
    li: { fontFamily: 'Lexend_400Regular', fontSize: 13, color: '#555', lineHeight: 22 },
    ul: { marginTop: 4, paddingLeft: 4 },
    strong: { fontFamily: 'Lexend_700Bold', color: '#1A1A2E' },
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Header Gradient */}
      <LinearGradient
        colors={['#CC1C22', '#E8424A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: Math.max(insets.top + 12, 52) }]}
      >

        {/* Logo + Name row */}
        <View style={styles.headerBody}>
          {imageLink ? (
            <View style={styles.logoWrapper}>
              <Image
                source={{ uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${imageLink}` }}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          ) : (
            <View style={[styles.logoWrapper, styles.logoPlaceholder]}>
              <Ionicons name="business-outline" size={28} color="#CC1C22" />
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle} numberOfLines={2}>{lenderName}</Text>
            <Text style={styles.headerSubtitle}>Detail Informasi Pinjaman</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {infoItems.map((item, i) => (
            <View key={i} style={styles.statCard}>
              <View style={styles.statIconBox}>
                <Ionicons name={item.icon} size={18} color="#CC1C22" />
              </View>
              <Text style={styles.statValue} numberOfLines={2}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Informasi Tambahan */}
        {detail.additionalInformation ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconBox}>
                <Ionicons name="information-circle-outline" size={15} color="#CC1C22" />
              </View>
              <Text style={styles.sectionTitle}>Informasi Tambahan</Text>
            </View>
            <RenderHtml
              contentWidth={winWidth - 64}
              source={{ html: detail.additionalInformation }}
              tagsStyles={htmlTagsStyles}
            />
          </View>
        ) : null}

        {/* Informasi Umum (basicInfo plain text, jika ada) */}
        {detail.basicInfo ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconBox}>
                <Ionicons name="document-outline" size={15} color="#CC1C22" />
              </View>
              <Text style={styles.sectionTitle}>Informasi Umum</Text>
            </View>
            <Text style={styles.paragraph}>{detail.basicInfo}</Text>
          </View>
        ) : null}

        {/* Keunggulan */}
        {detail.plusValue ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconBox}>
                <Ionicons name="star-outline" size={15} color="#CC1C22" />
              </View>
              <Text style={styles.sectionTitle}>Keunggulan</Text>
            </View>
            <Text style={styles.paragraph}>{detail.plusValue}</Text>
          </View>
        ) : null}

        {/* Cara Pengajuan */}
        {detail.applymentTutorial ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconBox}>
                <Ionicons name="clipboard-outline" size={15} color="#CC1C22" />
              </View>
              <Text style={styles.sectionTitle}>Cara Pengajuan</Text>
            </View>
            <Text style={styles.paragraph}>{detail.applymentTutorial}</Text>
          </View>
        ) : null}

        {/* Syarat & Dokumen */}
        {detail.termsDocument ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconBox}>
                <Ionicons name="document-text-outline" size={15} color="#CC1C22" />
              </View>
              <Text style={styles.sectionTitle}>Syarat &amp; Dokumen</Text>
            </View>
            <RenderHtml
              contentWidth={winWidth - 64}
              source={{ html: detail.termsDocument }}
              tagsStyles={htmlTagsStyles}
            />
          </View>
        ) : null}
      </ScrollView>

      {/* Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity onPress={navAjukan} activeOpacity={0.88} style={{ flex: 1 }}>
          <LinearGradient
            colors={['#CC1C22', '#E8424A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.applyBtn}
          >
            <Ionicons name="paper-plane-outline" size={16} color="white" />
            <Text style={styles.applyText}>Ajukan Sekarang</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  emptyText: { fontSize: 14, color: '#999', fontFamily: 'Lexend_400Regular' },

  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
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
    marginBottom: 16,
  },

  headerBody: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  logoWrapper: {
    width: 64, height: 64, borderRadius: 16,
    backgroundColor: 'white',
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12, shadowRadius: 6, elevation: 4,
  },
  logoPlaceholder: { backgroundColor: '#FEE2E2' },
  logo: { width: '100%', height: '100%' },

  headerTitle: {
    color: 'white', fontSize: 18, fontFamily: 'Lexend_700Bold',
    marginBottom: 4, flexShrink: 1,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)', fontSize: 12, fontFamily: 'Lexend_400Regular',
  },

  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14,
  },
  statCard: {
    backgroundColor: 'white', borderRadius: 16, padding: 14,
    width: '47%', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  statIconBox: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  statValue: {
    fontSize: 13, fontFamily: 'Lexend_700Bold', color: '#1A1A2E',
    textAlign: 'center', marginBottom: 2,
  },
  statLabel: { fontSize: 10, color: '#999', fontFamily: 'Lexend_400Regular', textAlign: 'center' },

  section: {
    backgroundColor: 'white', borderRadius: 20, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  sectionIconBox: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center',
  },
  sectionTitle: { fontSize: 14, fontFamily: 'Lexend_700Bold', color: '#1A1A2E' },
  paragraph: { fontSize: 13, fontFamily: 'Lexend_400Regular', color: '#555', lineHeight: 20 },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'white', paddingHorizontal: 16, paddingTop: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 12,
  },
  applyBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 15, borderRadius: 16,
  },
  applyText: { color: 'white', fontSize: 15, fontFamily: 'Lexend_700Bold' },
});

export default InformasiDetail;
