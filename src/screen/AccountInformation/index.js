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
  Modal,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons, MaterialIcons, Octicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../utils/axios';
import { useAlertModal } from '../../contexts/AlertModalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';


// Data input field

const AccountInformation = () => {
  const { showAlert } = useAlertModal();
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [dataUser, setDataUser] = useState({});
  console.log("INI DATA USER", dataUser);
  const [formFields, setFormFields] = useState([]);

  const api = axios.create({
    baseURL: 'https://be.pindar.id/api',
  });
  
  // Tambahkan interceptor di awal
  api.interceptors.request.use(async (config) => {
    const { method, url, headers, data } = config;
    let curl = `curl -X ${method?.toUpperCase()} "${config.baseURL}${url}"`;
  
    for (const key in headers) {
      if (headers[key]) {
        curl += ` -H "${key}: ${headers[key]}"`;
      }
    }
  
    if (data) {
      const body = typeof data === 'object' ? JSON.stringify(data) : data;
      curl += ` -d '${body}'`;
    }
  
    console.log('\n[DEBUG cURL]:\n', curl, '\n');
    return config;
  });

  useEffect(() => {
    if (dataUser) {
      setFormFields([
        { key: 'email', icon: 'mail', value: dataUser.email, editable: false },
        { key: 'fullName', icon: 'person', value: dataUser.fullName, editable: true },
        { key: 'userName', icon: 'person-outline', value: dataUser.userName, editable: true },
        { key: 'phoneNumber', icon: 'call', value: dataUser.phoneNumber, editable: true },
        { key: 'address', icon: 'location', value: dataUser.address, editable: true },
      ]);
    }
  }, [dataUser]);
  
  const handleInputChange = (text, index) => {
    const newFields = [...formFields];
    newFields[index].value = text;
    setFormFields(newFields);
  };
  
  

  const [loading, setLoading] = useState(false);

  // Fungsi untuk copy ID Member
  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied', 'Id Member copied to clipboard!');
  };

  const pickFromGallery = async () => {
    setShowPickerModal(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Izinkan akses galeri terlebih dahulu.');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
  
    if (!result.canceled) {
      const image = result.assets[0];
      console.log("Dari galeri:", image.uri);
      await uploadProfile(image); // langsung upload
    }
  };
  
  const pickFromCamera = async () => {
    setShowPickerModal(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Izinkan akses kamera terlebih dahulu.');
      return;
    }
  
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
  
    if (!result.canceled) {
      const image = result.assets[0];
      console.log("Dari kamera:", image.uri);
      await uploadProfile(image); // langsung upload
    }
  };
  
  const getMimeType = (uri) => {
    if (uri.endsWith('.png')) return 'image/png';
    if (uri.endsWith('.jpg') || uri.endsWith('.jpeg')) return 'image/jpeg';
    return 'image/jpeg'; // default
  };

  const getDataUser = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      console.log(token)
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
  useEffect(() => {

    getDataUser();
  }, []);

  const updateProfile = async (fileId = null) => {
    try {
      console.log("INI FILE ID", fileId);
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
  
      const data = {};
      formFields.forEach(field => {
        data[field.key] = field.value;
      });
  
      if (fileId) {
        data.imageId = fileId; // <-- mapping fileId ke imageId
      }
  
      const response = await api.put('/user/update', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      showAlert(response.data.message, 'success');
      getDataUser();
    } catch (error) {
      console.log("GAGAL UPDATE", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };
  
  
  

  const uploadProfile = async (image) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.log('Token tidak ditemukan');
        return Alert.alert('Gagal', 'Token tidak ditemukan.');
      }
  
      // Deteksi mime type dari URI
      const getMimeType = (uri) => {
        if (uri.endsWith('.png')) return 'image/png';
        if (uri.endsWith('.jpg') || uri.endsWith('.jpeg')) return 'image/jpeg';
        return 'image/jpeg'; // default
      };
  
      const formData = new FormData();
      formData.append('file', {
        uri: image.uri,
        type: image.mimeType || getMimeType(image.uri),
        name: image.fileName || image.name || 'profile.jpg',
      });
      formData.append('moduleName', 'user_profile');
  
      // Debug isi formData
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }
  
      const response = await api.post('/file/image', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Upload berhasil:', response.data);
      Alert.alert('Sukses', response.data.message || 'Foto berhasil diunggah!');
      
      const imageId = response.data.imageId;
      const fileId = response.data.data?.fileId;
      if (fileId) {
        await updateProfile(fileId);
      }
      
  
    } catch (error) {
      console.log('Gagal upload:', error.response?.data || error.message);
      Alert.alert('Gagal', error.response?.data?.message || 'Upload gagal.');
    }
  };
  
  
  
  
  

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
          <TouchableOpacity style={styles.editIcon} onPress={() => setShowPickerModal(true)}>
            <MaterialIcons name="camera-alt" size={18} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.profileName}>{dataUser?.fullName || ""}</Text>
        <Text style={styles.profileEmail}>{dataUser?.email || ""}</Text>
      </View>

      {/* FlatList untuk Input */}
      <FlatList
        data={formFields}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.inputContainer}>
            <View style={styles.iconWrapper}>
              <Ionicons name={item.icon} size={20} color="#F86469" />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={item.value}
                editable={item.editable}
                onChangeText={(text) => handleInputChange(text, index)}
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
            <TouchableOpacity onPress={updateProfile}>
              <LinearGradient
                colors={['#CC1C22', '#F86469']}
                style={styles.applyGradient}>
                <Text style={styles.applyText}>Save</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      />
      <Modal
  visible={showPickerModal}
  transparent
  animationType="slide"
  onRequestClose={() => setShowPickerModal(false)}>
  <View style={{
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end'
  }}>
    <View style={{
      backgroundColor: 'white',
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Pilih Gambar Dari:</Text>
      <TouchableOpacity onPress={pickFromCamera} style={{ paddingVertical: 10 }}>
        <Text style={{ fontSize: 16 }}>📷 Kamera</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={pickFromGallery} style={{ paddingVertical: 10 }}>
        <Text style={{ fontSize: 16 }}>🖼️ Galeri</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setShowPickerModal(false)} style={{ paddingVertical: 10 }}>
        <Text style={{ fontSize: 16, color: 'red' }}>Batal</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

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
