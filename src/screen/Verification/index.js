import React, { useRef, useState, useEffect } from 'react';
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
import api from '../../utils/axios';
import { useAlertModal } from '../../contexts/AlertModalContext';
import forge from 'node-forge';

export default function Verification(props) {
  const { showAlert } = useAlertModal();
  const [otp, setOtp] = useState(['', '', '', '']);
   const [loading, setLoading] = useState(false);
   const { fullName, email, phoneNumber, password } = props.route.params;


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
     const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
     const encrypted = publicKey.encrypt(password, 'RSA-OAEP', {
       md: forge.md.sha1.create(), // OAEP pakai SHA-1, sesuai default di Node.js
     });
     return forge.util.encode64(encrypted); // base64
   };
  const [secondsLeft, setSecondsLeft] = useState(30);
const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  const maskEmail = (email) => {
    const [name, domain] = email.split('@');
    const maskedName =
      name.length <= 2
        ? name[0] + '*'.repeat(name.length - 1)
        : name[0] + '*'.repeat(name.length - 2) + name.slice(-1);
  
    return `${maskedName}@${domain}`;
  };
  
  const handleResendCode = async () => {
    try {
      console.log("JALAANNN")
      setLoading(true);
      console.log("Password sebelum enkripsi:", password); // cek ini
      const encryptedPassword = encryptPassword(password);
      console.log("Encrypted password:", encryptedPassword);
      const response = await api.post('/user/sign-up', {
        fullName,
        email,
        phoneNumber,
        password: encryptedPassword,
      });
      console.log("respon kirim ulang otp",response);
      showAlert(response?.data?.message || 'Kode OTP dikirim ulang.', 'success');
      setSecondsLeft(30); // 🔁 Reset timer setelah resend
    } catch (error) {
      console.log(error.response?.data);
      showAlert(
        error.response?.data?.message || 'Gagal mengirim ulang kode OTP.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };
  

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
  useEffect(() => {
    let interval = null;
  
    if (secondsLeft > 0) {
      setIsResendDisabled(true);
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
      clearInterval(interval);
    }
  
    return () => clearInterval(interval);
  }, [secondsLeft]);


  const handleVerifyOtp = async () => {
  const fullOtp = otp.join('');
  console.log("JALAN");

  if (fullOtp.length < 4) {
    showAlert('Kode OTP belum lengkap.', 'error');
    return;
  }

  try {
    setLoading(true);

    const response = await api.post('/user/confirm-otp', {
      email: email, // ← nanti ini ambil dari props kalau bisa
      otpCode: fullOtp,
    });

    console.log('RESPONSE DATA:', response.data);

    if (response?.data?.code === 200) {
      showAlert('Verifikasi berhasil!', 'success');
      props.navigation.navigate('Signin');
    } else {
      showAlert(response?.data?.message || 'Kode OTP salah. Coba lagi.', 'error');
    }
  } catch (error) {
    console.log(error);
    showAlert(
      error.response?.data?.message || 'Terjadi kesalahan saat verifikasi OTP.',
      'error'
    );
  } finally {
    setLoading(false);
  }
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
            <Text>{maskEmail(email)}</Text>
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
          <TouchableOpacity onPress={handleVerifyOtp} style={styles.buttonContainer}>
            <LinearGradient
              colors={['#CC1C22', '#F86469']}
              start={{ x: 0.5, y: 1 }} // Mulai dari atas
              end={{ x: 0.5, y: 0 }} // Berakhir di bawah
              style={styles.button}>
              <Text style={styles.buttonText}>SIGN IN</Text>
            </LinearGradient>
          </TouchableOpacity>
          <View style={styles.orContainer}>
            {isResendDisabled ? (
              <>
                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 15 }}>
                  Kirim ulang dalam{' '}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 15,
                    color: '#CC1C22',
                  }}>
                  0:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}
                </Text>
              </>
            ) : (
              <TouchableOpacity onPress={handleResendCode}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 15,
                    color: '#CC1C22',
                  }}>
                  Kirim Ulang Kode
                </Text>
              </TouchableOpacity>
            )}
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
