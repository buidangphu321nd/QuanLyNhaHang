import React, { useCallback, useState } from "react";
import { DATABASE, get, ref, set } from "../../fireBaseConfig";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import LoadingSkeleton from "../../Component/LoadingSkeleton";

const UnPaid = () => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [listOrder, setListOrder] = useState([]);

    const FetchListOrder = useCallback(async () => {
        try {
            setIsLoading(true);
            const billReff = ref(DATABASE, "orders");
            const snapshot = await get(billReff);
            const data = snapshot.val();
            if (data) {
                const orderArray = Object.keys(data).map((key) => ({
                    tableId: key,
                    ...data[key],
                }));
                setListOrder(orderArray);
            }
            setIsLoading(false);
        } catch (err) {
            console.error("Error: ", err);
            setIsLoading(false);
        }
    }, []);

    useFocusEffect(useCallback(() => {
        FetchListOrder();
    }, [FetchListOrder]));

    const formatDateTime = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${hours}:${minutes} ${day}/${month}/${year}`;
    };

    const calculateTotal = (items) => {
        let total = 0;

        Object.values(items).forEach((item) => {
            const { quantity, dishPrice } = item;
            const price = Number(dishPrice.replace(",", ""));
            const subtotal = quantity * price;
            total += subtotal;
        });

        return formatTotal(total);
    };

    const formatTotal = (total) => {
        return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const handlePayment = (item) => {
        const tableDetail = {
            tableId: item.tableId,
            tableName: item.tableName,
            floorId: item.floorId,
            floorName: item.floorName,
        };
        const dishOrder = Object.values(item.items);
        navigation.navigate("PaymentStep1", { tableDetail: tableDetail, dishOrder: dishOrder});
    };

    return (
        <LoadingSkeleton showContent={!isLoading}>
            <View style={{ flex: 1, backgroundColor: "#fafafa", paddingHorizontal: 8 }}>
                <FlatList
                    data={listOrder}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                backgroundColor: "#fff",
                                elevation: 1,
                                borderRadius: 8,
                                paddingHorizontal: 16,
                                marginVertical: 16,
                            }}
                        >
                            <TouchableOpacity onPress={() => handlePayment(item)}>
                                <View style={{ marginTop: 8 }}>
                                    <Text style={{ fontSize: 16, color: "#000000", fontWeight: 400 }}>{item.tableName}</Text>
                                </View>
                                <Text style={{ color: "#888888", fontWeight: 400, marginTop: 8 }}>{formatDateTime(item.createTime)}</Text>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8, alignItems: "center" }}>
                                    <Text style={{ color: "#888888", fontWeight: 400 }}>#{item.orderId}</Text>
                                    <View style={{ backgroundColor: "rgba(222,113,67,0.2)", borderRadius: 8, borderWidth: 1, borderColor: "#de7143" }}>
                                        <Text style={{ color: "#de7143", paddingVertical: 4, paddingHorizontal: 8 }}>Chưa thanh toán</Text>
                                    </View>
                                </View>
                                <View style={{ marginTop: 16, borderBottomWidth: 1, borderBottomColor: "#ddd", borderStyle: "dashed" }} />
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 8 }}>
                                    <Text style={{ fontSize: 16, color: "#000", fontWeight: 500 }}>Tổng cộng</Text>
                                    <Text style={{ fontSize: 16, color: "#1E6F5C", fontWeight: 500 }}>{calculateTotal(item.items)}đ</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={(item) => item.createTime.toString()}
                />
            </View>
        </LoadingSkeleton>
    );
};

export default UnPaid;
