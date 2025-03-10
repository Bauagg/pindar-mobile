import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Alert,
  Dimensions,
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
      icon: <Ionicons name="person-outline" size={24} color="#6B7280" />,
      screen: 'AccountInformation',
    },
    {
      id: '2',
      title: 'Password & Security',
      icon: <Feather name="lock" size={24} color="#6B7280" />,
      screen: 'PasswordSecurity',
    },
    { id: 'header1', type: 'header', title: 'Preference' },
    { id: '3', title: 'App Version', value: '1.0' },
    { id: '4', title: 'Terms & Conditions', screen: 'TermsCondition' },
    { id: '5', title: 'Privacy Policy', screen: 'PrivacyPolicy' },
    { id: '6', title: 'About Us', screen: 'AboutUs' },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => console.log('User logged out') },
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item }) => {
    if (item.type === 'header') {
      return (
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#6B7280',
            marginTop: 20,
            marginBottom: 10,
          }}>
          {item.title}
        </Text>
      );
    }

    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          elevation: 5,
          shadowColor: '#F86469',
          paddingVertical: 15,
          paddingHorizontal: 20,
          borderRadius: 12,
          marginBottom: 10,
        }}
        onPress={() => item.screen && navigation.navigate(item.screen)}>
        {item.icon && <View style={{ marginRight: 12 }}>{item.icon}</View>}
        <Text style={{ fontSize: 16, color: '#333', flex: 1 }}>
          {item.title}
        </Text>
        {item.value ? (
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#6B7280' }}>
            {item.value}
          </Text>
        ) : (
          <Entypo name="chevron-right" size={20} color="#9CA3AF" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingVertical: 10,
          backgroundColor: '#fff',
        }}>
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={
            <View style={{ alignItems: 'center', marginBottom: 30 }}>
              <View
                style={{
                  borderWidth: 4,
                  borderColor: '#F86469',
                  borderRadius: 9999,
                  padding: 4,
                }}>
                <Image
                  source={profile.avatar}
                  style={{ width: 100, height: 100, borderRadius: 50 }}
                />
              </View>
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>
                {profile.name}
              </Text>
              <Text style={{ fontSize: 14, color: '#6B7280' }}>
                {profile.email}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#6B7280',
                  marginTop: 20,
                  alignSelf: 'flex-start',
                }}>
                Account & Security
              </Text>
            </View>
          }
          ListFooterComponent={
            <>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'white',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: '#fff', // Merah muda lembut
                  shadowColor: '#F8BBD0',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 10,
                }}
                onPress={handleLogout}>
                <Entypo name="log-out" size={20} color="#6B7280" />
                <Entypo name="chevron-right" size={20} color="#9CA3AF" />
              </TouchableOpacity>
              <View style={{ height: Dimensions.get('window').height * 0.2 }} />
            </>
          }
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
};

export default ProfileScreen;
