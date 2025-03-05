import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Entypo, Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';

const AccountInformation = () => {
  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle="dark-content"
      />

      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Information</Text>
        <TouchableOpacity>
          <Entypo name="dots-three-vertical" size={20} color="black" />
        </TouchableOpacity>
      </View> */}

      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <View style={styles.profileImageWrapper}>
          <Image
            source={require('../../assets/avatar.png')}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editIcon}>
            <MaterialIcons name="camera-alt" size={18} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.profileName}>Putri Amalia</Text>
        <Text style={styles.profileEmail}>putriamalia@gmail.com</Text>
      </View>

      {/* Form Section */}
      <View style={styles.formContainer}>
        {formFields.map((item, index) => (
          <View key={index} style={styles.inputWrapper}>
            <Ionicons
              name={item.icon}
              size={20}
              color="#D43F3A"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              value={item.value}
              editable={item.editable}
            />
            {item.label && (
              <View style={styles.labelBadge}>
                <Text style={styles.labelText}>{item.label}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const formFields = [
  { icon: 'mail', value: 'putriamalia@gmail.com', editable: false },
  { icon: 'person', value: 'Putri Amalia', editable: true },
  { icon: 'key', value: 'putri17', editable: true },
  { icon: 'call', value: '+62 8527654654', editable: true },
  { icon: 'location', value: 'Menteng, Jakarta Pusat', editable: true },
  {
    icon: 'document',
    value: 'id364284946',
    editable: false,
    label: 'Id Member',
  },
];

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
  formContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF2F2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    position: 'relative',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  labelBadge: {
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    position: 'absolute',
    right: 10,
  },
  labelText: {
    fontSize: 12,
    color: '#D43F3A',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#D43F3A',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default AccountInformation;
