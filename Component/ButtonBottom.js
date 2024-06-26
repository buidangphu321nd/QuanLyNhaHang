import { Button, Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const width = Dimensions.get("window").width - 60;
const ButtonBottom = (props) => {
  const {
    style = {},
    confirmLabel = "",
    cancelLabel = "",
    onConfirm = () => {
    },
    onCancel = () => {
    },
  } = props;
  return (
    <View style={[styles.container, { justifyContent: cancelLabel ? "space-evenly" : "center", ...style }]}>
      {cancelLabel ?
        <View>
          <TouchableOpacity onPress={onCancel} style={styles.bottomButtonOutLine}>
            <Text style={styles.buttonTextCancel}>{cancelLabel}</Text>
          </TouchableOpacity>
        </View>
        : null
      }
      <View>
        <TouchableOpacity onPress={onConfirm}
                          style={[styles.bottomButton, { width: cancelLabel ? width / 2 : width / 1.5 }]}>
          <Text style={styles.buttonTextConfirm}>{confirmLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 16,
    elevation: 5,
    flexDirection: "row",
  },
  bottomButton: {

    backgroundColor: "#1E6F5C",
    paddingVertical: 16,
    borderRadius: 16,
    elevation: 5,
  },
  bottomButtonOutLine: {
    width: width / 2,
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 16,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#1E6F5C",
  },
  buttonTextConfirm: {
    fontSize: 14,
    textAlign: "center",
    color: "white",
  },
  buttonTextCancel: {
    fontSize: 14,
    textAlign: "center",
    color: "#1E6F5C",
    fontWeight: "500",
  },
});
export default ButtonBottom;
