import React,{useState} from "react";
import { FlatList, ScrollView, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import RowItemAction from "../../Component/RowItemAction";
import ButtonBottom from "../../Component/ButtonBottom";
import SvgMoney from "../../assets/images/svg/money.svg";
import SvgBank from "../../assets/images/svg/bank.svg";
import generateID from "../../Component/generateID";
import { DATABASE, ref, set } from "../../fireBaseConfig";


const Payment = (props) => {
  const selectedCustomer = props.route.params.selectedCustomer;
  const dishOrder = props.route.params.dishOrder;
  const tableDetail = props.route.params.tableDetail;
  console.log("selectedCustomer: ",selectedCustomer);

  const [selectedMethod, setSelectedMethod] = useState(null);


  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
  };

  const methodStyle = (method) => ({
    borderRadius: 8,
    backgroundColor: "#fff",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: selectedMethod === method ? "#1E6F5C" : "#ddd",
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    width: 170,
    marginLeft: method !== 'cash' ? 16 : 0,
  });

  const textStyle = (method) => ({
    color: selectedMethod === method ? "#1E6F5C" : "#888888",
    fontSize: 14,
    fontWeight: 500,
    marginLeft: 8,
  });

  const parsePrice = (price) => {
    const numericPrice = parseInt(price.replace(/,/g, ""), 10); // Remove commas and convert to integer
    return numericPrice;
  };

  const calculateTotalPrice = (quantity, price) => {
    return quantity * parsePrice(price);
  };
  const getTotalPrice = () => {
    return dishOrder.reduce((acc, item) => acc + calculateTotalPrice(item.quantity, item.dishPrice), 0);
  };

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

  const handlePayment = async () => {
    const now = new Date();
    const billId = generateID();
    if (selectedMethod == null){
      ToastAndroid.show("Vui lòng chọn phương thức thanh toán!",ToastAndroid.LONG);
      return;
    }
    const newBill = {
      billId,
      createTime : now.getTime(),
      tableId : tableDetail.tableId,
      tableName : tableDetail.tableName,
      customerId : selectedCustomer ? selectedCustomer.customerId : generateID()+686868,
      customerName: selectedCustomer ? selectedCustomer.customerName : "Khách lẻ",
      items: dishOrder,
      paymentMethod : selectedMethod,
      total : getTotalPrice()
    }
    console.log("New bill",newBill)
    const billRef = ref(DATABASE, `bills/` + billId);
    const orderRef = ref(DATABASE, `orders/${tableDetail.tableId}`);
    try {
      await set(billRef, newBill);
      ToastAndroid.show("Thanh toán thành công!", ToastAndroid.LONG);
      await set(orderRef, null);
      await handlePress();
      props.navigation.goBack();
    } catch (error) {
      console.error("Lỗi khi lưu đơn hàng:", error);
      ToastAndroid.show("Lỗi khi lưu đơn hàng.", ToastAndroid.SHORT);
    }
  };

  return (

    <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <ScrollView>
        <View style={{ flex: 1, marginVertical: 16 }}>
          <Text style={{ color: "#292929", fontSize: 16, fontWeight: 400, paddingHorizontal: 16 }}>Thông tin khách
            hàng</Text>
          <RowItemAction
            description={"Khách hàng"}
            value={selectedCustomer ? selectedCustomer?.customerName : "Khách lẻ"}
            style={{ marginTop: 16, paddingHorizontal: 16, backgroundColor: "#fff" }}
            borderWidth={0}
          />
          <Text style={{ color: "#292929", fontSize: 16, fontWeight: 400, paddingHorizontal: 16, marginTop: 32 }}>Thông
            tin món</Text>

          <View
            style={{ backgroundColor: "#fff", marginVertical: 16, marginHorizontal: 8, borderRadius: 8, elevation: 1 }}>
            <View style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 16,
              marginVertical: 16,
            }}>
              <Text style={{ color: "#888888" }}> Món</Text>
              <Text style={{ color: "#888888" }}> Thành tiền (đ)</Text>
            </View>
            <FlatList
              data={dishOrder}
              renderItem={({ item }) => (
                <View style={{ flexDirection: "row" }}>
                  <Text style={{
                    flex: 0.6,
                    color: "#292929",
                    fontSize: 16,
                    fontWeight: 400,
                    paddingHorizontal: 16,
                    marginVertical: 16,
                  }}>{item.dishName}</Text>
                  <Text style={{
                    flex: 0.3,
                    color: "#292929",
                    fontSize: 16,
                    fontWeight: 400,
                    marginVertical: 16,
                  }}> x{item.quantity}</Text>
                  <Text style={{
                    flex: 0.3,
                    color: "#ff0000",
                    fontSize: 16,
                    fontWeight: 400,
                    paddingRight: 16,
                    marginVertical: 16,
                  }}>{calculateTotalPrice(item.quantity, item.dishPrice).toLocaleString()}</Text>
                </View>
              )}
              ListFooterComponent={
                <View
                  style={{ borderBottomWidth: 1, borderBottomColor: "#888888", borderStyle: "dashed", margin: 16 }} />
              }
            />
            <View style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 16,
              marginVertical: 16,
            }}>
              <Text style={{ color: "#292929", fontSize: 16, fontWeight: 400 }}>Giảm giá</Text>
              <Text style={{ color: "#ff0000", fontSize: 16, fontWeight: 400 }}>đ 0</Text>
            </View>
            <View style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 16,
              marginVertical: 16,
              alignItems: "center",
            }}>
              <Text style={{ color: "#292929", fontSize: 16, fontWeight: 400 }}>Tổng tiền</Text>
              <Text
                style={{ color: "#ff0000", fontSize: 24, fontWeight: 400 }}>đ {getTotalPrice().toLocaleString()}</Text>
            </View>
          </View>
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={{ color: "#292929", fontSize: 16, fontWeight: 500 }}>Phương thức thanh toán</Text>
          </View>
          <View style={{ flexDirection: "row", paddingHorizontal: 16, marginVertical: 16 }}>
            <TouchableOpacity onPress={() => handleSelectMethod('cash')}>
              <View style={methodStyle('cash')}>
                <SvgMoney width={24} height={24} fill={selectedMethod === 'cash' ? "#1E6F5C" : "#000"} />
                <Text style={textStyle('cash')}>Tiền mặt</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelectMethod('bank')}>
              <View style={methodStyle('bank')}>
                <SvgBank width={24} height={24} fill={selectedMethod === 'bank' ? "#1E6F5C" : "#000"} />
                <Text style={textStyle('bank')}>Chuyển khoản</Text>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => handleSelectMethod('card')}>
            <View style={methodStyle('card')}>
              <SvgBank width={24} height={24} fill={selectedMethod === 'card' ? "#1E6F5C" : "#000"} />
              <Text style={textStyle('card')}>Quẹt thẻ</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <ButtonBottom confirmLabel={"Thanh Toán"} onConfirm={handlePayment}/>
    </View>

  );
};

export default Payment;
