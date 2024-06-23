import React, { } from 'react';
import Modal from 'react-native-modal';
import { View, TouchableOpacity, Text, Dimensions } from "react-native";
import SvgCross from "../assets/images/svg/cross.svg"

const height = Dimensions.get("window").height;
const ModalBottom = (props) => {

  const {
    title = '',
    labelCancel = 'Huỷ',
    labelConfirm = 'Đồng ý',
    onConfirm = () => {},
    visible = false,
    setVisible = () => {},
    maxHeight = height - 200,
    style = {},
    avoidKeyboard = true,
    onShow=()=>{},
    statusBarTranslucent=false
  } = props;


  const onCancel = () => {
    setVisible(false);
  };

  return (
    <Modal
      isVisible={!!visible}
      backdropTransitionOutTiming = {0}
      onBackdropPress={onCancel}
      style={{margin: 0, bottom: 0, padding: 0, flex: 1,  justifyContent: 'flex-end'}}
      avoidKeyboard={avoidKeyboard}
      deviceHeight={height}
      onShow={onShow}
      statusBarTranslucent={statusBarTranslucent}

    >
      <View style={{ backgroundColor: '#fff', overflow: 'hidden', borderTopLeftRadius: 8, borderTopRightRadius: 8}}>
        <Text style={{textAlign: 'center', color: "#1E6F5C",fontWeight:"500",marginTop:16}}>{title}</Text>
        <TouchableOpacity onPress={onCancel} style={{position: 'absolute', right: 0, top: 4, padding: 16}}>
          <SvgCross fill={'#888'} width={16} height={16}/>
        </TouchableOpacity>

        <View style={[maxHeight && {maxHeight}, style]}>
          {props.children}
        </View>

      </View>
    </Modal>
  );
}

export default ModalBottom;
