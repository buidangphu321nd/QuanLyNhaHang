import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ToastAndroid } from "react-native";
import ButtonBottom from "../../Component/ButtonBottom";
import ModalBottom from "../../Component/ModalBottom";
import Input from "../../Component/Input";
import generateID from "../../Component/generateID";
import { DATABASE, get, ref, set,remove } from "../../fireBaseConfig";

const categories = [
  { id: '1', name: 'Đặc sản' },
  { id: '2', name: 'Khai vị' },
  { id: '3', name: 'Bò' },
  { id: '4', name: 'Dê' },

];

const dishes = {
  '1': [{ id: '101', name: 'Thăn bò mỹ sốt tiêu', price: '300,000' }],
  '2': [{ id: '201', name: 'Sườn Non Bò Mỹ Sốt Oba', price: '300,000' }],
  // Thêm các món ăn tương ứng với từng danh mục...
};

const Dishes = () => {
  const [categoryName,setCategoryName] = useState("");
  const [categories,setCategories] = useState([]);
  const [refreshCategories, setRefreshCategories] = useState(false);
  const [isModal,setIsModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  // const [currentDishes, setCurrentDishes] = useState([]);

  // useEffect(() => {
  //   setCurrentDishes(dishes[selectedCategoryId]);
  // }, [selectedCategoryId]);
  const handleCreateCategory = async () => {
    const categoryId = generateID();
    const newCategory = {categoryId,categoryName}
    try {
      const categoryRef = ref(DATABASE,"category/"+categoryId);
      await set (categoryRef,newCategory);
      setIsModal(false);
      setCategoryName("");
      setRefreshCategories(!refreshCategories);
      ToastAndroid.show("Thêm danh mục thành công!",ToastAndroid.LONG);
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    const FetchCategory = async () => {
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
    };
    FetchCategory();
  }, [refreshCategories]);
  console.log("List categories:",categories);
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
          <ButtonBottom cancelLabel={"Hủy"} confirmLabel={"Đồng ý"} onCancel={()=> setIsModal(false)} onConfirm={handleCreateCategory}/>
        </ModalBottom>
        <TouchableOpacity onPress={() => {}}>
          <Text style={[styles.headerText,{color:"#1E6F5C",fontWeight:500}]}>Quản lý danh mục</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.dishesContainer}>
        {/*<FlatList*/}
        {/*  data={currentDishes}*/}
        {/*  keyExtractor={(item) => item.id}*/}
        {/*  renderItem={({ item }) => (*/}
        {/*    <View style={styles.dishItem}>*/}
        {/*      <Text style={styles.dishText}>{item.name}</Text>*/}
        {/*      <Text style={styles.dishText}>{item.price}</Text>*/}
        {/*    </View>*/}
        {/*  )}*/}
        {/*/>*/}
      </View>
    </View>
  <ButtonBottom confirmLabel={"Thêm thực đơn"}/>
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
