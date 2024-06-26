import React, {useState} from 'react';
import {
  StatusBar,
} from "react-native";
import Routes from "./Routes";

const App = () => {
  return (
    <>
      <StatusBar
        backgroundColor='#fafafa'
        translucent={true}
        barStyle='dark-content'
      />
      <Routes />
    </>

  )
};


export default App;
