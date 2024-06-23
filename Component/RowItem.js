import React from 'react';
import { StyleSheet, Text, View } from "react-native";



/**
 * Component Text
 * @param {object} props - Thuộc tính của thành phần.
 * @param {object} props.style - Style tuỳ chỉnh.
 * @param {string} props.description - Mô tả.
 * @param {string} props.value - Giá trị của row (Mặc định: 'Chọn giá trị').
 * @param {object} props.valueStyle - Style của giá trị.
 * @param {number} props.borderWidth - độ dày border bottom (Mặc định: 0.5)
 * @returns {JSX.Element} - Thành phần JSX.
 */
export default function RowItem(props) {
  const {
    style = {},
    description = '',
    value = '',
    valueStyle = {},
    borderWidth = 1,
  } = props;



  return (
    <View style={[styles.flexRow, styles.borderBottom, {
      paddingVertical: 16,
      borderBottomWidth: borderWidth,
    }, style]}>
      {description &&
        <Text style={{ color: "#888888", flex: 1, minWidth: 140,fontSize:14}}>{description}</Text>}
      {value &&
        <Text style={{fontSize:14,color:"#1E6F5C"}}>{value}</Text>
      }
    </View>
  );

}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    alignItems:'center'
  },
  borderBottom:{
    borderWidth:0,
    borderBottomWidth: 0.5,
    borderColor: '#dedede'
  },
})
