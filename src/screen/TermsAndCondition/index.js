import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../utils/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TermsCondition = () => {
  const [loading, setLoading] = useState(false);
  const [dataTerms, setDataTerms] = useState({});
  const scrollViewRef = useRef(null);

  const getDataTerms = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      const response = await api.get(`/parameter/TERMS_CONDITION`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDataTerms(response.data.data);
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
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>
          Terakhir diperbarui: <Text style={styles.boldText}>24/02/2025</Text>
        </Text>

        <Text style={styles.sectionTitle}>1. Pendahuluan</Text>
        <Text style={styles.sectionContent}>
          {dataTerms.param_value}
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
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  scrollView: {
    marginBottom: 80,
  },
  lastUpdated: {
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 8,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#374151',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  sectionContent: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 16,
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

export default TermsCondition;
