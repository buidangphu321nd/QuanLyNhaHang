import React, { useCallback, useState } from "react";
import { DATABASE, get, ref,set } from "../../fireBaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import LoadingSkeleton from "../../Component/LoadingSkeleton";
import { FlatList, Image, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import AreaComponent from "../../Component/AreaComponent";
import ImgEmpty from "../../assets/images/Emty.png";
const TableChange = (props) => {
  const [listFloor, setListFloor] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState("ALL");
  const tableId = props.route.params.tableId;
  console.log("TableId: ",tableId);
  const {handlePress} = props.route.params;

  const fetchFloors = useCallback(async () => {
    try {
      setIsLoading(true);
      const floorsRef = ref(DATABASE, "floor");
      const snapshot = await get(floorsRef);
      if (snapshot.exists()) {
        const floorsData = snapshot.val();
        const floorsArray = Object.keys(floorsData).map(key => ({
          floorId: key,
          ...floorsData[key],
        }));
        setListFloor(floorsArray);
      } else {
        console.log("No floors data available");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching floors: ", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchFloors();
    }, [fetchFloors]),
  );

  console.log("Floor: ", listFloor);

  const handleUpdate = async (tableDetail) => {
    const updateTable = {
      tableName: tableDetail.tableName,
      tableSlots: tableDetail.tableSlots,
      statusTable: "USING",
      floorId: tableDetail.floorId,
      floorName: tableDetail.floorName,
    };
    const tableRef = ref(DATABASE, `tables/${tableDetail.tableId}`);
    try {
      await set(tableRef, updateTable);
      console.log("Table status updated successfully");
    } catch (error) {
      console.error("Failed to update table status:", error);
    }
  };

  const handleTableTransfer = async (targetTableId) => {
    const currentOrderRef = ref(DATABASE, `orders/${tableId}`);
    const targetOrderRef = ref(DATABASE, `orders/${targetTableId}`);

    try {
      // Lấy order hiện tại
      const snapshot = await get(currentOrderRef);
      if (snapshot.exists()) {
        const currentOrderData = snapshot.val();

        // Sao chép dữ liệu order sang bàn mới
        await set(targetOrderRef, currentOrderData);

        // Xóa order từ bàn cũ
        await set(currentOrderRef, null);

        // Thực thi hàm handlePress để cập nhật trạng thái bàn cũ
        await handlePress();

        ToastAndroid.show("Chuyển bàn thành công!", ToastAndroid.LONG);
      } else {
        ToastAndroid.show("Không tìm thấy order ở bàn hiện tại.", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Error transferring table orders:", error);
      ToastAndroid.show("Lỗi khi chuyển bàn.", ToastAndroid.SHORT);
    }
  }
  return (
    <LoadingSkeleton showContent={!isLoading}>
      <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
        <View style={{ flex: 1 }}>
          <View style={{paddingHorizontal:16,marginVertical:16}}>
            <Text style={{color:"#000000"}}>Chọn bàn muốn chuyển đến </Text>
            <Text style={{color:"#000000",marginTop:8}}>(Chỉ được chọn bàn chưa dùng) </Text>
          </View>
          {listFloor.length > 0 ? (
            <FlatList
              data={listFloor}
              renderItem={({ item }) => (
                <AreaComponent
                  floor={item}
                  navigation={props.navigation}
                  showStatus={true}
                  action={(tableDetail) => {
                    if (tableDetail.statusTable === "USING") {
                      ToastAndroid.show("Vui lòng chọn bàn chưa sử dụng !",ToastAndroid.LONG);
                    } else {
                      console.log("Press ", tableDetail.tableId);
                      handleTableTransfer(tableDetail.tableId);
                      handleUpdate(tableDetail);
                     //Thực thi chuyển dữ liệu sang bàn mới
                    }
                  }}
                />
              )}
              ListFooterComponent={<View style={{ height: 50 }} />}
            />
          ) : (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Image source={ImgEmpty} resizeMode={"contain"} />
              <Text style={{ fontSize: 18, color: "#888888" }}>Không có dữ liệu</Text>
            </View>
          )}
        </View>
      </View>
    </LoadingSkeleton>
  );
}

export default TableChange;
