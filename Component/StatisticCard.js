import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import React from 'react';
import { useSelector } from 'react-redux';

const StatisticCard = (props) => {
  const { onPress, title, total,style } = props;


  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={onPress ? false : true}
      style={[
        styles.shadow,
        {
          backgroundColor: "#fff",
          margin: 16,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 12,
        },
        style
      ]}
    >
      <View style={[{ alignItems: 'center', width: '100%', paddingBottom: 16 }, styles?.borderBottom]}>
        <Text style={{color:"#292929",fontSize:16,fontWeight:400}} >
          {title}
        </Text>
        <Text style={{ color: "#1E6F5C",fontSize:18,fontWeight:450,marginVertical:8}}>
          {total}
        </Text>
      </View>
      {props?.children}
    </TouchableOpacity>
  );
};
export default StatisticCard;

const styles = StyleSheet.create({
  shadow:{
    shadowOffset: { width: 0, height: 2 },
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 3,
  },
  borderBottom:{
    borderBottomWidth: 1,
    borderColor: '#dedede'
  },
})
