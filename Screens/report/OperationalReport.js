import React, { useCallback, useEffect, useState } from "react";
import { Text, TouchableOpacity, View,FlatList} from "react-native";
import SvgCalendar from "../../assets/images/svg/calendar.svg";
import StatisticCard from "../../Component/StatisticCard";
import { DATABASE, get, ref } from "../../fireBaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import DatePicker from "react-native-date-picker";
import ButtonBottom from "../../Component/ButtonBottom";
import ModalBottom from "../../Component/ModalBottom";

const OperationalReport = () => {
  const [selected, setSelected] = useState("CurrentDay");
  const [listBill, setListBill] = useState([]);
  const [listSchedule, setListSchedule] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [tableReservations, setTableReservations] = useState(0);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);

  const FetchListBill = useCallback(async () => {
    try {
      const billReff = ref(DATABASE, "bills");
      const snapshot = await get(billReff);
      const data = snapshot.val();
      if (data) {
        const billArray = Object.keys(data).map(key => ({
          billId: key,
          ...data[key],
        }));
        setListBill(billArray);
      }
    } catch (err) {
      console.error("Error: ", err);
    }
  }, []);

  const FetchListSchedule = useCallback(async () => {
    try {
      const scheduleReff = ref(DATABASE, "schedule");
      const snapshot = await get(scheduleReff);
      const data = snapshot.val();
      if (data) {
        const scheduleArray = Object.keys(data).map(key => ({
          scheduleId: key,
          ...data[key],
        }));
        setListSchedule(scheduleArray);
      }
    } catch (err) {
      console.error("Error: ", err);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      FetchListBill();
      FetchListSchedule();
    }, [FetchListBill, FetchListSchedule]),
  );

  useEffect(() => {
    calculateMetrics();
  }, [listBill, listSchedule, selected]);

  const calculateMetrics = () => {
    const now = new Date();
    let startOfPeriod, endOfPeriod;

    switch (selected) {
      case "CurrentDay":
        startOfPeriod = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        endOfPeriod = startOfPeriod + 86400000; // 24 hours
        break;
      case "PreviousDay":
        startOfPeriod = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).getTime();
        endOfPeriod = startOfPeriod + 86400000; // 24 hours
        break;
      case "CurrentMonth":
        startOfPeriod = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        endOfPeriod = new Date(now.getFullYear(), now.getMonth() + 1, 0).getTime() + 86400000; // End of month
        break;
      case "Custom":
        startOfPeriod = fromDate.getTime();
        endOfPeriod = toDate.getTime() + 86400000; // Bao gồm cả ngày cuối
        break;
      default:
        return;
    }

    let ordersCount = 0;
    let productsCount = 0;
    const productMap = {};

    listBill.forEach(bill => {
      if (bill.createTime >= startOfPeriod && bill.createTime < endOfPeriod) {
        ordersCount++;
        bill.items.forEach(item => {
          productsCount += item.quantity;
          if (!productMap[item.dishName]) {
            productMap[item.dishName] = { quantity: 0, revenue: 0 };
          }
          productMap[item.dishName].quantity += item.quantity;
          const dishPrice = parseFloat(item.dishPrice.replace(/,/g, '')); // Chuyển đổi dishPrice từ chuỗi thành số
          if (!isNaN(dishPrice)) {
            productMap[item.dishName].revenue += item.quantity * dishPrice;
          }
        });
      }
    });

    const bestSelling = Object.keys(productMap)
      .map(dishName => ({
        dishName,
        ...productMap[dishName],
      }))
      .sort((a, b) => b.quantity - a.quantity); // Sắp xếp theo số lượng từ lớn đến bé

    setTotalOrders(ordersCount);
    setTotalProducts(productsCount);
    setTableReservations(listSchedule.filter(schedule => schedule.arrivalTime >= startOfPeriod && schedule.arrivalTime < endOfPeriod).length);
    setBestSellingProducts(bestSelling);
  };

  console.log("BestSelling: ",bestSellingProducts);
  const getButtonStyle = (section) => ({
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1E6F5C",
    alignItems: "center",
    minWidth: 50,
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: selected === section ? "#1E6F5C" : "#fff",
  });

  const getTextStyle = (section) => ({
    color: selected === section ? "#fff" : "#1E6F5C",
  });

  const getCalendarFill = (section) => (selected === section ? "#fff" : "#1E6F5C");

  return (
    <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <View>
        <View style={{ flexDirection: "row", marginTop: 8, paddingHorizontal: 16 }}>
          <TouchableOpacity style={getButtonStyle("ALL")} onPress={() => {
            setSelected("ALL"), setIsModal(true);
          }}>
            <SvgCalendar width={16} height={16} fill={getCalendarFill("ALL")} />
          </TouchableOpacity>
          <TouchableOpacity style={[{ marginLeft: 8 }, getButtonStyle("CurrentDay")]} onPress={() => setSelected("CurrentDay")}>
            <Text style={getTextStyle("CurrentDay")}>Hôm nay</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[{ marginLeft: 8 }, getButtonStyle("PreviousDay")]} onPress={() => setSelected("PreviousDay")}>
            <Text style={getTextStyle("PreviousDay")}>Hôm qua</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[{ marginLeft: 8 }, getButtonStyle("CurrentMonth")]} onPress={() => setSelected("CurrentMonth")}>
            <Text style={getTextStyle("CurrentMonth")}>Tháng này</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <StatisticCard
          title={"Tổng số đơn hàng"}
          total={`${totalOrders}`}
        >
          <View style={{ marginVertical: 16 }}>
            <View>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ color: "#888888", paddingRight: 10 }}>Tổng sản phẩm</Text>
                <Text style={{ color: "#292929" }}>{totalProducts}</Text>
              </View>
            </View>
            <View>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                <Text style={{ color: "#888888", paddingRight: 10 }}>Lượt đặt bàn</Text>
                <Text style={{ color: "#292929" }}>{tableReservations}</Text>
              </View>
            </View>
          </View>
        </StatisticCard>
        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, marginTop: 8 }}>
          <Text style={{ color: "#000", fontSize: 16, fontWeight: 500 }}>Sản phẩm bán chạy</Text>
          {/*<TouchableOpacity>*/}
          {/*  <Text style={{ color: "#1E6F5C", fontSize: 14, fontWeight: 400 }}>Xem tất cả</Text>*/}
          {/*</TouchableOpacity>*/}
        </View>
        <View style={{ backgroundColor: "#fff", elevation: 1, paddingHorizontal: 16, marginVertical: 8 }}>
          <View style={{ flexDirection: "row", marginVertical: 8, borderBottomColor: "#ddd", borderBottomWidth: 1 }}>
            <Text style={{ flex: 0.8, color: "#000", fontSize: 14, fontWeight: 400 }}>Sản phẩm</Text>
            <Text style={{ flex: 0.3, color: "#000", fontSize: 14, fontWeight: 400 }}>SL</Text>
            <Text style={{ flex: 0.3, color: "#000", fontSize: 14, fontWeight: 400, marginBottom: 8 }}>Doanh Thu</Text>
          </View>
          <FlatList
            data={bestSellingProducts}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <View style={{ flexDirection: "row", marginVertical: 8 }}>
                <Text style={{ flex: 0.8, color: "#000", fontSize: 14, fontWeight: 400 }}>{item.dishName}</Text>
                <Text style={{ flex: 0.3, color: "#000", fontSize: 14, fontWeight: 400 }}>{item.quantity}</Text>
                <Text style={{ flex: 0.3, color: "#000", fontSize: 14, fontWeight: 400 }}>{item.revenue.toLocaleString()}đ</Text>
              </View>
            )}
          />
        </View>
      </View>
      <ModalBottom
        title={"Bộ Lọc Thời Gian"}
        visible={isModal}
        setVisible={setIsModal}
      >
        <View style={{ paddingHorizontal: 16, marginVertical: 16 }}>
          <Text style={{ color: "#000", fontWeight: 400 }}>Chọn thời gian tùy chỉnh</Text>
          <View style={{ flexDirection: "row", marginVertical: 16, alignItems: "center" }}>
            <Text style={{ color: "#000", fontWeight: 400 }}>Từ</Text>
            <View style={{ marginHorizontal: 8, borderRadius: 8, borderWidth: 1, borderColor: "#ddd" }}>
              <TouchableOpacity style={{ padding: 8, flexDirection: "row", alignItems: "center" }}
                                onPress={() => setOpenFrom(true)}>
                <SvgCalendar fill={"#888888"} height={24} width={24} />
                <Text style={{ marginLeft: 8, color: "#888",}}>
                  {fromDate.toLocaleDateString("vi-VN")}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={{ color: "#000", fontWeight: 400 }}>Đến</Text>
            <View style={{ marginHorizontal: 8, borderRadius: 8, borderWidth: 1, borderColor: "#ddd" }}>
              <TouchableOpacity style={{ padding: 8, flexDirection: "row", alignItems: "center" }}
                                onPress={() => setOpenTo(true)}>
                <SvgCalendar fill={"#888888"} height={24} width={24} />
                <Text style={{ marginLeft: 8, color: "#888"}}>
                  {toDate.toLocaleDateString("vi-VN")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {openFrom && (
            <DatePicker
              modal
              open={openFrom}
              date={fromDate}
              onConfirm={(date) => {
                setFromDate(date);
                setOpenFrom(false);
              }}
              onCancel={() => {
                setOpenFrom(false);
              }}
              mode="date"
              locale="vi"
            />
          )}

          {openTo && (
            <DatePicker
              modal
              open={openTo}
              date={toDate}
              onConfirm={(date) => {
                setToDate(date);
                setOpenTo(false);
              }}
              onCancel={() => {
                setOpenTo(false);
              }}
              mode="date"
              locale="vi"
            />
          )}
        </View>
        <ButtonBottom
          cancelLabel={"Hủy"}
          confirmLabel={"Đồng ý"}
          onCancel={() => setIsModal(false)}
          onConfirm={() => {
            setSelected("Custom"); // Cập nhật trạng thái lựa chọn
             calculateMetrics();
            setIsModal(false);
          }}
        />
      </ModalBottom>
    </View>
  );
}

export default OperationalReport;
