import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons'; // Untuk ikon kalender dan panah

const TrendingCard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Trending Products</Text>
        <View style={styles.dateContainer}>
          <Entypo name="calendar" size={16} color="white" />
          <Text style={styles.dateText}> Last Date 29/02/2025</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>View all </Text>
        <Entypo name="chevron-right" size={16} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#CC1C22',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%', // Sesuaikan dengan lebar layar
    alignSelf: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  dateText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default TrendingCard;
