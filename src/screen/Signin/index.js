import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { useAlertModal } from '../../contexts/AlertModalContext';
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_900Black,
} from '@expo-google-fonts/lexend';
import api from '../../utils/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Signin(props) {
  const { showAlert } = useAlertModal();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = async () => {
    setIsEnabled((prev) => {
      const newState = !prev;
      AsyncStorage.setItem('rememberMe', JSON.stringify(newState));
      return newState;
    });
  };

  const navSignin = () => {
    props.navigation.navigate('Verification');
  };
  const navSignup = () => {
    props.navigation.navigate('Signup');
  };
  const navForgot = () => {
    props.navigation.navigate('ForgotPass');
  };
  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      console.log('token', token);
      if (token) {
        props.navigation.replace('AppScreen'); // Redirect ke halaman utama jika token ada
      }
    };

    checkLogin();
  }, []);
  const handleLogin = async () => {
    setLoading(true); // Aktifkan loading state jika ada

    try {
      const response = await api.post('/user/sign-in', {
        email: username, // Gunakan username sebagai email
        password,
      });

      if (response.status === 200 && response.data.code === 200) {
        const { accessToken, refreshToken } = response.data.data;
        console.log('INI RESPON LOGIN', response.data.data);

        if (!accessToken || !refreshToken) {
          throw new Error('Token tidak ditemukan dalam response.'); // Cegah token kosong
        }

        try {
          // Simpan token ke AsyncStorage
          await AsyncStorage.setItem('accessToken', accessToken);
          await AsyncStorage.setItem('refreshToken', refreshToken);
          await AsyncStorage.setItem('fullName', response.data.data.fullName);
          await AsyncStorage.setItem('imageLink', response.data.data.imageLink);

          // Jika "Remember Me" aktif, simpan email dan password
          if (isEnabled) {
            await AsyncStorage.setItem('rememberedEmail', username);
            await AsyncStorage.setItem('rememberedPassword', password);
          } else {
            await AsyncStorage.removeItem('rememberedEmail');
            await AsyncStorage.removeItem('rememberedPassword');
          }
        } catch (storageError) {
          console.error('Gagal menyimpan data ke AsyncStorage:', storageError);
          showAlert('Terjadi kesalahan saat menyimpan data.', 'error');
          return;
        }

        showAlert('Login berhasil! Selamat datang.', 'success');

        // Tunggu sebentar agar token benar-benar tersimpan sebelum navigasi
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Navigasi ke halaman berikutnya
        props.navigation.replace('Verification');
      } else {
        showAlert(response.data.message || 'Login gagal.', 'error');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      showAlert(
        error.response?.data?.message || 'Terjadi kesalahan saat login.',
        'error'
      );
    } finally {
      setLoading(false); // Matikan loading state setelah selesai
    }
  };

  useEffect(() => {
    const loadRememberedLogin = async () => {
      const savedEmail = await AsyncStorage.getItem('rememberedEmail');
      const savedPassword = await AsyncStorage.getItem('rememberedPassword');

      if (savedEmail && savedPassword) {
        setUsername(savedEmail);
        setPassword(savedPassword);
        setIsEnabled(true); // Aktifkan "Remember Me" secara otomatis
      }
    };

    loadRememberedLogin();
  }, []);

  useEffect(() => {
    const loadRememberMeStatus = async () => {
      const savedRememberMe = await AsyncStorage.getItem('rememberMe');
      if (savedRememberMe !== null) {
        setIsEnabled(JSON.parse(savedRememberMe));
      }
    };

    loadRememberMeStatus();
  }, []);

  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <View style={styles.container}>
        <View style={styles.redSection}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/loginlogo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>
        <View style={styles.whiteSection}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Sign in</Text>
          </View>
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={24}
              color="#807A7A"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
          </View>
          <View style={styles.inputContainer}>
            <Feather
              name="lock"
              size={24}
              color="#807A7A"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={secureText}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setSecureText(!secureText)}>
              <Entypo
                name={secureText ? 'eye-with-line' : 'eye'}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.forgotContainer}>
            <View style={styles.rememberContainer}>
              <Switch
                trackColor={{ false: '#767577', true: '#CC1C22' }}
                thumbColor={isEnabled ? '#fff' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
              <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 12 }}>
                Remember Me
              </Text>
            </View>
            <View>
              <TouchableOpacity onPress={navForgot}>
                <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 12 }}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleLogin}
            style={styles.buttonContainer}>
            <LinearGradient
              colors={['#CC1C22', '#F86469']}
              start={{ x: 0.5, y: 1 }} // Mulai dari atas
              end={{ x: 0.5, y: 0 }} // Berakhir di bawah
              style={styles.button}>
              <Text style={styles.buttonText}>SIGN IN</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.orContainer}>
            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 16 }}>
              OR
            </Text>
          </View>
          <View style={styles.signupContainer}>
            <Text style={{ fontFamily: 'Lexend_500Medium', fontSize: 15 }}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={navSignup}>
              <Text style={styles.signupText}> Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  redSection: {
    flex: 1,
    backgroundColor: 'white',
    width: Dimensions.get('window').width,
    marginTop: -100,
  },
  whiteSection: {
    flex: 2,
    padding: 35,
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Lexend_500Medium',
    fontWeight: 500,
    marginBottom: 20,
  },
  titleContainer: {
    width: '100%',
    // paddingLeft: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '100%',
  },
  input: {
    flex: 1,
    height: 40,
  },
  button: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Lexend_700Bold',
    // fontWeight: 'bold',
  },
  forgotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 180,
  },
  signupText: {
    color: 'red',
    fontFamily: 'Lexend_500Medium',
    fontSize: 15,
  },
  shareText: {
    fontFamily: 'Lexend_500Medium',
    fontSize: 15,
  },
});
