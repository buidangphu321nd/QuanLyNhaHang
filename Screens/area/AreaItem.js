import { View, Text, TouchableOpacity } from "react-native";
import SvgArrow from "../../assets/images/svg/SvgArrowRight.svg";

const AreaItem = (props) => {
  const {item} = props;
  return (
    <TouchableOpacity>
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginTop:16,
      }}>
        <Text style={{ color: "#292929", fontSize: 14, fontWeight: "400" }}>{item.floorName}</Text>
        <SvgArrow width={16} height={16} />
      </View>
      <View style={{ borderBottomWidth: 1,
        borderBottomColor: "#DDDDDD"}}/>
    </TouchableOpacity>
  );
};

export default AreaItem;
