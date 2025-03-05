import React, { useRef, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Verification(props) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleChange = (text, index) => {
    if (text.length > 1) {
      text = text.slice(-1);
    }
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs[index - 1].current.focus();
    }
  };

  const navHome = () => {
    props.navigation.replace('AppScreen');
  };

  return (
    <>
      <StatusBar translucent={true} backgroundColor={'transparent'} />
      <View style={styles.container}>
        <View style={styles.redSection}>
          <View style={styles.Sent}>
            <Text style={{ fontFamily: 'Manrope', color: '#8F959E' }}>
              We've Sent a Verification Code to
            </Text>
            <Text>p*******a@gmail.com</Text>
          </View>
        </View>
        <View style={styles.whiteSection}>
          <View style={styles.otpContainer}>
            {otp.map((value, index) => (
              <TextInput
                key={index}
                ref={inputRefs[index]}
                style={styles.otpBox}
                keyboardType="numeric"
                maxLength={1}
                value={value}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                autoFocus={index === 0}
              />
            ))}
          </View>
          <TouchableOpacity onPress={navHome} style={styles.buttonContainer}>
            <LinearGradient
              colors={['#CC1C22', '#F86469']}
              start={{ x: 0.5, y: 1 }} // Mulai dari atas
              end={{ x: 0.5, y: 0 }} // Berakhir di bawah
              style={styles.button}>
              <Text style={styles.buttonText}>SIGN IN</Text>
            </LinearGradient>
          </TouchableOpacity>
          <View style={styles.orContainer}>
            <View style={{ marginRight: 10 }}>
              <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 15 }}>
                Re-send code in
              </Text>
            </View>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                fontSize: 15,
                color: '#CC1C22',
              }}>
              0:20
            </Text>
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
  },
  whiteSection: {
    flex: 2,
    padding: 35,
    alignItems: 'center',
  },
  Sent: {
    alignItems: 'center',
    marginTop: 100,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  otpBox: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: 'gray',
    textAlign: 'center',
    fontSize: 24,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  button: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    width: '55%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
});
