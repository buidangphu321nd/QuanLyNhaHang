import React,{useEffect,useState,useCallback} from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { DATABASE, get, ref } from "../../fireBaseConfig";

import CustomerIcon from "../../assets/images/svg/book-user.svg";
import TableIcon from "../../assets/images/svg/Icontable.svg";
import SvgEmployee from "../../assets/images/svg/SvgEmployee.svg";
import Calender from "../../assets/images/svg/calendar.svg";
import SvgOrder from "../../assets/images/svg/SvgOrder.svg";
import StatisticCard from "../../Component/StatisticCard";
import SvgAvatar from "../../assets/images/svg/avatar-svgrepo-com.svg";
import { useFocusEffect } from "@react-navigation/native";

const listAction = [
  { title: "Khách hàng", icon: CustomerIcon, route: "CustomerList", label: "CUSTOMER" },
  { title: "Bàn", icon: TableIcon, route: "ManageTableArea", label: "TABLE_MANAGE" },
  { title: "Nhân viên", icon: SvgEmployee, route: "Staff", label: "EMPLOYEE_MANAGE" },
  { title: "Đặt bàn", icon: Calender, route: "ScheduleManage", label: "RESERVE" },
  { title: "Thực đơn", icon: SvgOrder, route: "Dishes", label: "DISH" },
  { title: "Đơn hàng", icon: SvgOrder, route: "OrderList", label: "ORDER" },

];
const HomeOwner = (props) => {
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [todayOrders, setTodayOrders] = useState(0);
  const [todayReservations, setTodayReservations] = useState(0);

  const fetchTodayData = useCallback(async () => {
    try {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const endOfDay = startOfDay + 86400000; // 24 hours

      const billReff = ref(DATABASE, "bills");
      const snapshot = await get(billReff);
      const data = snapshot.val();
      let revenue = 0;
      let orders = 0;

      if (data) {
        Object.keys(data).forEach(key => {
          const bill = data[key];
          if (bill.createTime >= startOfDay && bill.createTime < endOfDay) {
            orders++;
            revenue += bill.total;
          }
        });
      }
      setTodayRevenue(revenue);
      setTodayOrders(orders);

      const scheduleReff = ref(DATABASE, "schedule");
      const scheduleSnapshot = await get(scheduleReff);
      const scheduleData = scheduleSnapshot.val();
      let reservations = 0;

      if (scheduleData) {
        Object.keys(scheduleData).forEach(key => {
          const schedule = scheduleData[key];
          if (schedule.arrivalTime >= startOfDay && schedule.arrivalTime < endOfDay) {
            reservations++;
          }
        });
      }
      setTodayReservations(reservations);

    } catch (err) {
      console.error("Error fetching data: ", err);
    }
  }, []);


  useFocusEffect(
    useCallback(() => {

      fetchTodayData();
    }, [fetchTodayData]),
  );
  const actionItem = (item) => {
    if (item?.route) {
      props?.navigation?.navigate(item?.route);
    } else {
      item?.action();
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <View style={{
        backgroundColor: "#fff",
        marginTop: 16,
        flexDirection: "row",
        paddingHorizontal: 16,
        justifyContent: "space-between",
      }}>
        <View style={{ marginVertical: 8 }}>
          <Text style={{ color: "#000000", fontSize: 16, fontWeight: 500 }}>Nhà hàng Anh Phú</Text>
          <Text style={{ color: "#888888", fontSize: 14, marginTop: 8 }}>Chủ cửa hàng</Text>
        </View>
        <View style={{ marginTop: 16 }}>
          <TouchableOpacity onPress={() => props.navigation.navigate("HomeInformation")}>
            <SvgAvatar width={28} height={28} />
          </TouchableOpacity>

        </View>
      </View>
      <FlatList
        data={listAction}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        contentContainerStyle={{
          justifyContent: "space-between",
        }}
        ListHeaderComponent={
          <StatisticCard
            title={"Doanh thu hôm nay"}
            total={`${todayRevenue.toLocaleString()}đ`}
            onPress={() => {
              props?.navigation?.navigate("Report");
            }}
          >
            <View style={{ flexDirection: "row", marginVertical: 16 }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ color: "#888888", paddingRight: 10 }}>Đơn hàng:</Text>
                  <Text style={{ color: "#292929" }}>
                    {todayOrders}
                  </Text>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ color: "#888888", paddingRight: 10 }}>Lượt đặt bàn:</Text>
                  <Text style={{ color: "#292929" }}>
                    {todayReservations}
                  </Text>
                </View>

              </View>
            </View>
          </StatisticCard>
        }
        renderItem={({ item, index }) => (
          <View style={{ alignItems: "center", flexBasis: `${100 / 3}%`, marginBottom: 24 }}>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                actionItem(item);
              }}
            >
              <View
                style={{
                  backgroundColor: "#1E6F5C",
                  height: 60,
                  width: 60,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 14,
                }}
              >
                <item.icon fill={"white"} height={30} width={30} />

              </View>
            </TouchableOpacity>
            <Text
              numberOfLines={2}
              style={{ paddingTop: 6, textAlign: "center", color: "black" }}
            >
              {item?.title}
            </Text>
          </View>
        )}

      />
    </View>
  );
};

export default HomeOwner;
