import React, { useCallback, useState, useEffect } from "react";
import {
  Keyboard,
  SectionList,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import ButtonBottom from "../../Component/ButtonBottom";
import RowItemAction from "../../Component/RowItemAction";
import ModalBottom from "../../Component/ModalBottom";
import { DATABASE, get, ref, set } from "../../fireBaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import DatePicker from "react-native-date-picker";
import Input from "../../Component/Input";
import generateID from "../../Component/generateID";


const ScheduleBook = (props) => {
  const [isModalTable, setIsModalTable] = useState(false);
  const [isModalTime, setIsModalTime] = useState(false);
  const [isModalCustomer, setIsModalCustomer] = useState(false);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [dateTimeDisplay, setDateTimeDisplay] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [errors, setErrors] = useState({});
  const [note, setNote] = useState("");

  useEffect(() => {
    const datePart = date.toISOString().slice(0, 10); // Lấy phần ngày từ chuỗi ISO (YYYY-MM-DD)
    const timePart = time.toLocaleTimeString("en-GB", { // Chuyển đối tượng time thành chuỗi giờ 24h
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    setDateTimeDisplay(`${datePart} ${timePart}`);
  }, [date, time]);


  useEffect(() => {
    const generateTimeSlots = () => {
      const slots = [];
      const startTime = new Date(date.setHours(9, 0, 0, 0));
      const endTime = new Date(date.setHours(22, 0, 0, 0));

      while (startTime <= endTime) {
        slots.push(new Date(startTime));
        startTime.setMinutes(startTime.getMinutes() + 30);
      }

      setTimeSlots(slots);
    };
    generateTimeSlots();
  }, [date]);


  const selectTimeSlot = (slot) => {
    const now = new Date();
    const selectedTime = new Date(slot);

    if (selectedTime < now) {

      ToastAndroid.show("Vui lòng chọn thời gian trong tương lai.", ToastAndroid.SHORT);
    } else {
      setTime(selectedTime);
    }
  };


  const onConfirmTime = (selectedTime) => {
    const prospectiveTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), selectedTime.getHours(), selectedTime.getMinutes());
    if (prospectiveTime < new Date()) {
      ToastAndroid.show("Vui lòng chọn thời gian trong tương lai.", ToastAndroid.SHORT);
      setShowTimePicker(false);
    } else {
      setTime(prospectiveTime);
      setShowTimePicker(false);
    }
  };

  const onConfirmDate = (selectedDate) => {
    const prospectiveDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), time.getHours(), time.getMinutes());
    if (prospectiveDate < new Date()) {
      ToastAndroid.show("Vui lòng chọn ngày trong tương lai.", ToastAndroid.SHORT);
      setShowDatePicker(false);
    } else {
      setDate(prospectiveDate);
      setShowDatePicker(false);
    }
  };

  const fetchTables = useCallback(async () => {
    try {
      const tablesRef = ref(DATABASE, "tables");
      const snapshot = await get(tablesRef);
      if (snapshot.exists()) {
        const tablesData = snapshot.val();
        const floors = {};

        Object.keys(tablesData).forEach(key => {
          const { floorId, floorName, tableName, tableId, tableSlots } = tablesData[key];
          if (!floors[floorId]) {
            floors[floorId] = {
              title: floorName,
              id: floorId,
              data: [],
            };
          }
          floors[floorId].data.push({
            name: tableName,
            id: tableId,
            slots: tableSlots,
          });
        });

        const formattedData = Object.values(floors);
        setTables(formattedData);

      } else {
        console.log("No data available");
      }
    } catch (error) {
      console.error("Error fetching tables: ", error);
    }
  }, []);


  useFocusEffect(
    useCallback(() => {
      fetchTables();
    }, [fetchTables]),
  );

  console.log("List tables: ", tables);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

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
      setIsModalCustomer(false);
    } catch (err) {
      console.error("Error: " + err);
    }
  };
  console.log("SelectedTable: ", selectedTable);


  const handleScheduleBook = async () => {
    if (!selectedTable) {
      ToastAndroid.show("Vui lòng chọn bàn!", ToastAndroid.LONG);
      return;
    }
    if (!selectedCustomer) {
      ToastAndroid.show("Vui lòng chọn khách hàng!", ToastAndroid.LONG);
      return;
    }
    const scheduleId = generateID();
    const formattedDateTime = dateTimeDisplay.replace(" ", "T");
    const arrivalTime = (new Date(formattedDateTime)).getTime();
    const currentTime = Date.now();

    const schedulesRef = ref(DATABASE, "schedule");
    const snapshot = await get(schedulesRef);
    if (snapshot.exists()) {
      const schedulesData = snapshot.val();

      // Check for conflicting schedules
      const conflict = Object.keys(schedulesData).some(key => {
        const schedule = schedulesData[key];
        return schedule.tableId === selectedTable.tableId && schedule.arrivalTime === arrivalTime;
      });

      if (conflict) {
        ToastAndroid.show("Bàn đã được đặt cho thời gian này. Vui lòng chọn thời gian khác.", ToastAndroid.LONG);
        return;
      }
    }

    const newSchedule = {
      scheduleId,
      tableId: selectedTable.tableId,
      tableName: selectedTable.tableName,
      floorId:selectedTable.floorId,
      floorName:selectedTable.floorName,
      arrivalTime: arrivalTime,
      customerId: selectedCustomer.customerId,
      customerName: selectedCustomer.customerName,
      note,
      currentTime,
    };
    try {
      const scheduleRef = ref(DATABASE, "schedule/" + scheduleId);
      await set(scheduleRef, newSchedule);
      ToastAndroid.show("Đặt bàn thành công!", ToastAndroid.LONG);
      props.navigation.goBack();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ flex: 1, paddingTop: 16 }}>
          <RowItemAction description={"Bàn"} value={selectedTable ? `${selectedTable?.tableName}` : "Chọn bàn"}
                         style={{ marginHorizontal: 16 }}
                         onPress={() => props.navigation.navigate("ManageTableArea", { setSelectedTable })} />
          <RowItemAction description={"Thời gian"} value={dateTimeDisplay} style={{ marginHorizontal: 16 }}
                         onPress={() => setIsModalTime(true)} />
          <RowItemAction description={"Khách hàng"}
                         value={selectedCustomer ? selectedCustomer?.customerName : "Chọn khách hàng"}
                         style={{ marginHorizontal: 16 }}
                         onPress={() => setIsModalCustomer(true)} />
          <View style={{ margin: 16 }}>
            <Text style={{ color: "#292929" }}>Ghi chú</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#DDDDDD",
                borderRadius: 8,
                minHeight: 100,
                padding: 8,
                color: "#292929",
              }}
              placeholder={"Nhập ghi chú"}
              placeholderTextColor={"#888888"}
              textAlignVertical={"top"}
              multiline={true}
              onChangeText={(text) => setNote(text)}
              value={note}
            />
          </View>

          {/*<ModalBottom*/}
          {/*  title={"Chọn bàn"}*/}
          {/*  visible={isModalTable}*/}
          {/*  setVisible={setIsModalTable}*/}
          {/*>*/}

          {/*  <SectionList*/}
          {/*    sections={tables}*/}
          {/*    keyExtractor={(item, index) => item.id + index}*/}
          {/*    renderItem={({ item, section }) => (*/}

          {/*      <RowItemAction*/}
          {/*        value={item.name}*/}
          {/*        onPress={() => {*/}
          {/*          setSelectedTable(item);*/}
          {/*          setIsModalTable(false);*/}
          {/*        }}*/}
          {/*        style={{ marginLeft: 48, marginRight: 16 }}*/}
          {/*      />*/}
          {/*    )}*/}
          {/*    renderSectionHeader={({ section }) => (*/}
          {/*      <RowItem*/}
          {/*        value={section.title}*/}
          {/*        onPress={() => {*/}
          {/*        }}*/}
          {/*        style={{ paddingHorizontal: 16 }}*/}
          {/*      />*/}
          {/*    )}*/}
          {/*  />*/}
          {/*  <ButtonBottom confirmLabel={"Đóng"} onConfirm={() => setIsModalTable(false)} />*/}
          {/*</ModalBottom>*/}
          <ModalBottom
            title={"Chọn thời gian"}
            visible={isModalTime}
            setVisible={setIsModalTime}
          >

            <RowItemAction
              description={"Chọn ngày"}
              value={date.toLocaleDateString()}
              style={{ marginHorizontal: 16 }}
              onPress={() => setShowDatePicker(true)}
            />
            {showDatePicker && (
              <DatePicker
                modal
                open={showDatePicker}
                date={date}
                onConfirm={(selectedDate) => onConfirmDate(selectedDate)}
                onCancel={() => {
                  setShowDatePicker(false);
                }}
                mode="date"
              />
            )}

            <RowItemAction
              description={"Chọn giờ"}
              value={time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit",hour12:false })}
              style={{ marginHorizontal: 16 }}
              onPress={() => setShowTimePicker(true)}
            />
            {showTimePicker && (
              <DatePicker
                modal
                open={showTimePicker}
                date={time}
                onConfirm={(selectedTime) => onConfirmTime(selectedTime)}
                onCancel={() => {
                  setShowTimePicker(false);
                }}
                mode="time"
              />
            )}
            <FlatList
              data={timeSlots}
              keyExtractor={(item, index) => index.toString()}
              numColumns={5}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    borderColor: "#ddd",
                    padding:4,
                    borderRadius: 8,
                    alignItems: "center",
                    margin:16,
                    justifyContent: "center",
                  }}
                  onPress={() => selectTimeSlot(item)}
                >
                  <Text style={{ color: "#292929", fontSize: 14 }}>
                                      {item.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false })}
                                    </Text>
                  
                </TouchableOpacity>
              )}
            />
            <ButtonBottom confirmLabel={"Đồng ý"} onConfirm={() => {
              setIsModalTime(false);
            }} />
          </ModalBottom>
          <ModalBottom
            title={"Chọn khách hàng"}
            visible={isModalCustomer}
            setVisible={setIsModalCustomer}>
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
        <ButtonBottom confirmLabel={"Đồng ý"} cancelLabel={"Hủy"} onCancel={() => props.navigation.goBack()}
                      onConfirm={handleScheduleBook} />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ScheduleBook;
