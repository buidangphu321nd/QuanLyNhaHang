import { StyleSheet, Text, TextInput, View } from "react-native";

const Input = (props) => {
  const {
    title = "",
    placeholder = "",
    isRequired = false,
    onChangeText,
    value="",
    errors,
    keyboardType,
  } = props;
  return (
    <View style={{ padding: 16 }}>
      <Text style={styles.title}>
        {title}
        {isRequired && <Text style={{ color: "red" }}> *</Text>}
      </Text>
      <TextInput
        value={value}
        placeholder={placeholder}
        placeholderTextColor={"#888888"}
        style={[styles.input, errors ? styles.errorInput : null]}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      >
      </TextInput>
      {errors && <Text style={styles.errorText}>{errors}</Text>}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fafafa",
  },
  title: {
    color: "#292929",
    fontSize: 14,
  },
  input: {
    backgroundColor:"#fff",
    marginTop:8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    color:"#292929"
  },
  errorInput: {
    borderColor: "red", // Thay đổi màu viền thành đỏ khi có lỗi
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  }
});
export default Input;
