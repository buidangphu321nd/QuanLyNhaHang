import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Image, Text, TextInput, ToastAndroid, TouchableOpacity, View } from "react-native";
import RowItemAction from "../../Component/RowItemAction";
import ButtonBottom from "../../Component/ButtonBottom";
import ImgEmpty from "../../assets/images/Emty.png";
import { DATABASE, get, ref, set, update } from "../../fireBaseConfig";
import Input from "../../Component/Input";
import ModalBottom from "../../Component/ModalBottom";
import generateID from "../../Component/generateID";
import { useFocusEffect } from "@react-navigation/native";
import Svgimage from "../../assets/images/svg/image-picture-svgrepo-com.svg";
import SvgTru from "../../assets/images/svg/tru.svg";
import SvgCong from "../../assets/images/svg/cong.svg";
import SvgNote from "../../assets/images/svg/note-svgrepo-com.svg";

const TableOrderUsed = (props) => {
  const [tableDetail, setTableDetail] = useState({});
  const [isModal, setIsModal] = useState(false);
  const [isModalDish, setIsModalDish] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerName, setCustomerName] = useState("Khách lẻ");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [dishOrder, setDishOrder] = useState([]);
  const [selectedDish, setSelectedDish] = useState("");
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    setTableDetail(props.route.params.tableDetail);
  }, [props.route.params.tableDetail]);

  const incrementQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
  };

  const decrementQuantity = () => {
    const newQuantity = Math.max(1, quantity - 1);
    setQuantity(newQuantity);
  };

  const fetchOrderItems = useCallback(async () => {
    const orderRef = ref(DATABASE, `orders/${tableDetail.tableId}`);
    try {
      const snapshot = await get(orderRef);
      if (snapshot.exists()) {
        const orderData = snapshot.val();
        if (orderData && orderData.items) {
          const itemsArray = Object.values(orderData.items);
          setDishOrder(itemsArray);
        } else {
          setDishOrder([]);
        }
      } else {
        setDishOrder([]);
      }
    } catch (error) {
      console.error("Error fetching order items:", error);
      setDishOrder([]);
    }
  }, [tableDetail.tableId]);

  useFocusEffect(
      useCallback(() => {
        fetchOrderItems();
      }, [fetchOrderItems])
  );

  const handlePress = async () => {
    const updateTable = {
      tableName: tableDetail.tableName,
      tableSlots: tableDetail.tableSlots,
      statusTable: "",
      floorId: tableDetail.floorId,
      floorName: tableDetail.floorName,
    };
    const tableRef = ref(DATABASE, `tables/${tableDetail.tableId}`);
    try {
      await set(tableRef, updateTable);
      console.log("Table status updated successfully");
      props.navigation.goBack();
    } catch (error) {
      console.error("Failed to update table status:", error);
    }
  };

  const handlePayment = () => {
    if (dishOrder.length > 0) {
      props.navigation.navigate("PaymentStep1", { tableDetail: tableDetail, dishOrder: dishOrder, selectedCustomer: selectedCustomer});
    } else {
      ToastAndroid.show("Không có món ăn để thanh toán", ToastAndroid.SHORT);
    }
  };

  const handleMainButtonPress = () => {
    if (dishOrder.length > 0) {
      handlePayment();
    } else {
      handlePress();
    }
  };

  const validateInput = () => {
    let isValid = true;
    let errors = {};

    if (!customerName.trim()) {
      errors.customerName = "Bắt Buộc Nhập Họ Tên";
      isValid = false;
    }

    if (customerPhone && (customerPhone.length !== 10 || !customerPhone.startsWith("0"))) {
      errors.customerPhone = "Vui lòng nhập đúng định dạng số điện thoại";
      isValid = false;
    }

    if (customerEmail && !customerEmail.includes("@")) {
      errors.customerEmail = "Vui lòng nhập đúng định dạng email";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleCreate = async () => {
    if (!validateInput()) return;

    const customerId = generateID();

    const newCustomer = {
      customerId,
      customerName,
      customerPhone,
      customerEmail,
    };

    try {
      const customerRef = ref(DATABASE, "customer/" + customerId);
      await set(customerRef, newCustomer);
      console.log("Them Khach Hang Thanh Cong !");
      ToastAndroid.show("Thêm khách hàng thành công", ToastAndroid.LONG);
      setSelectedCustomer(newCustomer);
      setIsModal(false);
    } catch (err) {
      console.error("Error: " + err);
    }
  };

  const handleChange = () => {
    props.navigation.navigate("TableChange", { tableDetail: tableDetail, tableId: tableDetail.tableId, handlePress });
  };

  const updateKitchenStatus = async (dish, newQuantity) => {
    const quantityDiff = newQuantity - dish.quantity;

    if (quantityDiff > 0) {
      const newOrderList = {
        ...dish,
        quantity: quantityDiff,
        tableId: tableDetail.tableId,
        tableName: tableDetail.tableName,
        status: "WAITING",
        createTime: new Date().getTime(),
      };
      const kc_id = generateID();
      const kitchenRef = ref(DATABASE, `kitchen_bar/${kc_id}/items`);
      await set(kitchenRef, { [dish.dishId]: newOrderList });
    } else if (quantityDiff < 0) {
      const canceledQuantity = Math.abs(quantityDiff);
      const newOrderList = {
        ...dish,
        quantity: canceledQuantity,
        tableId: tableDetail.tableId,
        tableName: tableDetail.tableName,
        status: "CANCEL",
        createTime: new Date().getTime(),
      };
      const kc_id = generateID();
      const kitchenRef = ref(DATABASE, `kitchen_bar/${kc_id}/items`);
      await set(kitchenRef, { [dish.dishId]: newOrderList });
    }
  };

  const handleConfirm = async () => {
    const updatedDishes = dishOrder.map(dish => {
      if (dish.dishId === selectedDish.dishId) {
        updateKitchenStatus(dish, quantity);
        return { ...dish, quantity: quantity };
      }
      return dish;
    });

    setDishOrder(updatedDishes);

    try {
      const orderRef = ref(DATABASE, `orders/${tableDetail.tableId}/items`);
      const itemsToUpdate = {};
      updatedDishes.forEach(item => {
        itemsToUpdate[item.dishId] = item;
      });
      await set(orderRef, itemsToUpdate);
      ToastAndroid.show("Số lượng món ăn đã được cập nhật", ToastAndroid.SHORT);
    } catch (error) {
      console.error("Error updating dishes:", error);
      ToastAndroid.show("Cập nhật số lượng món ăn thất bại", ToastAndroid.LONG);
    }

    setIsModalDish(false);
  };

  return (
      <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
        <View style={{ flex: 1, marginTop: 16 }}>
          <Text style={{ color: "#292929", fontSize: 16, fontWeight: 400, paddingHorizontal: 16 }}>Thông tin khách hàng</Text>
          <RowItemAction
              description={"Khách hàng"}
              value={selectedCustomer ? selectedCustomer?.customerName : "Khách lẻ"}
              style={{ marginTop: 16, paddingHorizontal: 16, backgroundColor: "#fff" }}
              borderWidth={0}
              onPress={() => setIsModal(true)}
          />
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16, paddingHorizontal: 16, alignItems: "center" }}>
            <Text style={{ color: "#292929", fontSize: 16, fontWeight: 400 }}>Danh sách món đã gọi</Text>
            {dishOrder.length > 0 ? (
                <TouchableOpacity onPress={() => props.navigation.navigate("TableOrderMenu", { tableDetail: tableDetail })}>
                  <Text style={{ color: "#1E6F5C", fontSize: 14, fontWeight: 400 }}>+ Gọi thêm món</Text>
                </TouchableOpacity>
            ) : null}
          </View>

          <View style={{ backgroundColor: "#fff", marginVertical: 16 }}>
            {dishOrder.length > 0 ? (
                <FlatList
                    data={dishOrder}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={{ marginVertical: 8 }}
                            onPress={() => {
                              if (item) {
                                setSelectedDish(item);
                                setQuantity(item.quantity);
                                setIsModalDish(true);
                              } else {
                                ToastAndroid.show("Món ăn không hợp lệ", ToastAndroid.SHORT);
                              }
                            }}
                        >
                          <View style={{ flexDirection: "row", paddingHorizontal: 16, paddingVertical: 8 }}>
                            {item.dishImage ? (
                                <View style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, height: 64, width: 64 }}>
                                  <Image style={{ height: 64, width: 64, borderRadius: 8 }} source={{ uri: item.dishImage }} />
                                </View>
                            ) : (
                                <View
                                    style={{
                                      borderRadius: 8,
                                      borderWidth: 1,
                                      borderColor: "#ddd",
                                      height: 64,
                                      width: 64,
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                >
                                  <Svgimage width={24} height={24} />
                                </View>
                            )}
                            <View style={{ flex: 1, paddingHorizontal: 16 }}>
                              <Text style={{ color: "#292929", fontWeight: "500", fontSize: 16 }}>{item.dishName}</Text>
                              {item.note != "" ? (
                                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                                    <SvgNote width={14} height={14} fill={"#ef5f05"} />
                                    <Text style={{ color: "#ef5f05", fontSize: 14, marginLeft: 8 }}>{item.note}</Text>
                                  </View>
                              ) : null}
                              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
                                <Text style={{ color: "#1E6F5C", fontSize: 16 }}>{item.dishPrice} đ</Text>
                                <Text style={{ color: "#292929", fontWeight: "500", fontSize: 16 }}> x {item.quantity}</Text>
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                    )}
                />
            ) : (
                <View style={{ alignItems: "center" }}>
                  <View style={{ alignItems: "center", marginTop: 16 }}>
                    <Image source={ImgEmpty} resizeMode={"contain"} />
                    <Text style={{ fontSize: 18, color: "#888888" }}>Không có dữ liệu</Text>
                  </View>
                  <TouchableOpacity
                      style={{ width: 200, backgroundColor: "#1E6F5C", marginVertical: 16, borderRadius: 8 }}
                      onPress={() => props.navigation.navigate("TableOrderMenu", { tableDetail: tableDetail, selectedCustomer: selectedCustomer })}
                  >
                    <Text style={{ color: "#fff", fontSize: 14, textAlign: "center", padding: 16 }}>Gọi món</Text>
                  </TouchableOpacity>
                </View>
            )}
          </View>
          <ModalBottom title={"Chọn khách hàng"} visible={isModal} setVisible={setIsModal}>
            <Input
                title={"Họ Tên"}
                placeholder={"Nhập họ tên khách hàng"}
                isRequired={true}
                onChangeText={(text) => setCustomerName(text)}
                errors={errors.customerName}
                value={customerName}
            />
            <Input
                title={"Số điện thoại"}
                placeholder={"Nhập số điện thoại khách hàng"}
                onChangeText={(text) => setCustomerPhone(text)}
                errors={errors.customerPhone}
                value={customerPhone}
            />
            <Input
                title={"Email"}
                placeholder={"Nhập email khách hàng"}
                onChangeText={(text) => setCustomerEmail(text)}
                errors={errors.customerEmail}
                value={customerEmail}
            />
            <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 16 }}>
              <Text style={{ color: "#292929" }}>Hoặc</Text>
              <TouchableOpacity style={{ marginTop: 8 }} onPress={() => props.navigation.navigate("CustomerList", { setSelectedCustomer })}>
                <Text style={{ color: "#1E6F5C", fontSize: 16 }}>Danh sách khách hàng</Text>
              </TouchableOpacity>
            </View>
            <ButtonBottom confirmLabel={"Xác nhận"} onConfirm={handleCreate} />
          </ModalBottom>

          <ModalBottom title={"Thông tin món"} visible={isModalDish} setVisible={setIsModalDish}>
            <View style={{ paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: "#ddd" }}>
              <Text style={{ color: "#000000", fontSize: 16 }}> {selectedDish.dishName}</Text>
              <View style={{ marginVertical: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ color: "#000000", fontSize: 16, fontWeight: 500 }}> {selectedDish.dishPrice}đ</Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                  <TouchableOpacity style={{ width: 30, height: 30, justifyContent: "center", alignItems: "center" }} onPress={decrementQuantity}>
                    <SvgTru width={18} height={18} fill={"#1E6F5C"}/>
                  </TouchableOpacity>
                  <Text style={{ marginHorizontal: 24, color: "#1E6F5C", fontSize: 18 }}>{quantity}</Text>
                  <TouchableOpacity style={{ width: 30, height: 30, justifyContent: "center", alignItems: "center" }} onPress={incrementQuantity}>
                    <SvgCong width={18} height={18} fill={"#1E6F5C"} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <ButtonBottom confirmLabel={"Xác nhận"} onConfirm={handleConfirm} />
          </ModalBottom>
        </View>
        <ButtonBottom confirmLabel={dishOrder.length > 0 ? "Thanh Toán" : "Hủy Bàn"} cancelLabel={"Chuyển bàn"} onConfirm={handleMainButtonPress} onCancel={() => handleChange()} />
      </View>
  );
};

export default TableOrderUsed;
