import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend";
import api from "../../utils/axios";

const { width } = Dimensions.get("window");
const TRENDING_CARD_WIDTH = width - 48;

export default function Education(props) {
  const [fontsLoaded] = useFonts({ Lexend_400Regular, Lexend_700Bold });
  const [dataContent, setDataContent] = useState([]);
  const [dataTrending, setDataTrending] = useState([]);
  const [trendingIndex, setTrendingIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchText, setSearchText] = useState("");

  const getCategories = async () => {
    try {
      const response = await api.get("/content/content-category");
      const result = response.data.data.categories || [];
      setCategories([{ id: null, name: "Semua" }, ...result]);
    } catch (error) {
      console.log("Error ambil kategori:", error);
    }
  };

  const getDataEducation = async (categoryId = null, searchQuery = "", pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      let endpoint = `/content/list?limit=3&offset=${(pageNum - 1) * 3}`;
      if (categoryId) endpoint += `&categoryId=${categoryId}`;
      if (searchQuery) endpoint += `&search=${encodeURIComponent(searchQuery)}`;

      const response = await api.get(endpoint);
      const contents = response.data.data.contents || [];
      const pagination = response.data.data.pagination;

      if (append) {
        setDataContent((prev) => [...prev, ...contents]);
      } else {
        setDataContent(contents);
      }

      setHasMore(pageNum < (pagination?.totalPages || 1));
      setPage(pageNum);
    } catch (error) {
      console.log("Error ambil konten:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      getDataEducation(selectedCategory, searchText, page + 1, true);
    }
  };

  const getTrendingEducation = async () => {
    try {
      const response = await api.get(`/content/list?requestType=trending&limit=5&offset=1`);
      setDataTrending(response.data.data?.contents || []);
    } catch (error) {
      console.log("Error ambil trending:", error);
    }
  };

  useEffect(() => {
    getCategories();
    getDataEducation();
    getTrendingEducation();
  }, []);

  if (!fontsLoaded) return null;

  const ListHeader = (
    <View>
      {/* Trending */}
      {dataTrending.length > 0 && (
        <>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Trending</Text>
            <TouchableOpacity
              style={styles.viewAllBtn}
              onPress={() => props.navigation.navigate("Education All Treding")}
            >
              <Text style={styles.viewAllBtnText}>Lihat semua</Text>
              <Ionicons name="chevron-forward" size={13} color="#CC1C22" />
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={dataTrending}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
            snapToInterval={TRENDING_CARD_WIDTH + 12}
            snapToAlignment="start"
            decelerationRate="fast"
            onScroll={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / (TRENDING_CARD_WIDTH + 12));
              setTrendingIndex(index);
            }}
            scrollEventThrottle={16}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.trendingCard}
                activeOpacity={0.88}
                onPress={() => props.navigation.navigate("EducationDetail", { id: item.id })}
              >
                <Image
                  source={{ uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${item.imageLink}` }}
                  style={styles.trendingImage}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.75)"]}
                  style={styles.trendingOverlay}
                >
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{item.category || "Artikel"}</Text>
                  </View>
                  <Text style={styles.trendingTitle} numberOfLines={2}>{item.title}</Text>
                  <View style={styles.metaRow}>
                    <Ionicons name="flame" size={12} color="#FF6B6B" />
                    <Text style={styles.metaText}> Trending</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            )}
          />
          {/* Pagination dots */}
          <View style={styles.dotsRow}>
            {dataTrending.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, trendingIndex === i ? styles.dotActive : styles.dotInactive]}
              />
            ))}
          </View>
        </>
      )}

      {/* Terbaru header */}
      <View style={[styles.sectionRow, { marginTop: 24 }]}>
        <Text style={styles.sectionTitle}>Terbaru</Text>
      </View>

      {/* Filter Kategori */}
      {categories.length > 1 && (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item.id ?? "all"}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedCategory(item.id);
                getDataEducation(item.id, searchText, 1, false);
              }}
              style={[
                styles.filterChip,
                selectedCategory === item.id && styles.filterChipActive,
              ]}
            >
              <Text style={[
                styles.filterChipText,
                selectedCategory === item.id && styles.filterChipTextActive,
              ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {loading && (
        <ActivityIndicator color="#CC1C22" style={{ marginVertical: 30 }} />
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F6FA" }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={["#CC1C22", "#E8424A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <Text style={styles.headerTitle}>Edukasi</Text>
        <Text style={styles.headerSubtitle}>Tingkatkan literasi keuanganmu</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#CC1C22" />
          <TextInput
            placeholder="Cari artikel edukasi..."
            style={styles.searchInput}
            placeholderTextColor="#aaa"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={() => getDataEducation(selectedCategory, searchText, 1, false)}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => { setSearchText(""); getDataEducation(selectedCategory, "", 1, false); }}>
              <Ionicons name="close-circle" size={16} color="#ccc" />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Article List dengan infinite scroll */}
      <FlatList
        data={loading ? [] : dataContent}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8, gap: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.articleCard}
            activeOpacity={0.88}
            onPress={() => props.navigation.navigate("EducationDetail", { id: item.id })}
          >
            <Image
              source={{ uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${item.imageLink}` }}
              style={styles.articleImage}
              resizeMode="cover"
            />
            <View style={styles.articleBody}>
              <View style={styles.articleBadge}>
                <Text style={styles.articleBadgeText}>{item.category || "Artikel"}</Text>
              </View>
              <Text style={styles.articleTitle} numberOfLines={2}>{item.title}</Text>
              <View style={styles.metaRow}>
                <Ionicons name="time-outline" size={12} color="#999" />
                <Text style={styles.articleMeta}>
                  {"  "}{new Date(item.createdDate).toLocaleDateString("id-ID", {
                    day: "2-digit", month: "short", year: "numeric",
                  })}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          loadingMore
            ? <ActivityIndicator color="#CC1C22" style={{ marginVertical: 20 }} />
            : <View style={{ height: 120 }} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
  },
  circle1: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.07)",
    top: -40,
    right: -20,
  },
  circle2: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.05)",
    bottom: 10,
    left: -10,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 22,
    fontFamily: "Lexend_700Bold",
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontFamily: "Lexend_400Regular",
    marginBottom: 16,
  },
  searchBar: {
    backgroundColor: "white",
    height: 46,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#333",
    fontFamily: "Lexend_400Regular",
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Lexend_700Bold",
    color: "#1A1A2E",
  },
  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 2,
  },
  viewAllBtnText: {
    fontSize: 12,
    color: "#CC1C22",
    fontFamily: "Lexend_700Bold",
  },
  trendingCard: {
    width: TRENDING_CARD_WIDTH,
    height: 200,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
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
  trendingImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  trendingOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 14,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(204,28,34,0.85)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 6,
  },
  categoryBadgeText: {
    color: "white",
    fontSize: 10,
    fontFamily: "Lexend_700Bold",
  },
  trendingTitle: {
    color: "white",
    fontSize: 13,
    fontFamily: "Lexend_700Bold",
    lineHeight: 18,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 11,
    fontFamily: "Lexend_400Regular",
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  filterChipActive: {
    backgroundColor: "#CC1C22",
    borderColor: "#CC1C22",
  },
  filterChipText: {
    fontSize: 13,
    fontFamily: "Lexend_400Regular",
    color: "#555",
  },
  filterChipTextActive: {
    color: "white",
    fontFamily: "Lexend_700Bold",
  },
  articleCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  articleImage: {
    width: 100,
    height: 100,
    backgroundColor: "#f0f0f0",
  },
  articleBody: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  articleBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#FEE2E2",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 6,
  },
  articleBadgeText: {
    color: "#CC1C22",
    fontSize: 10,
    fontFamily: "Lexend_700Bold",
  },
  articleTitle: {
    fontSize: 13,
    fontFamily: "Lexend_700Bold",
    color: "#1A1A2E",
    lineHeight: 19,
    marginBottom: 8,
  },
  articleMeta: {
    fontSize: 11,
    color: "#999",
    fontFamily: "Lexend_400Regular",
  },
});
