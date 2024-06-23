import React, { useEffect, useState } from "react";
import { FlatList, Text, ToastAndroid, TouchableOpacity, View, Alert, Image } from "react-native";
import ButtonBottom from "../../Component/ButtonBottom";
import ModalBottom from "../../Component/ModalBottom";
import Input from "../../Component/Input";
import { DATABASE, get, ref, set,remove } from "../../fireBaseConfig";
import generateID from "../../Component/generateID";
import RowItemAction from "../../Component/RowItemAction";
import ImgEmpty from "../../assets/images/Emty.png";
import LoadingSkeleton from "../../Component/LoadingSkeleton";

const StaffRole = () => {
  const [isModal, setIsModal] = useState(false);
  const [checkEdit, setCheckEdit] = useState(false);
  const [roleStaffs, setRoleStaffs] = useState([]);
  const [roleStaffName,setRoleStaffName] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateInput = () => {
    let isValid = true;
    let errors = {};

    if (!roleStaffName.trim()) {
      errors.roleStaffName = "Bắt buộc nhập vai trò";
      isValid = false;
    }
    setErrors(errors);
    return isValid;
  };

  const isRoleStaffNameDuplicate = (name, id) => {
    return roleStaffs.some(roleStaff => roleStaff.roleStaffName.toLowerCase() === name.toLowerCase() && roleStaff.roleStaffId !== id);
  };

  const handleCreateorDelete = async () => {

    if (checkEdit === false) {
      //thêm vai trò
      if (!validateInput()) return;
      if (isRoleStaffNameDuplicate(roleStaffName,null)) {
        ToastAndroid.show("Tên vai trò đã tồn tại, vui lòng nhập tên khác.", ToastAndroid.LONG);
        return;
      }
      const roleStaffId = generateID();
      const newRoleStaff = {roleStaffId,roleStaffName};

      try {
        const RoleStaffRef = ref(DATABASE,"rolestaff/" + roleStaffId);
        await set (RoleStaffRef,newRoleStaff);
        setRoleStaffs(prevRoles => [...prevRoles, { roleStaffId, ...newRoleStaff }]);
        setIsModal(false);
        setRoleStaffName("");
        ToastAndroid.show("Thêm vai trò thành công!", ToastAndroid.LONG);
      }catch (err){
        console.error("Error:",err)
      }
    } else if (checkEdit === true ){
      Alert.alert(
        "Xác nhận xóa",
        "Bạn có chắc chắn muốn xóa vai trò này không?",
        [
          {
            text: "Hủy",
            onPress: () => setIsModal(false),
            style: "cancel"
          },
          {
            text: "Đồng ý", onPress: async () => {
              try {
                const RoleStaffRef = ref(DATABASE, `rolestaff/${selectedRoleId}`);
                await remove(RoleStaffRef);
                console.log("Vai trò đã được xóa từ Firebase");

                // Cập nhật state để phản ánh sự thay đổi trên giao diện người dùng
                setRoleStaffs(roleStaffs.filter(role => role.roleStaffId !== selectedRoleId));

                ToastAndroid.show("Vai trò đã được xóa.", ToastAndroid.SHORT);
              } catch (error) {
                console.error("Lỗi khi xóa vai trò: ", error);
                ToastAndroid.show("Không thể xóa vai trò.", ToastAndroid.SHORT);
              }

              setIsModal(false);
              setRoleStaffName("");
            }
          }
        ],
        { cancelable: false }
      )
    }

  }

  useEffect(() => {
    const FetchStaffRole = async () => {
      setIsLoading(true);
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
      setIsLoading(false);
    };
    FetchStaffRole();
  }, []);
  console.log("Role Staff: ", roleStaffs);

  const renderItem = ({item}) => {
    return <RowItemAction value={item.roleStaffName}
                          style={{marginHorizontal: 16}}
                          valueStyle={{ color: "#292929" }}
                          onPress={() => {
                            setIsModal(true),
                              setCheckEdit(true),
                              setRoleStaffName(item.roleStaffName);
                            setSelectedRoleId(item.roleStaffId);
                          }}/>
  }

  return (
    <LoadingSkeleton showContent={!isLoading}>
    <View style={{flex:1}}>
      {roleStaffs.length > 0 ?
        <FlatList data={roleStaffs} renderItem={renderItem} style={{flex:1}}/>
        : (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Image source={ImgEmpty} resizeMode={"contain"} />
            <Text style={{ fontSize: 18, color: "#888888" }}>Không có dữ liệu</Text>
          </View>
        )
      }

      <ButtonBottom confirmLabel={"Thêm vai trò"} onConfirm={() => setIsModal(true)}/>
      <ModalBottom
        visible={isModal}
        title={checkEdit ?"Thông tin vai trò" : "Thêm vai trò"}
        setVisible={(isVisible) => {
          setIsModal(isVisible);
          if (!isVisible) {
            setRoleStaffName("");
            setCheckEdit(false);
          }
        }}
      >
        <Input title={"Nhập vai trò"} placeholder={"Ví dụ: Quản lý nhà hàng, Bếp, Bar, Phụ bếp, Phục vụ"} onChangeText={(text) => setRoleStaffName(text)}
                value={roleStaffName} errors={errors.roleStaffName}/>

        <ButtonBottom confirmLabel={checkEdit ? "Xóa Vai Trò" : "Đồng ý"} cancelLabel="Hủy" onCancel={() => {setIsModal(false),setRoleStaffName("")}}
                      onConfirm={handleCreateorDelete} />
      </ModalBottom>
    </View>
    </LoadingSkeleton>
  )
}
export default StaffRole;
