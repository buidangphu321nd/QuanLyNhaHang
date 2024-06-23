import React, { useCallback, useState } from "react";
import { Keyboard, SectionList, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import ButtonBottom from "../../Component/ButtonBottom";
import RowItemAction from "../../Component/RowItemAction";
import RowItem from "../../Component/RowItem";
import ModalBottom from "../../Component/ModalBottom";
import { DATABASE, get, ref } from "../../fireBaseConfig";
import { useFocusEffect } from "@react-navigation/native";

const ScheduleBook = (props) => {
  const [isModalTable,setIsModalTable] = useState(false);
  const [isModalTime,setIsModalTime] = useState(false);
  const [floors,setFloors] = useState([]);
  const [tables,setTables] = useState([]);
  const [selectedTableName, setSelectedTableName] = useState("Chọn bàn");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const fetchFloors = useCallback(async () => {
    try {
      const floorsRef = ref(DATABASE, 'floor');
      const snapshot = await get(floorsRef);
      if (snapshot.exists()) {
        const floorsData = snapshot.val();
        const floorsArray = Object.keys(floorsData).map(key => ({
          floorId: key,
          ...floorsData[key],
        }));
        setFloors(floorsArray);

      } else {
        console.log("No floors data available");
      }
    } catch (error) {
      console.error("Error fetching floors: ", error);
    }
  },[]);

  const fetchTables = useCallback(async () => {
    try {
      const tablesRef = ref(DATABASE, 'tables');
      const snapshot = await get(tablesRef);
      if (snapshot.exists()) {
        const tablesData = snapshot.val();
        const floors = {};
        const allTablesTemp = [];

        Object.keys(tablesData).forEach(key => {
          const { floorId, floorName, tableName, tableId, tableSlots } = tablesData[key];
          if (!floors[floorId]) {
            floors[floorId] = {
              title: floorName,
              id: floorId,
              data: []
            };
          }
          floors[floorId].data.push({
            name: tableName,
            id: tableId,
          });
          // allTablesTemp.push({ floorId, floorName, tableName, tableId, tableSlots });
        });

        const formattedData = Object.values(floors);
        setTables(formattedData);

      } else {
        console.log("No data available");
      }
    } catch (error) {
      console.error("Error fetching tables: ", error);
    }
  }, []);



  useFocusEffect(
    useCallback(() => {
      fetchFloors();
      fetchTables();
    }, [fetchFloors,fetchTables])
  );

  console.log("List floors: ",floors);
  console.log("List tables: ",tables);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
  <View style={{flex:1,backgroundColor:"#fff"}}>
    <View style={{flex:1,paddingTop:16}}>
      <RowItemAction description={"Bàn"} value={selectedTableName} style={{marginHorizontal:16}} onPress={() => setIsModalTable(true)} />
      <RowItemAction description={"Thời gian"} value={"Chọn thời gian"} style={{marginHorizontal:16}} onPress={() => setIsModalTime(true)}/>
      <RowItemAction description={"Khách hàng"} value={"Chọn khách hàng"} style={{marginHorizontal:16}} />
      <View style={{margin:16}}>
        <Text style={{color:"#292929"}}>Ghi chú</Text>
        <TextInput
          style={{borderWidth:1,borderColor:"#DDDDDD",borderRadius:8,minHeight:100,padding:8,color:"#292929"}}
          placeholder={"Nhập ghi chú"}
          placeholderTextColor={"#888888"}
          textAlignVertical={'top'}
          multiline={true}
        />
      </View>

      <ModalBottom
        title={"Chọn bàn"}
        visible={isModalTable}
        setVisible={setIsModalTable}
      >

        <SectionList
          sections={tables}
          keyExtractor={(item, index) => item.id + index}
          renderItem={({item, section}) => (

            <RowItemAction
              value={item.name}
              onPress={() => {
                setSelectedTableName(item.name);
                setIsModalTable(false);
              }}
              style={{marginLeft: 48, marginRight: 16}}
            />
          )}
          renderSectionHeader={({section}) => (
            <RowItem
              value={section.title}
              onPress={() => {}}
              style={{paddingHorizontal: 16}}
            />
          )}
        />
        <ButtonBottom confirmLabel={"Đóng"} onConfirm={() => setIsModalTable(false)}/>
      </ModalBottom>
      <ModalBottom
        title={"Chọn thời gian"}
        visible={isModalTime}
        setVisible={setIsModalTime}
      >
        <RowItemAction
          description={"Chọn ngày"}
          value={date.toLocaleDateString()}
          style={{marginHorizontal: 16}}
          // onPress={() => setShowDatePicker(true)}
        />


        <RowItemAction
          description={"Chọn giờ"}
          value={time.toLocaleTimeString()}
          style={{marginHorizontal: 16}}
          // onPress={() => setShowTimePicker(true)}
        />

        <ButtonBottom confirmLabel={"Đồng ý"}/>
      </ModalBottom>
    </View>
    <ButtonBottom confirmLabel={"Đồng ý"} cancelLabel={"Hủy"}/>
  </View>
    </TouchableWithoutFeedback>
  )
}

export default ScheduleBook;
