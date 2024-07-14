import React, { useCallback, useEffect, useState } from "react";
import { DATABASE, get, ref } from "../../fireBaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SvgCalendar from "../../assets/images/svg/calendar.svg";
import StatisticCard from "../../Component/StatisticCard";
import MyBarChart from "../../Component/MyBarChart";
import ModalBottom from "../../Component/ModalBottom";
import DatePicker from "react-native-date-picker";
import ButtonBottom from "../../Component/ButtonBottom";

const FinacialReport = () => {
  const [selected, setSelected] = useState("CurrentDay");
  const [listBill, setListBill] = useState([]);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [cashRevenue, setCashRevenue] = useState(0);
  const [bankRevenue, setBankRevenue] = useState(0);
  const [cardRevenue, setCardRevenue] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [xAxisLabels, setXAxisLabels] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);


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

  useFocusEffect(
    useCallback(() => {
      FetchListBill();
    }, [FetchListBill]),
  );

  useEffect(() => {
    calculateRevenue();
  }, [listBill, selected]);

  const calculateRevenue = () => {
    const now = new Date();
    let startOfPeriod, endOfPeriod;

    switch (selected) {
      case "CurrentDay":
        startOfPeriod = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        endOfPeriod = startOfPeriod + 86400000; // 24 giờ
        break;
      case "PreviousDay":
        startOfPeriod = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).getTime();
        endOfPeriod = startOfPeriod + 86400000; // 24 giờ
        break;
      case "CurrentMonth":
        startOfPeriod = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        endOfPeriod = new Date(now.getFullYear(), now.getMonth() + 1, 0).getTime() + 86400000; // Tới cuối tháng
        break;
      case "Custom":
        startOfPeriod = fromDate.getTime();
        endOfPeriod = toDate.getTime() + 86400000; // Bao gồm cả ngày cuối
        break;
      default:
        return;
    }

    let todayTotal = 0;
    let cashTotal = 0;
    let bankTotal = 0;
    let cardTotal = 0;

    listBill.forEach(bill => {
      if (bill.createTime >= startOfPeriod && bill.createTime < endOfPeriod) {
        todayTotal += bill.total;
        if (bill.paymentMethod === "cash") {
          cashTotal += bill.total;
        } else if (bill.paymentMethod === "bank") {
          bankTotal += bill.total;
        } else if (bill.paymentMethod === "card") {
          cardTotal += bill.total;
        }
      }
    });

    setTodayRevenue(todayTotal);
    setCashRevenue(cashTotal);
    setBankRevenue(bankTotal);
    setCardRevenue(cardTotal);
  };

  const generateXAxisLabels = () => {
    const now = new Date();
    const labels = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
      labels.push(formattedDate);
    }
    setXAxisLabels(labels);
  };
  useEffect(() => {
    generateXAxisLabels();
  }, []);

  const calculateChartData = () => {
    const now = new Date();
    const data = Array(7).fill(0);

    listBill.forEach(bill => {
      const billDate = new Date(bill.createTime);
      for (let i = 0; i < 7; i++) {
        const targetDate = new Date(now);
        targetDate.setDate(now.getDate() - i);
        if (
          billDate.getFullYear() === targetDate.getFullYear() &&
          billDate.getMonth() === targetDate.getMonth() &&
          billDate.getDate() === targetDate.getDate()
        ) {
          data[6 - i] += bill.total;
        }
      }
    });

    const scaledData = data.map(value => value / 1000); // Chia cho 1000
    setChartData(scaledData);
  };
  useEffect(() => {
    calculateChartData();
  }, [listBill]);
  return (
    <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <View>
        <View style={{ flexDirection: "row", marginTop: 8, paddingHorizontal: 16 }}>
          <TouchableOpacity style={getButtonStyle("ALL")} onPress={() => {
            setSelected("ALL"), setIsModal(true);
          }}>
            <SvgCalendar width={16} height={16} fill={getCalendarFill("ALL")} />
          </TouchableOpacity>
          <TouchableOpacity style={[{ marginLeft: 8 }, getButtonStyle("CurrentDay")]}
                            onPress={() => setSelected("CurrentDay")}>
            <Text style={getTextStyle("CurrentDay")}>Hôm nay</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[{ marginLeft: 8 }, getButtonStyle("PreviousDay")]}
                            onPress={() => setSelected("PreviousDay")}>
            <Text style={getTextStyle("PreviousDay")}>Hôm qua</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[{ marginLeft: 8 }, getButtonStyle("CurrentMonth")]}
                            onPress={() => setSelected("CurrentMonth")}>
            <Text style={getTextStyle("CurrentMonth")}>Tháng này</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <StatisticCard
          title={"Doanh thu"}
          total={`${todayRevenue.toLocaleString()}đ`}
        >
          <View style={{ marginVertical: 16 }}>
            <View>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ color: "#888888", paddingRight: 10 }}>Tiền mặt</Text>
                <Text style={{ color: "#292929" }}>{cashRevenue.toLocaleString()}đ</Text>
              </View>
            </View>
            <View>
              <View
                style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                <Text style={{ color: "#888888", paddingRight: 10 }}>Chuyển khoản</Text>
                <Text style={{ color: "#292929" }}>{bankRevenue.toLocaleString()}đ</Text>
              </View>
            </View>
            <View>
              <View
                style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                <Text style={{ color: "#888888", paddingRight: 10 }}>Quẹt thẻ</Text>
                <Text style={{ color: "#292929" }}>{cardRevenue.toLocaleString()}đ</Text>
              </View>
            </View>
          </View>
        </StatisticCard>
      </View>
      <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
        <Text style={{ fontSize: 16, color: "#000", fontWeight: 500 }}>Biểu đồ doanh thu</Text>
      </View>
      <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
        <Text style={{ fontSize: 14, color: "#000", fontWeight: 400 }}>Số tiền(k)</Text>
        <MyBarChart
          datas={chartData}
          xAxisLabels={xAxisLabels}
          barColors={["#1E6F5C", "#3498DB"]}
          style={{ height: 300 }}
          // xUnit={"VNĐ"}
        />
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
                <Text style={styles.dateText}>
                  {fromDate.toLocaleDateString("vi-VN")}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={{ color: "#000", fontWeight: 400 }}>Đến</Text>
            <View style={{ marginHorizontal: 8, borderRadius: 8, borderWidth: 1, borderColor: "#ddd" }}>
              <TouchableOpacity style={{ padding: 8, flexDirection: "row", alignItems: "center" }}
                                onPress={() => setOpenTo(true)}>
                <SvgCalendar fill={"#888888"} height={24} width={24} />
                <Text style={styles.dateText}>
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
            calculateRevenue(); // Gọi lại hàm tính doanh thu
            setIsModal(false); // Đóng modal
          }}
        />
      </ModalBottom>
    </View>
  );
};

export default FinacialReport;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  activeTab: {
    borderBottomWidth: 1,
    borderBottomColor: "#1E6F5C",
  },
  tabText: {
    color: "#888888",
    fontSize: 14,
  },
  activeText: {
    color: "#1E6F5C",
  },
  dateText: {
    marginLeft: 8,
    color: "#888",
  },
});
