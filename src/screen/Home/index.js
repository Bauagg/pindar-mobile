import React, { useState, useEffect, useRef } from "react";
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  Linking,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Entypo, Feather } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend";
import api from "../../utils/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const screenWidth = Dimensions.get("window").width;

const MENU_ITEMS = [
  { image: require("../../assets/menu1.png"), text: "Pinjaman\nDaring", screen: "Pindar" },
  { image: require("../../assets/menu2.png"), text: "Kartu\nKredit", screen: "Kartu Kredit" },
  { image: require("../../assets/menu3.png"), text: "Pinjaman\nBank", screen: "PinjamanBank" },
];

export default function Home(props) {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [fullName, setFullName] = useState(null);
  const [dataUser, setDataUser] = useState({});
  const [rekomendasi, setRekomendasi] = useState([]);
  const [creditCards, setCreditCards] = useState([]);
  const [popularDeal, setPopularDeal] = useState([]);
  const [popularDealIndex, setPopularDealIndex] = useState(0);
  const popularDealRef = useRef(null);
  const popularDealIndexRef = useRef(0);
  const [popularPlus, setPopularPlus] = useState([]);
  const [popularPlusIndex, setPopularPlusIndex] = useState(0);
  const popularPlusRef = useRef(null);
  const popularPlusIndexRef = useRef(0);
  const rekoFlatListRef = useRef(null);
  const rekoIndexRef = useRef(0);
  const [educationList, setEducationList] = useState([]);
  const [trendingDate, setTrendingDate] = useState("");
  const [loadingEdu, setLoadingEdu] = useState(false);

  const [fontsLoaded] = useFonts({ Lexend_400Regular, Lexend_700Bold });

  const navNotifikasi = () => props.navigation.navigate("Notifikasi");

  const handleSearch = async (text) => {
    setSearchText(text);
    if (text.length > 0) {
      try {
        const response = await api.get(`/product/search?search=${encodeURIComponent(text)}`);
        setFilteredData(response.data.products || []);
      } catch {
        setFilteredData([]);
      }
    } else {
      setFilteredData([]);
    }
  };

  useEffect(() => {
    const getDataUser = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        console.log("Token saat fetch profile:", token ? token.slice(0, 30) + "..." : "NULL");
        const response = await api.get(`/user/profile`);
        setDataUser(response.data.data || {});
      } catch (e) {
        console.error("Gagal fetch profile:", e.response?.status, JSON.stringify(e.response?.data));
      }
    };

    const fetchStorage = async () => {
      try {
        const name = await AsyncStorage.getItem("fullName");
        if (name) setFullName(name);
      } catch (e) {}
    };

    const fetchRekomendasi = async () => {
      try {
        const response = await api.get("/lender/list-pinned?limit=8&offset=1");
        setRekomendasi(response.data.data?.lenders || []);
      } catch (e) {
        console.error("Gagal fetch rekomendasi:", e.message);
      }
    };

    const fetchPopularDeal = async () => {
      try {
        const response = await api.get("/announcement/active?type=deal");
        setPopularDeal(response.data.data || []);
      } catch (e) {
        console.error("Gagal fetch popular deal:", e.message);
      }
    };

    const fetchPopularPlus = async () => {
      try {
        const response = await api.get("/announcement/active?type=popular");
        setPopularPlus(response.data.data || []);
      } catch (e) {
        console.error("Gagal fetch popular plus:", e.message);
      }
    };

    const fetchCreditCards = async () => {
      try {
        const response = await api.get("/credit-card/search?limit=10&offset=1");
        setCreditCards(response.data.data?.creditCards || []);
      } catch (e) {
        console.error("Gagal fetch credit cards:", e.message);
      }
    };

    const fetchEducation = async () => {
      try {
        setLoadingEdu(true);
        const response = await api.get("/content/list?limit=3");
        const contents = response.data.data?.contents || [];
        console.log("Education image URL contoh:", `${process.env.EXPO_PUBLIC_IMAGE_BASE_URL}${contents[0]?.imageLink}`);
        setEducationList(contents);
        const d = new Date();
        setTrendingDate(
          `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`
        );
      } catch (e) {
        console.error("Gagal fetch education:", e.message);
      } finally {
        setLoadingEdu(false);
      }
    };

    getDataUser();
    fetchStorage();
    fetchRekomendasi();
    fetchCreditCards();
    fetchPopularDeal();
    fetchPopularPlus();
    fetchEducation();
  }, []);

  useEffect(() => {
    if (popularDeal.length === 0) return;
    const CARD_WIDTH = (width - 32) / 2 + 12;
    const interval = setInterval(() => {
      const nextIndex = popularDealIndexRef.current + 1 >= popularDeal.length ? 0 : popularDealIndexRef.current + 1;
      popularDealIndexRef.current = nextIndex;
      setPopularDealIndex(nextIndex);
      popularDealRef.current?.scrollToOffset({ offset: nextIndex * CARD_WIDTH, animated: true });
    }, 3000);
    return () => clearInterval(interval);
  }, [popularDeal]);

  useEffect(() => {
    if (popularPlus.length === 0) return;
    const BANNER_WIDTH = width - 32 + 12;
    const interval = setInterval(() => {
      const nextIndex = popularPlusIndexRef.current + 1 >= popularPlus.length ? 0 : popularPlusIndexRef.current + 1;
      popularPlusIndexRef.current = nextIndex;
      setPopularPlusIndex(nextIndex);
      popularPlusRef.current?.scrollToOffset({ offset: nextIndex * BANNER_WIDTH, animated: true });
    }, 3000);
    return () => clearInterval(interval);
  }, [popularPlus]);

  useEffect(() => {
    if (rekomendasi.length === 0) return;
    const CARD_WIDTH = 120 + 12;
    const interval = setInterval(() => {
      const nextIndex = rekoIndexRef.current + 1;
      if (nextIndex >= rekomendasi.length) {
        rekoIndexRef.current = 0;
        rekoFlatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      } else {
        rekoIndexRef.current = nextIndex;
        rekoFlatListRef.current?.scrollToOffset({ offset: nextIndex * CARD_WIDTH, animated: true });
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [rekomendasi]);

  if (!fontsLoaded) return null;

  const firstName = (fullName || dataUser?.fullName || "User").split(" ")[0];

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F6FA" }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* ── HEADER (sama seperti sebelumnya) ── */}
      <LinearGradient
        colors={["#CC1C22", "#E8424A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.circle1} />
        <View style={styles.circle2} />

        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <View style={styles.avatarWrapper}>
              {dataUser.imagelink ? (
                <Image
                  source={{ uri: `${process.env.EXPO_PUBLIC_IMAGE_BASE_URL}${dataUser.imagelink}` }}
                  style={styles.avatar}
                />
              ) : (
                <LinearGradient
                  colors={["#FF6B6B", "#CC1C22"]}
                  style={styles.avatarInitial}
                >
                  <Text style={styles.avatarInitialText}>
                    {firstName.charAt(0).toUpperCase()}
                  </Text>
                </LinearGradient>
              )}
            </View>
            <View>
              <Text style={styles.greetingSmall}>Selamat datang 👋</Text>
              <Text style={styles.greeting}>Hi, {firstName}!</Text>
            </View>
          </View>
          <TouchableOpacity onPress={navNotifikasi} style={styles.bellBtn}>
            <MaterialCommunityIcons name="bell-badge-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#CC1C22" />
          <TextInput
            placeholder="Search pindar..."
            style={styles.searchInput}
            placeholderTextColor="#aaa"
            value={searchText}
            onChangeText={handleSearch}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => { setSearchText(""); setFilteredData([]); }}>
              <Ionicons name="close-circle" size={16} color="#ccc" />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Search dropdown */}
      {searchText.length > 0 && filteredData.length > 0 && (
        <View style={styles.searchDropdown}>
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id?.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.searchItem}
                onPress={() => {
                  Linking.openURL(item.directlink);
                  setSearchText("");
                  setFilteredData([]);
                }}
              >
                <Image
                  source={{ uri: `${process.env.EXPO_PUBLIC_IMAGE_BASE_URL}${item.imagelink}` }}
                  style={styles.searchItemImg}
                />
                <Text style={styles.searchItemText}>{item.title}</Text>
                <Entypo name="chevron-right" size={16} color="#ccc" />
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── MENU GRID ── */}
        <View style={styles.menuGrid}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuCard}
              activeOpacity={0.85}
              onPress={() => props.navigation.navigate(item.screen)}
            >
              <Image source={item.image} style={styles.menuImg} />
              <Text style={styles.menuLabel}>{item.text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── POPULAR DEAL ── */}
        {popularDeal.length > 0 && (
          <View style={{ marginTop: 24 }}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Popular Deal</Text>
            </View>
            <FlatList
              ref={popularDealRef}
              data={popularDeal}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={(width - 32) / 2 + 12}
              snapToAlignment="start"
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
              onScroll={(e) => {
                const cardW = (width - 32) / 2 + 12;
                const idx = Math.round(e.nativeEvent.contentOffset.x / cardW);
                popularDealIndexRef.current = idx;
                setPopularDealIndex(idx);
              }}
              scrollEventThrottle={16}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.92}
                  onPress={() => item.url && Linking.openURL(item.url)}
                  style={styles.popularCard}
                >
                  <Image
                    source={{ uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${item.imageLink}` }}
                    style={styles.popularImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}
            />
            <View style={styles.dotsRow}>
              {popularDeal.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, popularDealIndex === i ? styles.dotActive : styles.dotInactive]}
                />
              ))}
            </View>
          </View>
        )}

        {/* ── POPULAR PLUS ── */}
        {popularPlus.length > 0 && (
          <View style={{ marginTop: 24 }}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Popular Plus</Text>
            </View>
            <FlatList
              ref={popularPlusRef}
              data={popularPlus}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={width - 32 + 12}
              snapToAlignment="start"
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
              onScroll={(e) => {
                const idx = Math.round(e.nativeEvent.contentOffset.x / (width - 32 + 12));
                popularPlusIndexRef.current = idx;
                setPopularPlusIndex(idx);
              }}
              scrollEventThrottle={16}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.92}
                  onPress={() => item.url && Linking.openURL(item.url)}
                  style={styles.popularPlusCard}
                >
                  <Image
                    source={{ uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${item.imageLink}` }}
                    style={styles.popularImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}
            />
            <View style={styles.dotsRow}>
              {popularPlus.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, popularPlusIndex === i ? styles.dotActive : styles.dotInactive]}
                />
              ))}
            </View>
          </View>
        )}

        {/* ── TRENDING EDUCATION ── */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.trendingBanner}
          onPress={() => props.navigation.navigate("Education All Treding")}
        >
          <LinearGradient
            colors={["#CC1C22", "#E8424A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.trendingGradient}
          >
            <View style={styles.trendingCircle1} />
            <View style={styles.trendingCircle2} />
            <View>
              <Text style={styles.trendingTitle}>Trending Education</Text>
              <Text style={styles.trendingDate}>Last Date {trendingDate || "—"}</Text>
            </View>
            <View style={styles.trendingBtn}>
              <Text style={styles.trendingBtnText}>View all</Text>
              <Feather name="arrow-right" size={14} color="white" style={{ marginLeft: 4 }} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* ── APLIKASI REKOMENDASI ── */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Aplikasi Rekomendasi</Text>
          <TouchableOpacity onPress={() => props.navigation.navigate("Pindar")}>
            <Text style={styles.sectionViewAll}>View all →</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          ref={rekoFlatListRef}
          data={rekomendasi}
          keyExtractor={(item, i) => i.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 4, gap: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.rekoCard}
              activeOpacity={0.85}
              onPress={() => {
                if (item.directlink) Linking.openURL(item.directlink);
                else props.navigation.navigate("Pindar");
              }}
            >
              <Image
                source={{ uri: `${process.env.EXPO_PUBLIC_IMAGE_BASE_URL}${item.imagelink}` }}
                style={styles.rekoImg}
                resizeMode="contain"
              />
              <Text style={styles.rekoName} numberOfLines={1}>{item.lendername}</Text>
            </TouchableOpacity>
          )}
        />

        {/* ── REKOMENDASI CREDIT CARD ── */}
        <View style={[styles.sectionRow, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>Rekomendasi Credit Card</Text>
          <TouchableOpacity onPress={() => props.navigation.navigate("Kartu Kredit")}>
            <Text style={styles.sectionViewAll}>View all →</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.ccGrid}>
          {creditCards.slice(0, 6).map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.ccCard}
              activeOpacity={0.88}
              onPress={() => props.navigation.navigate("Kartu Kredit Detail", { id: item.id })}
            >
              <View style={styles.ccImageWrapper}>
                <Image
                  source={{ uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${item.imageLink}` }}
                  style={styles.ccImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.ccBody}>
                <Text style={styles.ccTitle} numberOfLines={2}>{item.title}</Text>
                <View style={styles.ccBadge}>
                  <Text style={styles.ccBadgeText}>{item.benefitName}</Text>
                </View>
                <Text style={styles.ccFee}>
                  {item.yearlyFee === "0"
                    ? "Gratis Tahunan"
                    : `Rp ${parseInt(item.yearlyFee).toLocaleString("id-ID")}/thn`}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── EDUCATION PRODUCT ── */}
        <View style={[styles.sectionRow, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>Education Product</Text>
          <TouchableOpacity onPress={() => props.navigation.navigate("Education All Treding")}>
            <Text style={styles.sectionViewAll}>View all →</Text>
          </TouchableOpacity>
        </View>

        {loadingEdu ? (
          <ActivityIndicator color="#CC1C22" style={{ marginVertical: 20 }} />
        ) : (
          <View style={{ paddingHorizontal: 16, gap: 14 }}>
            {educationList.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.eduCard}
                activeOpacity={0.88}
                onPress={() => props.navigation.navigate("EducationDetail", { id: item.id })}
              >
                <Image
                  source={{ uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${item.imageLink}` }}
                  style={styles.eduImg}
                  resizeMode="cover"
                />
                <View style={styles.eduOverlay}>
                  <View style={styles.eduBadge}>
                    <Text style={styles.eduBadgeText}>{item.category || "Artikel"}</Text>
                  </View>
                  <Text style={styles.eduTitle} numberOfLines={2}>{item.title}</Text>
                  <View style={styles.eduMeta}>
                    <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.eduMetaText}>  {new Date(item.createdDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  /* ── HEADER ── */
  header: {
    width,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
  },
  circle1: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.07)",
    top: -40,
    right: -30,
  },
  circle2: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.05)",
    bottom: 10,
    left: -20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
    marginRight: 12,
    overflow: "hidden",
    backgroundColor: "#eee",
  },
  avatar: { width: "100%", height: "100%" },
  avatarInitial: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitialText: {
    color: "white",
    fontSize: 20,
    fontFamily: "Lexend_700Bold",
  },
  greetingSmall: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontFamily: "Lexend_400Regular",
  },
  greeting: {
    color: "white",
    fontSize: 18,
    fontFamily: "Lexend_700Bold",
  },
  bellBtn: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 8,
    borderRadius: 12,
  },
  searchBar: {
    backgroundColor: "white",
    height: 46,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#333",
    fontFamily: "Lexend_400Regular",
  },

  /* ── SEARCH DROPDOWN ── */
  searchDropdown: {
    position: "absolute",
    top: 190,
    left: 16,
    right: 16,
    backgroundColor: "white",
    borderRadius: 14,
    zIndex: 9999,
    elevation: 20,
    maxHeight: 260,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  searchItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  searchItemImg: {
    width: 34,
    height: 34,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: "#f5f5f5",
  },
  searchItemText: {
    flex: 1,
    fontSize: 13,
    color: "#333",
    fontFamily: "Lexend_400Regular",
  },

  /* ── MENU GRID ── */
  menuGrid: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
    gap: 12,
  },
  menuCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  menuImg: {
    width: 52,
    height: 52,
    resizeMode: "contain",
    marginBottom: 10,
  },
  menuLabel: {
    fontSize: 12,
    fontFamily: "Lexend_700Bold",
    color: "#333",
    textAlign: "center",
    lineHeight: 17,
  },

  /* ── TRENDING BANNER ── */
  trendingBanner: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#CC1C22",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  trendingGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
    overflow: "hidden",
  },
  trendingCircle1: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.07)",
    top: -30,
    right: 100,
  },
  trendingCircle2: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.05)",
    bottom: -20,
    right: 20,
  },
  trendingTitle: {
    color: "white",
    fontSize: 16,
    fontFamily: "Lexend_700Bold",
    marginBottom: 4,
  },
  trendingDate: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 12,
    fontFamily: "Lexend_400Regular",
  },
  trendingBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.65)",
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  trendingBtnText: {
    color: "white",
    fontSize: 13,
    fontFamily: "Lexend_700Bold",
  },

  /* ── SECTION ── */
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Lexend_700Bold",
    color: "#1A1A2E",
  },
  sectionViewAll: {
    fontSize: 13,
    color: "#CC1C22",
    fontFamily: "Lexend_400Regular",
  },

  /* ── REKOMENDASI ── */
  rekoCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    width: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  rekoImg: {
    width: 70,
    height: 46,
    marginBottom: 10,
  },
  rekoName: {
    fontSize: 12,
    fontFamily: "Lexend_700Bold",
    color: "#333",
    textAlign: "center",
  },

  /* ── POPULAR PLUS ── */
  popularPlusCard: {
    width: width - 32,
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  popularCard: {
    width: (width - 32) / 2,
    height: 240,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  popularImage: {
    width: "100%",
    height: "100%",
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 22,
    backgroundColor: "#CC1C22",
  },
  dotInactive: {
    width: 6,
    backgroundColor: "#D9D9D9",
  },

  /* ── CREDIT CARD ── */
  ccGrid: {
    paddingHorizontal: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  ccCard: {
    width: (width - 44) / 2,
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  ccImageWrapper: {
    backgroundColor: "#F8F8F8",
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  ccImage: {
    width: "100%",
    height: "100%",
  },
  ccBody: {
    padding: 12,
  },
  ccTitle: {
    fontSize: 13,
    fontFamily: "Lexend_700Bold",
    color: "#1A1A2E",
    lineHeight: 18,
    marginBottom: 6,
  },
  ccBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#FEE2E2",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 6,
  },
  ccBadgeText: {
    fontSize: 10,
    color: "#CC1C22",
    fontFamily: "Lexend_700Bold",
  },
  ccFee: {
    fontSize: 11,
    color: "#999",
    fontFamily: "Lexend_400Regular",
  },

  /* ── EDUCATION ── */
  eduCard: {
    borderRadius: 18,
    overflow: "hidden",
    height: 200,
    backgroundColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 14,
  },
  eduImg: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  eduOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.38)",
  },
  eduBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#CC1C22",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  eduBadgeText: {
    color: "white",
    fontSize: 11,
    fontFamily: "Lexend_700Bold",
  },
  eduTitle: {
    color: "white",
    fontSize: 15,
    fontFamily: "Lexend_700Bold",
    lineHeight: 22,
    marginBottom: 6,
  },
  eduMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  eduMetaText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 11,
    fontFamily: "Lexend_400Regular",
  },
});
