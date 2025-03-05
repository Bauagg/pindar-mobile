import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Entypo } from '@expo/vector-icons'; // Ikon untuk arrow

const AccordionItem = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View
      style={{
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        padding: 10,
      }}>
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{title}</Text>
        <Entypo
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="black"
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={{ marginTop: 5 }}>
          <Text style={{ fontSize: 14, color: '#666' }}>{content}</Text>
        </View>
      )}
    </View>
  );
};

const KartuKreditDetail = () => {
  return (
    <ScrollView style={{ padding: 20, backgroundColor: '#f5f5f5' }}>
      <AccordionItem
        title="Detail Informasi"
        content="Kartu Kredit BCA Black Visa adalah kartu kredit premium yang menawarkan berbagai fasilitas eksklusif bagi nasabahnya..."
      />
      <AccordionItem
        title="Fitur Utama"
        content="Kartu ini menyediakan limit kredit tinggi, program reward points yang dapat ditukarkan dengan hadiah menarik..."
      />
      <AccordionItem
        title="Fasilitas Kartu"
        content="Pemegang kartu dapat menikmati berbagai promo dan diskon, perlindungan asuransi perjalanan, serta layanan pelanggan prioritas."
      />
      <AccordionItem
        title="Biaya & Denda"
        content="Kartu ini memiliki biaya tahunan Rp 450.000 serta denda keterlambatan pembayaran sesuai ketentuan bank."
      />
      <AccordionItem
        title="Persyaratan"
        content="Syarat pengajuan kartu ini antara lain memiliki penghasilan minimum Rp 10.000.000 per bulan dan berusia minimal 21 tahun."
      />
      <AccordionItem
        title="Cara Pengajuan"
        content="Pengajuan kartu ini dapat dilakukan secara online melalui aplikasi BCA atau dengan mengunjungi cabang BCA terdekat."
      />
    </ScrollView>
  );
};

export default KartuKreditDetail;
