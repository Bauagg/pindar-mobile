import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'react-native';
import MainStackNavigator from './src/navigation';
import SplashScreen from './src/screen/SplashScreen';
import { setNavigationRef } from './src/utils/axios'; // <- sesuaikan path jika perlu

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const navRef = useRef(null);

  useEffect(() => {
    setNavigationRef(navRef.current); // kirim ke axios
    const fetchData = async () => {
      // bisa tambahkan logika cek login
      setShowSplash(false);
    };
    fetchData();
  }, []);

  return (
    <>
      <StatusBar hidden={false} backgroundColor="#A0C5E8" />
      {showSplash ? (
        <SplashScreen />
      ) : (
        <MainStackNavigator navigationRef={navRef} />
      )}
    </>
  );
};

export default App;
