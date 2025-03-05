import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from 'react-native';
import { Entypo, Ionicons, Feather } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
  const profile = {
    name: 'Putri Amalia',
    email: 'putriamalia@gmail.com',
    avatar: require('../../assets/avatar.png'),
  };

  const menuItems = [
    {
      id: '1',
      title: 'Account Information',
      icon: <Ionicons name="person-outline" size={24} color="black" />,
      screen: 'AccountInformation',
    },
    {
      id: '2',
      title: 'Password & Security',
      icon: <Feather name="lock" size={24} color="black" />,
      screen: 'PasswordSecurity',
    },
    { id: '3', title: 'App Version', value: '1.0' },
    { id: '4', title: 'Terms & Conditions', screen: 'TermsCondition' },
    { id: '5', title: 'Privacy Policy', screen: 'PrivacyPolicy' },
    { id: '6', title: 'About Us', screen: 'AboutUs' },
  ];

  return (
    <>
      <StatusBar translucent backgroundColor={'transparent'} />
      <View style={styles.container}>
        {/* Profile Section */}
        <View style={styles.profileContainer}>
          <Image source={profile.avatar} style={styles.profileImage} />
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileEmail}>{profile.email}</Text>
        </View>

        {/* Menu List */}
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                if (item.screen) {
                  navigation.navigate(item.screen);
                }
              }}>
              {item.icon && (
                <View style={{ marginRight: 10 }}>{item.icon}</View>
              )}
              <Text style={styles.menuText}>{item.title}</Text>
              {item.value && (
                <Text style={styles.versionText}>{item.value}</Text>
              )}
            </TouchableOpacity>
          )}
          ListFooterComponent={
            <TouchableOpacity style={styles.logoutButton}>
              <Entypo name="log-out" size={24} color="black" />
              <Text style={styles.logoutText}>Log out</Text>
            </TouchableOpacity>
          }
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#F86469',
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FDF2F2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  versionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDF2F2',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ProfileScreen;
