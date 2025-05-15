import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utils/axios';
import { Linking } from 'react-native';


const InformasiDetail = (props) => {
  const [activeTab, setActiveTab] = useState('Informasi');
  const [dataDetail, setDataDetail] = useState ([]);
  console.log("INI DATA DETAIL", dataDetail);
  const {id} = props?.route?.params;
  const [loading, setLoading] = useState(false);
  console.log("INI ID", id);

  const getDetail = async (id) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      const response = await api.get(`/lender/detail/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setDataDetail(response.data.data)
    } catch (error) {
      console.log(error);
    }
  }

  const navRedirect = () => {
  props.navigation.navigate('RedirecScreen', {
    directLink: dataDetail?.directLink,
    imageLink: dataDetail?.imageLink,
    lenderName: dataDetail?.lenderName,
  });
};




useEffect(() => {
 getDetail(id)
}, [])

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'Informasi' && styles.activeTab,
            styles.leftTab,
          ]}
          onPress={() => setActiveTab('Informasi')}>
          <LinearGradient
            colors={
              activeTab === 'Informasi'
                ? ['#CC1C22', '#F86469']
                : ['#F4F4F4', '#F4F4F4']
            }
            style={[
              styles.gradient,
              activeTab === 'Informasi' && styles.activeGradient,
            ]}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'Informasi' && styles.activeTabText,
              ]}>
              Informasi
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'Syarat & Dokumen' && styles.activeTab,
            styles.rightTab,
          ]}
          onPress={() => setActiveTab('Syarat & Dokumen')}>
          <LinearGradient
            colors={
              activeTab === 'Syarat & Dokumen'
                ? ['#CC1C22', '#F86469']
                : ['#F4F4F4', '#F4F4F4']
            }
            style={[
              styles.gradient,
              activeTab === 'Syarat & Dokumen' && styles.activeGradient,
            ]}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'Syarat & Dokumen' && styles.activeTabText,
              ]}>
              Syarat & Dokumen
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <FlatList
        ListFooterComponent={() => (
          <>
            <ScrollView style={styles.content}>
              {activeTab === 'Informasi' ? (
                <View>
                  <Text style={styles.sectionTitle}>Informasi Pinjaman</Text>
                  <Text style={styles.listItem}>• Jenis Pinjaman: {dataDetail?.loanType}</Text>
                  <Text style={styles.listItem}>• Plafon Maksimum: Rp{dataDetail?.maxLoan}</Text>
                  <Text style={styles.listItem}>• Tenor Maksimum: {dataDetail?.maxTenor} bulan</Text>

                  <Text style={styles.sectionTitle}>Keunggulan</Text>
                  <Text style={styles.paragraph}>{dataDetail?.plusValue}</Text>

                  <Text style={styles.sectionTitle}>Informasi Umum</Text>
                  <Text style={styles.paragraph}>{dataDetail?.basicInfo}</Text>

                  <Text style={styles.sectionTitle}>Cara Pengajuan</Text>
                  <Text style={styles.paragraph}>{dataDetail?.applymentTutorial}</Text>
                </View>
              ) : (
                <View>
                  <Text style={styles.sectionTitle}>Syarat & Dokumen</Text>
                  <Text style={styles.listItem}>• Tipe Pembayaran: {dataDetail?.paymentType}</Text>
                  <Text style={styles.listItem}>• Informasi Tambahan: {dataDetail?.additionalInformation}</Text>

                  <Text style={styles.sectionTitle}>Ketentuan</Text>
                  <Text style={styles.paragraph}>{dataDetail?.termsDocument}</Text>
                </View>
              )}

            </ScrollView>
          </>
        )}
        style={{ paddingHorizontal: 20 }}
      />

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
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 10,
  },

  gradient: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeGradient: {
    borderRadius: 10,
  },
  // activeTab: { backgroundColor: '#ff2a2a', borderRadius: 10 },
  tabText: { fontSize: 16, color: 'black' },
  activeTabText: { color: '#fff', fontWeight: 'bold' },
  content: {
    padding: 20,
    backgroundColor: '#F4F4F4',
    borderRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomLeftRadius: 10,
    flex: 1,
    height: Dimensions.get('window').height,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginVertical: 8 },
  listItem: { fontSize: 14, marginVertical: 4 },
  paragraph: { fontSize: 14, color: 'gray', marginBottom: 16 },
  button: { margin: 16, borderRadius: 10, overflow: 'hidden' },
  buttonGradient: { padding: 14, alignItems: 'center', borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default InformasiDetail;
