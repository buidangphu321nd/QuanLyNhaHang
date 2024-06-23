import React, { useState, useCallback, useEffect } from "react";
import { View ,Text,Image,FlatList} from "react-native";
import ButtonBottom from "../../Component/ButtonBottom";
import TableComponent from "../../Component/TableComponent";
import AreaComponent from "../../Component/AreaComponent";
import { DATABASE, get, ref } from "../../fireBaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import LoadingSkeleton from "../../Component/LoadingSkeleton";
import ImgEmpty from "../../assets/images/Emty.png";

const TableManage = (props) => {
  const [listFloor, setListFloor] = useState([]);
  const [isLoading,setIsLoading] = useState(false)

  const fetchFloors = useCallback(async () => {
    try {
      setIsLoading(true)
      const floorsRef = ref(DATABASE, 'floor');
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
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching floors: ", error);
    }
  },[]);


  useFocusEffect(
    useCallback(() => {
      fetchFloors();
    }, [fetchFloors])
  );
  console.log("Floor: ",listFloor);
  const navToAreaManage = () => {
    props.navigation.navigate("ManageArea",{mode:"edit"})
  }
  const navToTableCreate = () => {
    props.navigation.navigate("TableCreate")
  }
  return (
    <LoadingSkeleton showContent={!isLoading}>
    <View style={{flex:1}}>

        <View style={{ flex: 1 }}>
          {listFloor.length > 0 ? (
          <FlatList
            data={listFloor}
            renderItem={({ item }) => (
              <AreaComponent
                floor={item}
                navigation={props.navigation}
                showStatus={false}
                action={(tableDetail) => {
                  props.navigation.navigate('TableDetail', {
                    floor: item,
                    tableDetail,
                  });
                }}
              />
            )}
            ListFooterComponent={<View style={{ height: 50 }} />}
          />): (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Image source={ImgEmpty} resizeMode={"contain"} />
              <Text style={{ fontSize: 18, color: "#888888" }}>Không có dữ liệu</Text>
            </View>
            )}
          <ButtonBottom
            cancelLabel={'Quản lý Khu vực'}
            onCancel={navToAreaManage}
            confirmLabel={'Thêm bàn'}
            onConfirm={navToTableCreate}
          />
        </View>
    </View>
    </LoadingSkeleton>
  );
}

export default TableManage;
