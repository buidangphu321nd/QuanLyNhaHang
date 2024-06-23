import React,{useState,useEffect} from "react";
import { Text, TouchableWithoutFeedback, Keyboard, View, ToastAndroid } from "react-native";
import RowItemAction from "../../Component/RowItemAction";
import Input from "../../Component/Input";
import ButtonBottom from "../../Component/ButtonBottom";
import { DATABASE, ref, set, push } from "../../fireBaseConfig";
import generateID from "../../Component/generateID";

const TableCreate = (props) => {
  const [tableName, setTableName] = useState("");
  const [tableSlots, setTableSlots] = useState("");
  const [floor, setFloor] = useState({});
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (props.route.params?.selectedFloor) {
      setFloor(props.route.params.selectedFloor);
    }
  }, [props.route.params?.selectedFloor]);
  console.log("SelectedFloor: ",floor)

  const validate = () => {
    let valid = true;
    let errors = {};

    if (!tableName.trim()) {
      errors.tableName = "Vui lòng nhập tên bàn";
      valid = false;
    }

    if (!tableSlots.trim()) {
      errors.tableSlots = "Vui lòng nhập số ghế";
      valid = false;
    }

    if (!floor.floorId) {
      ToastAndroid.show("Vui Lòng Chọn Khu Vực", ToastAndroid.LONG);
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  // const isTableNameDuplicate = (newTableName, currentTableId, tables) => {
  //   return tables.some(table =>
  //     table.tableName.toLowerCase() === newTableName.toLowerCase() && table.tableId !== currentTableId
  //   );
  // };

  const handleConfirm = async () => {
    if (!validate()) {
      return;
    }
    try {
      const tableId = generateID();
      const newTable = {
        tableId,
        tableName,
        tableSlots,
        floorId: floor.floorId,
        floorName: floor.floorName,
      }
      const tableRef = ref(DATABASE,'tables/'+tableId);
      await set (tableRef,newTable);
      console.log("Table add successfully");
      ToastAndroid.show("Thêm bàn thành công", ToastAndroid.LONG);
      props.navigation.goBack();
    } catch (err) {
      console.error("Error adding table: ",err)
    }
  }
  const navigateAreaManage = () => {
    props.navigation.navigate("ManageArea",{mode: "select"});
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ flex: 1, marginTop: 16 }}>
          <RowItemAction value={floor.floorName ? floor.floorName : "Chọn khu vực"}
                         style={{ marginHorizontal: 16 }}
                         description={"Khu vực"}
                         onPress={navigateAreaManage}
          />
          <Input title={"Tên bàn"} placeholder={"Ví dụ: Bàn 1"} value={tableName} onChangeText={(text) => setTableName(text)} errors={errors.tableName}/>
          <Input title={"Số ghế"} placeholder={"Nhập số ghế"} value={tableSlots} onChangeText={(text) => setTableSlots(text)} keyboardType="numeric" errors={errors.tableSlots}/>
        </View>
        <ButtonBottom cancelLabel={"Hủy"} onCancel={() => props.navigation.goBack()} confirmLabel={"Đồng ý"} onConfirm={handleConfirm} />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default TableCreate;
