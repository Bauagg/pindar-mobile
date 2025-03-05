import React, { useState } from 'react';
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

export default function Signin(props) {
  const { showAlert } = useAlertModal();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const navSignin = () => {
    props.navigation.navigate('Verification');
  };
  const navSignup = () => {
    props.navigation.navigate('Signup');
  };
  const navForgot = () => {
    props.navigation.navigate('ForgotPass');
  };
  const handleLogin = () => {
    // Simulasi autentikasi (gantilah dengan API login sesungguhnya)
    if (username === 'admin' && password === '1234') {
      showAlert('Login berhasil! Selamat datang.', 'success');
      setTimeout(() => {
        props.navigation.replace('Verification');
      }, 2000); // Delay untuk transisi
    } else {
      showAlert('Username atau password salah.', 'error');
    }
  };
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
              <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}>
                Remember Me
              </Text>
            </View>
            <View>
              <TouchableOpacity onPress={navForgot}>
                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}>
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
            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 15 }}>
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
    fontFamily: 'lexend',
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
    fontWeight: 'bold',
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
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
  },
});
