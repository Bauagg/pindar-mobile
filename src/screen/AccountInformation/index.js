import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons, MaterialIcons, Octicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../utils/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Data input field

const AccountInformation = () => {
  const [dataUser, setDataUser] = useState({});
  const formFields = dataUser
    ? [
        { icon: 'mail', value: dataUser.email, editable: false },
        { icon: 'person', value: dataUser.fullName, editable: true },
        { icon: 'person-outline', value: dataUser.userName, editable: true },
        { icon: 'call', value: dataUser.phoneNumber, editable: true },
        { icon: 'location', value: dataUser.address, editable: true },
      ]
    : [];

  console.log(formFields);

  const [loading, setLoading] = useState(false);

  // Fungsi untuk copy ID Member
  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied', 'Id Member copied to clipboard!');
  };

  useEffect(() => {
    const getDataUser = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        const response = await api.get(`/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data); // bisa disimpan ke state juga kalau mau
        setDataUser(response.data.data);
      } catch (error) {
        console.error('Gagal mengambil data lenders:', error);
      } finally {
        setLoading(false);
      }
    };

    getDataUser();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle="dark-content"
      />

      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <View style={styles.profileImageWrapper}>
          <Image
            source={{ uri: `https://be.pindar.id${dataUser.imagelink}` }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editIcon}>
            <MaterialIcons name="camera-alt" size={18} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.profileName}>Putri Amalia</Text>
        <Text style={styles.profileEmail}>putriamalia@gmail.com</Text>
      </View>

      {/* FlatList untuk Input */}
      <FlatList
        data={formFields}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.inputContainer}>
            <View style={styles.iconWrapper}>
              <Ionicons name={item.icon} size={20} color="#F86469" />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={item.value}
                editable={item.editable}
              />
            </View>
          </View>
        )}
        ListFooterComponent={() => (
          <>
            {/* Member ID Section - FIXED (Moved Outside FlatList) */}
            <View style={styles.inputContainer2}>
              <View style={styles.iconWrapper2}>
                <Ionicons name="document-text" size={20} color="#F86469" />
              </View>
              <View style={styles.inputWrapper2}>
                <TextInput
                  style={styles.input}
                  value="id364284946"
                  editable={false}
                />
              </View>
              <TouchableOpacity
                style={styles.labelBadge}
                onPress={() => copyToClipboard('id364284946')}>
                <Ionicons name="attach" size={20} color="#D43F3A" />
                <Text style={styles.labelText}>Id Member</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity>
              <LinearGradient
                colors={['#CC1C22', '#F86469']}
                style={styles.applyGradient}>
                <Text style={styles.applyText}>Save</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#F8D7DA',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#D43F3A',
    borderRadius: 15,
    padding: 5,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  profileEmail: {
    fontSize: 14,
    color: 'gray',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '80%',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fff',
    shadowColor: '#F8BBD0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  inputContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
    width: '80%',
  },
  iconWrapper2: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  inputWrapper2: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fff',
    shadowColor: '#F8BBD0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginRight: 50,
  },
  input: {
    flex: 1,
    fontSize: 12,
    color: '#333',
  },
  labelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    right: 10,
    elevation: 4,
    width: 100,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 12,
    color: '#D43F3A',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  saveButton: {
    backgroundColor: '#D43F3A',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
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

export default AccountInformation;
