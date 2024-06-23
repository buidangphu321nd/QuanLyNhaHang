import React from "react";
import { View } from "react-native";
import RowItemAction from "../../Component/RowItemAction";
import ButtonBottom from "../../Component/ButtonBottom";
const ScheduleManage = (props) => {

  return (
    <View style={{flex:1}}>
      <View style={{flex:1}}>
        <RowItemAction
          value={'Tất cả'}
          description={'Bàn'}
          style={{ marginTop: 12, paddingHorizontal: 16, backgroundColor: 'white' }}
          borderWidth={0}
          onPress={() => {}}
        />
      </View>
      <ButtonBottom confirmLabel={"Đặt Bàn"} onConfirm={() => props.navigation.navigate("ScheduleBook")}/>
    </View>
  )
}

export default ScheduleManage;
