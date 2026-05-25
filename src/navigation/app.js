import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Import Screens
import Home from "../screen/Home";
import Transaction from "../screen/Transaction";
import Profile from "../screen/Profile";
import Education from "../screen/Education";
import PindarScreen from "../screen/PindarScreen";
import HeaderName from "../components/Header/defaultwithname";
import KartuKreditScreen from "../screen/KartuKreditScreen";
import CompareScreen from "../screen/CompareScreen";
import KartuKreditDetail from "../screen/KartuKreditDetail";
import AccountInformation from "../screen/AccountInformation";
import PasswordSecurity from "../screen/PasswordSecurity";
import TermsConditions from "../screen/TermsAndCondition";
import PrivacyPolicy from "../screen/PrivacyPolicy";
import AboutUs from "../screen/AboutUs";
import EducationDetail from "../screen/EducationDetail";
import EducationComments from "../screen/EducationComments";
import Notifikasi from "../screen/Notifikasi";
import InformasiDetail from "../screen/IndormasiDetail";
import RedirectScreen from "../screen/RedirectScreen";
import CompareScreenKartu from "../screen/CompareScreenKartu";
import RedirectScreenKartu from "../screen/RedirectScreenKartu";
import EducationAllTreding from "../screen/EducationAllTreding";
import PinjamanBank from "../screen/PinjamanBank";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + insets.bottom;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#d62828",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: styles.label,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 20,
          right: 20,
          backgroundColor: "#ffffff",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: tabBarHeight,
          paddingBottom: insets.bottom,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 20,
        },
        tabBarShowLabel: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home-filled" size={24} color={color} />
          ),
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="Education"
        component={Education}
        options={{
          header: (props) => <HeaderName {...props} name="Edukasi" />,
          tabBarIcon: ({ color }) => (
            <Ionicons name="newspaper-outline" size={24} color={color} />
          ),
          tabBarLabel: "Edukasi",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          header: (props) => <HeaderName {...props} name="Profile" />,
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  );
}

// Main Stack Navigator
export default function AppStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Pindar"
        component={PindarScreen}
        options={{
          header: (props) => <HeaderName {...props} name="Pinjaman" />,
        }}
      />
      <Stack.Screen
        name="Kartu Kredit"
        component={KartuKreditScreen}
        options={{
          header: (props) => <HeaderName {...props} name="Kartu Kredit" />,
        }}
      />
      <Stack.Screen
        name="Compare"
        component={CompareScreen}
        options={{
          header: (props) => <HeaderName {...props} name="Pindar" />,
        }}
      />
      <Stack.Screen
        name="AccountInformation"
        component={AccountInformation}
        options={{
          header: (props) => (
            <HeaderName {...props} name="Account Information" />
          ),
        }}
      />
      <Stack.Screen
        name="PasswordSecurity"
        component={PasswordSecurity}
        options={{
          header: (props) => <HeaderName {...props} name="Password Security" />,
        }}
      />
      <Stack.Screen
        name="TermsCondition"
        component={TermsConditions}
        options={{
          header: (props) => <HeaderName {...props} name="Term & Condition" />,
        }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{
          header: (props) => <HeaderName {...props} name="Privacy Policy" />,
        }}
      />
      <Stack.Screen
        name="AboutUs"
        component={AboutUs}
        options={{
          header: (props) => <HeaderName {...props} name="About Us" />,
        }}
      />
      <Stack.Screen
        name="Kartu Kredit Detail"
        component={KartuKreditDetail}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EducationDetail"
        component={EducationDetail}
        options={{
          header: (props) => <HeaderName {...props} name="Edukasi" />,
        }}
      />
      <Stack.Screen
        name="EducationComments"
        component={EducationComments}
        options={{
          header: (props) => <HeaderName {...props} name="Edukasi" />,
        }}
      />
      <Stack.Screen
        name="Notifikasi"
        component={Notifikasi}
        options={{
          header: (props) => <HeaderName {...props} name="Notifikasi" />,
        }}
      />
      <Stack.Screen
        name="Informasi Detail"
        component={InformasiDetail}
        options={{
          header: (props) => <HeaderName {...props} name="Detail Informasi" />,
        }}
      />
      <Stack.Screen
        name="RedirecScreen"
        component={RedirectScreen}
        options={{
          header: (props) => <HeaderName {...props} name="Pinjaman" />,
        }}
      />
      <Stack.Screen
        name="Compare Kartu"
        component={CompareScreenKartu}
        options={{
          header: (props) => <HeaderName {...props} name="Kartu Kredit" />,
        }}
      />
      <Stack.Screen
        name="Redirect Kartu"
        component={RedirectScreenKartu}
        options={{
          header: (props) => <HeaderName {...props} name="Kartu Kredit" />,
        }}
      />
      <Stack.Screen
        name="Education All Treding"
        component={EducationAllTreding}
        options={{
          header: (props) => <HeaderName {...props} name="Edukasi" />,
        }}
      />
      <Stack.Screen
        name="PinjamanBank"
        component={PinjamanBank}
        options={{
          header: (props) => <HeaderName {...props} name="Pinjaman Bank" />,
        }}
      />
    </Stack.Navigator>
  );
}

// Styles
const styles = StyleSheet.create({
  shadowStyle: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -1000 }, // Bayangan naik ke atas
    shadowOpacity: 0.5, // Sesuaikan transparansi
    shadowRadius: 100, // Lebarkan efek bayangan
    elevation: 20, // Untuk Android
    backgroundColor: "white", // Pastikan warna latar belakang sesuai
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  labelContainer: {
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    color: "gray",
    fontWeight: "bold",
  },
  activeLabel: {
    color: "#d62828",
  },
  activeDivider: {
    width: 40,
    height: 4,
    backgroundColor: "#d62828",
    borderRadius: 2,
    marginTop: 20, // Position below the text
  },
});
