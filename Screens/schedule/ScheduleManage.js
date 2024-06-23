import React, { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet, ToastAndroid, Alert, Image } from "react-native";
import RowItemAction from "../../Component/RowItemAction";
import ButtonBottom from "../../Component/ButtonBottom";
import { DATABASE, get, ref, remove } from "../../fireBaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import ScheduleItem from "./ScheduleItem";
import LoadingSkeleton from "../../Component/LoadingSkeleton";
import ModalBottom from "../../Component/ModalBottom";
import ImgEmpty from "../../assets/images/Emty.png";


const ScheduleManage = (props) => {
  const [allSchedules, setAllSchedules] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);


  const fetchAllSchedule = useCallback(async () => {
    try {
      const scheduleRef = ref(DATABASE, "schedule");
      const snapshot = await get(scheduleRef);
      if (snapshot.exists()) {
        const schedulesData = snapshot.val();
        const schedulesArray = Object.keys(schedulesData).map(key => ({
          scheduleId: key,
          ...schedulesData[key],
        }));

        setAllSchedules(schedulesArray);
      } else {
        console.log("No data available");
      }
    } catch (error) {
      console.error("Error fetching schedule: ", error);
    }
  }, []);

  const fetchSchedule = useCallback(async () => {
    try {
      setIsLoading(true);

      const scheduleRef = ref(DATABASE, 'schedule/');
      const snapshot = await get(scheduleRef);
      if (snapshot.exists()) {
        const schedulesData = snapshot.val();
        // Lọc dữ liệu dựa trên tableId
        const filteredData = selectedTable && selectedTable.tableId
          ? Object.keys(schedulesData).filter(key => schedulesData[key].tableId === selectedTable.tableId).reduce((acc, key) => {
            acc[key] = schedulesData[key];
            return acc;
          }, {})
          : schedulesData;
        // Biến đổi dữ liệu thành mảng nhóm theo ngày
        const groupedByDate = Object.keys(filteredData).reduce((acc, key) => {
          const date = moment(filteredData[key].arrivalTime).format("YYYY-MM-DD");
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push({ ...filteredData[key], scheduleId: key });
          return acc;
        }, {});

        const schedulesArray = Object.keys(groupedByDate).map(date => ({
          date,
          data: groupedByDate[date],
        }));

        setSchedules(schedulesArray.sort((a, b) => moment(a.date) - moment(b.date))); // Sắp xếp theo ngày

      } else {
        console.log("No data available");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching schedule: ", error);
    }
  }, [selectedTable]);

  useFocusEffect(
    useCallback(() => {
      fetchAllSchedule();
      fetchSchedule();
    }, [fetchAllSchedule, fetchSchedule]),
  );

  console.log("List Schedule: ", allSchedules);


  const handleDelete = async (scheduleId) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn hủy bàn này không?",
      [
        {
          text: "Hủy",
          onPress: () => console.log("Hủy xóa"),
          style: "cancel",
        },
        {
          text: "Xóa",
          onPress: async () => {
            try {
              const scheduleRef = ref(DATABASE, `schedule/${scheduleId}`);
              await remove(scheduleRef);
              // setSchedules(prevSchedules => {
              //   const updatedSchedules = prevSchedules.map(group => ({
              //     ...group,
              //     data: group.data.filter(schedule => schedule.scheduleId !== scheduleId)
              //   })).filter(group => group.data.length > 0);
              //   return updatedSchedules;
              // });
              fetchSchedule();
              ToastAndroid.show("Hủy bàn thành công", ToastAndroid.SHORT);
            } catch (error) {
              console.error("Lỗi khi hủy bàn: ", error);
              ToastAndroid.show("Không thể hủy bàn", ToastAndroid.SHORT);
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: false },
    );
  };
  console.log("Schedule: ", schedules);
  console.log("Selected Table: ", selectedTable);
  return (
    <LoadingSkeleton showContent={!isLoading}>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <RowItemAction
            value={selectedTable ? selectedTable.tableName : "Tất cả"}
            description={"Bàn"}
            style={{ marginTop: 12, paddingHorizontal: 16, backgroundColor: "white" }}
            borderWidth={0}
            onPress={() => setIsModal(true)}
          />
          <ModalBottom
            title={"Chọn chi tiết bàn hoặc tất cả"}
            visible={isModal}
            setVisible={setIsModal}
          >
            <RowItemAction value={"Chọn bàn"} style={{ marginHorizontal: 16, marginTop: 16 }} onPress={() => {
              props.navigation.navigate("ManageTableArea", { setSelectedTable }), setIsModal(false);
            }} />
            <RowItemAction value={"Tất cả"} style={{ marginHorizontal: 16, marginBottom: 50 }} onPress={() => {
              setSelectedTable(null);
              setIsModal(false);
            }} />
          </ModalBottom>
          {schedules.length > 0 ? (
          <FlatList
            data={schedules}
            keyExtractor={(item) => item.date}
            renderItem={({ item }) => (
              <View style={{ marginHorizontal: 16, marginTop: 16 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#292929",
                }}>{moment(item.date).format("dddd, DD/MM/YYYY")}</Text>
                <FlatList
                  data={item.data}
                  keyExtractor={(item) => item.date}
                  renderItem={({ item }) => (
                    <ScheduleItem item={item} onRemoveSchedule={() => handleDelete(item.scheduleId)} />
                  )}
                />
              </View>
            )}
          /> ) : (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Image source={ImgEmpty} resizeMode={"contain"} />
              <Text style={{ fontSize: 18, color: "#888888" }}>Không có dữ liệu</Text>
            </View>
          )}
        </View>
        <ButtonBottom confirmLabel={"Đặt Bàn"} onConfirm={() => props.navigation.navigate("ScheduleBook")} />
      </View>
    </LoadingSkeleton>
  );
};

export default ScheduleManage;

