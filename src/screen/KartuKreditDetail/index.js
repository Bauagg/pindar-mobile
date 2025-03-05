import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { List } from 'react-native-paper';

const KartuKreditDetail = () => {
  const [expandedItems, setExpandedItems] = useState({});

  const accordionData = [
    {
      id: 1,
      title: 'Detail Informasi',
      content: 'Kartu Kredit BCA Black Visa adalah kartu kredit premium...',
    },
    {
      id: 2,
      title: 'Fitur Utama',
      content:
        'Kartu ini menyediakan limit kredit tinggi, reward points, dan berbagai promo...',
    },
    {
      id: 3,
      title: 'Fasilitas Kartu',
      content:
        'Pemegang kartu dapat menikmati berbagai fasilitas eksklusif dan layanan prioritas...',
    },
    {
      id: 4,
      title: 'Biaya & Denda',
      content:
        'Kartu ini memiliki biaya tahunan Rp 450.000 dengan bunga rendah...',
    },
    {
      id: 5,
      title: 'Persyaratan',
      content:
        'Pengajuan kartu memerlukan penghasilan minimal dan dokumen pendukung...',
    },
    {
      id: 6,
      title: 'Cara Pengajuan',
      content:
        'Pengajuan kartu dapat dilakukan secara online melalui website resmi bank...',
    },
  ];

  const toggleAccordion = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle tiap item tanpa menutup yang lain
    }));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: '#E50914',
          paddingVertical: 50,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          alignItems: 'center',
        }}>
        <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>
          Kartu Kredit
        </Text>
      </View>

      {/* Gambar Kartu */}
      <View style={{ alignItems: 'center', marginTop: -30 }}>
        <Image
          source={require('../../assets/bca.png')}
          style={{ width: 280, height: 180, borderRadius: 10 }}
        />
      </View>

      {/* Kartu Detail */}
      <View style={{ alignItems: 'center', marginVertical: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>BCA Black Visa</Text>
        <Text style={{ fontSize: 16, color: '#333', marginTop: 5 }}>
          Rp 450.000* <Text style={{ color: '#888' }}>Premium</Text>
        </Text>
        <Text style={{ fontSize: 14, color: '#888' }}>Signature Card</Text>
      </View>

      {/* FlatList untuk Accordion & Footer */}
      <FlatList
        data={accordionData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <List.Accordion
            title={item.title}
            expanded={expandedItems[item.id] || false}
            onPress={() => toggleAccordion(item.id)}
            titleStyle={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}
            left={(props) => (
              <AntDesign
                name="downcircleo"
                size={20}
                color={expandedItems[item.id] ? '#E50914' : '#888'}
              />
            )}
            style={{
              backgroundColor: 'white',
              marginVertical: 5,
              borderRadius: 10,
              paddingHorizontal: 10,
            }}>
            <Text style={{ padding: 15, fontSize: 14, color: '#555' }}>
              {item.content}
            </Text>
          </List.Accordion>
        )}
        ListFooterComponent={
          <TouchableOpacity
            style={{
              backgroundColor: '#E50914',
              padding: 15,
              borderRadius: 10,
              alignItems: 'center',
              margin: 20,
            }}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
              Ajukan Sekarang
            </Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
};

export default KartuKreditDetail;
