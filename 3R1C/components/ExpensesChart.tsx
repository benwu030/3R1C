import { View, Text } from "react-native";
import React from "react";
import { LineChart } from "react-native-gifted-charts";

interface DataPoint {
  value: number;
  label?: string;
}
interface ExpensesChartProps {
  data: DataPoint[];
}
const ExpensesChart = (lineData: ExpensesChartProps) => {
  return (
    <LineChart
      data={lineData.data}
      xAxisLabelTextStyle={{
        alignSelf: "flex-end",
      }}
      endSpacing={-10}
    />
  );
};

export default ExpensesChart;
