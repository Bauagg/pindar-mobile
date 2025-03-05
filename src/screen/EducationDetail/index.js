import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EducationDetail = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const navEducationComments = () => {
    props.navigation.navigate('EducationComments');
  };

  return (
    <View style={styles.container}>
      {/* Header */}

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons
          name="search"
          size={20}
          color="#A3A3A3"
          style={styles.searchIcon}
        />
        <TextInput placeholder="Search here.." style={styles.searchInput} />
      </View>

      {/* Article */}
      <Image
        source={{ uri: 'https://via.placeholder.com/300' }}
        style={styles.articleImage}
      />
      <View style={styles.articleContent}>
        <Text style={styles.timestamp}>4h ago</Text>
        <Text style={styles.articleTitle}>
          Strategi Cerdas Mengelola Pinjaman Online Agar Tak Merugikan
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
          Pinjaman online (pinjol) semakin populer karena kemudahannya dalam
          memberikan akses dana cepat... (selengkapnya)
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
                <Text>Copy Link</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton}>
                <Ionicons name="logo-whatsapp" size={24} color="green" />
                <Text>WhatsApp</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton}>
                <Ionicons name="logo-facebook" size={24} color="blue" />
                <Text>Facebook</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton}>
                <Ionicons name="logo-messenger" size={24} color="blue" />
                <Text>Messenger</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton}>
                <Ionicons name="logo-twitter" size={24} color="skyblue" />
                <Text>Twitter</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton}>
                <Ionicons name="logo-instagram" size={24} color="purple" />
                <Text>Instagram</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton}>
                <Ionicons name="logo-skype" size={24} color="blue" />
                <Text>Skype</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={24}
                  color="green"
                />
                <Text>Message</Text>
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
    borderRadius: 20,
    margin: 10,
    paddingHorizontal: 10,
    height: 40,
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
  },
  articleContent: {
    padding: 15,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  stat: {
    fontSize: 14,
    color: '#444',
  },
  articleText: {
    fontSize: 14,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
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
