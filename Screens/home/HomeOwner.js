import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

import CustomerIcon from '../../assets/images/svg/book-user.svg';
import TableIcon from '../../assets/images/svg/Icontable.svg';
import SvgEmployee from '../../assets/images/svg/SvgEmployee.svg';
import Calender from '../../assets/images/svg/calendar.svg';
import SvgOrder from '../../assets/images/svg/SvgOrder.svg';
import ImgEmpty from "../../assets/images/Emty.png";

const listAction = [
  { title: 'Khách hàng', icon: CustomerIcon, route: 'CustomerList', label: 'CUSTOMER' },
  { title: 'Bàn', icon: TableIcon, route: 'ManageTableArea', label: 'TABLE_MANAGE' },
  { title: 'Nhân viên', icon: SvgEmployee, route: 'Staff', label: 'EMPLOYEE_MANAGE' },
  { title: 'Đặt bàn', icon: Calender, route: 'ScheduleManage', label: 'RESERVE' },
  { title: 'Thực đơn', icon: SvgOrder, route: 'Dishes', label: 'DISH' },
  { title: 'Đơn hàng', icon: SvgOrder, route: 'OrderList', label: 'ORDER' },

];
const HomeOwner = (props) => {
  const actionItem = (item) => {
    if (item?.route) {
      props?.navigation?.navigate(item?.route);
    } else {
      item?.action();
    }
  };
   return (
     <View style={{flex:1,backgroundColor:"#fafafa"}}>
        <FlatList
          data={listAction}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          contentContainerStyle={{
            justifyContent: 'space-between',
          }}
          renderItem={({ item, index }) => (
            <View style={{ alignItems: 'center', flexBasis: `${100 / 3}%`, marginBottom: 24 }}>
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
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
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 14,
                  }}
                >
                  <item.icon fill={'white'} height={30} width={30} />

                </View>
              </TouchableOpacity>
              <Text
                numberOfLines={2}
                style={{ paddingTop: 6, textAlign: 'center',color:"black" }}
              >
                {item?.title}
              </Text>
            </View>
          )}

        />
     </View>
   )
}

export default HomeOwner;
