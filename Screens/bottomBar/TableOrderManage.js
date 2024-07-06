import React, { useCallback, useState } from "react";
import { DATABASE, get, ref } from "../../fireBaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import LoadingSkeleton from "../../Component/LoadingSkeleton";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import AreaComponent from "../../Component/AreaComponent";
import ImgEmpty from "../../assets/images/Emty.png";

const TableOrderManage = (props) => {
  const [listFloor, setListFloor] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState("ALL");

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

  const getButtonStyle = (section) => ({
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1E6F5C",
    alignItems: "center",
    width: 100,
    padding: 6,
    backgroundColor: selected === section ? "#1E6F5C" : "#fff",
  });

  const getTextStyle = (section) => ({
    color: selected === section ? "#fff" : "#1E6F5C",
  });

  return (
    <LoadingSkeleton showContent={!isLoading}>
      <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", marginTop: 24, paddingHorizontal: 16 }}>
            <TouchableOpacity style={getButtonStyle("ALL")} onPress={() => setSelected("ALL")}>
              <Text style={getTextStyle("ALL")}>Tất cả</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[{ marginLeft: 8},getButtonStyle("BOOK")]} onPress={() => {setSelected("BOOK"),props.navigation.navigate("ScheduleBook")}}>
              <Text style={getTextStyle("BOOK")}>Đặt trước</Text>
            </TouchableOpacity>
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
                      props.navigation.navigate("TableOrderUsed", {
                        floor: item,
                        tableDetail,
                      });
                    } else {
                    props.navigation.navigate("TableOrderManageDetail", {
                      floor: item,
                      tableDetail,
                    });
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
};

export default TableOrderManage;
