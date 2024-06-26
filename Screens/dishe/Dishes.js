import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ToastAndroid, Image } from "react-native";
import ButtonBottom from "../../Component/ButtonBottom";
import ModalBottom from "../../Component/ModalBottom";
import Input from "../../Component/Input";
import generateID from "../../Component/generateID";
import { DATABASE, get, ref, set,remove } from "../../fireBaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import DishItem from "./dishItem";
import ImgEmpty from "../../assets/images/Emty.png";

const Dishes = (props) => {
  const [categoryName,setCategoryName] = useState("");
  const [categories,setCategories] = useState([]);
  const [isModal,setIsModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [currentDishes, setCurrentDishes] = useState([]);

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

    if (isCategoryNameDuplicate(categoryName,null)) {
      ToastAndroid.show("Tên danh mục đã tồn tại, vui lòng chọn tên khác.", ToastAndroid.LONG);
      return;
    }
    const categoryId = generateID();
    const newCategory = {categoryId,categoryName}
    try {
      const categoryRef = ref(DATABASE,"category/"+categoryId);
      await set (categoryRef,newCategory);
      setIsModal(false);
      setCategoryName("");
      setCategories([...categories,newCategory]);
      ToastAndroid.show("Thêm danh mục thành công!",ToastAndroid.LONG);
    } catch (err) {
      console.log(err)
    }
  }
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
        <TouchableOpacity onPress={() => setIsModal(true)}>
          <Text style={[styles.headerText,{color:"#1E6F5C",fontWeight:500}]}>Thêm mới</Text>
        </TouchableOpacity>
        <ModalBottom
         title={"Thêm mới danh mục"}
         visible={isModal}
         setVisible={(isVisible) => {
           setIsModal(isVisible);
           setCategoryName("");
         }}
        >
          <Input title={"Nhập tên danh mục món ăn"} placeholder={"Ví dụ: Khai vị, Bò, Gà,.. "}  onChangeText={(text) => setCategoryName(text)}
                 errors={errors.categoryName} value={categoryName}/>
          <ButtonBottom cancelLabel={"Hủy"} confirmLabel={"Đồng ý"} onCancel={()=> {setIsModal(false),setCategoryName("")}} onConfirm={handleCreateCategory}/>
        </ModalBottom>
        <TouchableOpacity onPress={() => props.navigation.navigate("DishCategory") }>
          <Text style={[styles.headerText,{color:"#1E6F5C",fontWeight:500}]}>Quản lý danh mục</Text>
        </TouchableOpacity>
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
                  selectedDish={false}
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
      <ButtonBottom confirmLabel={"Thêm thực đơn"} onConfirm={() => props.navigation.navigate("DishMenu")}/>
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

export default Dishes;
