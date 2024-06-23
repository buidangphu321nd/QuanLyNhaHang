import React, { useState } from "react";
import { View, StyleSheet, ToastAndroid, TouchableWithoutFeedback, Keyboard } from "react-native";
import Input from "../../Component/Input";
import ButtonBottom from "../../Component/ButtonBottom";
import { DATABASE, ref, set } from "../../fireBaseConfig";
import generateID from "../../Component/generateID";

const CustomerCreate = (props) => {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [errors, setErrors] = useState({});

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

    const customerId = generateID().toString();
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
      props.route.params.onCreateSuccess(newCustomer);
      props.navigation.goBack();
    } catch (err) {
      console.error("Error: " + err);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
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

        </View>
        <ButtonBottom confirmLabel={"Xác nhận"} onConfirm={handleCreate} />
      </View>

    </TouchableWithoutFeedback>
  );
};

export default CustomerCreate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    color: "#292929",
    fontSize: 14,
  },
});
