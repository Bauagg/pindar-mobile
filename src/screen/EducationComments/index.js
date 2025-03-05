import React, { useState } from 'react';
import {
  View,
  FlatList,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Avatar, IconButton } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';

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
      'Tergantung penyedia layanan, tapi di Pindar kamu bisa bandingin yang paling rendah!',
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

  const renderItem = ({ item }) => (
    <View
      style={{ flexDirection: 'row', padding: 10, alignItems: 'flex-start' }}>
      <Avatar.Image size={40} source={{ uri: item.avatar }} />
      <View style={{ marginLeft: 10, flex: 1 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{item.name}</Text>
        <Text style={{ fontSize: 13, color: '#555' }}>{item.comment}</Text>
        <View
          style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: '#888' }}>{item.time} •</Text>
          <Text style={{ fontSize: 12, color: '#888', marginLeft: 5 }}>
            ❤️ {item.likes} likes
          </Text>
          <Text style={{ fontSize: 12, color: '#888', marginLeft: 10 }}>
            ↩️ reply
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      {/* <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 15,
          borderBottomWidth: 1,
          borderColor: '#ddd',
        }}>
        <IconButton icon="arrow-left" size={24} onPress={() => {}} />
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            flex: 1,
            textAlign: 'center',
          }}>
          Education
        </Text>
        <IconButton icon="dots-vertical" size={24} />
      </View> */}

      {/* Comments List */}
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
        }}>
        <TextInput
          style={{
            flex: 1,
            backgroundColor: '#f0f0f0',
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderRadius: 20,
          }}
          placeholder="Type your comment"
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity
          style={{
            marginLeft: 10,
            backgroundColor: '#4A90E2',
            padding: 10,
            borderRadius: 20,
          }}>
          <Feather name="send" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default EducationComments;
