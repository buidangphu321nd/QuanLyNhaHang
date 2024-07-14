import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ToastAndroid, Image, TextInput } from "react-native";
import ButtonBottom from "../../Component/ButtonBottom";
import { DATABASE, get, ref, set } from "../../fireBaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import DishItem from "../dishe/dishItem";
import ImgEmpty from "../../assets/images/Emty.png";
import generateID from "../../Component/generateID";
import SvgNote from "../../assets/images/svg/note-svgrepo-com.svg";
import ModalBottom from "../../Component/ModalBottom";

const TableOrderMenu = (props) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [currentDishes, setCurrentDishes] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [orderList, setOrderList] = useState({});
  const [totalItems, setTotalItems] = useState(0);
  const [tableDetail, setTableDetail] = useState({});
  const [isModalNote, setIsModalNote] = useState(false);
  const [note, setNote] = useState("");
  const [currentDishId, setCurrentDishId] = useState(null);

  useEffect(() => {
    setTableDetail(props.route.params.tableDetail);
  }, [props.route.params.tableDetail]);

  const selectedCustomer = props.route.params.selectedCustomer;
  console.log("TableId: ", tableDetail.tableId);
  console.log("SelectedCustomer:", selectedCustomer);

  const addToOrderList = (dish, quantity) => {
    const newOrderList = { ...orderList };
    const createTime = new Date().getTime();
    if (quantity > 0) {
      if (newOrderList[dish.dishId]) {
        // Cập nhật số lượng và thông tin khác nếu món ăn đã tồn tại
        newOrderList[dish.dishId].quantity = quantity;
        newOrderList[dish.dishId].createTime = createTime;
      } else {
        // Nếu món ăn chưa tồn tại, thêm mới vào danh sách
        newOrderList[dish.dishId] = {
          ...dish,
          quantity,
          tableId: tableDetail.tableId,
          tableName: tableDetail.tableName,
          createTime: createTime,
          note: "",
          status: "WAITING",
        };
      }
    } else {
      delete newOrderList[dish.dishId];
    }
    setOrderList(newOrderList);
    updateTotalItems(newOrderList);
  };

  const updateTotalItems = (orders) => {
    const totalCount = Object.values(orders).reduce((acc, current) => acc + current.quantity, 0);
    setTotalItems(totalCount);
  };

  const handleConfirm = async () => {
    const kc_id = generateID();
    if (!orderList || Object.keys(orderList).length === 0) {
      ToastAndroid.show("Vui lòng chọn ít nhất một món ăn.", ToastAndroid.SHORT);
      return;
    }

    const orderRef = ref(DATABASE, `orders/${tableDetail.tableId}`);
    const kitchenRef = ref(DATABASE, `kitchen_bar/${kc_id}`);

    const snapshot = await get(orderRef);
    let newOrder;

    if (snapshot.exists()) {
      // Cập nhật đơn hàng hiện có
      newOrder = snapshot.val();
      // Duyệt qua các món ăn mới và cập nhật số lượng
      Object.entries(orderList).forEach(([key, newItem]) => {
        if (newOrder.items[key]) {
          // Cộng dồn số lượng nếu món đã tồn tại
          newOrder.items[key].quantity += newItem.quantity;
        } else {
          // Thêm món mới nếu không tồn tại
          newOrder.items[key] = newItem;
        }
      });
    } else {
      // Tạo đơn hàng mới nếu không có sẵn
      newOrder = {
        orderId: generateID(),
        tableId: tableDetail.tableId,
        tableName: tableDetail.tableName,
        floorId: tableDetail.floorId,
        floorName: tableDetail.floorName,
        createTime: new Date().getTime(),
        items: orderList,
      };
    }

    // Lưu đơn hàng vào Firebase
    try {
      await set(orderRef, newOrder);
      await set(kitchenRef, { kc_id, items: orderList });
      ToastAndroid.show("Gọi món thành công!", ToastAndroid.LONG);
      props.navigation.goBack();
    } catch (error) {
      console.error("Lỗi khi lưu đơn hàng:", error);
      ToastAndroid.show("Lỗi khi lưu đơn hàng.", ToastAndroid.SHORT);
    }
  };

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

  const fetchAllDishes = useCallback(async () => {
    try {
      const dishRef = ref(DATABASE, 'dish');
      const snapshot = await get(dishRef);
      if (snapshot.exists()) {
        const dishData = snapshot.val();
        const allDishes = Object.keys(dishData).map(key => ({
          dishId: key,
          ...dishData[key],
        }));
        setCurrentDishes(allDishes);
      } else {
        console.log("No dishes available");
        setCurrentDishes([]);
      }
    } catch (error) {
      console.error("Error fetching dishes: ", error);
    }
  }, []);

  const fetchDishesByCategory = useCallback(async () => {
    try {
      const dishRef = ref(DATABASE, `dish`);
      const snapshot = await get(dishRef);
      if (snapshot.exists()) {
        const dishData = snapshot.val();
        const filteredDishes = Object.keys(dishData)
          .map(key => ({
            dishId: key,
            ...dishData[key],
          }))
          .filter(dish => dish.categoryId === selectedCategoryId); // Lọc món ăn theo danh mục đã chọn

        setCurrentDishes(filteredDishes);
      } else {
        console.log("No data available");
        setCurrentDishes([]);
      }
    } catch (error) {
      console.error("Error fetching dishes: ", error);
    }
  }, [selectedCategoryId]);

  useFocusEffect(
    useCallback(() => {
      if (selectedCategoryId) {
        fetchDishesByCategory();
      } else {
        fetchAllDishes();
      }
    }, [selectedCategoryId, fetchDishesByCategory, fetchAllDishes]),
  );

  const handleAddNote = () => {
    if (currentDishId && note) {
      const newOrderList = { ...orderList };
      if (newOrderList[currentDishId]) {
        newOrderList[currentDishId].note = note;
      }
      setOrderList(newOrderList);
      setNote("");
      setCurrentDishId(null);
      setIsModalNote(false);
    }
  };

  console.log("List categories:", categories);
  console.log("List Dish: ", currentDishes);
  console.log("Orders list: ", orderList);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.categoryContainer}>
          <Text style={[styles.headerText, { color: "#292929" }]}>Danh mục</Text>
          <FlatList
            data={categories}
            keyExtractor={(item) => item.categoryId}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  item.categoryId === selectedCategoryId ? styles.activeCategory : null,
                ]}
                onPress={() => setSelectedCategoryId(item.categoryId)}
              >
                <Text style={styles.categoryText}>{item.categoryName}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
        <View style={styles.dishesContainer}>
          {currentDishes.length > 0 ?
            (
              <FlatList
                data={currentDishes}
                keyExtractor={(item) => item.dishId}
                renderItem={({ item }) => (
                  <DishItem
                    item={item}
                    selectedDish={true}
                    addToOrderList={addToOrderList}
                    orderList={orderList}
                    tableId={tableDetail.tableId}
                  />
                )}
              />
            ) :
            (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Image source={ImgEmpty} resizeMode={"contain"} />
                <Text style={{ fontSize: 18, color: "#888888" }}>Không có dữ liệu</Text>
              </View>
            )}
        </View>
      </View>
      <ButtonBottom confirmLabel={"Xác nhận"} cancelLabel={`Danh sách gọi món: ${totalItems}`} onConfirm={handleConfirm}
                    onCancel={() => setIsModal(true)} />
      <ModalBottom
        title={"Danh sách gọi món"}
        visible={isModal}
        setVisible={setIsModal}
      >
        <FlatList
          data={Object.values(orderList)}
          renderItem={({ item }) => (
            <View style={{ marginVertical: 8, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: "#ddd" }}>
              <Text style={{ color: "#000000", fontSize: 16 }}> {item.dishName}</Text>
              <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }} onPress={() => { setIsModalNote(true); setCurrentDishId(item.dishId); }}>
                <SvgNote width={14} height={14} fill={"#ef5f05"}  />
                <Text style={{ color: "#ef5f05", fontSize: 14, marginLeft:8 }}>{item.note ? item.note : "Ghi chú"}</Text>
              </TouchableOpacity>
              <View style={{ marginVertical: 8, flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ color: "#000000", fontSize: 16, fontWeight: 500 }}> {item.dishPrice}đ</Text>
                <Text style={{ color: "#000000", fontSize: 16, fontWeight: 500 }}> x {item.quantity}</Text>
              </View>

            </View>
          )}
        />
      </ModalBottom>
      <ModalBottom
        title={"Thêm Ghi Chú"}
        visible={isModalNote}
        setVisible={setIsModalNote}
      >
        <View style={{ paddingHorizontal: 16, marginVertical: 16 }}>
          <Text style={{ color: "#292929", fontWeight: 600 }}>Món ăn</Text>
          <Text style={{ color: "#292929", fontWeight: 400, marginTop: 8 }}>{currentDishId ? orderList[currentDishId].dishName : ""}</Text>
          <Text style={{ color: "#292929", fontWeight: 400, marginTop: 16 }}>Ghi chú</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#DDDDDD",
              borderRadius: 8,
              minHeight: 100,
              padding: 8,
              color: "#292929",
            }}
            placeholder={"Nhập ghi chú"}
            placeholderTextColor={"#888888"}
            textAlignVertical={"top"}
            multiline={true}
            onChangeText={setNote}
            value={note}
          />
        </View>
        <ButtonBottom cancelLabel={"Hủy"} confirmLabel={"Xác nhận"} onCancel={() => setIsModalNote(false)} onConfirm={handleAddNote} />
      </ModalBottom>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  categoryContainer: {
    flex: 0.25,
    backgroundColor: "#FAFAFA",
  },
  dishesContainer: {
    flex: 0.75,
    backgroundColor: "#fff",
  },
  categoryItem: {
    alignItems: "center",
    padding: 16,
  },
  activeCategory: {
    backgroundColor: "#ddd",
  },
  categoryText: {
    color: "#292929",
  },
  dishItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  dishText: {
    fontSize: 16,
    color: "#292929",
  },
  headerText: {
    fontSize: 14,
    padding: 16,
    backgroundColor: "#FAFAFA",
    textAlign: "center",
  },
});

export default TableOrderMenu;
