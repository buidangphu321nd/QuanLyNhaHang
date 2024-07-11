import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SvgTable from './assets/images/svg/lamp_fill.svg';
import SvgTableOutline from './assets/images/svg/lamp_outline.svg';
import SvgFileIconOutline from './assets/images/svg/FileIconOutline.svg';
import SvgHomeOutLine from './assets/images/svg/SvgHomeOutLine.svg';
import SvgHome from './assets/images/svg/SvgHomeIcon.svg';
import SvgOrder from './assets/images/svg/SvgOrder.svg';
import HomeOwner from "./Screens/home/HomeOwner";
import ScheduleManage from "./Screens/schedule/ScheduleManage";
import FoodOrder from "./Screens/kitchen/FoodOrder";
import { createNativeStackNavigator } from "react-native-screens/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import CustomerList from "./Screens/customer/CustomerList";
import CustomerCreate from "./Screens/customer/CustomerCreate";

import CustomerDetail from "./Screens/customer/CustomerDetail";
import TableManage from "./Screens/table/TableManage";
import AreaManage from "./Screens/area/AreaManage";
import TableCreate from "./Screens/table/TableCreate";
import TableDetail from "./Screens/table/TableDetail";
import Staff from "./Screens/staff/Staff";
import StaffCreate from "./Screens/staff/StaffCreate";
import StaffRole from "./Screens/staff/StaffRole";
import StaffDetail from "./Screens/staff/StaffDetail";
import ScheduleBook from "./Screens/schedule/ScheduleBook";
import Dishes from "./Screens/dishe/Dishes";
import DishCategory from "./Screens/dishe/DishCategory";
import DishMenu from "./Screens/dishe/DishMenu";
import DishDetail from "./Screens/dishe/DishDetail";
import tableOrderManage from "./Screens/bottomBar/TableOrderManage";
import TableOrderManageDetail from "./Screens/bottomBar/TableOrderManageDetail";
import TableOrderUsed from "./Screens/bottomBar/TableOrderUsed";
import TableOrderMenu from "./Screens/bottomBar/TableOrderMenu";
import Payment from "./Screens/payment/Payment";
import TableChange from "./Screens/bottomBar/TableChange";
import Kitchen from "./Screens/bottomBar/Kitchen";
import Report from "./Screens/report/Report";
import OrderList from "./Screens/orderList/orderList";
import OrderListDetail from "./Screens/orderList/orderListDetail";
import Login from "./Screens/login/Login";
import HomeInformation from "./Screens/home/HomeInformation";

const Tab = createBottomTabNavigator();
const headerOptions = {
  headerTintColor: '#292929',
  headerTitleStyle: {
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  headerTitleAlign: 'center',
  headerBackTitleVisible: false,
  headerShadowVisible: false,
};

const MyTabOwner = () => {
  const screenOptions = {
    tabBarActiveTintColor: "#1E6F5C",
    tabBarInactiveTintColor: "#888888",
    headerShown: false,
    tabBarStyle: {height:64,paddingTop:6},
    tabBarLabelStyle:{paddingBottom: 6},
  };
  return (
    <Tab.Navigator
      screenOptions={{
        ...screenOptions, ...headerOptions, headerShown: true,

      }}>
      <Tab.Screen
        name='HomeTab'
        component={HomeOwner}
        options={{
          tabBarIcon: ({ focused, color, size }) =>
            focused ? (
              <SvgHome fill={color} width={size} />
            ) : (
              <SvgHomeOutLine
                fill={color} width={size} />
            ),
          headerShown: false,
          tabBarLabel: 'Trang chủ',
        }}/>

      <Tab.Screen
        name='ManageOrder'
        component={tableOrderManage}
        options={{
          tabBarIcon: ({ focused, color, size }) =>
            focused ? (
              <SvgTable fill={color} width={size} height={size} />
            ) : (
              <SvgTableOutline fill={color} width={size} height={size} />
            ),

          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: "#fff" },
          tabBarLabel: 'Bàn',
          headerShown: false
        }}

      />

      <Tab.Screen
        name='Kitchen'
        component={Kitchen}
        initialParams={{ hideBackButton: true }}
        options={{
          tabBarIcon: ({ focused, color, size }) =>
            focused ? (
              <SvgOrder fill={color} width={size} />
            ) : (
              <SvgFileIconOutline fill={color} width={size} />
            ),
          tabBarLabel: 'Bếp, bar',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  )
}
const Stack = createNativeStackNavigator();
const Routes = (props) => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ ...headerOptions}}>
        <Stack.Screen
          name='Login'
          component={Login}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name='MyTabOwner'
          component={MyTabOwner}
          options={{ headerShown: false}}
        />
        <Stack.Screen
          name='HomeInformation'
          component={HomeInformation}
          options={{ title: 'Cửa hàng' }}
        />
        <Stack.Screen
          name='CustomerList'
          component={CustomerList}
          options={{ title: 'Khách hàng' }}
        />
        <Stack.Screen
          name='CustomerCreate'
          component={CustomerCreate}
          options={{ title: 'Thêm mới khách hàng' }}
        />
        <Stack.Screen
          name='CustomerDetail'
          component={CustomerDetail}
          options={{ title: 'Thông tin khách hàng' }}
        />
        <Stack.Screen
          name='ManageTableArea'
          component={TableManage}
          options={{ title: 'Quản lý bàn' }}
        />
        <Stack.Screen
          name='ManageArea'
          component={AreaManage}
          options={{ title: 'Quản lý khu vực' }}
        />
        <Stack.Screen
          name='TableCreate'
          component={TableCreate}
          options={{ title: 'Thêm bàn' }}
        />
        <Stack.Screen
          name='TableDetail'
          component={TableDetail}
          options={{ title: 'Chi tiết bàn' }}
        />

        <Stack.Screen
          name='Staff'
          component={Staff}
          options={{ title: 'Nhân viên' }}
        />
        <Stack.Screen
        name='StaffCreate'
        component={StaffCreate}
        options={{ title: 'Thêm nhân viên' }}
        />
        <Stack.Screen
          name='StaffRole'
          component={StaffRole}
          options={{ title: 'Vai trò' }}
        />
        <Stack.Screen
          name='StaffDetail'
          component={StaffDetail}
          options={{ title: 'Thông tin nhân viên' }}
        />
        <Stack.Screen
          name='ScheduleManage'
          component={ScheduleManage}
          options={{
            title: 'Danh sách đặt bàn'
          }}
        />
        <Stack.Screen
        name='ScheduleBook'
        component={ScheduleBook}
        options={{
          title: 'Đặt bàn'
        }}
      />
        <Stack.Screen
          name='Dishes'
          component={Dishes}
          options={{
            title: 'Thực đơn'
          }}
        />
        <Stack.Screen
          name='DishCategory'
          component={DishCategory}
          options={{
            title: 'Danh mục'
          }}
        />
        <Stack.Screen
          name='DishMenu'
          component={DishMenu}
          options={{
            title: 'Thêm thực đơn'
          }}
        />
        <Stack.Screen
          name='DishDetail'
          component={DishDetail}
          options={{
            title: 'Thông tin món ăn'
          }}
        />
        <Stack.Screen
          name='TableOrderManageDetail'
          component={TableOrderManageDetail}
          options={({ route }) => ({
            title: `${route.params?.tableDetail?.tableName} - ${route.params?.tableDetail?.floorName}`
          })}
        />
        <Stack.Screen
          name='TableOrderUsed'
          component={TableOrderUsed}
          options={({ route }) => ({
            title: `${route.params?.tableDetail?.tableName} - ${route.params?.tableDetail?.floorName}`
          })}
        />
        <Stack.Screen
          name='TableOrderMenu'
          component={TableOrderMenu}
          options={{
            title: 'Gọi món'
          }}
        />
        <Stack.Screen
          name='PaymentStep1'
          component={Payment}
          options={({ route }) => ({
            title: `${route.params?.tableDetail?.tableName} - ${route.params?.tableDetail?.floorName}`
          })}
        />
        <Stack.Screen
          name='TableChange'
          component={TableChange}
          options={({ route }) => ({
            title: `${route.params?.tableDetail?.tableName} - ${route.params?.tableDetail?.floorName}`
          })}
        />
        <Stack.Screen
          name='Report'
          component={Report}
          options={{title:"Báo cáo"}}
        />
        <Stack.Screen
          name='OrderList'
          component={OrderList}
          options={{title:"Đơn hàng"}}
        />
        <Stack.Screen
          name='OrderListDetail'
          component={OrderListDetail}
          options={{title:"Chi tiết đơn hàng"}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Routes;
