import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_900Black,
} from '@expo-google-fonts/lexend';

const { width } = Dimensions.get('window');

const deals = [
  {
    id: '1',
    title: 'Cashback up to',
    discount: '80%*',
    description: 'On local events',
    buttonText: 'LOOK EVENTS',
    image: require('../../assets/manthinking.png'), // Ganti dengan gambarmu
    bgColor: '#41B7A3',
  },
  {
    id: '2',
    title: 'up to',
    discount: '50% Off',
    description: 'On domestic flights',
    buttonText: 'BOOK NOW',
    image: require('../../assets/mansmile.png'), // Ganti dengan gambarmu
    bgColor: '#E64058',
  },
];

const PopularDeal = () => {
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
  });
  if (!fontsLoaded) {
    return null;
  }
  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: item.bgColor }]}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.discount}>{item.discount}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>{item.buttonText}</Text>
        </TouchableOpacity>
      </View>
      <Image source={item.image} style={styles.image} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Popular Deal 🔥</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={deals}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    // fontWeight: 'bold',
    fontFamily: 'Lexend_700Bold',
    color: '#333',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#004AAD',
  },
  list: {
    paddingHorizontal: 20,
  },
  card: {
    width: width * 0.5,
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Lexend_400Regular',
  },
  discount: {
    fontSize: 24,
    // fontWeight: 'bold',
    fontFamily: 'Lexend_700Bold',
    color: '#fff',
  },
  description: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Lexend_400Regular',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  buttonText: {
    fontSize: 12,
    // fontWeight: 'bold',
    fontFamily: 'Lexend_700Bold',
    color: '#333',
  },
  image: {
    width: 100,
    height: 120,
    position: 'absolute',
    bottom: 0,
    right: 0,
    resizeMode: 'contain',
  },
});

export default PopularDeal;
