import React, { useCallback, useState, useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet, FlatList, Image } from "react-native";
import { DATABASE, get, ref, remove, update } from "../../fireBaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import Svgimage from "../../assets/images/svg/image-picture-svgrepo-com.svg";
import ModalBottom from "../../Component/ModalBottom";
import LoadingSkeleton from "../../Component/LoadingSkeleton";
import SvgNote from "../../assets/images/svg/note-svgrepo-com.svg";

const Kitchen = () => {
  const [isModal, setIsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeStatus, setActiveStatus] = useState("WAITING");
  const [selectedItem, setSelectedItem] = useState(null);
  const statusOptions = [
    { label: "Đang chờ", value: "WAITING" },
    { label: "Đã xong", value: "DONE" },
    { label: "Đã giao", value: "DELIVERED" },
    { label: "Đã hủy", value: "CANCEL" },
  ];

  const [all, setAll] = useState([]);
  const [listItem, setListItem] = useState([]);

  const FetchAll = useCallback(async () => {
    try {
      setIsLoading(true);
      const now = new Date();
      const startOfPeriod = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const endOfPeriod = startOfPeriod + 86400000 - 1;

      const kitchenRef = ref(DATABASE, "kitchen_bar");
      const snapshot = await get(kitchenRef);
      const data = snapshot.val();

      if (data) {
        const kitchenArray = Object.keys(data).map(key => ({
          kc_id: key,
          ...data[key],
          items: Object.values(data[key].items || {}).filter(dish => {
            const createTime = new Date(dish.createTime).getTime();
            return createTime >= startOfPeriod && createTime <= endOfPeriod;
          })
        })).filter(kitchen => kitchen.items.length > 0);

        setAll(kitchenArray);
      }
      setIsLoading(false);
    } catch (err) {
      console.error("Error: ", err);
      setIsLoading(false);
    }
  }, []);


  useFocusEffect(
    useCallback(() => {
      FetchAll();
    }, [FetchAll]),
  );

  useEffect(() => {
    if (all.length > 0) {
      const filteredItems = all
        .filter(item => item.items && Object.values(item.items).some(dish => dish.status === activeStatus))
        .flatMap(item =>
          Object.values(item.items)
            .filter(dish => dish.status === activeStatus)
            .map(dish => ({ ...dish, kc_id: item.kc_id }))
        );
      setListItem(filteredItems);
    }
  }, [all, activeStatus]);
  const handleStatusChange = async (item, newStatus) => {
    try {
      const dishRef = ref(DATABASE, `kitchen_bar/${item.kc_id}/items/${item.dishId}`);
      const orderRef = ref(DATABASE, `orders/${item.tableId}/items/${item.dishId}`);
      await update(dishRef, { status: newStatus });
      if (newStatus === "CANCEL") {
        await remove(orderRef);
      }

      setIsModal(false);
      FetchAll(); // Gọi lại hàm FetchAll để cập nhật danh sách món ăn sau khi thay đổi trạng thái
    } catch (err) {
      console.error("Error updating status: ", err);
    }
  };

  console.log("All data: ", all);
  console.log("List Item: ", listItem);
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ marginVertical: 16 }}>
        <Text style={{ color: "#000000", fontWeight: "600", textAlign: "center", fontSize: 16 }}>Bếp, Bar</Text>
      </View>
      <View style={styles.container}>
        {statusOptions.map((status, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, activeStatus === status.value && styles.activeTab]}
            onPress={() => setActiveStatus(status.value)}
          >
            <Text style={[styles.tabText, activeStatus === status.value && styles.activeText]}>
              {status.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={listItem}
        keyExtractor={item => item.dishId}
        renderItem={({ item }) => (
          <LoadingSkeleton showContent={!isLoading}>
            <View>
              <TouchableOpacity onPress={() => { setIsModal(true); setSelectedItem(item); }}>
                <View style={{ flexDirection: "row", paddingHorizontal: 16, paddingVertical: 8 }}>
                  {item.dishImage ?
                    (
                      <View style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, height: 64, width: 64 }}>
                        <Image style={{ height: 64, width: 64, borderRadius: 8 }} source={{ uri: item.dishImage }} />
                      </View>
                    ) : (
                      <View style={{
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: "#ddd",
                        height: 64,
                        width: 64,
                        justifyContent: "center",
                        alignItems: "center",
                      }}>
                        <Svgimage width={24} height={24} />
                      </View>
                    )}
                  <View style={{ flex: 1, paddingHorizontal: 16 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ color: "#292929", fontWeight: "500", fontSize: 16 }}>{item.dishName}</Text>
                      <Text style={{ color: "#292929", fontWeight: "500", fontSize: 16 }}>x{item.quantity}</Text>
                    </View>
                    {item.note != "" ?
                      (
                        <View style={{ flexDirection: "row", alignItems: "center",marginTop:8 }} >
                          <SvgNote width={14} height={14} fill={"#ef5f05"}  />
                          <Text style={{ color: "#ef5f05", fontSize: 14, marginLeft:8 }}>{item.note}</Text>
                        </View>
                      )
                      : null}
                    <View style={{ flexDirection: "row", justifyContent: "space-between",marginTop: item.note != "" ? 8 :24 }}>
                      <Text style={{ color: "#888888", fontSize: 16}}>{item.tableName}</Text>
                      <Text style={{ color: "#888888", fontSize: 16 }}>{formatTime(item.createTime)}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              <ModalBottom
                title={"Thông tin món"}
                visible={isModal}
                setVisible={setIsModal}
              >
                <View style={{ paddingHorizontal: 16 }}>
                  <TouchableOpacity style={{ alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#ddd" }} onPress={() => handleStatusChange(selectedItem, "DONE")}>
                    <Text style={{ color: "#000000", fontSize: 16, marginVertical: 24 }}>Đã xong</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#ddd" }} onPress={() => handleStatusChange(selectedItem, "DELIVERED")}>
                    <Text style={{ color: "#000000", fontSize: 16, marginVertical: 24 }}>Đã giao</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#ddd" }} onPress={() => handleStatusChange(selectedItem, "CANCEL")}>
                    <Text style={{ color: "red", fontSize: 16, marginVertical: 24 }}>Hủy món</Text>
                  </TouchableOpacity>
                </View>
              </ModalBottom>
            </View>
          </LoadingSkeleton>
        )}
      />
    </View>
  );

};

export default Kitchen;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  activeTab: {
    borderBottomWidth: 1,
    borderBottomColor: "#1E6F5C",
  },
  tabText: {
    color: "#888888",
    fontSize: 16,
  },
  activeText: {
    color: "#1E6F5C",
  },
});
