import React, {useState} from 'react';
import { OrderProvider } from "./ConText/OrderContext";
import {
  StatusBar,
} from "react-native";
import Routes from "./Routes";

const App = () => {
  return (
    <OrderProvider>
      <StatusBar
        backgroundColor={"transparent"}
        translucent={true}
        barStyle={"dark-content"}
      />
      <Routes />
    </OrderProvider>

  )
};


export default App;
