import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const PrivacyPolicy = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privasi Policy</Text>
      </View> */}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.updatedText}>
          Terakhir diperbarui: <Text style={styles.boldText}>24/02/2025</Text>
        </Text>

        <Text style={styles.sectionTitle}>1. Pendahuluan</Text>
        <Text style={styles.contentText}>
          Selamat datang di Pindar. Privasi Anda sangat penting bagi kami.
          Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan,
          menggunakan, dan melindungi informasi Anda saat menggunakan aplikasi
          Pindar.
        </Text>

        <Text style={styles.sectionTitle}>
          2. Informasi yang Kami Kumpulkan
        </Text>
        <Text style={styles.contentText}>
          Kami dapat mengumpulkan informasi berikut dari pengguna:
        </Text>
        <Text style={styles.listItem}>
          • Informasi Pribadi: Nama, alamat email, nomor telepon, data identitas
          (KTP, NPWP), dan informasi keuangan.
        </Text>
        <Text style={styles.listItem}>
          • Informasi Perangkat: Jenis perangkat, sistem operasi, alamat IP.
        </Text>
        <Text style={styles.listItem}>
          • Informasi Penggunaan: Aktivitas dalam aplikasi, preferensi.
        </Text>

        <Text style={styles.sectionTitle}>
          3. Cara Kami Menggunakan Informasi
        </Text>
        <Text style={styles.contentText}>
          Informasi yang dikumpulkan digunakan untuk:
        </Text>
        <Text style={styles.listItem}>
          • Memproses pengajuan pinjaman atau kartu kredit.
        </Text>
        <Text style={styles.listItem}>
          • Menyediakan informasi dan perbandingan layanan keuangan.
        </Text>
        <Text style={styles.listItem}>
          • Meningkatkan pengalaman pengguna dalam aplikasi.
        </Text>
        <Text style={styles.listItem}>
          • Mengirimkan notifikasi terkait status pengajuan.
        </Text>
      </ScrollView>

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
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  updatedText: {
    color: 'gray',
    marginBottom: 8,
  },
  boldText: {
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  contentText: {
    color: 'gray',
    marginTop: 8,
  },
  listItem: {
    color: 'gray',
    marginTop: 4,
    marginLeft: 16,
  },
  button: {
    backgroundColor: 'red',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
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

export default PrivacyPolicy;
