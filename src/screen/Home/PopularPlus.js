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
} from "react-native";
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend";
import api from "../../utils/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const PopularPlus = () => {
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dataBanner, setDataBanner] = useState([]);
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
  });

  const handleScroll = (event) => {
    const slideIndex = Math.round(
      event.nativeEvent.contentOffset.x / (width * 0.9)
    );
    setActiveIndex(slideIndex);
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

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item.id)} activeOpacity={0.8}>
      <View style={styles.card}>
        <Image
          source={{ uri: `https://be.pindar.id/api${item.imageLink}` }}
          style={styles.image}
          resizeMode="contain"
        />
        {/* <View style={styles.overlay}>
          <Text style={styles.smallText}>{item.title}</Text>
          <Text style={styles.bigText}>{item.subtitle}</Text>
        </View> */}
      </View>
    </TouchableOpacity>
  );

  const getDataCC = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("accessToken");
      const response = await api.get(`/announcement/active?type=popular`, {
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

  useEffect(() => {
    getDataCC();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Popular Plus</Text>
      <FlatList
        ref={flatListRef}
        data={dataBanner}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={width * 0.9 + 20} // +20 for margin
        decelerationRate="fast"
      />
      <View style={styles.pagination}>
        {dataBanner.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, activeIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: "Lexend_700Bold",
    color: "#333",
    marginLeft: 20,
    marginBottom: 10,
  },
  card: {
    borderRadius: 15,
    width: width * 0.9,
    height: 150,
    overflow: "hidden", // penting untuk border radius
    marginHorizontal: 10,
    position: "relative",
    backgroundColor: "#eee",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    left: 15,
    bottom: 15,
    right: 15,
  },
  smallText: {
    fontSize: 14,
    color: "white",
    fontFamily: "Lexend_400Regular",
  },
  bigText: {
    fontSize: 18,
    fontFamily: "Lexend_700Bold",
    color: "white",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "orange",
  },
});

export default PopularPlus;
