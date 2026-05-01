import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  Linking,
} from "react-native";
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend";
import api from "../../utils/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.5;
const CARD_MARGIN = 15;

const PopularDeal = () => {
  const flatListRef = useRef(null);
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
  });

  const [loading, setLoading] = useState(false);
  const [dataBanner, setDataBanner] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event) => {
    const slideIndex = Math.round(
      event.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_MARGIN)
    );
    setActiveIndex(slideIndex);
  };

  const getDataDeal = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("accessToken");
      const response = await api.get(`/announcement/active?type=deal`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDataBanner(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data popular:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = async (id) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const response = await api.get(`/announcement/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const url = response.data.data.url;
      if (url) {
        Linking.openURL(url);
      } else {
        console.warn("URL tidak tersedia.");
      }
    } catch (error) {
      console.error("Gagal membuka detail:", error.message);
    }
  };

  useEffect(() => {
    getDataDeal();
  }, []);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => handlePress(item.id)}
      activeOpacity={0.8}
      style={[
        styles.card,
        {
          marginLeft: index === 0 ? 20 : 0,
          marginRight: index === dataBanner.length - 1 ? 20 : CARD_MARGIN,
        },
      ]}
    >
      <Image
        source={{ uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${item.imageLink}` }}
        style={styles.image}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  if (!fontsLoaded || loading) {
    return (
      <View style={{ padding: 20 }}>
        <ActivityIndicator size="small" color="#004AAD" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Popular Deal 🔥</Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={dataBanner}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={CARD_WIDTH + CARD_MARGIN}
        decelerationRate="fast"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Lexend_700Bold",
    color: "#333",
  },
  card: {
    width: CARD_WIDTH,
    height: 180,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#f1f1f1",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default PopularDeal;
