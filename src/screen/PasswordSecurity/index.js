import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

const PasswordSecurity = ({ navigation }) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Password & Security</Text>
        <TouchableOpacity>
          <Feather name="more-vertical" size={24} color="black" />
        </TouchableOpacity>
      </View> */}

      {/* Title */}
      <Text style={styles.title}>Change Password</Text>
      <Text style={styles.subtitle}>Please enter your password</Text>

      {/* Password Fields */}
      {['Old Password', 'New Password', 'Confirm Password'].map(
        (label, index) => (
          <View key={index} style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="red"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder={label}
              secureTextEntry={secureTextEntry}
            />
            <TouchableOpacity
              onPress={() => setSecureTextEntry(!secureTextEntry)}>
              <Feather
                name={secureTextEntry ? 'eye-off' : 'eye'}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>
        )
      )}

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PasswordSecurity;
