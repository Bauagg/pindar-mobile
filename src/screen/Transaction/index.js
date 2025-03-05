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

export default function Transaction(props) {
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Transaction</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
