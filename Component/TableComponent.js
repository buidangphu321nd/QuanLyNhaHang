import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import React from 'react';


const TableComponent = (props) => {
  const {
    styles,
    listTable = [],
    table,
    onPress = () => {
    },
    showStatus=false
  } = props;


  const getStatus = (status) => {
    let bgColor = "#888888";
    let color;
    let borderColor;
    switch (status) {
      case 'USING':
        // setBackgroundColor(THEME?.COLOR_MAIN), setColor('white'), setBorderColor(THEME?.COLOR_MAIN);
        bgColor = "#1E6F5C";
        color = 'white';
        borderColor = "#1E6F5C";
        break;
      case 'PAYMENT_REQUEST':
        bgColor = '#27ae60',
          color = 'white',
          borderColor = '#27ae60';
        break;
      case 'RESERVED':
        bgColor = '#bbd4ce',
          color = 'black',
          borderColor = '#bbd4ce';
        break;
      case 'FREE':
        bgColor = 'white';
        color = 'black';
        borderColor = 'black';
        break;

    }
    return { color, bgColor, borderColor };
  };


  return (
    <TouchableOpacity
      onPress={onPress}
      style={[{
        alignItems: 'center',

      }, styles]}>
      <View style={{
        height: 4,
        width: 16,
        backgroundColor: '#DDD',
        borderRadius: 2,
        opacity: 0.6,
      }} />
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <View style={{
          height: 16,
          width: 4,
          backgroundColor: '#DDD',
          borderRadius: 2,
          opacity: 0.6,

        }} />
        <View style={{
          borderWidth: 0.75,
          borderColor:showStatus? getStatus(table?.currentState)?.borderColor:'black',
          height: 50,
          width: 75,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: showStatus?getStatus(table?.currentState)?.bgColor:'white',
          margin: 4,
        }}>
          <Text
            numberOfLines={1}
            style={{
              color:showStatus? getStatus(table?.currentState)?.color:'black',
              fontSize: 14,
            }}> {table?.tableName}</Text>
          {table?.tableSlots&&<Text style={{ fontSize: 10, color:showStatus? getStatus(table?.currentState)?.color:'black', lineHeight:14 }}>{table?.tableSlots} ghế</Text>}
        </View>
        <View style={{
          height: 16,
          width: 4,
          backgroundColor: '#DDD',
          borderRadius: 2,
          opacity: 0.6,


        }} />
      </View>
      <View style={{
        height: 4,
        width: 16,
        backgroundColor: '#DDD',
        borderRadius: 2,
        opacity: 0.6,
      }} />
    </TouchableOpacity>
  );
};
export default TableComponent;

const styles = StyleSheet.create({
  text: {
    color:"#292929",
    fontSize:14,
  }
})
