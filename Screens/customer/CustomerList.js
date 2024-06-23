import CustomerListItem from "./CustomerListItem";
import { TouchableOpacity, View, Text, FlatList, TextInput, StyleSheet, Image } from "react-native";
import ButtonBottom from "../../Component/ButtonBottom";
import React, { useEffect, useState } from "react";
import { DATABASE, ref, get } from "../../fireBaseConfig";
import SvgSearch from "../../assets/images/svg/search.svg";
import LoadingSkeleton from "../../Component/LoadingSkeleton";
import ImgEmpty from "../../assets/images/Emty.png";

const CustomerList = (props) => {
  const {} = props;
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const setSelectCustomerSchedule = props?.route?.params?.setSelectedCustomer;

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      try {
        const customerRef = ref(DATABASE, "customer"); // Tạo tham chiếu tới node 'customer' trong Firebase
        const snapshot = await get(customerRef); // Lấy dữ liệu từ tham chiếu này
        const data = snapshot.val(); // Trích xuất dữ liệu từ snapshot
        if (data) {
          // Chuyển đổi dữ liệu từ đối tượng thành mảng
          const customerArray = Object.keys(data).map(key => ({
            customerId: key, // Thiết lập customseterId từ key
            ...data[key], // Sao chép các thuộc tính còn lại của khách hàng
          }));
          setCustomers(customerArray);
          setFilteredCustomers(customerArray);
        }
      } catch (err) {
        console.error("Error: ", err);
      }
      setIsLoading(false);
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCustomers(customers);
    } else {
      const filteredData = customers.filter(customer =>
        customer.customerName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredCustomers(filteredData);
    }
  }, [searchQuery, customers]);


  console.log("Customer: ", customers);

  const onPress = (item, index) => {
    if (setSelectCustomerSchedule) {
      setSelectCustomerSchedule(item);
      props?.navigation?.goBack();
    } else {
      props.navigation.navigate("CustomerDetail", {
        customerId: item?.customerId,
      });
    }
  };

  const renderItem = ({ item, index }) => {
    return (

      <CustomerListItem item={item} index={index} onPress={onPress} />
    );
  };
  const onCreateSuccess = (newCustomer) => {
    setCustomers(prevCustomers => [...prevCustomers, newCustomer]);
  };

  const navToCustomerAdd = () => {
    props.navigation.navigate("CustomerCreate", { onCreateSuccess });
  };
  return (
    <LoadingSkeleton showContent={!isLoading}>

      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <SvgSearch width={24} height={24} fill={"#1E6F5C"}
                   style={{ position: "absolute", top: 38, left: 34, zIndex: 1 }} />
        <TextInput style={styles.input} placeholder={"Tìm Kiếm"} placeholderTextColor={"#888888"}
                   onChangeText={text => setSearchQuery(text)} />
        {filteredCustomers.length > 0 ?
          <FlatList
            data={filteredCustomers}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          /> : (<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Image source={ImgEmpty} resizeMode={"contain"} />
            <Text style={{ fontSize: 18, color: "#888888" }}>Không có dữ liệu</Text>
          </View>)
        }
        <ButtonBottom confirmLabel={"Thêm Khách Hàng"} onConfirm={navToCustomerAdd} />
      </View>

    </LoadingSkeleton>
  );
};
export default CustomerList;
const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    margin: 24,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    color: "#292929",
    paddingLeft: 40,
  },
});
