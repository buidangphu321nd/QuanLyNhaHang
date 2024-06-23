import React, {useState} from 'react';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  Modal, StatusBar,
} from "react-native";
import HomeOwner from "./Screens/home/HomeOwner";
import Routes from "./Routes";

const App = () => {
  return (
    <>
      <StatusBar
        backgroundColor='transparent'
        translucent={true}
        barStyle='dark-content'
      />
      <Routes />
    </>

  )
};

const styles = StyleSheet.create({

});

export default App;
