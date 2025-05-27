import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../utils/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PrivacyPolicy = () => {
  const [loading, setLoading] = useState(false);
  const [dataPrivacy, setDataPrivacy] = useState({});
  const scrollViewRef = useRef(null);

  const navigation = useNavigation();

  const getDataTerms = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      const response = await api.get(`/parameter/PRIVACY_POLICY`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDataPrivacy(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataTerms();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.updatedText}>
          Terakhir diperbarui: <Text style={styles.boldText}>24/02/2025</Text>
        </Text>

        <Text style={styles.sectionTitle}>1. Pendahuluan</Text>
        <Text style={styles.contentText}>
          {dataPrivacy.param_value}
        </Text>
      </ScrollView>

      <TouchableOpacity
        onPress={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        <LinearGradient
          colors={['#CC1C22', '#F86469']}
          style={styles.filterFloating}
        >
          <Feather
            name="arrow-down"
            size={14}
            color="white"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.filterFloatingText}>Selengkapnya</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  updatedText: {
    color: 'gray',
    marginBottom: 8,
  },
  boldText: {
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  contentText: {
    color: 'gray',
    marginTop: 8,
  },
  filterFloating: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    marginLeft: -75,
    width: 150,
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  filterFloatingText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Lexend-Regular',
  },
});

export default PrivacyPolicy;
