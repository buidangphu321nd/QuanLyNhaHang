import React, { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet, Alert, ToastAndroid } from "react-native";
import moment from 'moment';
import 'moment/locale/vi';
import ModalBottom from "../../Component/ModalBottom";
import RowItem from "../../Component/RowItem";
import RowItemAction from "../../Component/RowItemAction";
import ButtonBottom from "../../Component/ButtonBottom";
import { DATABASE, ref, remove } from "../../fireBaseConfig";


const ScheduleItem = (props) => {
  const [isModal,setIsModal] = useState(false);
  const {
    onPress = () => {
    },
    item,
    index,
    onRemoveSchedule,
  } = props;


  return (
    <View style={{ flexDirection: 'row', marginTop: 16, marginHorizontal: 6 }}>
      <View style={{ width: 60, paddingTop: 12, alignItems: 'center' }}>
        <Text style={{color:"#292929"}}>{moment(item?.arrivalTime).format('HH:mm')}</Text>
      </View>

      <TouchableOpacity
        onPress={() => setIsModal(true)}
        style={[styles.border, { flex: 1, backgroundColor: '#fff', padding: 12, borderRadius: 8 }]}>
        <View style={[styles.flexRow]}>
          <Text style={{color:"#292929"}}>{item?.customerName}</Text>
        </View>
        <Text style={{ color:"#292929",marginTop: 6 }}>{item?.tableName} , {item?.floorName}</Text>
        {item?.note && <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 6 }}>
          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 16,
            height: 16,
            marginTop: 4,
            borderRadius: 8,
            backgroundColor: "#888888",
          }}>
            <Text style={{ color: "#fff", fontSize: 12 }}>i</Text>
          </View>
          <Text
            style={{ marginLeft: 10, color: "#888888", flex: 1 }}>{item?.note}</Text>
        </View>}
      </TouchableOpacity>
      <ModalBottom
        title={"Thông tin đặt bàn"}
        visible={isModal}
        setVisible={setIsModal}
      >
        <RowItemAction
          value={item?.customerName}
          description={"Khách hàng"}
          style={{paddingHorizontal:16}}
          boderWidth={0}/>
        <RowItem
          value={moment(item?.arrivalTime).format("HH:mm") }
          description={"Thời gian đến"}
          style={{paddingHorizontal:16}}
          boderWidth={0}/>
        <RowItem
          value={item.tableName + " , " + item.floorName}
          description={"Bàn"}
          style={{paddingHorizontal:16}}
          boderWidth={0}/>
        {item?.note &&
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={{color:"#292929"}}>Ghi chú</Text>
            <Text style={{color:"#888888"}}>{item?.note}</Text>
          </View>
        }
        <View style={{ height: 50 }}></View>
        <ButtonBottom
          confirmLabel={'Hủy Bàn'}
          cancelLabel={'Đóng'}
          onCancel={() => setIsModal(false)}
          onConfirm={ () => {onRemoveSchedule(),setIsModal(false)}}
        />
      </ModalBottom>
    </View>
  );
}

export default ScheduleItem;

const styles = StyleSheet.create({
  border:{
    borderWidth: 0.5,
    borderColor: '#ddd'
  },
  flexRow: {
    flexDirection: 'row',
    alignItems:'center'
  },
})
