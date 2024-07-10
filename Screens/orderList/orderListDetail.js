import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import SvgDone from "../../assets/images/svg/done.svg";
import SvgPrint from "../../assets/images/svg/print.svg";

const OrderListDetail = (props) => {
  const { item } = props.route.params;
  console.log("item", item);
  const orderDish = item.items;
  console.log("Order Dish: ", orderDish);

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  const parsePrice = (price) => {
    if (!price) return 0;
    const numericPrice = parseInt(price.replace(/,/g, ""), 10); // Remove commas and convert to integer
    return isNaN(numericPrice) ? 0 : numericPrice;
  };

  const calculateTotalPrice = (quantity, price) => {
    return quantity * parsePrice(price);
  };

  const getTotalPrice = () => {
    return orderDish.reduce((acc, item) => acc + calculateTotalPrice(item.quantity, item.dishPrice), 0);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <View style={{ alignItems: "center", marginTop: 24 }}>
        <SvgDone height={44} width={44} fill={"#27AE60"} />
        <Text style={{ fontSize: 16, color: "#000", fontWeight: "500", marginTop: 8 }}>Hoàn thành</Text>
      </View>

      <View style={{ backgroundColor: "#fff", marginVertical: 16, marginHorizontal: 8, borderRadius: 8, elevation: 1 }}>
        <View style={{ alignItems: "center", marginVertical: 8 }}>
          <Text style={{ color: "#000", fontWeight: 500, fontSize: 16 }}>Hóa đơn #{item.billId}</Text>
          <Text style={{
            color: "#888",
            fontWeight: 400,
            fontSize: 14,
            marginTop: 8,
          }}>{formatDateTime(item.createTime)}</Text>
          <Text style={{ color: "#888", fontWeight: 400, fontSize: 14, marginTop: 8 }}>Khách
            hàng: {item.customerName3}</Text>

        </View>
        <View style={{
          marginTop: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#ddd",
          borderStyle: "dashed",
          marginHorizontal: 16,
        }} />
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
          data={orderDish}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={{ flexDirection: "row" }}>
              <Text style={{
                flex: 0.6,
                color: "#292929",
                fontSize: 16,
                fontWeight: "400",
                paddingHorizontal: 16,
                marginVertical: 8,
              }}>{item.dishName}</Text>
              <Text style={{
                flex: 0.3,
                color: "#292929",
                fontSize: 16,
                fontWeight: "400",
                marginVertical: 8,
              }}> x{item.quantity}</Text>
              <Text style={{
                flex: 0.3,
                color: "#ff0000",
                fontSize: 16,
                fontWeight: "400",
                paddingRight: 16,
                marginVertical: 8,
              }}>{calculateTotalPrice(item.quantity, item.dishPrice).toLocaleString()}</Text>
            </View>
          )}
        />
        <View style={{
          marginTop: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#ddd",
          borderStyle: "dashed",
          marginHorizontal: 16,
        }} />
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          marginVertical: 8,
        }}>
          <Text style={{ color: "#292929", fontSize: 16, fontWeight: 400 }}>Giảm giá</Text>
          <Text style={{ color: "#ff0000", fontSize: 16, fontWeight: 400 }}>đ 0</Text>
        </View>
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          marginVertical: 8,
          alignItems: "center",
        }}>
          <Text style={{ color: "#292929", fontSize: 16, fontWeight: 400 }}>Tổng tiền</Text>
          <Text
            style={{ color: "#ff0000", fontSize: 18, fontWeight: 400 }}>đ {getTotalPrice().toLocaleString()}</Text>
        </View>
        <View style={{
          marginTop: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#ddd",
          borderStyle: "dashed",
          marginHorizontal: 16,
        }} />
        <View style={{ alignItems: "center", marginVertical: 16 }}>
          <View style={{
            backgroundColor: "rgba(39, 174, 96, 0.1)",
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#27AE60",
          }}>
            <Text style={{ color: "#27AE60", paddingVertical: 4, paddingHorizontal: 8, textAlign: "center" }}>Đã thanh
              toán</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={{ alignItems: "center" }}>
        <View style={{ flexDirection: "row", marginVertical: 8, alignItems: "center" }}>
          <SvgPrint height={18} width={18} />
          <Text style={{ color: "#000", marginLeft: 8 }}>In hoá đơn</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default OrderListDetail;
