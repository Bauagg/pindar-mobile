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

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.55;
const CARD_MARGIN = 12;

const PopularDeal = () => {
  const flatListRef = useRef(null);
  const [fontsLoaded] = useFonts({ Lexend_400Regular, Lexend_700Bold });
  const [loading, setLoading] = useState(false);
  const [dataBanner, setDataBanner] = useState([]);

  const getDataDeal = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/announcement/active?type=deal`);
      setDataBanner(response.data.data || []);
    } catch (error) {
      console.error("Gagal mengambil data deal:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = async (id) => {
    try {
      const response = await api.get(`/announcement/${id}`);
      const url = response.data.data.url;
      if (url) Linking.openURL(url);
    } catch (error) {
      console.error("Gagal membuka detail:", error.message);
    }
  };

  useEffect(() => {
    getDataDeal();
  }, []);

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator color="#CC1C22" />
      </View>
    );
  }

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => handlePress(item.id)}
      activeOpacity={0.88}
      style={[
        styles.card,
        {
          marginLeft: index === 0 ? 20 : CARD_MARGIN,
          marginRight: index === dataBanner.length - 1 ? 20 : 0,
        },
      ]}
    >
      <Image
        source={{ uri: `${process.env.EXPO_PUBLIC_IMAGE_BASE_URL}${item.imageLink}` }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Deal</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={dataBanner}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_MARGIN}
        decelerationRate="fast"
        contentContainerStyle={{ paddingBottom: 4 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 8,
  },
  loadingBox: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: CARD_WIDTH,
    height: 200,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#f1f1f1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#CC1C22",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: "white",
    fontSize: 11,
    fontFamily: "Lexend_700Bold",
  },
});

export default PopularDeal;
