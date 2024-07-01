import React,{useState,useEffect,useRef} from "react";
import { Image, Text, TouchableOpacity, View,TextInput } from "react-native";
import Svgimage from "../../assets/images/svg/image-picture-svgrepo-com.svg";
import SvgTru from "../../assets/images/svg/tru.svg"
import SvgCong from "../../assets/images/svg/cong.svg"
import ModalBottom from "../../Component/ModalBottom";
import SvgNote from "../../assets/images/svg/note-svgrepo-com.svg"
import ButtonBottom from "../../Component/ButtonBottom";
import { useNavigation } from '@react-navigation/native';
import { useOrder } from "../../ConText/OrderContext";
const DishItem = (props) => {
  const {
    item, onPress = () => {
    },
    selectedDish,
    tableId,
  } = props;
  const navigation = useNavigation();
  const [quantity, setQuantity] = useState(0);
  const quantityRef = useRef(quantity);
  const [isModal,setIsModal] = useState(false);
  const [isSelected,setIsSelected] = useState(false);
  const [note, setNote] = useState('');
  const [status,setStatus] = useState("Chưa làm");
  const { dispatch } = useOrder();

  const toggleSelection = () => {
    const newIsSelected = !isSelected;
    setIsSelected(newIsSelected);
    if (newIsSelected) {
      setQuantity(1); // Set default quantity to 1 when selected
    } else {
      setQuantity(0); // Reset quantity to 0 when deselected
      setNote("");
      dispatch({
        type: "REMOVE_ORDER_ITEM",
        payload: {
          tableId,
          dishId: item.dishId,
        },
      });
    }
  };

  const incrementQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    dispatch({
      type: "ADD_ORDER_ITEM",
      payload: {
        tableId,
        dish: item,
        quantity: newQuantity,
        note,
      },
    });

  };

  const decrementQuantity = () => {
    const newQuantity = Math.max(1, quantity - 1);
    setQuantity(newQuantity);
    dispatch({
      type: "ADD_ORDER_ITEM",
      payload: {
        tableId,
        dish: item,
        quantity: newQuantity,
        note,
      },
    });
  };

  const handlePress = () => {
    if (selectedDish === true) {
      toggleSelection();
    } else {
      navigation.navigate("DishDetail", { dishId: item.dishId });
    }
  };

  const handleConfirm = () => {
    setIsModal(false);
    if (quantity > 0) {
      dispatch({
        type: "ADD_ORDER_ITEM",
        payload: {
          tableId,
          dish: item,
          quantity,
          note,
        },
      });
      setIsSelected(true);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} >
      <View style={{ flexDirection: "row",paddingHorizontal:16,paddingVertical:8 }}>
        {item.dishImage ?
          (
            <View style={{borderWidth:1,borderColor:"#ddd",borderRadius:8,height:64,width:64}}>
              <Image style={{ height: 64, width: 64,borderRadius:8 }} source={{ uri: item.dishImage }} />
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
        <View style={{paddingHorizontal:16}}>
          <Text style={{ color: "#292929", fontWeight: "500" ,fontSize:16}}>{item.dishName}</Text>
          <Text style={{ color: "#1E6F5C" ,fontSize:16,marginTop:16}}>{item.dishPrice} đ</Text>
          {isSelected && (
            <>
            <View style={{flexDirection:"row",alignItems: "center", marginTop:8 }}>
              <TouchableOpacity style={{width:30,height:30,justifyContent:"center",alignItems:"center"}} onPress={decrementQuantity}>
                <SvgTru width={18} height={18} fill={"#1E6F5C"}/>
              </TouchableOpacity>
              <Text style={{ marginHorizontal: 24,color:"#1E6F5C",fontSize:18 }}>{quantity}</Text>
              <TouchableOpacity style={{width:30,height:30,justifyContent:"center",alignItems:"center"}} onPress={incrementQuantity}>
                <SvgCong width={18} height={18} fill={"#1E6F5C"}/>
              </TouchableOpacity>
            </View>
              <TouchableOpacity style={{marginTop:8}} onPress={() => setIsModal(true)}>
                {note ? (
                  <View style={{flexDirection:"row",alignItems:"center"}}>
                    <SvgNote width={18} height={18} fill={"#888888"} style={{marginTop:8}}/>
                    <Text style={{ marginTop: 8, color: "#888888", fontSize: 16, padding: 6}}>{note}</Text>
                  </View>
                ) : (
                  <TouchableOpacity style={{ marginTop: 8 }} onPress={() => setIsModal(true)}>
                    <Text style={{ color: "#888888", fontSize: 16, padding: 6 }}>+ Thêm ghi chú</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
              <ModalBottom
                title={"Thêm Ghi Chú"}
                visible={isModal}
                setVisible={setIsModal}
              >
                <View style={{paddingHorizontal:16,marginVertical:16}}>
                  <Text style={{color:"#292929",fontWeight:600}}>Món ăn</Text>
                  <Text style={{color:"#292929",fontWeight:400,marginTop:8}}>{item.dishName}</Text>
                  <Text style={{color:"#292929",fontWeight:400,marginTop:16}}>Ghi chú</Text>
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
                    onChangeText={setNote}
                    value={note}

                  />
                </View>
                <ButtonBottom cancelLabel={"Hủy"} confirmLabel={"Xác nhận"} onCancel={() => {setIsModal(false)}} onConfirm={handleConfirm}
                />

              </ModalBottom>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DishItem;
