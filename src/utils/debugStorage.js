import AsyncStorage from '@react-native-async-storage/async-storage';

const logAllAsyncStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const result = await AsyncStorage.multiGet(keys);

    console.log('== AsyncStorage Content ==');
    result.forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
  } catch (e) {
    console.error('Failed to load AsyncStorage content:', e);
  }
};

export default logAllAsyncStorage;
