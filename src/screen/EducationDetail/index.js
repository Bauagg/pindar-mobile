import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Share,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { WebView } from "react-native-webview";
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend";
import api from "../../utils/axios";

const { width } = Dimensions.get("window");

const EducationDetail = (props) => {
  const { id } = props.route.params;
  const [fontsLoaded] = useFonts({ Lexend_400Regular, Lexend_700Bold });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [webViewHeight, setWebViewHeight] = useState(300);

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

  const handleShare = async () => {
    try {
      await Share.share({
        message: data?.title || "Baca artikel edukasi di Pindar!",
      });
    } catch (_) {}
  };

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

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: -apple-system, sans-serif;
          font-size: 15px;
          color: #333;
          line-height: 1.75;
          padding: 0 4px;
          word-break: break-word;
        }
        img {
          max-width: 100%;
          height: auto;
          border-radius: 10px;
          margin: 8px 0;
        }
        p { margin-bottom: 12px; }
        h1, h2, h3 { color: #1A1A2E; margin-bottom: 8px; margin-top: 16px; }
        ul, ol { padding-left: 20px; margin-bottom: 12px; }
        li { margin-bottom: 4px; }
        a { color: #CC1C22; }
        blockquote {
          border-left: 3px solid #CC1C22;
          padding-left: 12px;
          color: #666;
          margin: 12px 0;
        }
        strong { color: #1A1A2E; }
      </style>
    </head>
    <body>
      ${data.contentDetail || "<p>Tidak ada konten.</p>"}
      <script>
        window.ReactNativeWebView.postMessage(document.body.scrollHeight);
      </script>
    </body>
    </html>
  `;

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
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
        {/* Category badge */}
        {data.category && (
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>{data.category}</Text>
          </View>
        )}
      </View>

      {/* Content Card */}
      <View style={styles.card}>
        {/* Meta row */}
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
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={16} color="#CC1C22" />
            <Text style={styles.shareBtnText}>Bagikan</Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text style={styles.title}>{data.title}</Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* HTML Content */}
        <WebView
          originWhitelist={["*"]}
          source={{ html: htmlContent }}
          style={{ width: width - 48, height: webViewHeight }}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          onMessage={(e) => {
            const h = parseInt(e.nativeEvent.data, 10);
            if (!isNaN(h) && h > 0) setWebViewHeight(h + 32);
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F6FA",
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
  card: {
    margin: 16,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 14,
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
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: "auto",
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  shareBtnText: {
    fontSize: 12,
    color: "#CC1C22",
    fontFamily: "Lexend_700Bold",
  },
  title: {
    fontSize: 18,
    fontFamily: "Lexend_700Bold",
    color: "#1A1A2E",
    lineHeight: 26,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginBottom: 16,
  },
});

export default EducationDetail;
