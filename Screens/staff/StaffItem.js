import React from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import SvgArrowRight from "../../assets/images/svg/SvgArrowRight.svg"

const StaffItem = (props) => {
  const {
    item, index, onPress = () => {
    },
  } = props;


  return (
    <View style={{backgroundColor:"#fff",paddingVertical:8,}}>
      <TouchableOpacity
        onPress={() => onPress(item, index)}
        style={[{ flexDirection: "row", paddingTop: 16 ,paddingHorizontal:16}]}
      >
        <View
          style={[
            styles.border,
            styles.center,
            { width: 24, height: 24, borderRadius: 12 ,marginTop:8},
          ]}
        >
          <Text style={{ color: "#292929" }}>{index + 1}</Text>
        </View>
        <View style={[
          styles.borderBottom,
          { paddingBottom: 16, flex: 1, marginLeft: 12 },
        ]}>
          <View style={{flexDirection:"row",marginTop: 8 }}>
            <Text style={{ flex:1,color: "#1E6F5C", fontSize: 16, fontWeight: 500 }}>
              {item.staffName}
            </Text>
            <SvgArrowRight width={16} height={16}  />
          </View>
          <View style={{marginTop: 8 }}>
            <Text style={{ color:"#292929" }}>
              {item.roleStaffName}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  border: {
    borderWidth: 0.5,
    borderColor: "#ddd",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  borderBottom: {
    borderWidth: 0,
    borderBottomWidth: 0.5,
    borderColor: "#dedede",
  },
});
export default StaffItem;
