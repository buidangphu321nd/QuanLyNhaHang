import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import RowItemAction from "../../Component/RowItemAction";
import ButtonBottom from "../../Component/ButtonBottom";
import ImgEmpty from "../../assets/images/Emty.png";
import { DATABASE, ref, set } from "../../fireBaseConfig";

const TableOrderUsed = (props) => {
  const [tableDetail, setTableDetail] = useState({});
  useEffect(() => {
    setTableDetail(props.route.params.tableDetail);
  }, [props.route.params.tableDetail]);
  console.log("Table Detail: ", tableDetail);
  const handlePress = async () => {
    const updateTable = {
      tableName: tableDetail.tableName,
      tableSlots: tableDetail.tableSlots,
      statusTable: "",
      floorId: tableDetail.floorId,
      floorName: tableDetail.floorName,
    };
    const tableRef = ref(DATABASE, `tables/${tableDetail.tableId}`);
    try {
      await set(tableRef, updateTable);
      console.log("Table status updated successfully");
      props.navigation.goBack();
    } catch (error) {
      console.error("Failed to update table status:", error);
    }

  };
  return (
    <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <View style={{ flex: 1, marginTop: 16 }}>
        <Text style={{ color: "#292929", fontSize: 16, fontWeight: 400, paddingHorizontal: 16 }}>Thông tin khách
          hàng</Text>
        <RowItemAction
          value={"Chọn khách hàng"}
          description={"Khách hàng"}
          style={{ marginTop: 16, paddingHorizontal: 16, backgroundColor: "#fff" }}
          borderWidth={0}
          onPress={() => {
          }}
        />
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 16,
          paddingHorizontal: 16,
          alignItems: "center",
        }}>
          <Text style={{ color: "#292929", fontSize: 16, fontWeight: 400 }}>Danh sách món đã gọi</Text>
          <TouchableOpacity>
            <Text style={{ color: "#1E6F5C", fontSize: 14, fontWeight: 400 }}>+ Gọi thêm món</Text>
          </TouchableOpacity>
        </View>

        <View style={{ backgroundColor: "#fff", marginVertical: 16, alignItems: "center" }}>
          <View style={{ alignItems: "center", marginTop: 16 }}>
            <Image source={ImgEmpty} resizeMode={"contain"} />
            <Text style={{ fontSize: 18, color: "#888888" }}>Không có dữ liệu</Text>
          </View>
          <TouchableOpacity style={{ width: 200, backgroundColor: "#1E6F5C", marginVertical: 16, borderRadius: 8 }}
                            onPress={() => props.navigation.navigate("TableOrderMenu",{tableId:tableDetail.tableId})}>
            <Text style={{ color: "#fff", fontSize: 14, textAlign: "center", padding: 16 }}>Gọi món</Text>
          </TouchableOpacity>
        </View>

      </View>
      <ButtonBottom confirmLabel={"Hủy Bàn"} cancelLabel={"Chuyển bàn"} onConfirm={handlePress} />
    </View>
  );
};

export default TableOrderUsed;
