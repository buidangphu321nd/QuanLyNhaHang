import React, { useCallback, useState } from "react";
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { DATABASE, get, ref } from "../../fireBaseConfig";
import { useFocusEffect } from "@react-navigation/native";

const OrderList = (props) => {
  const [listBill, setListBill] = useState([]);
  const FetchListBill = useCallback(async () => {
    try {
      const billReff = ref(DATABASE, "bills");
      const snapshot = await get(billReff);
      const data = snapshot.val();
      if (data) {
        const billArray = Object.keys(data).map(key => ({
          billId: key,
          ...data[key],
        }));
        setListBill(billArray);
      }
    } catch (err) {
      console.error("Error: ", err);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      FetchListBill();
    }, [FetchListBill]),
  );
  console.log("ListBill",listBill);

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };


  const formatTotal = (total) => {
    return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  return (
    <View style={{flex:1,backgroundColor:"#fafafa",paddingHorizontal:8}}>
        <FlatList
          data={listBill}
          renderItem={({item}) => (
            <View style={{backgroundColor:"#fff",elevation:1,borderRadius:8,paddingHorizontal:16,marginVertical:16}}>
              <TouchableOpacity onPress={() => props.navigation.navigate("OrderListDetail",{item: item})}>
              <View style={{flexDirection:"row",justifyContent:"space-between",marginTop:8}}>
                <Text style={{color:"#000",fontWeight:500}}>{item.customerName}</Text>
                <Text style={{color:"#888888",fontWeight:400}}>{item.tableName}</Text>
              </View>
              <Text style={{color:"#888888",fontWeight:400,marginTop:8}}>{formatDateTime(item.createTime)}</Text>
              <View style={{flexDirection:"row",justifyContent:"space-between",marginTop:8,alignItems:"center"}}>
                <Text style={{color:"#888888",fontWeight:400}}>#{item.billId}</Text>
                <View style={{backgroundColor:"rgba(39, 174, 96, 0.1)",borderRadius:8,borderWidth:1,borderColor:"#27AE60"}}>
                  <Text style={{color:"#27AE60",paddingVertical:4,paddingHorizontal:8}}>Đã thanh toán</Text>
                </View>
              </View>
              <View style={{marginTop:16,borderBottomWidth:1,borderBottomColor:"#ddd",borderStyle:"dashed"}}/>
              <View style={{flexDirection:"row",justifyContent:"space-between",marginVertical:8}}>
                <Text style={{fontSize:16,color:"#000",fontWeight:500}}>Tổng cộng</Text>
                <Text style={{fontSize:16,color:"#1E6F5C",fontWeight:500}}>{formatTotal(item.total)}đ</Text>
              </View>
              </TouchableOpacity>
            </View>
          )}
        />

    </View>
  )
}

export default OrderList;
