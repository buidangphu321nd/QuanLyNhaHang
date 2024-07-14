import React, { useCallback, useState } from "react";
import {FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import { DATABASE, get, ref } from "../../fireBaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import FinacialReport from "../report/FinacialReport";
import OperationalReport from "../report/OperationalReport";
import Unpaid from "./Unpaid";
import Paid from "./Paid";

const OrderList = (props) => {
    const [activeStatus, setActiveStatus] = useState("Chưa thanh toán");
    const statusOptions = ["Chưa thanh toán", "Đã thanh toán"];

    const renderActiveTabContent = () => {
        switch (activeStatus) {
            case "Chưa thanh toán":
                return <Unpaid />;
            case "Đã thanh toán":
                return <Paid/>;
            default:
                return null;
        }
    };
  return (
    <View style={{flex:1,backgroundColor:"#fafafa",paddingHorizontal:8}}>
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
        {renderActiveTabContent()}
    </View>
  )
}

export default OrderList;
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 8,
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