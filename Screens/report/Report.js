import React, { useCallback, useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SvgCalendar from "../../assets/images/svg/calendar.svg";
import StatisticCard from "../../Component/StatisticCard";
import MyBarChart from "../../Component/MyBarChart";
import { DATABASE, get, ref } from "../../fireBaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import FinacialReport from "./FinacialReport";
import OperationalReport from "./OperationalReport";

const Report = (props) => {
  const [activeStatus, setActiveStatus] = useState("Tài chính");
  const statusOptions = ["Tài chính", "Vận hành"];

  const renderActiveTabContent = () => {
    switch (activeStatus) {
      case "Tài chính":
        return <FinacialReport />;
      case "Vận hành":
        return <OperationalReport/>;
      default:
        return null;
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <View style={styles.container}>
        {statusOptions.map((status, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, activeStatus === status && styles.activeTab]}
            onPress={() => setActiveStatus(status)}
          >
            <Text style={[styles.tabText, activeStatus === status && styles.activeText]}>
              {status}
            </Text>
          </TouchableOpacity>
        ))}

      </View>
      {renderActiveTabContent()}
    </View>

  );
}

export default Report;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  activeTab: {
    borderBottomWidth: 1,
    borderBottomColor: "#1E6F5C",
  },
  tabText: {
    color: "#888888",
    fontSize: 14,
  },
  activeText: {
    color: "#1E6F5C",
  },
});
