import React, { useCallback, useState,useEffect } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Keyboard,
  Text,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import RowItemAction from "../../Component/RowItemAction";
import Input from "../../Component/Input";
import ButtonBottom from "../../Component/ButtonBottom";
import Svgimage from "../../assets/images/svg/image-picture-svgrepo-com.svg";
import ModalBottom from "../../Component/ModalBottom";
import ImagePicker from "react-native-image-crop-picker";
import { DATABASE, get, ref, remove, set } from "../../fireBaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import TrashIcon from "../../assets/images/svg/Trash.svg"


const height = Dimensions.get("screen").height;
const width = Dimensions.get("window").width * 2;
const DishDetail = (props) => {
  const [dishName, setDishName] = useState("");
  const [dishPrice, setDishPrice] = useState(0);
  const [dishImage, setDishImage] = useState(null);
  const [isModal, setIsModal] = useState(false);
  const [selectedDishCategory, setSelectedDishCategory] = useState(null);
  const [dish, setDish] = useState([]);
  const [errors, setErrors] = useState({});

  const dishId = props.route.params.dishId;

  const openGallery = () => {
    ImagePicker.openPicker({
      width: width,
      height: width,
      cropping: true,
    }).then(image => {
      setDishImage(image.path);
      setIsModal(false);
    });
  };
  const openCamera = () => {
    ImagePicker.openCamera({
      width: width,
      height: height,
      cropping: true,
    }).then(image => {
      setDishImage(image.path);
      setIsModal(false);
    });
  };

  const formatNumber = (input) => {
    // Xóa bỏ các ký tự không phải số và dấu phẩy
    const cleaned = ("" + input).replace(/[^0-9]/g, "");
    // Định dạng lại số để có dấu phẩy phân cách hàng nghìn
    const formatted = cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return formatted;
  };
  const handlePriceChange = (value) => {
    const formattedPrice = formatNumber(value);
    setDishPrice(formattedPrice);
  };



  const fetchDish = useCallback(async () => {
    try {
      const dishRef = ref(DATABASE, `dish/${dishId}`);
      const snapshot = await get(dishRef);
      if (snapshot.exists()) {
        const dishData = snapshot.val();
        setDishName(dishData.dishName);
        setDishPrice(dishData.dishPrice);
        setDishImage(dishData.dishImage);
        setSelectedDishCategory({categoryId: dishData.categoryId,categoryName: dishData.categoryName});
      } else {
        console.log("No data available");
      }
    } catch (error) {
      console.error("Error fetching tables: ", error);
    }

  }, [dishId]);

  useEffect(() => {
    fetchDish();
  },[])

  console.log("List Dish: ", dish);
  console.log(selectedDishCategory);

  const validateInput = () => {
    let isValid = true;
    let errors = {};

    // Validate Name
    if (!dishName.trim()) {
      errors.dishName = "Bắt buộc nhập tên món";
      isValid = false;
    }


    if (!dishPrice.trim()) {
      errors.dishPrice = "Bắt buộc nhập giá bán";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };
  console.log("Errors: ", errors);

  const isDishDuplicate = (newDishName, id) => {
    return dish.some(dish => dish.dishName === newDishName && dish.dishId !== id
    );
  };

  const handleDishUpdate = async () => {
    if (!validateInput()) return;
    if (selectedDishCategory === null) {
      ToastAndroid.show("Vui lòng chọn danh mục.", ToastAndroid.LONG);
      return;
    }
    if (isDishDuplicate(dishName,dishId)) {
      ToastAndroid.show("Tên món ăn đã tồn tại, vui lòng nhập tên khác.", ToastAndroid.LONG);
      return;
    }
    const updateDish = {
      dishName,
      dishPrice,
      dishImage : dishImage || null,
      categoryId: selectedDishCategory.categoryId,
      categoryName: selectedDishCategory.categoryName,
    };
    try {
      const dishRef = ref(DATABASE, `dish/${dishId}`);
      await set(dishRef, updateDish);
      console.log("Them Thuc Don Thanh Cong !");
      ToastAndroid.show("Cập nhật thực đơn thành công", ToastAndroid.LONG);
      props.navigation.goBack();
    } catch (err) {
      console.error("Error: " + err);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa món ăn này không?",
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
              const dishRef = ref(DATABASE, `dish/${dishId}`);
              await remove(dishRef);
              ToastAndroid.show("Xóa món ăn thành công", ToastAndroid.SHORT);
              props.navigation.goBack();
            } catch (error) {
              console.error("Lỗi khi xóa món ăn: ", error);
              ToastAndroid.show("Không thể xóa món ăn", ToastAndroid.SHORT);
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
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ flex: 1, marginTop: 16 }}>
          <RowItemAction description={"Danh mục"}
                         value={selectedDishCategory ? selectedDishCategory.categoryName : "Chọn danh mục"}
                         style={{ marginHorizontal: 16 }}
                         onPress={() => props.navigation.navigate("DishCategory", { setSelectedDishCategory })} />
          <Input
            title={"Tên món"}
            placeholder={"Nhập tên món"}
            onChangeText={(text) => setDishName(text)}
            value={dishName}
            errors={errors.dishName}
          />
          <Input
            title={"Giá bán"}
            placeholder={"Nhập giá bán"}
            onChangeText={handlePriceChange}
            value={dishPrice}
            keyboardType={"numeric"}
            errors={errors.dishPrice}

          />
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={{ color: "#292929" }}>Ảnh minh họa</Text>
            <TouchableOpacity onPress={() => setIsModal(true)} style={{
              height: 100,
              width: 100,
            }}>
              <View style={{
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#ddd",
                height: 100,
                width: 100,
                marginTop: 16,
                borderStyle: "dashed",
                justifyContent: "center",
                alignItems: "center",
              }}>
                {dishImage ? (
                    <Image style={{ height: 100, width: 100 }} source={{ uri: dishImage }} />
                  ) :
                  (
                    <>
                      <Svgimage width={24} height={24} fill={"#888"} />
                      <Text style={{ color: "#888888" }}>Thêm mới</Text>
                    </>
                  )}

              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleDelete}
            style={{ flexDirection: 'row',marginTop:40, marginHorizontal: 16 ,alignItems:"center"}}>
            <TrashIcon width={24} height={24} />
            <Text style={{ color: "#E41717", marginLeft: 12 ,fontSize:14}}>
              Xóa món ăn
            </Text>
          </TouchableOpacity>
        </View>

        <ButtonBottom cancelLabel={"Hủy"} confirmLabel={"Đồng ý"} onCancel={() => props.navigation.goBack()}
                      onConfirm={handleDishUpdate} />
        <ModalBottom
          title={"Tùy chọn"}
          visible={isModal}
          setVisible={setIsModal}
        >
          <RowItemAction value={"Chọn ảnh từ thư viện"} style={{ marginHorizontal: 16 }} onPress={openGallery} />
          <RowItemAction value={"Mở Camera"} style={{ marginHorizontal: 16 }} onPress={openCamera} />
          <TouchableOpacity onPress={() => {
            setDishImage(null), setIsModal(false);
          }}>
            <Text style={{ textAlign: "center", color: "red", marginTop: 32 }}>Hủy ảnh</Text>
          </TouchableOpacity>
          <ButtonBottom confirmLabel={"Đóng"} style={{ marginTop: 32 }} onConfirm={() => setIsModal(false)} />
        </ModalBottom>

      </View>
    </TouchableWithoutFeedback>
  );
};
export default DishDetail;
