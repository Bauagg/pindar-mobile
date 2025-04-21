import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../utils/axios';
import { useAlertModal } from '../../contexts/AlertModalContext';
import forge from 'node-forge';

const PasswordSecurity = () => {
  const { showAlert } = useAlertModal();
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const publicKeyPem = `-----BEGIN PUBLIC KEY-----
  MIIBITANBgkqhkiG9w0BAQEFAAOCAQ4AMIIBCQKCAQBwrdNYWYfiIIKi4l/H3LUQ
  c+JJ7MUVyXNu+apYt5v+CzAwNw7rdJoCUqhE/eeHOOHfx7flu1UTa0fH8xNG2MVY
  pCkz8RqaTgGURj61VoTdBmR0BeBZHYP2dXa7lNV2CC9VlBMuR6pbZ3o6d9Pcieip
  jUZUPAX6xbZxhFbOivKlt3YNBg+h28TpzOwHbOoUmooS6QYqEt11/+HQbjgRg9r3
  6vhoYfVoax70u/YV1fjcQsp4UHJ4GXMoX+XXF21CxmbPtmxBs0UUHvrqRyYzPRit
  6IOPSL2y7UScc4M3Ob0uNLEDS+BwS5MO0r1fazLQZ6w/+H8GEdK1JJ/TO1OCX08Z
  AgMBAAE=
  -----END PUBLIC KEY-----`;

  const [secureTextEntry, setSecureTextEntry] = useState({
    old: true,
    new: true,
    confirm: true,
  });

   const encryptPassword = (password) => {
      const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
      const encrypted = publicKey.encrypt(password, 'RSA-OAEP', {
        md: forge.md.sha1.create(), // OAEP pakai SHA-1, sesuai default di Node.js
      });
      return forge.util.encode64(encrypted); // base64
    };

  const toggleSecureEntry = (field) => {
    setSecureTextEntry((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChangePass = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      showAlert('Konfirmasi password tidak sesuai.', 'error');
      return;
    }
  
    try {
      setLoading(true);
  
      // Encrypt the passwords before sending them
      const encryptedOldPassword = encryptPassword(passwords.oldPassword);
      const encryptedNewPassword = encryptPassword(passwords.newPassword);
  
      const response = await api.put('/user/change-password', {
        oldPassword: encryptedOldPassword,
        newPassword: encryptedNewPassword,
      });
  
      showAlert(response.data.message, 'success');
    } catch (error) {
      if (error.response?.data?.message) {
        showAlert(error.response.data.message, 'error');
      } else {
        showAlert('Terjadi kesalahan saat mengirim permintaan. Coba lagi nanti.', 'error');
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" />

          {/* Title Section */}
          <Text style={styles.title}>Change Password</Text>
          <Text style={styles.subtitle}>Please enter your password</Text>

          {/* Password Fields */}
          {[
            { label: 'Old Password', key: 'oldPassword', stateKey: 'old' },
            { label: 'New Password', key: 'newPassword', stateKey: 'new' },
            {
              label: 'Confirm Password',
              key: 'confirmPassword',
              stateKey: 'confirm',
            },
          ].map(({ label, key, stateKey }) => (
            <View key={key} style={styles.inputWrapper}>
              <Text style={styles.label}>{label}</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="red" />
                <TextInput
                  style={styles.input}
                  placeholder={label}
                  placeholderTextColor="#999"
                  secureTextEntry={secureTextEntry[stateKey]}
                  value={passwords[key]}
                  onChangeText={(text) =>
                    setPasswords((prev) => ({ ...prev, [key]: text }))
                  }
                />
                <TouchableOpacity onPress={() => toggleSecureEntry(stateKey)}>
                  <Feather
                    name={secureTextEntry[stateKey] ? 'eye-off' : 'eye'}
                    size={20}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={{ marginTop: 30 }}
            onPress={handleChangePass}
            disabled={loading}
          >
            <LinearGradient
              colors={['#CC1C22', '#F86469']}
              style={styles.applyGradient}
            >
              <Text style={styles.applyText}>
                {loading ? 'Saving...' : 'Save'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputWrapper: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginHorizontal: 10,
    color: '#000',
  },
  applyGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    fontFamily: 'Lexend-Regular',
  },
});

export default PasswordSecurity;
