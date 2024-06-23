import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TextInput, View } from "react-native";
import ButtonBottom from "../../Component/ButtonBottom";
import { DATABASE, get, ref } from "../../fireBaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import LoadingSkeleton from "../../Component/LoadingSkeleton";
import StaffItem from "./StaffItem";
import SvgSearch from "../../assets/images/svg/search.svg";
import ImgEmpty from "../../assets/images/Emty.png";

const Staff = (props) => {
  const [staffs, setStaffs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStaffs, setFilteredStaffs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStaffs = useCallback(async () => {
    setIsLoading(true);
    try {
      const staffRef = ref(DATABASE, "staff"); // Tạo tham chiếu tới node 'customer' trong Firebase
      const snapshot = await get(staffRef); // Lấy dữ liệu từ tham chiếu này
      const data = snapshot.val(); // Trích xuất dữ liệu từ snapshot
      if (data) {
        // Chuyển đổi dữ liệu từ đối tượng thành mảng
        const staffArray = Object.keys(data).map(key => ({
          staffId: key, // Thiết lập customerId từ key
          ...data[key], // Sao chép các thuộc tính còn lại của khách hàng
        }));
        setStaffs(staffArray);
        setFilteredStaffs(staffArray);
      }
    } catch (err) {
      console.error("Error: ", err);
    }
    setIsLoading(false);
  },[]);

  useFocusEffect(
    useCallback(() => {
      fetchStaffs();
    }, [fetchStaffs])
  );
  console.log("List Staffs: ",staffs);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredStaffs(staffs);
    } else {
      const filteredData = staffs.filter(staff =>
        staff.staffName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredStaffs(filteredData);
    }
  }, [searchQuery, staffs]);

  const renderItem = ({ item, index }) => {
    return (
      <StaffItem item={item} index={index} onPress={() => props.navigation.navigate("StaffDetail",{staffId: item.staffId})} />
    );
  };
  return (
    <LoadingSkeleton showContent={!isLoading}>
    <View style={{flex:1,backgroundColor:"#fff"}}>
      <SvgSearch width={24} height={24} fill={"#1E6F5C"}
                 style={{ position: "absolute", top: 38, left: 34, zIndex: 1 }} />
      <TextInput style={styles.input} placeholder={"Tìm Kiếm"} placeholderTextColor={"#888888"}
                 onChangeText={text => setSearchQuery(text)} />
      {filteredStaffs.length > 0 ?
        <FlatList
          data={filteredStaffs}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        /> : (<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Image source={ImgEmpty} resizeMode={"contain"} />
          <Text style={{ fontSize: 18, color: "#888888" }}>Không có dữ liệu</Text>
        </View>)
      }
      <ButtonBottom
        confirmLabel={"Thêm nhân viên"}
        onConfirm={() => props.navigation.navigate("StaffCreate")}
        cancelLabel={"Vai trò"}
        onCancel={() => props.navigation.navigate("StaffRole")}
      />
    </View>
    </LoadingSkeleton>
  )
}

export default Staff;
const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    margin: 24,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    color: "#292929",
    paddingLeft: 40,
  },
});
