import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
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

const IMAGE_MAP = {
  '/assets/images/mandiri.png': require('../../../assets/images/mandiri.png'),
  '/assets/images/bca.png':     require('../../../assets/images/bca.png'),
  '/assets/images/bri.png':     require('../../../assets/images/bri.png'),
  '/assets/images/bni.png':     require('../../../assets/images/bni.png'),
  '/assets/images/cimb.png':    require('../../../assets/images/cimb.png'),
};

const DetailPinjamanBank = (props) => {
  const item = props?.route?.params?.item;
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({ Lexend_400Regular, Lexend_700Bold });

  if (!fontsLoaded || !item) return null;

  const imgSource = IMAGE_MAP[item.imageLink];

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={['#CC1C22', '#E8424A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: Math.max(insets.top + 12, 52) }]}
      >
        <View style={styles.circle1} />
        <View style={styles.circle2} />

        <TouchableOpacity style={styles.backBtn} onPress={() => props.navigation.goBack()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>

        {/* Logo + Nama */}
        <View style={styles.headerBody}>
          <View style={styles.logoWrapper}>
            {imgSource ? (
              <Image source={imgSource} style={styles.logo} resizeMode="contain" />
            ) : (
              <Ionicons name="business-outline" size={28} color="#CC1C22" />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle} numberOfLines={2}>{item.namaBank}</Text>
            <Text style={styles.headerSubtitle}>{item.publisher}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >

        {/* Detail Pinjaman */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconBox}>
              <Ionicons name="information-circle-outline" size={15} color="#CC1C22" />
            </View>
            <Text style={styles.sectionTitle}>Detail Pinjaman</Text>
          </View>
          <Text style={styles.paragraph}>{item.detailPinjaman}</Text>
        </View>

        {/* Dokumen Dibutuhkan */}
        {item.dokumenDibutuhkan?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconBox}>
                <Ionicons name="document-text-outline" size={15} color="#CC1C22" />
              </View>
              <Text style={styles.sectionTitle}>Dokumen Dibutuhkan</Text>
            </View>
            {item.dokumenDibutuhkan.map((doc, i) => (
              <View key={i} style={styles.docRow}>
                <View style={styles.docBullet}>
                  <Ionicons name="checkmark" size={12} color="white" />
                </View>
                <Text style={styles.docText}>{doc}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Info tambahan */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconBox}>
              <Ionicons name="alert-circle-outline" size={15} color="#CC1C22" />
            </View>
            <Text style={styles.sectionTitle}>Informasi</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="business-outline" size={14} color="#999" />
            <Text style={styles.infoLabel}>Penerbit</Text>
            <Text style={styles.infoValue}>{item.publisher}</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Ionicons name="card-outline" size={14} color="#999" />
            <Text style={styles.infoLabel}>Nama Bank</Text>
            <Text style={styles.infoValue}>{item.namaBank}</Text>
          </View>
        </View>

      </ScrollView>

      {/* Bottom Bar */}
      {/* <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity activeOpacity={0.88} style={{ flex: 1 }}>
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
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },

  header: {
    paddingHorizontal: 20, paddingBottom: 24,
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32, overflow: 'hidden',
  },
  circle1: { position: 'absolute', width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.07)', top: -40, right: -20 },
  circle2: { position: 'absolute', width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.05)', bottom: 10, left: -10 },
  backBtn: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  headerBody: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  logoWrapper: {
    width: 64, height: 64, borderRadius: 16,
    backgroundColor: 'white',
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12, shadowRadius: 6, elevation: 4,
  },
  logo: { width: '100%', height: '100%' },
  headerTitle: { color: 'white', fontSize: 18, fontFamily: 'Lexend_700Bold', marginBottom: 4, flexShrink: 1 },
  headerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontFamily: 'Lexend_400Regular' },

  section: {
    backgroundColor: 'white', borderRadius: 20, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  sectionIconBox: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center',
  },
  sectionTitle: { fontSize: 14, fontFamily: 'Lexend_700Bold', color: '#1A1A2E' },
  paragraph: { fontSize: 13, fontFamily: 'Lexend_400Regular', color: '#555', lineHeight: 20 },

  docRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  docBullet: {
    width: 22, height: 22, borderRadius: 6,
    backgroundColor: '#CC1C22', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  docText: { fontSize: 13, fontFamily: 'Lexend_400Regular', color: '#444', flex: 1 },

  infoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  infoLabel: { fontSize: 12, fontFamily: 'Lexend_400Regular', color: '#999', flex: 1 },
  infoValue: { fontSize: 12, fontFamily: 'Lexend_700Bold', color: '#1A1A2E' },

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

export default DetailPinjamanBank;
