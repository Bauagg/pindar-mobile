import React, { useRef } from "react";
import { StatusBar, ActivityIndicator, View } from "react-native";
import MainStackNavigator from "./src/navigation";
import SplashScreen from "./src/screen/SplashScreen";
import { setNavigationRef } from "./src/utils/axios";
import {
  useFonts,
  Lexend_400Regular,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_700Bold,
  Lexend_900Black,
} from "@expo-google-fonts/lexend";

export default function App() {
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_500Medium,
    Lexend_600SemiBold,
    Lexend_700Bold,
    Lexend_900Black,
  });

  const navRef = useRef(null);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#CC1C22" />
      </View>
    );
  }

  return (
    <>
      <StatusBar
        hidden={false}
        backgroundColor="white"
        barStyle="dark-content"
      />
      <MainStackNavigator navigationRef={navRef} />
    </>
  );
}
