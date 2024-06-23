import React, { forwardRef, useImperativeHandle } from 'react';
import { TouchableOpacity, View,Text } from 'react-native';
import SvgCircleDot from '../assets/images/svg/dot-circle.svg';
import SvgCircle from '../assets/images/svg/circle.svg';


const RadioButton = forwardRef((props, ref) => {
  const {
    checked = false,
    style,
    onPress = () => {
    },
    label = '',
    labelStyle = {},
    childrenStyle = {},
    value,
    disabled = false,
  } = props;


  useImperativeHandle(ref, () => ({
    getValue() {
      return getValue();
    },
  }));


  const getValue = () => {
    return checked;
  };

  return (
    <TouchableOpacity
      onPress={() => !disabled && onPress(value)}
      style={[{ flexDirection: 'row' }, style]}>
      {checked ?
        <SvgCircleDot fill={disabled ? "#888888" : "#1E6F5C"} width={24} height={24} />
        :
        <SvgCircle fill={"#888888"} width={24} height={24} />
      }
      <View style={[{ flex: 1, marginLeft: 8 }, childrenStyle]}>
        {label && <Text style={[labelStyle]}>{label}</Text>}
        {props.children}
      </View>
    </TouchableOpacity>
  );
});

export default RadioButton;

