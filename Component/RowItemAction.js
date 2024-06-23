import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from "react-native";
import SvgArrowRight from '../assets/images/svg/SvgArrowRight.svg';


/**
 * Component Text
 * @param {object} props - Thuộc tính của thành phần.
 * @param {object} props.style - Style tuỳ chỉnh.
 * @param {string} props.description - Mô tả.
 * @param {string} props.value - Giá trị của row (Mặc định: 'Chọn giá trị').
 * @param {object} props.valueStyle - Style của giá trị (Mặc định: textNormal, color: COLOR_MAIN).
 * @param {function} props.onPress - function khi click item
 * @returns {JSX.Element} - Thành phần JSX.
 */
export default function RowItemAction(props) {
  const {
    style = {},
    description = '',
    descriptionStyle = {},
    value = '',
    valueStyle = {},
    onPress = () => {
    },
    borderWidth = 1,
    icon,
    disabled = false,
    childDescription = '',
    childDescriptionStyle = {},
  } = props;



  return (
    <View style={[styles.borderBottom, { borderBottomWidth: borderWidth }, style]}>
      <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        style={{ paddingVertical: 16 }}
      >
        <View
          style={[{ flexDirection: 'row', paddingBottom: childDescription ? 8 : null }]}>
          {icon && <View style={{ marginRight: 12 }}>{{
            ...icon,
            props: { fill: '#1E6F5C', width: 24, height: 24, ...icon.props },
          }}</View>}
          {description ? <Text
            style={[{ color: "#888888", width: 140 ,fontSize:14}, descriptionStyle]}>{description}</Text>:null}
          <Text style={[{
            color: "#1E6F5C",
            flex: 1,
            fontSize:14
          }, description ? { textAlign: 'right' } : null, valueStyle]}>{value}</Text>
          {disabled ? null :
            <View style={{ marginLeft: 'auto', paddingLeft: 6,justifyContent:"center" }}>
              <SvgArrowRight width={16} height={16} />
            </View>
          }
        </View>
        {childDescription? <Text style={[childDescriptionStyle,{fontSize:14}]}>{childDescription}</Text>:null}
      </TouchableOpacity>
    </View>
  );

}
const styles = StyleSheet.create({
  borderBottom:{
    borderWidth:0,
    borderBottomWidth: 0.5,
    borderColor: '#dedede'
  },
})
