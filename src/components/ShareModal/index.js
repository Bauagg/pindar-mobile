import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const ShareModal = ({ modalRef }) => {
  const shareOptions = [
    { name: 'Copy Link', icon: 'link', color: '#A3A3A3' },
    { name: 'WhatsApp', icon: 'logo-whatsapp', color: '#25D366' },
    { name: 'Facebook', icon: 'logo-facebook', color: '#1877F2' },
    { name: 'Messenger', icon: 'chatbubble', color: '#0084FF' },
    { name: 'Twitter', icon: 'logo-twitter', color: '#1DA1F2' },
    { name: 'Instagram', icon: 'logo-instagram', color: '#C13584' },
    { name: 'Skype', icon: 'logo-skype', color: '#00AFF0' },
    { name: 'Message', icon: 'chatbubbles', color: '#34C759' },
  ];

  return (
    <Modalize ref={modalRef} modalStyle={styles.modal}>
      <View style={styles.container}>
        <Text style={styles.title}>Share</Text>
        <View style={styles.grid}>
          {shareOptions.map((item, index) => (
            <TouchableOpacity key={index} style={styles.shareButton}>
              <Ionicons name={item.icon} size={32} color={item.color} />
              <Text style={styles.shareText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => modalRef.current?.close()}>
          <Text style={styles.cancelText}>CANCEL</Text>
        </TouchableOpacity>
      </View>
    </Modalize>
  );
};

const styles = StyleSheet.create({
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
  },
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  shareButton: {
    alignItems: 'center',
    width: 80,
    marginVertical: 10,
  },
  shareText: {
    marginTop: 5,
    fontSize: 12,
  },
  cancelButton: {
    marginTop: 15,
    backgroundColor: '#EAEAEA',
    width: '90%',
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

export default ShareModal;
