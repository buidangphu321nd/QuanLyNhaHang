import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState, useCallback } from 'react';
import { DATABASE, get, ref } from "../fireBaseConfig";
import TableComponent from "./TableComponent";
import { useFocusEffect } from "@react-navigation/native";

const AreaComponent = (props) => {
  const { floor, navigation, action, labelFilter = null, navToAddTable, showStatus } = props;

  const [listTable, setListTable] = useState([]);

  // Fetching tables data from Firebase
  const fetchTables = useCallback(async () => {
    try {
      const tablesRef = ref(DATABASE, 'tables');
      const snapshot = await get(tablesRef);
      if (snapshot.exists()) {
        const tablesData = snapshot.val();
        const tablesArray = Object.keys(tablesData).map(key => ({
          tableId: key,
          ...tablesData[key],
        }));
        const filteredTables = tablesArray.filter(table => table.floorId === floor.floorId);
        setListTable(filteredTables);
      } else {
        console.log("No data available");
      }
    } catch (error) {
      console.error("Error fetching tables: ", error);
    }
  }, [floor.floorId]);


  useFocusEffect(
    useCallback(() => {
      fetchTables();
    }, [fetchTables])
  );

  console.log("Tables: ", listTable);

  return (
    <View style={{ backgroundColor: "#fafafa" }}>
      <Text style={{ paddingBottom: 16, paddingTop: 20, paddingLeft: 16, color: "#292929", fontSize: 14 }} large={true}>
        {floor?.floorName}
      </Text>
      <View style={{ backgroundColor: "#fff", paddingVertical: 16 }}>
        {listTable?.length > 0
          ? <FlatList
            data={listTable}
            numColumns={3}
            renderItem={(({ item, index }) => {
              return (
                <TableComponent
                  key={index}
                  onPress={() => {
                    action(item);
                  }}
                  styles={styleTable.table}
                  // listTable={floor?.listTable}
                  table={item}
                  navigation={navigation}
                  showStatus={showStatus}
                />
              );
            })}
            ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
          />
          : <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: 50,
            width: '100%',
          }}>
            <Text style={{ color: "#292929", fontSize: 14 }}>Chưa có bàn</Text>
          </View>
        }
      </View>
    </View>
  );
};

export default AreaComponent;

const styleTable = StyleSheet.create({
  table: {
    flexBasis: `${100 / 3}%`,
  },
});
