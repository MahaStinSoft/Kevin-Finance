import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainScreen from './Screen/MainScreen';

const App = () => {

  return (
    <NavigationContainer>
      <MainScreen/>
    </NavigationContainer>
  );
};

export default App;
