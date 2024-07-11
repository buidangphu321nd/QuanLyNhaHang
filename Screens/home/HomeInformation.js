import React, { useState } from "react";
import { Text, ToastAndroid, View } from "react-native";
import Input from "../../Component/Input";
import ButtonBottom from "../../Component/ButtonBottom";
import { DATABASE, get, ref, set } from "../../fireBaseConfig";
import generateID from "../../Component/generateID";

const HomeInformation = (props) => {
  const [shopName,setShopName] = useState("");
  const [shopPhone,setShopPhone] = useState("");
  const [shopAddress,setShopAddress] = useState("");

  const handleConfirm = async () => {

    const shopId = generateID();
    const newStaff = {shopId,shopName,shopPhone,shopAddress}
    try {
      const staffRef = ref(DATABASE, "staff/" + staffId);
      await set(staffRef, newStaff);
      console.log("Them Nhan Vien Thanh Cong !");
      ToastAndroid.show("Thêm nhân viên thành công", ToastAndroid.LONG);
      // props.route.params.onCreateSuccess(newStaff);
      props.navigation.goBack();
    } catch (err) {
      console.error("Error: " + err);
    }
  }
  return (
    <View style={{flex:1,backgroundColor:"#fafafa"}}>
      <View style={{flex:1}}>
        <Text style={{color:"#000",fontWeight:400,fontSize:16,marginVertical:16,paddingHorizontal:16}}>Thông tin cơ bản</Text>
        <View style={{backgroundColor:"#fff"}}>
          <Input
            title={"Tên cửa hàng"}
            placeholder={"Nhập tên cửa hàng"}
            onChangeText={(text) => setShopName(text)}
            value={shopName}
          />
          <Input
            title={"Số điện thoại"}
            placeholder={"Nhập số điện thoại"}
            onChangeText={(text) => setShopPhone(text)}
            value={shopPhone}
          />
          <Input
            title={"Địa chỉ"}
            placeholder={"Nhập địa chỉ"}
            onChangeText={(text) => setShopAddress(text)}
            value={shopAddress}
          />
        </View>
      </View>
      <ButtonBottom confirmLabel={"Xác nhận"} cancelLabel={"Đăng xuất"}/>
    </View>
  )
}

export default HomeInformation;
