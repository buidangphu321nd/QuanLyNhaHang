import React from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

const Login = () => {
  return (
    <View style={{flex:1,backgroundColor:"#fff"}}>
      <View style={{alignItems:"center",marginTop:32}}>
        <Image source={require("../../assets/images/Login.png")} height={100} width={100}/>
        <Text style={{fontSize:16,fontWeight:500,color:"#1E6F5C",marginTop:16}}> Đăng Nhập</Text>
      </View>
      <View style={{paddingHorizontal:16,marginTop:16}}>
        <TextInput style={{borderWidth:1,borderColor:"#ddd",borderRadius:8}} placeholder={"Nhập email"} placeholderTextColor={"#888888"} />
        <TextInput style={{borderWidth:1,borderColor:"#ddd",borderRadius:8,marginTop:24}} placeholder={"Password"} placeholderTextColor={"#888888"} />
      </View>
      <View style={{alignItems:"center"}}>
        <TouchableOpacity style={{marginTop:24,backgroundColor:"#1E6F5C",width:150,borderRadius:8}}>
          <Text style={{color:"#fff",padding:8,textAlign:"center"}}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Login;
