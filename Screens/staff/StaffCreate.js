import React, { useCallback, useState } from "react";
import { View, TouchableOpacity, Modal, FlatList, StyleSheet, Text, ToastAndroid, Keyboard ,TouchableWithoutFeedback} from "react-native";
import Input from "../../Component/Input";
import RowItemAction from "../../Component/RowItemAction";
import { DATABASE, get, ref, set } from "../../fireBaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import RadioButton from "../../Component/RadioButton";
import ButtonBottom from "../../Component/ButtonBottom";
import generateID from "../../Component/generateID";

const StaffCreate = (props) => {
  const [roleStaffs, setRoleStaffs] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [roleStaffId, setRoleStaffId] = useState(null);
  const [roleStaffName, setRoleStaffName] = useState("Chọn vai trò");
  const [staffName,setStaffName] = useState("");
  const [staffPhone,setStaffPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [staffs, setStaffs] = useState([]);

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

  useFocusEffect(
    useCallback(() => {
      FetchStaffRole();
      fetchStaffs();
    }, [FetchStaffRole,fetchStaffs])
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
    return staffs.some(staff => staff.staffPhone === newStaffPhone && staff.staffId !== id
    );
  };
  const handleStaffCreate = async () => {
    if (!validateInput()) return;
    if (isStaffPhoneDuplicate(staffPhone,null)) {
      ToastAndroid.show("Số điện thoại đã tồn tại, vui lòng nhập số khác.", ToastAndroid.LONG);
      return;
    }
    const staffId = generateID();
    const newStaff = {staffId,staffName,staffPhone,roleStaffId,roleStaffName}
    try {
      const staffRef = ref(DATABASE, "staff/" + staffId);
      await set(staffRef, newStaff);
      console.log("Them Nhan Vien Thanh Cong !");
      ToastAndroid.show("Thêm nhân viên thành công", ToastAndroid.LONG);
      // props.route.params.onCreateSuccess(newStaff);
      props.navigation.goBack();
    } catch (err) {
      console.error("Error: " + err);
    }
  }

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
      </View>
      <ButtonBottom cancelLabel={"Hủy"} confirmLabel = "Đồng ý" onCancel={() => props.navigation.goBack()} onConfirm={handleStaffCreate}/>
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

export default StaffCreate;

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
