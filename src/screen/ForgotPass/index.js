import React, { useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  Switch,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import api from "../../utils/axios";
import { useAlertModal } from "../../contexts/AlertModalContext";
export default function ForgotPass(props) {
  const [username, setUsername] = useState("");
  const { showAlert } = useAlertModal();
  const [loading, setLoading] = useState(false);

  const navSend = () => {
    props.navigation.replace("Signin");
  };

  const handleForgotPass = async () => {
    try {
      setLoading(true);
      const response = await api.post("/user/forgot-password", {
        email: username,
      });
      showAlert(response.data.message, "success");
      props.navigation.navigate("Signin");
    } catch (error) {
      setLoading(false);
      if (error.response?.data?.message) {
        showAlert(
          "Lupa Password Gagal",
          error.response?.data?.message || "Terjadi kesalahan saat Lupa Pass.",
          "error"
        );
      } else {
        showAlert(
          "Terjadi kesalahan saat mengirim permintaan. Coba lagi nanti.",
          "error"
        );
      }
      console.log(error);
    }
  };

  return (
    <>
      <StatusBar translucent={true} backgroundColor={"transparent"} />
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Forgot Password</Text>
          <View style={{ paddingRight: 120 }}>
            <Text style={styles.subtitle}>
              Please enter your email address to request a password reset
            </Text>
          </View>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={24}
              color="black"
              style={{ marginRight: 5 }}
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
          </View>
          <TouchableOpacity
            onPress={handleForgotPass}
            style={styles.buttonContainer}
          >
            <LinearGradient
              colors={["#CC1C22", "#F86469"]}
              start={{ x: 0.5, y: 1 }} // Mulai dari atas
              end={{ x: 0.5, y: 0 }} // Berakhir di bawah
              style={styles.button}
            >
              <Text style={styles.buttonText}>SEND</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-SemiBold",
    fontWeight: 500,
    marginBottom: 20,
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    marginBottom: 20,
  },
  titleContainer: {
    width: "100%",
    paddingLeft: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: "100%",
  },
  input: {
    flex: 1,
    height: 40,
  },
  button: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  signupContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 200,
  },
  formContainer: {
    paddingHorizontal: 10,
  },
});
