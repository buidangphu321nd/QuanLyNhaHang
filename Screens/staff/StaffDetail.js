import React, { useCallback, useEffect, useState } from "react";
import { View, TouchableOpacity, Modal, FlatList, StyleSheet, Text, ToastAndroid, Keyboard ,TouchableWithoutFeedback,Alert} from "react-native";
import Input from "../../Component/Input";
import RowItemAction from "../../Component/RowItemAction";
import { DATABASE, get, ref, set,remove  } from "../../fireBaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import RadioButton from "../../Component/RadioButton";
import ButtonBottom from "../../Component/ButtonBottom";
import TrashIcon from "../../assets/images/svg/Trash.svg"

const StaffDetail = (props) => {
  const [roleStaffs, setRoleStaffs] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [roleStaffId, setRoleStaffId] = useState(null);
  const [roleStaffName, setRoleStaffName] = useState("Chọn vai trò");
  const [staffName,setStaffName] = useState("");
  const [staffPhone,setStaffPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [staffs, setStaffs] = useState([]);

  const staffId = props.route.params.staffId;
  console.log("StaffId: ",staffId)

  const FetchStaffRole = useCallback(async () => {
    try {
      const roleStaffRef = ref(DATABASE, "rolestaff");
      const snapshot = await get(roleStaffRef);
      const data = snapshot.val();
      if (data) {
        const roleStaffArray = Object.keys(data).map(key => ({
          roleStaffId: key,
          ...data[key],
        }));
        setRoleStaffs(roleStaffArray);
      }
    } catch (err) {
      console.error("Error: ", err);
    }
  },[]);

  const fetchStaffs = useCallback(async () => {

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
      }
    } catch (err) {
      console.error("Error: ", err);
    }
  },[]);

  const fetchStaffDetails = useCallback(async () => {
    if (staffId) {
      const staffRef = ref(DATABASE, `staff/${staffId}`);
      const snapshot = await get(staffRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setStaffName(data.staffName);
        setStaffPhone(data.staffPhone);
        setRoleStaffId(data.roleStaffId);
        setRoleStaffName(data.roleStaffName || "Chọn vai trò");
      }
    }
  }, [staffId]);

  useFocusEffect(
    useCallback(() => {
      FetchStaffRole();
      fetchStaffs();
      fetchStaffDetails();
    }, [FetchStaffRole,fetchStaffDetails,fetchStaffs])
  );

  console.log("Role Staff: ",roleStaffs)

  const handleSelectRole = (roleStaffId, roleStaffName) => {
    setRoleStaffId(roleStaffId);
    setRoleStaffName(roleStaffName);
    setIsModal(false);
  };

  const renderRoleItem = ({ item }) => (
    <TouchableOpacity style={styles.roleItem} onPress={() => handleSelectRole(item.roleStaffId, item.roleStaffName)}>
      <RadioButton
        checked={roleStaffId === item.roleStaffId}
        onPress={() => handleSelectRole(item.roleStaffId, item.roleStaffName)}
        label={item.roleStaffName}
        labelStyle={styles.roleText}
      />
    </TouchableOpacity>
  );
  console.log("SelectedRole: ",roleStaffId,roleStaffName)

  const validateInput = () => {
    let isValid = true;
    let errors = {};

    // Validate Name
    if (!staffName.trim()) {
      errors.staffName = "Bắt Buộc Nhập Họ Tên";
      isValid = false;
    }

    // Validate Phone
    if ((staffPhone.length !== 10 || !staffPhone.startsWith("0"))) {
      errors.staffPhone = "Vui lòng nhập đúng định dạng số điện thoại";
      isValid = false;
    }

    if (!roleStaffId) {
      ToastAndroid.show("Vui Lòng Chọn Vai Trò", ToastAndroid.LONG);
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };
  const isStaffPhoneDuplicate = (newStaffPhone, id) => {
    return staffs.some(staff =>
      staff.staffPhone === newStaffPhone && staff.staffId !== id
    );
  };
  const handleStaffUpdate = async () => {
    if (!validateInput()) return;
    if (isStaffPhoneDuplicate(staffPhone, staffId)) {
      ToastAndroid.show("Số điện thoại đã tồn tại, vui lòng nhập số khác.", ToastAndroid.LONG);
      return;
    }

    const updatedStaff = {staffName, staffPhone, roleStaffId, roleStaffName};

    try {
      const staffRef = ref(DATABASE, `staff/${staffId}`);
      await set(staffRef, updatedStaff);
      console.log("Cập nhật nhân viên thành công!");
      ToastAndroid.show("Cập nhật nhân viên thành công", ToastAndroid.LONG);
      props.navigation.goBack();
    } catch (err) {
      console.error("Error: " + err);
      ToastAndroid.show("Lỗi khi cập nhật nhân viên.", ToastAndroid.SHORT);
    }
  }

  const handleDeleteStaff = () => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa nhân viên này không?",
      [
        {
          text: "Hủy",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Xóa", onPress: async () => {
            try {
              const staffRef = ref(DATABASE, `staff/${staffId}`);
              await remove(staffRef);
              ToastAndroid.show("Nhân viên đã được xóa.", ToastAndroid.SHORT);
              props.navigation.goBack();
            } catch (error) {
              console.error("Lỗi khi xóa nhân viên: ", error);
              ToastAndroid.show("Không thể xóa nhân viên.", ToastAndroid.SHORT);
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{flex:1}}>
        <View style={{flex:1}}>
          <Input
            title={"Họ Tên"}
            placeholder={"Nhập họ tên nhân viên"}
            isRequired={true}
            onChangeText={(text) => setStaffName(text)}
            errors={errors.staffName}
            value={staffName}
          />
          <Input
            title={"Số điện thoại"}
            placeholder={"Nhập số điện thoại nhân viên"}
            isRequired={true}
            onChangeText={(text) => setStaffPhone(text)}
            errors={errors.staffPhone}
            value={staffPhone}
          />
          <RowItemAction description={"Vai trò"} value={roleStaffName} style={{marginHorizontal: 16}} onPress={() => setIsModal(true)} />
          <TouchableOpacity
            onPress={handleDeleteStaff}
            style={{ flexDirection: 'row', marginTop: 16, marginHorizontal: 16 ,alignItems:"center"}}>
            <TrashIcon width={24} height={24} />
            <Text style={{ color: "#E41717", marginLeft: 12 ,fontSize:14}}>
              Xóa nhân viên
            </Text>
          </TouchableOpacity>
        </View>
        <ButtonBottom cancelLabel={"Hủy"} confirmLabel = "Đồng ý" onCancel={() => props.navigation.goBack()} onConfirm={handleStaffUpdate} />
        <Modal
          transparent={true}
          visible={isModal}
          onRequestClose={() => setIsModal(false)}
        >
          <TouchableOpacity style={styles.modalBackground} onPress={() => setIsModal(false)}>
            <View style={styles.modalContent}>
              <FlatList
                data={roleStaffs}
                keyExtractor={item => item.roleStaffId}
                renderItem={renderRoleItem}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default StaffDetail;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '80%',
    maxHeight: '60%',
    padding: 20,
    borderRadius:8
  },
  roleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  roleText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333'
  }
});

