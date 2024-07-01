import React, { useEffect, useState } from "react";
import { Image, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import RowItemAction from "../../Component/RowItemAction";
import ButtonBottom from "../../Component/ButtonBottom";
import ImgEmpty from "../../assets/images/Emty.png";
import { DATABASE, ref, set } from "../../fireBaseConfig";
import Input from "../../Component/Input";
import ModalBottom from "../../Component/ModalBottom";
import generateID from "../../Component/generateID";

const TableOrderUsed = (props) => {
  const [tableDetail, setTableDetail] = useState({});
  const [isModal,setIsModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerName, setCustomerName] = useState("Khách lẻ");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [errors, setErrors] = useState({});


  useEffect(() => {
    setTableDetail(props.route.params.tableDetail);
  }, [props.route.params.tableDetail]);
  console.log("Table Detail: ", tableDetail);


  const handlePress = async () => {
    const updateTable = {
      tableName: tableDetail.tableName,
      tableSlots: tableDetail.tableSlots,
      statusTable: "",
      floorId: tableDetail.floorId,
      floorName: tableDetail.floorName,
    };
    const tableRef = ref(DATABASE, `tables/${tableDetail.tableId}`);
    try {
      await set(tableRef, updateTable);
      console.log("Table status updated successfully");
      props.navigation.goBack();
    } catch (error) {
      console.error("Failed to update table status:", error);
    }
  };

  const validateInput = () => {
    let isValid = true;
    let errors = {};

    // Validate Name
    if (!customerName.trim()) {
      errors.customerName = "Bắt Buộc Nhập Họ Tên";
      isValid = false;
    }

    // Validate Phone
    if (customerPhone && (customerPhone.length !== 10 || !customerPhone.startsWith("0"))) {
      errors.customerPhone = "Vui lòng nhập đúng định dạng số điện thoại";
      isValid = false;
    }

    // Validate Email
    if (customerEmail && !customerEmail.includes("@")) {
      errors.customerEmail = "Vui lòng nhập đúng định dạng email";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleCreate = async () => {
    if (!validateInput()) return;

    const customerId = generateID();

    const newCustomer = {
      customerId,
      customerName,
      customerPhone,
      customerEmail,
    };
    console.log("Database object:", DATABASE);
    try {
      const customerRef = ref(DATABASE, "customer/" + customerId);
      await set(customerRef, newCustomer);
      console.log("Them Khach Hang Thanh Cong !");
      ToastAndroid.show("Thêm khách hàng thành công", ToastAndroid.LONG);
      setSelectedCustomer(newCustomer);
      setIsModal(false);
    } catch (err) {
      console.error("Error: " + err);
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <View style={{ flex: 1, marginTop: 16 }}>
        <Text style={{ color: "#292929", fontSize: 16, fontWeight: 400, paddingHorizontal: 16 }}>Thông tin khách
          hàng</Text>
        <RowItemAction
          description={"Khách hàng"}
          value={selectedCustomer ? selectedCustomer?.customerName : "Khách lẻ"}
          style={{ marginTop: 16, paddingHorizontal: 16, backgroundColor: "#fff" }}
          borderWidth={0}
          onPress={() => setIsModal(true)}
        />
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 16,
          paddingHorizontal: 16,
          alignItems: "center",
        }}>
          <Text style={{ color: "#292929", fontSize: 16, fontWeight: 400 }}>Danh sách món đã gọi</Text>
          <TouchableOpacity>
            <Text style={{ color: "#1E6F5C", fontSize: 14, fontWeight: 400 }}>+ Gọi thêm món</Text>
          </TouchableOpacity>
        </View>

        <View style={{ backgroundColor: "#fff", marginVertical: 16, alignItems: "center" }}>
          <View style={{ alignItems: "center", marginTop: 16 }}>
            <Image source={ImgEmpty} resizeMode={"contain"} />
            <Text style={{ fontSize: 18, color: "#888888" }}>Không có dữ liệu</Text>
          </View>
          <TouchableOpacity style={{ width: 200, backgroundColor: "#1E6F5C", marginVertical: 16, borderRadius: 8 }}
                            onPress={() => props.navigation.navigate("TableOrderMenu",{tableId:tableDetail.tableId,selectedCustomer:selectedCustomer})}>
            <Text style={{ color: "#fff", fontSize: 14, textAlign: "center", padding: 16 }}>Gọi món</Text>
          </TouchableOpacity>
        </View>
        <ModalBottom
          title={"Chọn khách hàng"}
          visible={isModal}
          setVisible={setIsModal}>
          <Input
            title={"Họ Tên"}
            placeholder={"Nhập họ tên khách hàng"}
            isRequired={true}
            onChangeText={(text) => setCustomerName(text)}
            errors={errors.customerName}
            value={customerName}
          />
          <Input
            title={"Số điện thoại"}
            placeholder={"Nhập số điện thoại khách hàng"}
            onChangeText={(text) => setCustomerPhone(text)}
            errors={errors.customerPhone}
            value={customerPhone}
          />
          <Input
            title={"Email"}
            placeholder={"Nhập email khách hàng"}
            onChangeText={(text) => setCustomerEmail(text)}
            errors={errors.customerEmail}
            value={customerEmail}
          />
          <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 16 }}>
            <Text style={{ color: "#292929" }}>Hoặc</Text>
            <TouchableOpacity style={{ marginTop: 8 }}
                              onPress={() => props.navigation.navigate("CustomerList", { setSelectedCustomer })}>
              <Text style={{ color: "#1E6F5C", fontSize: 16 }}>Danh sách khách hàng</Text>
            </TouchableOpacity>
          </View>
          <ButtonBottom confirmLabel={"Xác nhận"} onConfirm={handleCreate} />
        </ModalBottom>

      </View>
      <ButtonBottom confirmLabel={"Hủy Bàn"} cancelLabel={"Chuyển bàn"} onConfirm={handlePress} />
    </View>
  );
};

export default TableOrderUsed;
