import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from '@expo-google-fonts/lexend';
import api from '../../utils/axios';

const { width } = Dimensions.get('window');

const KartuKreditDetail = (props) => {
  const idDetail = props?.route?.params?.id;
  const insets = useSafeAreaInsets();
  const { width: winWidth } = useWindowDimensions();
  const [fontsLoaded] = useFonts({ Lexend_400Regular, Lexend_700Bold });
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState(['fitur', 'info', 'terms']);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/credit-card/detail/${idDetail}`);
setDetail(response.data.data);
    } catch (error) {
      console.error('Gagal ambil detail:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDetails(); }, []);

  const toggleSection = (key) => {
    setExpandedSections(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const navAjukan = () => {
    props.navigation.navigate('Redirect Kartu', {
      imageLink: detail.imageLink,
      redirectLink: detail.redirectLink || detail.redicrectLink,
      title: detail.title,
    });
  };

  if (!fontsLoaded) return null;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#CC1C22" />
        <Text style={styles.loadingText}>Memuat detail kartu...</Text>
      </View>
    );
  }

  if (!detail) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={56} color="#ccc" />
        <Text style={styles.emptyText}>Data tidak ditemukan</Text>
      </View>
    );
  }

  const feeText = detail.yearlyFee === '0' || detail.yearlyFee === 0
    ? 'Gratis'
    : `Rp ${parseInt(detail.yearlyFee).toLocaleString('id-ID')}`;

  const infoItems = [
    detail.detailYearlyFee && detail.detailYearlyFee !== '0' && {
      label: 'Keterangan Iuran', value: `Rp ${(parseInt(detail.detailYearlyFee) || 0).toLocaleString('id-ID')}`,
    },
    detail.publisher?.name && { label: 'Penerbit', value: detail.publisher.name },
    detail.type?.name && { label: 'Jenis Kartu', value: detail.type.name },
    detail.monthlyIncomeMinimum && { label: 'Min. Penghasilan/Bln', value: `Rp ${parseInt(detail.monthlyIncomeMinimum).toLocaleString('id-ID')}` },
    detail.yearlyIncomeMinimum && { label: 'Min. Penghasilan/Thn', value: `Rp ${parseInt(detail.yearlyIncomeMinimum).toLocaleString('id-ID')}` },
    detail.mainCardMinimumAge && { label: 'Usia Kartu Utama', value: `${detail.mainCardMinimumAge} – ${detail.mainCardMaximumAge} tahun` },
  ].filter(Boolean);

  const sections = [
    {
      key: 'fitur',
      title: 'Fitur Kartu',
      icon: 'star-outline',
      hasData: detail.features?.length > 0,
      render: () => (
        <View style={{ gap: 10, width: '100%' }}>
          {detail.features.map((feature, i) => (
            <View key={i} style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={18} color="#CC1C22" style={{ marginTop: 1 }} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      ),
    },
    {
      key: 'info',
      title: 'Informasi Biaya',
      icon: 'information-circle-outline',
      hasData: infoItems.length > 0,
      render: () => (
        <View style={{ gap: 0 }}>
          {infoItems.map((item, i) => (
            <View key={i} style={[styles.infoRow, i === infoItems.length - 1 && { borderBottomWidth: 0 }]}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      ),
    },
    {
      key: 'terms',
      title: 'Persyaratan',
      icon: 'document-text-outline',
      hasData: !!detail.termsDocument,
      render: () => (
        <View>
          <Text style={styles.termsSubtitle}>Dokumen Dibutuhkan</Text>
          <RenderHtml
            contentWidth={winWidth - 64}
            source={{ html: detail.termsDocument }}
            tagsStyles={{
              body: { fontFamily: 'sans-serif', fontSize: 13, color: '#444', lineHeight: 22 },
              li: { marginBottom: 6 },
              p: { marginBottom: 8 },
              strong: { color: '#1A1A2E' },
              a: { color: '#CC1C22' },
            }}
          />
        </View>
      ),
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F6FA' }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>

        {/* ── HERO ── */}
        <LinearGradient
          colors={['#B01018', '#CC1C22', '#E8424A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroCircle1} />
          <View style={styles.heroCircle2} />
          <View style={styles.heroCircle3} />

          {/* Card image dengan efek shadow */}
          <View style={styles.cardShadowWrapper}>
            <View style={styles.cardImageWrapper}>
              <Image
                source={{ uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${detail.imageLink}` }}
                style={styles.cardImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </LinearGradient>

        {/* ── TITLE SECTION ── */}
        <View style={styles.titleCard}>
          <View style={styles.titleRow}>
            <Text style={styles.cardTitle}>{detail.title}</Text>
            {(detail.benefitName || detail.mainFeature) && (
              <View style={styles.benefitBadge}>
                <Ionicons name="gift-outline" size={11} color="#CC1C22" />
                <Text style={styles.benefitBadgeText}>{detail.benefitName || detail.mainFeature}</Text>
              </View>
            )}
          </View>
          {detail.publisher?.name && (
            <Text style={styles.publisherText}>
              <Ionicons name="business-outline" size={12} color="#999" /> {detail.publisher.name}
            </Text>
          )}
        </View>

        {/* ── STATS ── */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <LinearGradient colors={['#FFF5F5', '#FEE2E2']} style={styles.statIconBg}>
              <Ionicons name="wallet-outline" size={20} color="#CC1C22" />
            </LinearGradient>
            <Text style={styles.statValue} numberOfLines={1}>{feeText}</Text>
            <Text style={styles.statLabel}>Iuran Tahunan</Text>
          </View>

          <View style={styles.statCard}>
            <LinearGradient colors={['#EEF2FF', '#E0E7FF']} style={styles.statIconBg}>
              <Ionicons name="card-outline" size={20} color="#4F46E5" />
            </LinearGradient>
            <Text style={styles.statValue} numberOfLines={1}>{detail.type?.name || '-'}</Text>
            <Text style={styles.statLabel}>Jenis Kartu</Text>
          </View>

          <View style={styles.statCard}>
            <LinearGradient colors={['#F0FDF4', '#DCFCE7']} style={styles.statIconBg}>
              <Ionicons name="cash-outline" size={20} color="#16A34A" />
            </LinearGradient>
            <Text style={styles.statValue} numberOfLines={1}>
              {detail.monthlyIncomeMinimum
                ? `Rp ${(parseInt(detail.monthlyIncomeMinimum) / 1000000).toFixed(0)}jt`
                : '-'}
            </Text>
            <Text style={styles.statLabel}>Min. Income</Text>
          </View>
        </View>

        {/* ── ACCORDION SECTIONS ── */}
        <View style={styles.sectionsWrapper}>
          {sections.filter(s => s.hasData).map((section) => {
            const isOpen = expandedSections.includes(section.key);
            return (
              <View key={section.key} style={styles.accordion}>
                <TouchableOpacity
                  style={styles.accordionHeader}
                  onPress={() => toggleSection(section.key)}
                  activeOpacity={0.75}
                >
                  <View style={styles.accordionLeft}>
                    <View style={styles.accordionIconBox}>
                      <Ionicons name={section.icon} size={15} color="#CC1C22" />
                    </View>
                    <Text style={styles.accordionTitle}>{section.title}</Text>
                  </View>
                  <View style={[styles.chevronBox, isOpen && styles.chevronBoxOpen]}>
                    <Ionicons name="chevron-down" size={14} color={isOpen ? 'white' : '#999'} />
                  </View>
                </TouchableOpacity>

                {isOpen && (
                  <View style={styles.accordionBody}>
                    {section.render()}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* ── BOTTOM BAR ── */}
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
  loadingContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#F5F6FA', gap: 12,
  },
  loadingText: { fontSize: 13, color: '#999', fontFamily: 'Lexend_400Regular' },
  emptyText: { fontSize: 14, color: '#999', fontFamily: 'Lexend_400Regular' },

  /* Hero */
  hero: {
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroCircle1: {
    position: 'absolute', width: 240, height: 240, borderRadius: 120,
    backgroundColor: 'rgba(255,255,255,0.06)', top: -80, right: -60,
  },
  heroCircle2: {
    position: 'absolute', width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.05)', bottom: -40, left: -30,
  },
  heroCircle3: {
    position: 'absolute', width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.08)', top: 20, left: 30,
  },
  cardShadowWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 16,
  },
  cardImageWrapper: {
    width: width - 48,
    height: 190,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },

  /* Title Card */
  titleCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 6,
  },
  cardTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Lexend_700Bold',
    color: '#1A1A2E',
    lineHeight: 26,
  },
  benefitBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#FEE2E2', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  benefitBadgeText: {
    fontSize: 10, color: '#CC1C22', fontFamily: 'Lexend_700Bold',
  },
  publisherText: {
    fontSize: 12, color: '#999', fontFamily: 'Lexend_400Regular',
  },

  /* Stats */
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginTop: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statIconBg: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 13,
    fontFamily: 'Lexend_700Bold',
    color: '#1A1A2E',
    marginBottom: 2,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#999',
    fontFamily: 'Lexend_400Regular',
    textAlign: 'center',
  },

  /* Sections */
  sectionsWrapper: {
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 14,
  },

  /* Accordion */
  accordion: {
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    width: '100%',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  accordionLeft: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  accordionIconBox: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: '#FEE2E2',
    alignItems: 'center', justifyContent: 'center',
  },
  accordionTitle: {
    fontSize: 14, fontFamily: 'Lexend_700Bold', color: '#1A1A2E',
  },
  chevronBox: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center', justifyContent: 'center',
  },
  chevronBoxOpen: {
    backgroundColor: '#CC1C22',
  },
  accordionBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    width: '100%',
  },

  /* Feature */
  featureRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    width: '100%',
  },
  featureIconBox: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#CC1C22',
    alignItems: 'center', justifyContent: 'center',
    marginTop: 2, flexShrink: 0,
  },
  featureText: {
    flexShrink: 1,
    flexGrow: 1,
    fontSize: 13,
    color: '#444',
    fontFamily: 'Lexend_400Regular',
    lineHeight: 20,
  },

  /* Info */
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  infoLabel: {
    fontSize: 13, color: '#999', fontFamily: 'Lexend_400Regular',
  },
  infoValue: {
    fontSize: 13, color: '#1A1A2E', fontFamily: 'Lexend_700Bold',
    textAlign: 'right', flex: 1, marginLeft: 8,
  },

  /* Terms */
  termsSubtitle: {
    fontSize: 12,
    fontFamily: 'Lexend_700Bold',
    color: '#999',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  /* Bottom */
  bottomBar: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
  },
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: 16,
  },
  applyText: {
    color: 'white', fontSize: 15, fontFamily: 'Lexend_700Bold',
  },
});

export default KartuKreditDetail;
