import React, { useState, useEffect, useCallback } from "react";
import { View, TouchableOpacity, Text, TouchableWithoutFeedback, Keyboard, ToastAndroid,Alert } from "react-native";
import Input from "../../Component/Input";
import TrashIcon from "../../assets/images/svg/Trash.svg"
import ButtonBottom from "../../Component/ButtonBottom";
import RowItem from "../../Component/RowItem";
import { DATABASE, ref, set, remove, get } from "../../fireBaseConfig";
import { useFocusEffect } from "@react-navigation/native";

const TableDetail = (props) => {
  const [tableDetail,setTableDetail] = useState({});
  const [listTables,setListTables] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setTableDetail(props.route.params.tableDetail);
  }, [props.route.params.tableDetail]);
  console.log("Table Detail: ",tableDetail)

  const fetchTables = useCallback(async () => {
    try {
      const tablesRef = ref(DATABASE, 'tables');
      const snapshot = await get(tablesRef);
      if (snapshot.exists()) {
        const tablesData = snapshot.val();
        const tablesArray = Object.keys(tablesData).map(key => ({
          tableId: key,
          ...tablesData[key],
        }));

        setListTables(tablesArray);
      } else {
        console.log("No data available");
      }
    } catch (error) {
      console.error("Error fetching tables: ", error);
    }
  }, []);


  useFocusEffect(
    useCallback(() => {
      fetchTables();
    }, [fetchTables])
  );

  const validate = () => {
    let valid = true;
    let errors = {};

    if (!tableDetail.tableName.trim()) {
      errors.tableName = "Vui lòng nhập tên bàn";
      valid = false;
    }

    if (!tableDetail.tableSlots.trim()) {
      errors.tableSlots = "Vui lòng nhập số ghế";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const isTableNameDuplicate = (newTableName, currentTableId, tables) => {
    return tables.some(table =>
      table.tableName.toLowerCase() === newTableName.toLowerCase() && table.tableId !== currentTableId
    );
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    if (isTableNameDuplicate(tableDetail.tableName, tableDetail.tableId, listTables)) {
      ToastAndroid.show("Tên bàn đã tồn tại trong khu vực, vui lòng chọn tên khác.", ToastAndroid.LONG);
      return;
    }

    try {
      const tableRef = ref(DATABASE,`tables/${tableDetail.tableId}`);
      await set(tableRef,tableDetail);
      ToastAndroid.show("Cập nhật bàn thành công", ToastAndroid.SHORT);
      props.navigation.goBack();
    } catch (err) {
      console.error("Lỗi update: ",err)
    }

  }

  const handleDelete = async () => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa bàn này không?",
      [
        {
          text: "Hủy",
          onPress: () => console.log("Hủy xóa"),
          style: "cancel"
        },
        {
          text: "Xóa",
          onPress: async () => {
            try {
              const tableRef = ref(DATABASE, `tables/${tableDetail.tableId}`);
              await remove(tableRef);
              ToastAndroid.show("Xóa bàn thành công", ToastAndroid.SHORT);
              props.navigation.goBack();
            } catch (error) {
              console.error("Lỗi khi xóa bàn: ", error);
              ToastAndroid.show("Không thể xóa bàn", ToastAndroid.SHORT);
            }
          },
          style: "destructive"
        }
      ],
      { cancelable: false }
    );
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={{flex:1,backgroundColor:"#fff"}}>
      <View style={{flex:1,marginTop:16}}>
        <RowItem description={"Khu vực"} value={tableDetail.floorName} style={{paddingHorizontal:16}}/>
        <Input
          title={"Tên Bàn"}
          value={tableDetail.tableName}
          onChangeText={(text) => setTableDetail({...tableDetail, tableName: text})}
          errors={errors.tableName}
        />
        <Input
          title={"Số ghế"}
          value={tableDetail.tableSlots}
          keyboardType={"numeric"}
          onChangeText={(text) => setTableDetail({...tableDetail, tableSlots: text})}
          errors={errors.tableSlots}
        />
        <TouchableOpacity
          onPress={handleDelete}
          style={{ flexDirection: 'row', marginTop: 16, marginHorizontal: 16 ,alignItems:"center"}}>
          <TrashIcon width={24} height={24} />
          <Text style={{ color: "#E41717", marginLeft: 12 ,fontSize:14}}>
            Xóa bàn
          </Text>
        </TouchableOpacity>
      </View>
      <ButtonBottom confirmLabel={"Lưu"} cancelLabel={"Hủy"} onCancel={() => props.navigation.goBack()} onConfirm={handleUpdate}/>
    </View>
    </TouchableWithoutFeedback>
  )
};

export default TableDetail;
