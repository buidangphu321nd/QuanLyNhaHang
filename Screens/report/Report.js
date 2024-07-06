import React, { useCallback, useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SvgCalendar from "../../assets/images/svg/calendar.svg";
import StatisticCard from "../../Component/StatisticCard";
import MyBarChart from "../../Component/MyBarChart";
import { DATABASE, get, ref } from "../../fireBaseConfig";
import { useFocusEffect } from "@react-navigation/native";

const Report = (props) => {
  const [activeStatus, setActiveStatus] = useState("Tài chính");
  const statusOptions = ["Tài chính", "Vận hành"];
  const [selected, setSelected] = useState("CurrentDay");
  const [listBill, setListBill] = useState([]);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [cashRevenue, setCashRevenue] = useState(0);
  const [bankRevenue, setBankRevenue] = useState(0);
  const [cardRevenue, setCardRevenue] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [xAxisLabels, setXAxisLabels] = useState([]);

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
        // Xử lý cho trường hợp chọn khoảng thời gian tùy chọn
        // Ví dụ: startOfPeriod = customStartDate.getTime();
        // endOfPeriod = customEndDate.getTime() + 86400000;
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
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      labels.push(formattedDate);
    }
    setXAxisLabels(labels);
  };
  useEffect(() => {
    generateXAxisLabels()
  },[])

  const calculateChartData = () => {
    const now = new Date();
    const daysInMillis = 86400000;
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
  },[listBill])
  return (
    <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <View style={styles.container}>
        {statusOptions.map((status, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, activeStatus === status && styles.activeTab]}
            onPress={() => setActiveStatus(status)}
          >
            <Text style={[styles.tabText, activeStatus === status && styles.activeText]}>
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View>
        <View style={{ flexDirection: "row", marginTop: 16, paddingHorizontal: 16 }}>
          <TouchableOpacity style={getButtonStyle("ALL")} onPress={() => setSelected("ALL")}>
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
          title={"Doanh thu"}
          total={`${todayRevenue.toLocaleString()}đ`}
          onPress={() => {
            props?.navigation?.navigate("Report");
          }}
        >
          <View style={{ marginVertical: 16 }}>
            <View>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ color: "#888888", paddingRight: 10 }}>Tiền mặt</Text>
                <Text style={{ color: "#292929" }}>{cashRevenue.toLocaleString()}đ</Text>
              </View>
            </View>
            <View>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                <Text style={{ color: "#888888", paddingRight: 10 }}>Chuyển khoản</Text>
                <Text style={{ color: "#292929" }}>{bankRevenue.toLocaleString()}đ</Text>
              </View>
            </View>
            <View>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                <Text style={{ color: "#888888", paddingRight: 10 }}>Quẹt thẻ</Text>
                <Text style={{ color: "#292929" }}>{cashRevenue.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        </StatisticCard>
      </View>
      <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
        <Text style={{ fontSize: 16, color: "#000", fontWeight: 500 }}>Biểu đồ doanh thu</Text>
      </View>
      <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
        <Text style={{ fontSize: 14, color: "#000", fontWeight: 400, position: "absolute", left: 16 }}>Số tiền(k)</Text>
        <MyBarChart
          datas={chartData}
          xAxisLabels={xAxisLabels}
          barColors={["#1E6F5C", "#3498DB"]}
          style={{ height: 300 }}
          xUnit={"VNĐ"}
        />
      </View>
    </View>
  );
}

export default Report;

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
});
