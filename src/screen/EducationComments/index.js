import React, { useState } from 'react';
import {
  View,
  FlatList,
  TextInput,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Avatar } from 'react-native-paper';
import { Feather, AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_900Black,
} from '@expo-google-fonts/lexend';

const commentsData = [
  {
    id: '1',
    name: 'Bruce Wyne',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    comment: 'Bunga pinjaman online masih tinggi gak tahun depan?',
    likes: 125,
    time: '4w',
  },
  {
    id: '2',
    name: 'Sellina Kayle',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    comment:
      'Tergantung penyedia layanan, tapi di Pinjaman kamu bisa bandingin yang paling rendah!',
    likes: 12,
    time: '4w',
  },
  {
    id: '3',
    name: 'Madison Ivy',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    comment: 'Gue lebih suka kartu kredit, banyak cashback!',
    likes: 8,
    time: '3w',
  },
];

const EducationComments = () => {
  const [comment, setComment] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
  });
  if (!fontsLoaded) {
    return null;
  }

  const renderItem = ({ item, index }) => {
    if (!showAll && index > 1) return null;

    return (
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: 10,
          alignItems: 'flex-start',
          paddingHorizontal: 30,
        }}>
        {/* Avatar */}
        <Avatar.Image size={40} source={{ uri: item.avatar }} />
        <View style={{ marginLeft: 10, flex: 1 }}>
          {/* Nama */}
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 14,
              color: '#333',
              fontFamily: 'Lexend_700Bold',
            }}>
            {item.name}
          </Text>
          {/* Komentar */}
          <Text
            style={{
              fontSize: 13,
              color: '#555',
              marginTop: 2,
              lineHeight: 18,
              fontFamily: 'Lexend_400Regular',
            }}>
            {item.comment}
          </Text>
          {/* Waktu, Likes, dan Reply */}
          <View
            style={{
              flexDirection: 'row',
              marginTop: 5,
              alignItems: 'center',
            }}>
            <Text style={{ fontSize: 12, color: '#888' }}>{item.time} •</Text>
            <AntDesign
              name="hearto"
              size={12}
              color="#888"
              style={{ marginLeft: 5 }}
            />
            <Text style={{ fontSize: 12, color: '#888', marginLeft: 3 }}>
              {item.likes} likes
            </Text>
            <Text style={{ fontSize: 12, color: '#888', marginLeft: 10 }}>
              ↩️ reply
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'android' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <Text
        style={{
          padding: 15,
          fontSize: 16,
          // fontWeight: 'bold',
          fontFamily: 'Lexend_700Bold',
        }}>
        Comments
      </Text>

      {/* Comments List menggunakan FlatList */}
      <FlatList
        data={commentsData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {/* Comment Input */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
          borderTopWidth: 1,
          borderColor: '#ddd',
          backgroundColor: '#fff',
        }}>
        <TextInput
          style={{
            flex: 1,
            backgroundColor: '#fff',
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderRadius: 10,
            fontSize: 14,
            borderWidth: 1,
            borderColor: '#ddd',
          }}
          placeholder="Type your comment"
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity style={{ marginLeft: 10 }}>
          <LinearGradient
            colors={['#95D5FF', '#2493D5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              padding: 12,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Feather name="send" size={18} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default EducationComments;
