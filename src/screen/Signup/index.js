import React, { useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Entypo, Ionicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import api from "../../utils/axios";
import { useAlertModal } from "../../contexts/AlertModalContext";
import forge from "node-forge";

export default function Signup(props) {
  const { showAlert } = useAlertModal();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const publicKeyPem = `-----BEGIN PUBLIC KEY-----
MIIBITANBgkqhkiG9w0BAQEFAAOCAQ4AMIIBCQKCAQBwrdNYWYfiIIKi4l/H3LUQ
c+JJ7MUVyXNu+apYt5v+CzAwNw7rdJoCUqhE/eeHOOHfx7flu1UTa0fH8xNG2MVY
pCkz8RqaTgGURj61VoTdBmR0BeBZHYP2dXa7lNV2CC9VlBMuR6pbZ3o6d9Pcieip
jUZUPAX6xbZxhFbOivKlt3YNBg+h28TpzOwHbOoUmooS6QYqEt11/+HQbjgRg9r3
6vhoYfVoax70u/YV1fjcQsp4UHJ4GXMoX+XXF21CxmbPtmxBs0UUHvrqRyYzPRit
6IOPSL2y7UScc4M3Ob0uNLEDS+BwS5MO0r1fazLQZ6w/+H8GEdK1JJ/TO1OCX08Z
AgMBAAE=
-----END PUBLIC KEY-----`;
  const encryptPassword = (password) => {
    console.log("Password masuk ke encryptPassword:", password);
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const encrypted = publicKey.encrypt(password, "RSA-OAEP", {
      md: forge.md.sha1.create(),
    });
    return forge.util.encode64(encrypted);
  };

  const toggleSecureText = () => setSecureText(!secureText);
  const navigateSignin = () => props.navigation.navigate("Signin");

  const navigateVerif = () =>
    props.navigation.navigate("Verification", {
      fullName: fullname,
      email: email,
      phoneNumber: phone,
      password: password,
    });

  const handleSignup = async () => {
    if (!fullname || !email || !phone || !password || !confirmPassword) {
      showAlert("Gagal", "Semua field harus diisi.", "error");
      return;
    }

    if (password !== confirmPassword) {
      showAlert(
        "Gagal",
        "Password dan Konfirmasi Password tidak sama.",
        "error"
      );
      return;
    }

    try {
      setLoading(true);

      const encryptedPassword = encryptPassword(password);
      console.log("Encrypted Password:", encryptedPassword);

      const response = await api.post("/user/sign-up", {
        fullName: fullname,
        email: email,
        phoneNumber: phone,
        password: encryptedPassword,
      });

      // ✅ Asumsikan sukses jika tidak masuk ke catch
      const successMessage = response?.data?.message || "OTP berhasil dikirim";
      showAlert("Berhasil", successMessage, "success");

      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigateVerif();
    } catch (error) {
      console.log(error.response?.data);

      showAlert(
        "Gagal",
        error.response?.data?.message || "Terjadi kesalahan saat signup.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>
              <View style={styles.headerSection}>
                <Text style={styles.title}>Sign up</Text>
                <View style={styles.inputColumn}>
                  <InputField
                    icon="person-outline"
                    placeholder="Fullname"
                    value={fullname}
                    onChangeText={setFullname}
                  />
                  <InputField
                    icon="mail-outline"
                    placeholder="Email Address"
                    value={email}
                    onChangeText={setEmail}
                  />
                  <InputField
                    icon="call-outline"
                    placeholder="Phone Number"
                    value={phone}
                    onChangeText={setPhone}
                  />
                  <PasswordField
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureText={secureText}
                    toggleSecureText={toggleSecureText}
                  />
                  <PasswordField
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureText={secureText}
                    toggleSecureText={toggleSecureText}
                  />
                </View>
              </View>

              <View style={styles.footerSection}>
                <TouchableOpacity
                  onPress={handleSignup}
                  style={styles.buttonContainer}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={["#CC1C22", "#F86469"]}
                    start={{ x: 0.5, y: 1 }}
                    end={{ x: 0.5, y: 0 }}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>
                      {loading ? "LOADING..." : "CONTINUE"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                <View style={styles.signupContainer}>
                  <Text>Already have an account? </Text>
                  <TouchableOpacity onPress={navigateSignin}>
                    <Text style={styles.signupText}>Signin</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}

const InputField = ({ icon, placeholder, value, onChangeText }) => (
  <View style={styles.inputContainer}>
    <Ionicons name={icon} size={24} color="black" style={{ marginRight: 5 }} />
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#888"
      value={value}
      onChangeText={onChangeText}
      color="#000"
    />
  </View>
);

const PasswordField = ({
  placeholder,
  value,
  onChangeText,
  secureText,
  toggleSecureText,
}) => (
  <View style={styles.inputContainer}>
    <Feather name="lock" size={24} color="black" style={{ marginRight: 5 }} />
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      secureTextEntry={secureText}
      value={value}
      onChangeText={onChangeText}
    />
    <TouchableOpacity onPress={toggleSecureText}>
      <Entypo
        name={secureText ? "eye-with-line" : "eye"}
        size={20}
        color="gray"
      />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white",
    justifyContent: "space-between",
  },
  headerSection: {
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 35,
  },
  buttonContainer: {
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    marginBottom: 20,
  },
  inputColumn: {
    width: "100%",
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
  footerSection: {
    paddingHorizontal: 50,
    paddingBottom: 40,
    alignItems: "center",
  },
  button: {
    backgroundColor: "red",
    paddingVertical: 10,
    width: "100%",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  signupText: {
    color: "red",
  },
});
