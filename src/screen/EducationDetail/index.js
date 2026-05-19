import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import RenderHtml from "react-native-render-html";
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend";
import api from "../../utils/axios";

const EducationDetail = (props) => {
  const { id } = props.route.params;
  const { width } = useWindowDimensions();
  const [fontsLoaded] = useFonts({ Lexend_400Regular, Lexend_700Bold });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/content/detail/${id}`);
      setData(response.data.data);
    } catch (error) {
      console.log("Error fetch detail:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  if (!fontsLoaded) return null;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#CC1C22" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#ccc" />
        <Text style={styles.emptyText}>Artikel tidak ditemukan</Text>
      </View>
    );
  }

  const tagsStyles = {
    body: {
      fontFamily: "sans-serif",
      fontSize: 15,
      color: "#333",
      lineHeight: 26,
    },
    p: { marginBottom: 12 },
    h1: { fontSize: 22, color: "#1A1A2E", marginBottom: 8, marginTop: 16, fontWeight: "bold" },
    h2: { fontSize: 19, color: "#1A1A2E", marginBottom: 8, marginTop: 16, fontWeight: "bold" },
    h3: { fontSize: 17, color: "#1A1A2E", marginBottom: 6, marginTop: 14, fontWeight: "bold" },
    a: { color: "#CC1C22" },
    li: { marginBottom: 4 },
    blockquote: {
      borderLeftWidth: 3,
      borderLeftColor: "#CC1C22",
      paddingLeft: 12,
      color: "#666",
      marginVertical: 12,
    },
    img: { borderRadius: 10, marginVertical: 8 },
    strong: { color: "#1A1A2E" },
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      {/* Hero Image */}
      <View style={styles.heroWrapper}>
        <Image
          source={{ uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${data.imageLink}` }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.5)"]}
          style={styles.heroGradient}
        />
        {data.category && (
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>{data.category}</Text>
          </View>
        )}
      </View>

      {/* Meta */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={13} color="#999" />
          <Text style={styles.metaText}>
            {data.createdDate
              ? new Date(data.createdDate).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : ""}
          </Text>
        </View>
        {data.viewCount != null && (
          <View style={styles.metaItem}>
            <Ionicons name="eye-outline" size={13} color="#999" />
            <Text style={styles.metaText}>{data.viewCount} views</Text>
          </View>
        )}
      </View>

      {/* Title */}
      <Text style={styles.title}>{data.title}</Text>

      {/* Divider */}
      <View style={styles.divider} />

      {/* HTML Content */}
      <View style={styles.content}>
        <RenderHtml
          contentWidth={width - 32}
          source={{ html: data.contentDetail || "<p>Tidak ada konten.</p>" }}
          tagsStyles={tagsStyles}
          enableExperimentalMarginCollapsing
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    fontFamily: "Lexend_400Regular",
  },
  heroWrapper: {
    width: "100%",
    height: 240,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  heroBadge: {
    position: "absolute",
    bottom: 14,
    left: 16,
    backgroundColor: "rgba(204,28,34,0.9)",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  heroBadgeText: {
    color: "white",
    fontSize: 11,
    fontFamily: "Lexend_700Bold",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: "#999",
    fontFamily: "Lexend_400Regular",
  },
  title: {
    fontSize: 18,
    fontFamily: "Lexend_700Bold",
    color: "#1A1A2E",
    lineHeight: 26,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  content: {
    paddingHorizontal: 16,
  },
});

export default EducationDetail;
