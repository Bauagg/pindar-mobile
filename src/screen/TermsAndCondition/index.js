import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const TermsCondition = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity>
          <Entypo name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Terms & Condition</Text>
        <TouchableOpacity>
          <Entypo name="dots-three-vertical" size={20} color="black" />
        </TouchableOpacity>
      </View> */}

      <ScrollView style={styles.scrollView}>
        <Text style={styles.lastUpdated}>
          Terakhir diperbarui: <Text style={styles.boldText}>24/02/2025</Text>
        </Text>

        <Text style={styles.sectionTitle}>1. Pendahuluan</Text>
        <Text style={styles.sectionContent}>
          Selamat datang di Pindar, aplikasi agregasi pinjaman online dan kartu
          kredit. Dengan menggunakan aplikasi ini, Anda menyetujui syarat dan
          ketentuan yang berlaku.
        </Text>

        <Text style={styles.sectionTitle}>2. Definisi</Text>
        <Text style={styles.sectionContent}>
          • Pindar: Aplikasi yang menyediakan informasi dan perbandingan produk
          pinjaman online serta kartu kredit.
          {'\n'}• Pengguna: Individu yang mengakses layanan Pindar.
          {'\n'}• Mitra Keuangan: Lembaga keuangan yang bekerja sama dengan
          Pindar.
        </Text>

        <Text style={styles.sectionTitle}>3. Layanan yang Disediakan</Text>
        <Text style={styles.sectionContent}>
          • Menyediakan informasi dan perbandingan produk pinjaman online.
          {'\n'}• Membantu pengguna mengajukan pinjaman atau kartu kredit.
          {'\n'}• Memberikan notifikasi terkait status pengajuan.
        </Text>

        <Text style={styles.sectionTitle}>4. Kewajiban Pengguna</Text>
        <Text style={styles.sectionContent}>
          • Memberikan informasi yang akurat dan jujur.
          {'\n'}• Tidak menggunakan aplikasi untuk tujuan ilegal.
          {'\n'}• Menjaga keamanan akun.
        </Text>

        <Text style={styles.sectionTitle}>5. Privasi & Keamanan Data</Text>
        <Text style={styles.sectionContent}>
          • Pindar mengutamakan perlindungan data pengguna.
          {'\n'}• Data pribadi digunakan sesuai kebijakan privasi Pindar.
        </Text>
      </ScrollView>

      {/* Button */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <LinearGradient
          colors={['#CC1C22', '#F86469']}
          style={styles.filterFloating}>
          <Feather
            name="arrow-down"
            size={14}
            color="white"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.filterFloatingText}>Selengkapnya</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  scrollView: {
    marginBottom: 80,
  },
  lastUpdated: {
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 8,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#374151',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  sectionContent: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 16,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
  },
  button: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  filterFloating: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    marginLeft: -75,
    width: 150,
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  filterFloatingText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Lexend-Regular',
  },
});

export default TermsCondition;
