import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SvgTable from './assets/images/svg/lamp_fill.svg';
import SvgTableOutline from './assets/images/svg/lamp_outline.svg';
import SvgFileIconOutline from './assets/images/svg/FileIconOutline.svg';
import SvgHomeOutLine from './assets/images/svg/SvgHomeOutLine.svg';
import SvgHome from './assets/images/svg/SvgHomeIcon.svg';
import StackOutline from './assets/images/svg/layers_outLine.svg';
import StackFill from './assets/images/svg/layers.svg';
import SvgOrder from './assets/images/svg/SvgOrder.svg';
import HomeOwner from "./Screens/home/HomeOwner";
import ScheduleManage from "./Screens/schedule/ScheduleManage";
import FoodOrder from "./Screens/kitchen/FoodOrder";
import { createNativeStackNavigator } from "react-native-screens/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import CustomerList from "./Screens/customer/CustomerList";
import CustomerCreate from "./Screens/customer/CustomerCreate";
import { SafeAreaView } from "react-native";
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

const Tab = createBottomTabNavigator();
const headerOptions = {
  headerStyle: {
    backgroundColor: '#fff',
  },
  headerTintColor: '#292929',
  headerTitleStyle: {
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
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
        component={ScheduleManage}
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
          headerShown: false,
        }}

      />

      <Tab.Screen
        name='ListFood'
        component={FoodOrder}
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
          name='MyTabOwner'
          component={MyTabOwner}
          options={{ headerShown: false}}

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
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Routes;
