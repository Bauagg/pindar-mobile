import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend";
import api from "../../utils/axios";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40;

const PopularPlus = () => {
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dataBanner, setDataBanner] = useState([]);
  const [fontsLoaded] = useFonts({ Lexend_400Regular, Lexend_700Bold });

  const handleScroll = (event) => {
    const slideIndex = Math.round(
      event.nativeEvent.contentOffset.x / (CARD_WIDTH + 16)
    );
    setActiveIndex(slideIndex);
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

  const getDataCC = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/announcement/active?type=popular`);
      setDataBanner(response.data.data || []);
    } catch (error) {
      console.error("Gagal mengambil data popular:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataCC();
  }, []);

  if (!fontsLoaded) return null;

  if (loading) {
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
        { marginLeft: index === 0 ? 20 : 8, marginRight: index === dataBanner.length - 1 ? 20 : 0 },
      ]}
    >
      <Image
        source={{ uri: `${process.env.EXPO_PUBLIC_IMAGE_BASE_URL}${item.imageLink}` }}
        style={styles.image}
        resizeMode="cover"
      />
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
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={CARD_WIDTH + 16}
        decelerationRate="fast"
      />
      {dataBanner.length > 1 && (
        <View style={styles.pagination}>
          {dataBanner.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                activeIndex === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 8,
  },
  loadingBox: {
    height: 170,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: CARD_WIDTH,
    height: 170,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
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
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 22,
    backgroundColor: "#CC1C22",
  },
  inactiveDot: {
    width: 6,
    backgroundColor: "#D9D9D9",
  },
});

export default PopularPlus;
