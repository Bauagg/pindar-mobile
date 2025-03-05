import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const InformasiDetail = (props) => {
  const [activeTab, setActiveTab] = useState('Informasi');
  const navRedirect = () => {
    props.navigation.navigate('RedirecScreen');
  };

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Informasi' && styles.activeTab]}
          onPress={() => setActiveTab('Informasi')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'Informasi' && styles.activeTabText,
            ]}>
            Informasi
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'Syarat & Dokumen' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('Syarat & Dokumen')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'Syarat & Dokumen' && styles.activeTabText,
            ]}>
            Syarat & Dokumen
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'Informasi' ? (
          <View>
            <Text style={styles.sectionTitle}>Fitur Utama</Text>
            <Text style={styles.listItem}>
              • Plafon pinjaman hingga Rp3 juta
            </Text>
            <Text style={styles.listItem}>• Tenor pinjaman hingga 3 bulan</Text>
            <Text style={styles.listItem}>• Bunga 0.03% per hari</Text>

            <Text style={styles.sectionTitle}>Ulasan</Text>
            <Text style={styles.paragraph}>
              Informasi yang tertera di halaman ini dapat berubah sewaktu-waktu.
              Untuk informasi selengkapnya, dapat mengunjungi website resmi
              Akulaku.
            </Text>
          </View>
        ) : (
          <View>
            <Text style={styles.sectionTitle}>Syarat & Dokumen</Text>
            <Text style={styles.listItem}>• KTP sebagai identitas utama</Text>
            <Text style={styles.listItem}>• Rekening bank untuk pencairan</Text>
            <Text style={styles.listItem}>
              • Penghasilan tetap sebagai jaminan
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={navRedirect}>
        <LinearGradient
          colors={['#ff6161', '#ff2a2a']}
          style={styles.buttonGradient}>
          <Text style={styles.buttonText}>Ajukan Sekarang</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 16 },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
  tab: { flex: 1, padding: 12, alignItems: 'center' },
  activeTab: { backgroundColor: '#ff2a2a', borderRadius: 10 },
  tabText: { fontSize: 16, color: 'black' },
  activeTabText: { color: '#fff', fontWeight: 'bold' },
  content: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginVertical: 8 },
  listItem: { fontSize: 14, marginVertical: 4 },
  paragraph: { fontSize: 14, color: 'gray', marginBottom: 16 },
  button: { margin: 16, borderRadius: 25, overflow: 'hidden' },
  buttonGradient: { padding: 14, alignItems: 'center', borderRadius: 25 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default InformasiDetail;
