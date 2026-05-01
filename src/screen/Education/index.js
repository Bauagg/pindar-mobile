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
} from "react-native";
import { Entypo, Feather, Ionicons } from "@expo/vector-icons";
import api from "../../utils/axios";
import { Row } from "react-native-table-component";
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_900Black,
} from "@expo-google-fonts/lexend";
import AsyncStorage from "@react-native-async-storage/async-storage";

const articles = [
  {
    id: "1",
    title: "5 Kesalahan Pengguna Kartu Kredit yang Harus Dihindari",
    time: "5 menit yang lalu",
    image: require("../../assets/education2.png"),
  },
  {
    id: "2",
    title: "Strategi Cerdas Mengelola Pinjaman Online Agar Tak Merugikan",
    time: "10 menit yang lalu",
    image: require("../../assets/education3.png"),
  },
];

export default function Education(props) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
  });
  const [dataContent, setDataContent] = useState([]);
  const [dataTreding, setDataTreding] = useState([]);
  console.log("INI DATA TREDING BOSS", dataTreding);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const navEducationDetail = () => {
    props.navigation.navigate("EducationDetail");
  };
  const navEducationAllTerbaru = () => {
    props.navigation.navigate("Education All Terbaru");
  };
  const navEducationAllTreding = () => {
    props.navigation.navigate("Education All Treding");
  };

  const getCategories = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await api.get("/content/content-category", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = response.data.data.categories;
      console.log("INI RESULT", result);
      setCategories([{ id: null, name: "All" }, ...result]); // tambahkan 'All'
      setSelectedCategory(null); // default All
      getDataEducation(); // ambil semua data
    } catch (error) {
      console.log("Error ambil kategori:", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const getDataEducation = async (categoryId = null, searchQuery = "") => {
    try {
      console.log("Ambil data konten untuk kategoriId:", categoryId);
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      let endpoint = `/content/list`;
      const queryParams = [];

      if (categoryId) queryParams.push(`categoryId=${categoryId}`);
      if (searchQuery)
        queryParams.push(`search=${encodeURIComponent(searchQuery)}`);

      if (queryParams.length > 0) {
        endpoint += `?${queryParams.join("&")}`;
      }

      const response = await api.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("INI data", response.data.data.contents);
      setDataContent(response.data.data.contents);
    } catch (error) {
      console.log("Error ambil konten:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendingEducation = async (searchQuery = "") => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      console.log("Token:", token);

      let endpoint = `/content/list?requestType=trending`;
      if (searchQuery) {
        endpoint += `&search=${encodeURIComponent(searchQuery)}`;
      }
      console.log("Endpoint request:", endpoint);

      const response = await api.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Full response:", response.data);
      if (response.data && response.data.data && response.data.data.contents) {
        console.log("Trending contents:", response.data.data.contents);
        setDataTreding(response.data.data.contents);
      } else {
        console.log("Data trending kosong atau tidak sesuai format");
        setDataTreding([]); // reset data kalau kosong
      }
    } catch (error) {
      console.log("Error ambil konten trending:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataEducation();
    getTrendingEducation();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <Image
          source={require("../../assets/loginlogo.png")}
          style={{
            width: 50,
            height: 50,
            marginRight: 10,
            resizeMode: "contain",
          }}
        />
        <View style={styles.searchContainer}>
          <Entypo
            name="magnifying-glass"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Cari edukasi..."
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={() => {
              getDataEducation(selectedCategory); // gunakan kategori yang dipilih
              getTrendingEducation();
            }}
            returnKeyType="search"
          />
        </View>
      </View>
      <View
        style={{
          width: Dimensions.get("window").width,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
            paddingHorizontal: 20,
          }}
        >
          <Text style={styles.sectionTitle}>Trending</Text>
          <TouchableOpacity
            style={{ marginTop: 13 }}
            onPress={navEducationAllTreding}
          >
            <Text style={{ fontFamily: "Lexend_400Regular" }}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={dataTreding}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.trendingContainer}
              onPress={() =>
                props.navigation.navigate("EducationDetail", { id: item.id })
              } // kirim item ke detail
            >
              <Image
                source={{
                  uri: item.imageLink
                    ? `${process.env.EXPO_PUBLIC_API_BASE_URL}${item.imageLink}`
                    : "https://via.placeholder.com/150", // fallback kalau null
                }}
                style={styles.trendingImage}
              />
              <Text style={styles.trendingTitle}>{item.title}</Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Ionicons
                    name="time-outline"
                    size={10}
                    color="black"
                    style={{ marginTop: 3, marginRight: 5 }}
                  />
                  <Text style={styles.time}>4 jam yang lalu</Text>
                  <Entypo
                    name="dots-three-horizontal"
                    size={10}
                    color="black"
                    style={{ marginLeft: 250 }}
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
        <View>
          <Text style={styles.sectionTitle}>Terbaru</Text>
        </View>
        <TouchableOpacity
          style={{ marginTop: 13 }}
          onPress={navEducationAllTerbaru}
        >
          <Text style={{ fontFamily: "Lexend_400Regular" }}>Lihat Semua</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id ?? "all"}
            onPress={() => {
              console.log("Klik kategori:", category.name, category.id);
              setSelectedCategory(category.id);
              getDataEducation(category.id);
            }}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.activeCategory,
              ]}
            >
              {category.name}
            </Text>
            {selectedCategory === category.id && (
              <View style={styles.underline} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : (
        <FlatList
          data={dataContent}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate("EducationDetail", { id: item.id })
              }
            >
              <View style={styles.articleContainer}>
                <Image
                  source={{ uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${item.imageLink}` }}
                  style={styles.articleImage}
                  resizeMode="contain"
                />
                <View style={styles.articleTextContainer}>
                  <Text style={styles.articleTitle}>{item.title}</Text>
                  <View style={{ flexDirection: "row", marginTop: 5 }}>
                    <Ionicons
                      name="time-outline"
                      size={10}
                      color="black"
                      style={{ marginTop: 3, marginRight: 5 }}
                    />
                    <Text style={styles.time}>{item.time}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListFooterComponent={<View style={{ marginBottom: 50 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 15 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "85%",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchIcon: { marginRight: 5 },
  searchInput: { flex: 1 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    fontFamily: "Lexend-Regular",
  },
  trendingContainer: {
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 10,
    width: Dimensions.get("window").width - 40,
  },
  trendingImage: { width: "100%", height: 150, borderRadius: 10 },
  trendingTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "bold",
    marginTop: 5,
    fontFamily: "Lexend-Regular",
  },
  time: { color: "#888", fontSize: 12 },
  categoryContainer: { flexDirection: "row", marginVertical: 10 },
  categoryText: {
    marginRight: 15,
    fontSize: 14,
    color: "#777",
    fontFamily: "Lexend-Regular",
  },
  activeCategory: { fontWeight: "bold", color: "#000" },
  articleContainer: { flexDirection: "row", marginBottom: 15 },
  articleImage: { width: 80, height: 80, borderRadius: 10, marginRight: 10 },
  articleTextContainer: { flex: 1 },
  articleTitle: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Lexend-Regular",
    lineHeight: 20,
  },
  underline: {
    height: 2,
    width: 20,
    backgroundColor: "#1877F2",
    marginTop: 5,
  },
});
