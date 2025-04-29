import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  TextInput,
  Dimensions,
} from 'react-native';
import { Entypo, Feather, Ionicons } from '@expo/vector-icons';
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_900Black,
} from '@expo-google-fonts/lexend';
import api from '../../utils/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EducationDetail = (props) => {
  const {id} = props.route.params;
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [dataEducation,setEducation] = useState([]);
  console.log("INI DATA", dataEducation);
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
  });
 
  const navEducationComments = () => {
    props.navigation.navigate('EducationComments');
  };

const getDataDetail = async () => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('accessToken');
    console.log("INI TOKEN", token);
    const response = await api.get(
      `/content/detail/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data.data);
    setEducation(response.data.data);
  } catch (error) {
    console.log(error);
  }
}

  useEffect(() => {
    getDataDetail();
  }, []);
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={{ flexDirection: 'row' }}>
        <Image
          source={require('../../assets/loginlogo.png')}
          style={{
            width: 50,
            height: 50,
            marginRight: 10,
            resizeMode: 'contain',
          }}
        />
        <View style={styles.searchContainer}>
          <Entypo
            name="magnifying-glass"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput placeholder="Search here.." style={styles.searchInput} />
        </View>
      </View>

      {/* Article */}
      <Image
        source={{ uri: `https://be.pindar.id/api${dataEducation.imageLink}` }}
        style={styles.articleImage}
      />
      <View style={styles.articleContent}>
        <Text style={styles.timestamp}>4h ago</Text>
        <Text style={styles.articleTitle}>
          {dataEducation.title || ""}
        </Text>
        <View style={styles.statsContainer}>
          <TouchableOpacity onPress={navEducationComments}>
            <Text style={styles.stat}>
              <Ionicons name="chatbubble-outline" size={16} /> 8 comments
            </Text>
          </TouchableOpacity>
          <Text style={styles.stat}>
            <Ionicons name="heart-outline" size={16} /> 34 likes
          </Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.stat}>
              <Ionicons name="share-social-outline" size={16} /> Share
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.articleText}>
          {dataEducation.contentDetail}
        </Text>
      </View>

      {/* Share Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Share</Text>
            <View style={styles.shareOptions}>
              <TouchableOpacity style={styles.shareButton}>
                <Ionicons name="copy-outline" size={24} color="black" />
                <Text style={styles.shareText}>Copy Link</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton}>
                <Ionicons name="logo-whatsapp" size={24} color="green" />
                <Text style={styles.shareText}>WhatsApp</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton}>
                <Ionicons name="logo-facebook" size={24} color="blue" />
                <Text style={styles.shareText}>Facebook</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton}>
                <Ionicons name="logo-messenger" size={24} color="blue" />
                <Text style={styles.shareText}>Messenger</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton}>
                <Ionicons name="logo-twitter" size={24} color="skyblue" />
                <Text style={styles.shareText}>Twitter</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton}>
                <Ionicons name="logo-instagram" size={24} color="purple" />
                <Text style={styles.shareText}>Instagram</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton}>
                <Ionicons name="logo-skype" size={24} color="blue" />
                <Text style={styles.shareText}>Skype</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={24}
                  color="green"
                />
                <Text style={styles.shareText}>Message</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>CANCEL</Text>
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
    backgroundColor: '#F9F9F9',
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#FFF',
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
  },
  articleImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  articleContent: {
    padding: 15,
  },

  timestamp: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'Lexend_400Regular',
  },
  articleTitle: {
    fontSize: 18,
    // fontWeight: 'bold',
    fontFamily: 'Lexend_700Bold',
    marginVertical: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingRight: 100,
  },
  stat: {
    fontSize: 14,
    color: '#444',
    fontFamily: 'Lexend_400Regular',
  },
  articleText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Lexend_400Regular',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: Dimensions.get('window').width,
    // height: '60%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    // fontWeight: 'bold',
    marginBottom: 15,
    fontFamily: 'Lexend_700Bold',
  },
  shareOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
  },
  shareButton: {
    alignItems: 'center',
    margin: 10,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#EAEAEA',
    width: '100%',
    padding: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
});

export default EducationDetail;
