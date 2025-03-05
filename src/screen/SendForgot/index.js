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

export default function SendForgot(props) {
  const { showAlert } = useAlertModal();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const navHome = () => {
    props.navigation.replace('AppScreen');
  };
  const handleLogin = () => {
    // Simulasi autentikasi (gantilah dengan API login sesungguhnya)
    if (username === 'admin' && password === '1234') {
      showAlert(
        'Password Reset!',
        'your password has been reset, click below to continue your access',
        'success'
      );
      setTimeout(() => {
        props.navigation.replace('AppScreen');
      }, 2000); // Delay untuk transisi
    } else {
      showAlert(
        'Password Reset!',
        'your password has been reset, click below to continue your access',
        'success'
      );
    }
  };
  return (
    <>
      <StatusBar translucent={true} backgroundColor={'transparent'} />
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Enter the new password that has been sent to your email
          </Text>
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <View style={styles.inputContainer}>
            <Feather
              name="lock"
              size={24}
              color="gray"
              style={{ marginRight: 5 }}
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
          <TouchableOpacity
            onPress={handleLogin}
            style={styles.buttonContainer}>
            <LinearGradient
              colors={['#CC1C22', '#F86469']}
              start={{ x: 0.5, y: 1 }} // Mulai dari atas
              end={{ x: 0.5, y: 0 }} // Berakhir di bawah
              style={styles.button}>
              <Text style={styles.buttonText}>CONTINUE</Text>
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
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Manrope-SemiBold',
    fontWeight: 500,
    marginBottom: 20,
    textAlign: 'center',
    color: '#8F959E',
  },
  titleContainer: {
    // width: '100%',
    // paddingLeft: 10,
    alignSelf: 'center',
    paddingHorizontal: 50,
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
    marginTop: 200,
  },
});
