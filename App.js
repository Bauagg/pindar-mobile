import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import MainStackNavigator from './src/navigation';
import SplashScreen from './src/screen/SplashScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = (props) => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Simulate an asynchronous operation (e.g., fetching data, checking user authentication)
    const fetchData = async () => {
      // Your asynchronous logic here...

      // After completing the asynchronous operation, hide the splash screen
      setShowSplash(false);
    };

    fetchData(); // Call the asynchronous function
  }, []); // Empty dependency array means this useEffect runs once on mount

  return (
    <>
      {/* <StatusBar hidden={false} backgroundColor="#A0C5E8" /> */}
      {showSplash ? <SplashScreen /> : <MainStackNavigator />}
    </>
  );
};

export default App;
