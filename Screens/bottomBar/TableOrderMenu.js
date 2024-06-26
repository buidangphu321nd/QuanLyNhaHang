import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ToastAndroid, Image } from "react-native";
import ButtonBottom from "../../Component/ButtonBottom";
import { DATABASE, get, ref, set,remove } from "../../fireBaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import DishItem from "../dishe/dishItem";
import ImgEmpty from "../../assets/images/Emty.png";

const TableOrderMenu = (props) => {
  const [categories,setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [currentDishes,setCurrentDishes] = useState([]);

  const tableId = props.route.params.tableId;
  console.log("TableId: ",tableId);

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
  },[]);

  useFocusEffect(
    useCallback(() => {
      FetchCategory();

    },[FetchCategory])
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
          .filter(dish => dish.categoryId === selectedCategoryId); // Filter dishes by selected category

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

    }, [selectedCategoryId, fetchDishesByCategory,fetchAllDishes])
  )




  console.log("List categories:",categories);
  console.log("List Dish: ",currentDishes);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.categoryContainer}>
          <Text style={[styles.headerText,{color:"#292929"}]}>Danh mục</Text>
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
      <ButtonBottom confirmLabel={"Xác nhận"} cancelLabel={"Hủy"} onConfirm={() => {}} onCancel={() => props.navigation.goBack()}/>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  categoryContainer: {
    flex: 0.25,
    backgroundColor: '#FAFAFA',
  },
  dishesContainer: {
    flex: 0.75,
    backgroundColor: '#fff',
  },
  categoryItem: {
    alignItems:"center",
    padding: 16,
  },
  activeCategory: {
    backgroundColor: '#ddd',
  },
  categoryText: {
    color:"#292929"
  },
  dishItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dishText: {
    fontSize: 16,
    color:"#292929"
  },
  headerText: {
    fontSize: 14,
    padding: 16,
    backgroundColor: '#FAFAFA',
    textAlign:"center"
  },
});

export default TableOrderMenu;
