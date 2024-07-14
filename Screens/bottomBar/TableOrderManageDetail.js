import React, {useEffect, useState} from "react";
import {Image, Text, View} from "react-native";
import ButtonBottom from "../../Component/ButtonBottom";
import {DATABASE, set, ref} from "../../fireBaseConfig";
import ImgEmpty from "../../assets/images/Emty.png";

const TableOrderManageDetail = (props) => {
    const [tableDetail, setTableDetail] = useState({});
    useEffect(() => {
        setTableDetail(props.route.params.tableDetail);
    }, [props.route.params.tableDetail]);
    console.log("Table Detail: ", tableDetail)

    const handlePress = async () => {
        const updateTable = {
            tableName: tableDetail.tableName,
            tableSlots: tableDetail.tableSlots,
            statusTable: "USING",
            floorId: tableDetail.floorId,
            floorName: tableDetail.floorName
        };
        const tableRef = ref(DATABASE, `tables/${tableDetail.tableId}`);
        props.navigation.navigate("TableOrderUsed", {tableDetail: tableDetail})
        try {
            await set(tableRef, updateTable);
            console.log("Table status updated successfully");
        } catch (error) {
            console.error("Failed to update table status:", error);
        }

    };

    return (
        <View style={{flex: 1, backgroundColor: "#fafafa", alignItems: "center", justifyContent: "center"}}>
            <View style={{alignItems: "center", marginTop: 16}}>
                <Image source={ImgEmpty} resizeMode={"contain"}/>
                <Text style={{fontSize: 18, color: "#888888"}}>Bàn trống</Text>
            </View>
            <ButtonBottom style={{flexDirection: "column", backgroundColor: "#fafafa", elevation: 0}}
                          confirmLabel={"Bắt đầu gọi món"} onConfirm={handlePress}/>

        </View>
    )
}

export default TableOrderManageDetail;
