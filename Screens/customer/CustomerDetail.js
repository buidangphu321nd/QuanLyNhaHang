import React, { useState, useEffect } from "react";
import { Text, View ,StyleSheet,TextInput} from "react-native";
import { DATABASE, ref, get } from "../../fireBaseConfig";
const CustomerDetail = (props) => {
  const [customer, setCustomer] = useState({});
  const customerId = props.route.params.customerId;
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const customerRef = ref(DATABASE, `customer/${customerId}`);
        const snapshot = await get(customerRef);
        const data = snapshot.val();
        if (data) {
          setCustomer({
            customerId: customerId,
            ...data
          });
        }
      } catch (error) {
        console.error("Error fetching customer details: ", error);
      }
    };

    fetchCustomerDetails();
  }, [customerId]);

  console.log("CustomerDetail: ",customer)
  return (
    <View style={styles.container}>
      <Text style={{color:"#292929",fontSize:18,fontWeight:"400",padding:16}}>Thông tin cá nhân</Text>
      <View style={styles.containerFlex}>
        <Text style={{color:"#888888",fontSize:16}}>Tên khách hàng</Text>
        <TextInput style={{color:"#292929",fontSize:16}}>{customer.customerName}</TextInput>
      </View>
      <View style={styles.containerFlex}>
        <Text style={{color:"#888888",fontSize:16}}>Số điện thoại</Text>
        <TextInput style={{color:"#292929",fontSize:16}}> {customer.customerPhone}</TextInput>
      </View>
      <View style={styles.containerFlex}>
        <Text style={{color:"#888888",fontSize:16,}}>Email</Text>
        <TextInput style={{color:"#292929",fontSize:16}}>{customer.customerEmail}</TextInput>
      </View>
    </View>
  );
}

export default CustomerDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#fafafa",
  },
  containerFlex: {
    flexDirection:"row",
    justifyContent:"space-between",
    backgroundColor:"#fff",
    paddingVertical:8,
    paddingHorizontal:16,
    borderBottomWidth:1,
    borderBottomColor:"#ddd",
    alignItems:"center"
  }
})
