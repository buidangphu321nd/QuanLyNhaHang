import React, { useState,useEffect } from "react";
import {Keyboard, Text, ToastAndroid, TouchableWithoutFeedback, View} from "react-native";
import Input from "../../Component/Input";
import ButtonBottom from "../../Component/ButtonBottom";
import { DATABASE, get, ref, set } from "../../fireBaseConfig";
import generateID from "../../Component/generateID";

const HomeInformation = (props) => {
  const [shopName,setShopName] = useState("");
  const [shopPhone,setShopPhone] = useState("");
  const [shopAddress,setShopAddress] = useState("");

  const { shopId } = props.route.params;
  const [isNewShop, setIsNewShop] = useState(false);

  useEffect(() => {
    if (shopId) {
      fetchShopInfo(shopId);
    } else {
      setIsNewShop(true);
    }
  }, [shopId]);

  const fetchShopInfo = async (shopId) => {
    try {
      const shopRef = ref(DATABASE, `shop/${shopId}`);
      const snapshot = await get(shopRef);
      const data = snapshot.val();
      if (data) {
        setShopName(data.shopName);
        setShopPhone(data.shopPhone);
        setShopAddress(data.shopAddress);
      } else {
        setIsNewShop(true);
      }
    } catch (err) {
      console.error("Error fetching shop info: ", err);
    }
  };

  const handleConfirm = async () => {
    const newShopId = isNewShop ? generateID() : shopId;
    const newShop = { shopId: newShopId, shopName, shopPhone, shopAddress };

    try {
      const shopRef = ref(DATABASE, `shop/${newShopId}`);
      await set(shopRef, newShop);
      console.log("Thêm/Cập nhật thông tin thành công!");
      ToastAndroid.show("Thêm/Cập nhật thông tin shop thành công", ToastAndroid.LONG);
      props.navigation.goBack();
    } catch (err) {
      console.error("Error: " + err);
    }
  };
  return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
      <ButtonBottom confirmLabel={"Xác nhận"} cancelLabel={"Đăng xuất"} onConfirm={handleConfirm} />
    </View>
      </TouchableWithoutFeedback>
  )
}

export default HomeInformation;
