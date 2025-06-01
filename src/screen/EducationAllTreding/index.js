import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Entypo, Feather } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import api from "../../utils/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EducationAllTreding = () => {
  const [dataTreding, setDataTreding] = useState([]);
  console.log("INI TREDING SMUA", dataTreding);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [fontsLoaded] = useFonts({
    Lexend: require("../../assets/fonts/Lexend-Regular.ttf"),
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500); // 500ms debounce

    return () => clearTimeout(handler); // clear timer jika user masih mengetik
  }, [searchText]);

  useEffect(() => {
    getTrendingEducation(debouncedSearch);
  }, [debouncedSearch]);

  const getTrendingEducation = async (keyword) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      console.log("ini keyword user", keyword);
      const response = await api.get(
        `/content/product/trending?search=${keyword}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("INI data Trending", response.data.data.contents);
      setDataTreding(response.data.data.products);
    } catch (error) {
      console.log("Error ambil konten:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTrendingEducation();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      {/* Header Search Bar */}
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
            borderRadius: 20,
            width: "85%",
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          <Feather name="search" size={20} color="#888" />
          <TextInput
            placeholder="Search here.."
            style={{
              flex: 1,
              marginLeft: 10,
              fontFamily: "Lexend",
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
            }}
            value={searchText}
            onChangeText={setSearchText}
          />
          {loading && <ActivityIndicator style={{ marginTop: 10 }} />}
        </View>
      </View>

      {/* Title */}
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          marginVertical: 20,
          fontFamily: "Lexend",
        }}
      >
        Trending
      </Text>

      {/* Articles */}
      <FlatList
        data={dataTreding}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 20 }}>
            <Image
              source={{ uri: `https://be.pindar.id/api${item.imageLink}` }}
              style={{ width: "100%", height: 180, borderRadius: 10 }}
            />
            <Text style={{ color: "#666", marginTop: 8, fontFamily: "Lexend" }}>
              {item.category}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                fontFamily: "Lexend",
              }}
            >
              {item.name}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <Feather name="clock" size={14} color="#888" />
              <Text
                style={{ marginLeft: 5, color: "#888", fontFamily: "Lexend" }}
              >
                {item.view_count}
              </Text>
              <TouchableOpacity style={{ marginLeft: "auto" }}>
                <Entypo name="dots-three-horizontal" size={16} color="#888" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default EducationAllTreding;
