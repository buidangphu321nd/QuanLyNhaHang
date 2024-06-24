import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Svgimage from "../../assets/images/svg/image-picture-svgrepo-com.svg";

const DishItem = (props) => {
  const {
    item, onPress = () => {
    },
  } = props;
  return (
    <TouchableOpacity onPress={() => onPress()}>
      <View style={{ flexDirection: "row",paddingHorizontal:16,paddingVertical:8 }}>
        {item.dishImage ?
          (
            <View style={{borderWidth:1,borderColor:"#ddd",borderRadius:8,height:64,width:64}}>
              <Image style={{ height: 64, width: 64,borderRadius:8 }} source={{ uri: item.dishImage }} />
            </View>
          ) : (
            <View style={{
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#ddd",
              height: 64,
              width: 64,
              justifyContent: "center",
              alignItems: "center",
            }}>
              <Svgimage width={24} height={24} />
            </View>
          )}
        <View style={{paddingHorizontal:16}}>
          <Text style={{ color: "#292929", fontWeight: "800" ,fontSize:16}}>{item.dishName}</Text>
          <Text style={{ color: "#1E6F5C" ,fontSize:16,marginTop:16}}>{item.dishPrice} đ</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DishItem;
