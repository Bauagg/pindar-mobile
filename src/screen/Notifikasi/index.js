import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function Notifikasi({ navigation }) {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Persetujuan Pinjaman',
      message:
        'Selamat! Pinjaman Rp5.000.000 Anda telah disetujui. Dana segera cair ke rekening Anda.',
      date: 'Sat, 12 Nov 2024',
      daysAgo: '2 Day Ago',
    },
    {
      id: '2',
      title: 'Pendaftaran Berhasil',
      message:
        'Pendaftaran kartu kredit Anda telah diterima. Kami akan segera memproses pengajuan Anda.',
      date: 'Sat, 12 Nov 2024',
      daysAgo: '2 Day Ago',
    },
    {
      id: '3',
      title: 'Penawaran Pinjaman Baru',
      message:
        'Butuh dana cepat? Ajukan pinjaman hingga Rp10.000.000 dengan bunga rendah hanya di sini!',
      date: 'Sat, 12 Nov 2024',
      daysAgo: '2 Day Ago',
    },
    {
      id: '4',
      title: 'Verifikasi Dokumen',
      message:
        'Dokumen pendaftaran kartu kredit Anda sedang dalam tahap verifikasi. Mohon tunggu update selanjutnya.',
      date: 'Sat, 12 Nov 2024',
      daysAgo: '2 Day Ago',
    },
    {
      id: '5',
      title: 'Limit Pinjaman Naik',
      message:
        'Kabar baik! Limit pinjaman Anda naik menjadi Rp15.000.000. Ajukan sekarang dan dapatkan dana instan!',
      date: 'Sat, 12 Nov 2024',
      daysAgo: '2 Day Ago',
    },
    {
      id: '6',
      title: 'Persetujuan Kartu Kredit',
      message:
        'Selamat! Pengajuan kartu kredit Anda telah disetujui. Kartu akan segera dikirim ke alamat Anda.',
      date: 'Sat, 12 Nov 2024',
      daysAgo: '2 Day Ago',
    },
  ]);

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((item) => item.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.notificationCard}>
      <View style={styles.iconContainer}>
        <Ionicons name="notifications-outline" size={24} color="#CC1C22" />
        <View style={styles.redDot} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.date}>
          {item.date}, <Text style={styles.daysAgo}>{item.daysAgo}</Text>
        </Text>
      </View>
      <TouchableOpacity onPress={() => deleteNotification(item.id)}>
        <Feather name="trash-2" size={20} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent={true} backgroundColor={'transparent'} />
      {/* Header */}

      {/* Daftar Notifikasi */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: StatusBar.currentHeight || 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  iconContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  redDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  message: {
    fontSize: 14,
    color: '#616161',
    marginTop: 3,
  },
  date: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 5,
  },
  daysAgo: {
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 20,
  },
});
