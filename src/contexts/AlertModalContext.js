import React, { createContext, useState, useContext } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

const AlertModalContext = createContext();

export const AlertModalProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('success'); // "success" atau "error"

  const showAlert = (alertTitle, msg, alertType = 'success') => {
    setTitle(alertTitle);
    setMessage(msg);
    setType(alertType);
    setVisible(true);
  };

  const hideAlert = () => {
    setVisible(false);
    setMessage('');
    setTitle('');
  };

  return (
    <AlertModalContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <Modal visible={visible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              alignItems: 'center',
              width: 300,
            }}>
            {/* Ikon dalam lingkaran dengan warna merah tetap */}
            <LinearGradient
              colors={['#CC1C22', '#F86469']}
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Icon
                name={type === 'success' ? 'check' : 'times'}
                size={30}
                color="white"
              />
            </LinearGradient>

            <Text
              style={{
                marginVertical: 10,
                textAlign: 'center',
                fontFamily: 'Poppins-Bold',
                fontSize: 20,
              }}>
              {title}
            </Text>
            <Text
              style={{
                marginVertical: 10,
                textAlign: 'center',
                color: '#8F959E',
                fontFamily: 'Poppins-Regular',
                fontSize: 13,
              }}>
              {message}
            </Text>

            <TouchableOpacity onPress={hideAlert}>
              <LinearGradient
                colors={['#F86469', '#CC1C22']}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 40,
                  borderRadius: 10,
                  marginTop: 10,
                }}>
                <Text
                  style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                  Continue
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </AlertModalContext.Provider>
  );
};

export const useAlertModal = () => useContext(AlertModalContext);
