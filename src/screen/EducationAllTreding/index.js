import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
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

const EducationAllTreding = (props) => {
  const [fontsLoaded] = useFonts({ Lexend_400Regular, Lexend_700Bold });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const LIMIT = 10;

  const getCategories = async () => {
    try {
      const response = await api.get("/content/content-category");
      const result = response.data.data.categories || [];
      setCategories([{ id: null, name: "Semua" }, ...result]);
    } catch (error) {
      console.log("Error ambil kategori:", error);
    }
  };

  const fetchData = async ({ keyword = "", categoryId = null, currentOffset = 0, replace = true }) => {
    if (replace) setLoading(true);
    else setLoadingMore(true);
    try {
      let endpoint = `/content/list?limit=${LIMIT}&offset=${currentOffset}`;
      if (keyword) endpoint += `&search=${encodeURIComponent(keyword)}`;
      if (categoryId) endpoint += `&categoryId=${categoryId}`;

      const response = await api.get(endpoint);
      const newData = response.data.data.contents || [];

      setData((prev) => {
        if (replace) return newData;
        const existingIds = new Set(prev.map((i) => i.id));
        return [...prev, ...newData.filter((i) => !existingIds.has(i.id))];
      });
      setHasMore(newData.length === LIMIT);
      setOffset(currentOffset + newData.length);
    } catch (error) {
      console.log("Error fetch trending:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    getCategories();
    fetchData({ keyword: "", categoryId: null, currentOffset: 0, replace: true });
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchData({ keyword: searchText, categoryId: selectedCategory, currentOffset: 0, replace: true });
    }, 500);
    return () => clearTimeout(handler);
  }, [searchText]);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchData({ keyword: searchText, categoryId, currentOffset: 0, replace: true });
  };

  const loadMore = () => {
    if (loadingMore || !hasMore || loading) return;
    fetchData({ keyword: searchText, categoryId: selectedCategory, currentOffset: offset, replace: false });
  };

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F6FA" }}>
      <FlatList
        data={loading ? [] : data}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={18} color="#CC1C22" />
              <TextInput
                placeholder="Cari artikel edukasi..."
                style={styles.searchInput}
                placeholderTextColor="#aaa"
                value={searchText}
                onChangeText={setSearchText}
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText("")}>
                  <Ionicons name="close-circle" size={16} color="#ccc" />
                </TouchableOpacity>
              )}
            </View>
            {categories.length > 1 && (
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={categories}
                keyExtractor={(item) => item.id ?? "all"}
                contentContainerStyle={{ gap: 8, paddingBottom: 12 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleCategorySelect(item.id)}
                    style={[styles.filterChip, selectedCategory === item.id && styles.filterChipActive]}
                  >
                    <Text style={[styles.filterChipText, selectedCategory === item.id && styles.filterChipTextActive]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        }
        renderItem={({ item, index }) => (
          index === 0 ? (
            // Card besar untuk item pertama
            <TouchableOpacity
              style={styles.featuredCard}
              activeOpacity={0.88}
              onPress={() => props.navigation.navigate("EducationDetail", { id: item.id })}
            >
              <Image
                source={{ uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${item.imageLink}` }}
                style={styles.featuredImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.78)"]}
                style={styles.featuredOverlay}
              >
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.category || "Artikel"}</Text>
                </View>
                <Text style={styles.featuredTitle} numberOfLines={2}>{item.title}</Text>
                <View style={styles.metaRow}>
                  <Ionicons name="flame" size={12} color="#FF6B6B" />
                  <Text style={styles.metaTextWhite}>  {item.viewCount || 0} views</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            // Card kecil untuk item selanjutnya
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.88}
              onPress={() => props.navigation.navigate("EducationDetail", { id: item.id })}
            >
              <Image
                source={{ uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${item.imageLink}` }}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.cardBody}>
                <View style={styles.badgeSmall}>
                  <Text style={styles.badgeTextSmall}>{item.category || "Artikel"}</Text>
                </View>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                <View style={styles.metaRow}>
                  <Ionicons name="eye-outline" size={12} color="#999" />
                  <Text style={styles.metaText}>  {item.viewCount || 0} views</Text>
                </View>
              </View>
            </TouchableOpacity>
          )
        )}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator color="#CC1C22" style={{ marginVertical: 20 }} />
          ) : loadingMore ? (
            <ActivityIndicator color="#CC1C22" style={{ marginVertical: 20 }} />
          ) : (
            <View style={{ height: 100 }} />
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    gap: 12,
  },
  searchBar: {
    backgroundColor: "white",
    height: 46,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 8,
    marginBottom: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#333",
    fontFamily: "Lexend_400Regular",
  },
  featuredCard: {
    height: 220,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#eee",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  featuredImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  featuredOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 16,
  },
  featuredTitle: {
    color: "white",
    fontSize: 16,
    fontFamily: "Lexend_700Bold",
    lineHeight: 22,
    marginBottom: 6,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(204,28,34,0.9)",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 8,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontFamily: "Lexend_700Bold",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaTextWhite: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 11,
    fontFamily: "Lexend_400Regular",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  cardImage: {
    width: 100,
    height: 100,
    backgroundColor: "#f0f0f0",
  },
  cardBody: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  badgeSmall: {
    alignSelf: "flex-start",
    backgroundColor: "#FEE2E2",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 6,
  },
  badgeTextSmall: {
    color: "#CC1C22",
    fontSize: 10,
    fontFamily: "Lexend_700Bold",
  },
  cardTitle: {
    fontSize: 13,
    fontFamily: "Lexend_700Bold",
    color: "#1A1A2E",
    lineHeight: 19,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 11,
    color: "#999",
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
});

export default EducationAllTreding;
