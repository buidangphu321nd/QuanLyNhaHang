import React, { useCallback, useState } from "react";
import { DATABASE, get, ref, remove, set } from "../../fireBaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import RowItemAction from "../../Component/RowItemAction";
import { Alert, FlatList, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import ButtonBottom from "../../Component/ButtonBottom";
import ModalBottom from "../../Component/ModalBottom";
import Input from "../../Component/Input";
import generateID from "../../Component/generateID";

const DishCategory = (props) => {
  const [categories, setCategories] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [checkEdit, setCheckEdit] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [errors, setErrors] = useState({});
  const [currentId, setCurrentId] = useState();
  const setSelectedDishCategory = props?.route?.params?.setSelectedDishCategory;

  const FetchCategory = useCallback(async () => {
    try {
      const categoryRef = ref(DATABASE, "category");
      const snapshot = await get(categoryRef);
      const data = snapshot.val();
      if (data) {
        const categoryArray = Object.keys(data).map(key => ({
          categoryId: key,
          ...data[key],
        }));
        setCategories(categoryArray);
      }
    } catch (err) {
      console.error("Error: ", err);
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      FetchCategory();
    }, [FetchCategory]),
  );

  const renderItem = ({ item }) => {
    return (
      <RowItemAction
        value={item.categoryName}
        valueStyle={{ color: "#292929" }}
        style={{ marginHorizontal: 16 }}
        onPress={() => {
          if (setSelectedDishCategory) {
            setSelectedDishCategory(item);
            props.navigation.goBack();
          } else {setIsModal(true), setCheckEdit(true), setCategoryName(item.categoryName), setCurrentId(item.categoryId);}

        }}
      />
    );
  };
  const validateInput = () => {
    let isValid = true;
    let errors = {};

    if (!categoryName.trim()) {
      errors.categoryName = "Bắt buộc nhập danh mục";
      isValid = false;
    }
    setErrors(errors);
    return isValid;
  };

  const isCategoryNameDuplicate = (name, id) => {
    return categories.some(category => category.categoryName.toLowerCase() === name.toLowerCase() && category.categoryId !== id);
  };
  const handleCreateCategory = async () => {
    if (!validateInput()) return;

    // Kiểm tra tên tầng có trùng không
    if (isCategoryNameDuplicate(categoryName, checkEdit ? currentId : null)) {
      ToastAndroid.show("Tên danh mục đã tồn tại, vui lòng chọn tên khác.", ToastAndroid.LONG);
      return;
    }
    const categoryId = checkEdit ? currentId : generateID();
    const newCategory = { categoryId, categoryName };
    try {
      const categoryRef = ref(DATABASE, "category/" + categoryId);
      await set(categoryRef, newCategory);
      setIsModal(false);
      setCategoryName("");
      FetchCategory();
      const message = checkEdit ? "Cập nhật danh mục thành công!!" : "Thêm danh mục thành công!!";
      ToastAndroid.show(message, ToastAndroid.LONG);
    } catch (err) {
      console.log(err);
    }
  };
  const confirmDelete = () => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa khu vực này không?",
      [
        {
          text: "Hủy",
          onPress: () => setIsModal(false),
          style: "cancel",
        },
        {
          text: "Đồng ý", onPress: async () => {
            try {
              // Xóa khu vực từ Firebase
              const categoryRef = ref(DATABASE, `category/${currentId}`);
              await remove(categoryRef);
              console.log("Danh mục đã được xóa từ Firebase");

              // Cập nhật state để phản ánh sự thay đổi trên giao diện người dùng
              // const updatedCategory = categories.filter(category => category.categoryId !== categories.categoryId);
              // setCategories(updatedCategory);
              FetchCategory();

              ToastAndroid.show("Danh mục đã được xóa.", ToastAndroid.SHORT);
            } catch (error) {
              console.error("Lỗi khi xóa danh mục: ", error);
              ToastAndroid.show("Không thể xóa danh mục.", ToastAndroid.SHORT);
            }

            setIsModal(false);
            setCategoryName("");
          },
        },
      ],
      { cancelable: false },
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <FlatList data={categories} renderItem={renderItem} />
      <ButtonBottom confirmLabel={"Thêm danh mục"} onConfirm={() => {
        setIsModal(true), setCheckEdit(false);
      }} />
      <ModalBottom
        title={checkEdit ? "Sửa danh mục" : "Thêm danh mục"}
        visible={isModal}
        setVisible={(isVisible) => {
          setIsModal(isVisible);
          if (!isVisible) {
            setCategoryName("");
            setErrors("");
          }
        }}
      >
        <Input
          title={checkEdit ? "Tên danh mục" : "Nhập tên danh mục món ăn"}
          placeholder={"Ví dụ: Khai vị, Bò, Gà,.. "}
          onChangeText={(text) => setCategoryName(text)}
          errors={errors.categoryName}
          value={categoryName}
        />
        {checkEdit &&
          <TouchableOpacity
            onPress={confirmDelete}
            style={{ padding: 4, marginVertical: 28 }}>
            <Text style={{ color: "#E41717", textAlign: "center", fontSize: 14 }}>
              Xóa danh mục
            </Text>
          </TouchableOpacity>}
        <ButtonBottom cancelLabel={"Hủy"} confirmLabel={"Đồng ý"} onCancel={() => {
          setIsModal(false), setCategoryName("");
        }} onConfirm={handleCreateCategory} />
      </ModalBottom>

    </View>
  );
};
export default DishCategory;
