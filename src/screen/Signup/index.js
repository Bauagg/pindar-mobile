import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { Entypo, Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Signup(props) {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  const toggleSecureText = () => setSecureText(!secureText);
  const navigateSignin = () => props.navigation.navigate('Signin');
  const navigateHome = () => props.navigation.replace('AppScreen');

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
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
            onPress={navigateHome}
            style={styles.buttonContainer}>
            <LinearGradient
              colors={['#CC1C22', '#F86469']}
              start={{ x: 0.5, y: 1 }} // Mulai dari atas
              end={{ x: 0.5, y: 0 }} // Berakhir di bawah
              style={styles.button}>
              <Text style={styles.buttonText}>CONTINUE</Text>
            </LinearGradient>
          </TouchableOpacity>
          <View style={styles.signupContainer}>
            <Text>Already have an account? </Text>
            <TouchableOpacity onPress={navigateSignin}>
              <Text style={styles.signupText}> Signin</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

const InputField = ({ icon, placeholder, value, onChangeText }) => (
  <View style={styles.inputContainer}>
    <Ionicons name={icon} size={24} color="black" style={{ marginRight: 5 }} />
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
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
        name={secureText ? 'eye-with-line' : 'eye'}
        size={20}
        color="gray"
      />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerSection: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 35,
  },
  buttonContainer: {
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 20,
  },
  inputColumn: {
    width: '100%',
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
  footerSection: {
    flex: 2,
    paddingTop: 180,
    paddingHorizontal: 50,
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'red',
    paddingVertical: 10,
    width: '100%',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  signupText: {
    color: 'red',
  },
});
