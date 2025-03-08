import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const PasswordSecurity = () => {
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [secureTextEntry, setSecureTextEntry] = useState({
    old: true,
    new: true,
    confirm: true,
  });

  const toggleSecureEntry = (field) => {
    setSecureTextEntry((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
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
      <View style={{ marginTop: Dimensions.get('window').height - 600 }}>
        <TouchableOpacity>
          <LinearGradient
            colors={['#CC1C22', '#F86469']}
            style={styles.applyGradient}>
            <Text style={styles.applyText}>Save</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 50,
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
    // backgroundColor: 'red',
    paddingVertical: 8,
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
