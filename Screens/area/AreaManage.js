import React, { useEffect, useState } from "react";
import { FlatList, Text, ToastAndroid, View, Image, TouchableOpacity, Alert } from "react-native";
import ButtonBottom from "../../Component/ButtonBottom";
import ModalBottom from "../../Component/ModalBottom";
import Input from "../../Component/Input";
import { DATABASE, get, ref, set,remove } from "../../fireBaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingSkeleton from "../../Component/LoadingSkeleton";
import ImgEmpty from "../../assets/images/Emty.png";
import RowItemAction from "../../Component/RowItemAction";
import generateID from "../../Component/generateID";


const AreaManage = ({ route,navigation }) => {

  const mode = route.params?.mode;
  console.log("--> Mode: ",mode);
  const [floorName, setFloorName] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentId, setCurrentId] = useState(1);
  const [allIds, setAllIds] = useState([]);
  const [previousId, setPreviousId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [floors, setFloors] = useState([]);
  const [checkEdit, setCheckEdit] = useState(false);



  const validateInput = () => {
    let isValid = true;
    let errors = {};

    if (!floorName.trim()) {
      errors.floorName = "Bắt buộc nhập khu vực";
      isValid = false;
    }
    setErrors(errors);
    return isValid;
  };

  const isFloorNameDuplicate = (name, id) => {
    return floors.some(floor => floor.floorName.toLowerCase() === name.toLowerCase() && floor.floorId !== id);
  };



  const handleCreateorUpdate = async () => {
    if (!validateInput()) return;

    // Kiểm tra tên tầng có trùng không
    if (isFloorNameDuplicate(floorName, checkEdit ? currentId : null)) {
      ToastAndroid.show("Tên khu vực đã tồn tại, vui lòng chọn tên khác.", ToastAndroid.LONG);
      return;
    }


    const floorId = checkEdit ? currentId : generateID().toString();
    const newFloor = { floorId, floorName };
    try {
      const floorRef = ref(DATABASE, "floor/" + floorId);
      await set(floorRef, newFloor);
      const message = checkEdit ? "Cập nhật khu vực thành công!" : "Thêm khu vực thành công!";
      console.log(message);
      ToastAndroid.show(message, ToastAndroid.LONG);
      if (checkEdit) {
        // Cập nhật khu vực hiện có
        const updatedFloors = floors.map(f => f.floorId === floorId ? newFloor : f);
        setFloors(updatedFloors);
      } else {
        // Thêm khu vực mới
        setFloors([...floors, newFloor]);
      }
      setIsModal(false);
      setFloorName("");
    } catch (err) {
      console.error("Error: " + err);
    }
  };

  useEffect(() => {
    const FetchFloor = async () => {
      setIsLoading(true);
      try {
        const floorRef = ref(DATABASE, "floor");
        const snapshot = await get(floorRef);
        const data = snapshot.val();
        if (data) {
          const floorArray = Object.keys(data).map(key => ({
            floorId: key,
            ...data[key],
          }));
          setFloors(floorArray);
        }
      } catch (err) {
        console.error("Error: ", err);
      }
      setIsLoading(false);
    };
    FetchFloor();
  }, []);
  console.log("Floor: ", floors);

  const handleFloor = (floor) => {
    if (mode === "edit") {
      console.log("Selected Floor Name:", floor.floorName);
      setCheckEdit(true);
      setIsModal(true);
      setCurrentId(floor.floorId);
      setFloorName(floor.floorName);
    } else if (mode === "select") {
      navigation.navigate("TableCreate",{selectedFloor:floor});
    }
  }

  const confirmDelete = () => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa khu vực này không?",
      [
        {
          text: "Hủy",
          onPress: () => setIsModal(false),
          style: "cancel"
        },
        {
          text: "Đồng ý", onPress: async () => {
            try {
              // Xóa khu vực từ Firebase
              const floorRef = ref(DATABASE, `floor/${currentId}`);
              await remove(floorRef);
              console.log("Khu vực đã được xóa từ Firebase");

              // Cập nhật state để phản ánh sự thay đổi trên giao diện người dùng
              const updatedFloors = floors.filter(floor => floor.floorId !== currentId);
              setFloors(updatedFloors);

              ToastAndroid.show("Khu vực đã được xóa.", ToastAndroid.SHORT);
            } catch (error) {
              console.error("Lỗi khi xóa khu vực: ", error);
              ToastAndroid.show("Không thể xóa khu vực.", ToastAndroid.SHORT);
            }

            setIsModal(false);
            setFloorName(""); // Xóa tên khu vực đã xóa khỏi state
          }
        }
      ],
      { cancelable: false }
    )
  };

  const renderItem = ({ item }) => {
    return <RowItemAction valueStyle={{ color: "#292929" }}
                          style={{ marginHorizontal: 16 }}
                          value={item?.floorName}
                          onPress={() => handleFloor(item)} />;
  };
  return (
    <LoadingSkeleton showContent={!isLoading}>
      <View style={{ flex: 1 }}>
        {floors.length > 0 ?
          <FlatList data={floors} renderItem={renderItem} style={{ flex: 1 }} /> : (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Image source={ImgEmpty} resizeMode={"contain"} />
              <Text style={{ fontSize: 18, color: "#888888" }}>Không có dữ liệu</Text>
            </View>)}

        <ButtonBottom confirmLabel={"Thêm Khu Vực"} onConfirm={() => {setIsModal(true),setCheckEdit(false)}} />
        <ModalBottom
          visible={isModal}
          title={checkEdit ?"Sửa khu vực" : "Thêm khu vực"}
          setVisible={(isVisible) => {
            setIsModal(isVisible);
            if (!isVisible) {
              setFloorName("");
              setCheckEdit(false);
            }
          }}
        >
          <Input title={"Nhập khu vực"} placeholder={"Ví dụ: Tầng 1"} onChangeText={(text) => setFloorName(text)}
                 errors={errors.floorName} value={floorName}/>
          {checkEdit &&
            <TouchableOpacity
            onPress={confirmDelete}
            style={{padding:4,marginVertical:28}}>
            <Text style={{color:"#E41717",textAlign:'center',fontSize:14}}>
              Xóa khu vực
            </Text>
          </TouchableOpacity>}
          <ButtonBottom confirmLabel={"Đồng ý"} cancelLabel="Hủy" onCancel={() => {setIsModal(false),setFloorName("")}}
                        onConfirm={handleCreateorUpdate} />
        </ModalBottom>
      </View>
    </LoadingSkeleton>
  );
};

export default AreaManage;
