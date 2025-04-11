import { View, Text } from "react-native";
import React from "react";
import { LineChart, CurveType } from "react-native-gifted-charts";

interface DataPoint {
  value: number;
  label?: string;
  labelComponent?: () => React.ReactNode;
  dataPointText?: string;
}

interface ExpensesChartProps {
  data: DataPoint[];
  title?: string;
}

const ExpensesChart = ({
  data,
  title = "Spending Overview",
}: ExpensesChartProps) => {
  return (
    <View className="w-full overflow-hidden">
      {title && (
        <Text className="font-S-Medium text-gray-700 text-lg mb-2">
          {title}
        </Text>
      )}

      <LineChart
        data={data}
        hideDataPoints={false}
        color="#B85042"
        thickness={3}
        areaChart
        curveType={CurveType.QUADRATIC}
        curved
        initialSpacing={0}
        endSpacing={0}
        startFillColor="#b85042"
        endFillColor="#b85042"
        startOpacity={0.6}
        endOpacity={0.1}
        // X-axis styling
        xAxisColor="#a99b85"
        xAxisThickness={1}
        xAxisLabelTextStyle={{
          color: "#776B5D",
          fontSize: 10,
          fontFamily: "Signifier-Regular",
          marginTop: 2,
          textAlign: "center",
          marginLeft: 10,
          paddingLeft: 10,
        }}
        // Y-axis styling
        yAxisColor="#a99b85"
        yAxisThickness={1}
        hideYAxisText
        yAxisTextStyle={{
          color: "#776B5D",
          fontSize: 10,
          fontFamily: "Signifier-Regular",
        }}
        // Dash line styling
        horizontalRulesStyle="dashed"
        rulesType="dashed"
        rulesColor="#a99b85"
        dashWidth={5}
        dashGap={5}
        // Data point styling
        dataPointsHeight={6}
        dataPointsWidth={6}
        dataPointsColor="#B85042"
        dataPointsShape="circular"
        // Animation
        isAnimated
        animationDuration={1200}
        // Pointer styling
        pointerConfig={{
          pointerStripColor: "#a99b85",
          pointerStripWidth: 2,
          pointerColor: "#B85042",
          radius: 6,
          pointerLabelWidth: 70,
          pointerLabelHeight: 30,
          activatePointersOnLongPress: true,
          autoAdjustPointerLabelPosition: true,
          pointerLabelComponent: (items: any) => {
            return (
              <View className="bg-brick p-2 rounded-md">
                <Text className="text-white font-S-Medium text-[0.6rem]">
                  {items[0].date.toLocaleDateString("default", {
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
                <Text className="text-white font-S-Medium text-xs">
                  HK${items[0].value}
                </Text>
              </View>
            );
          },
        }}
      />
    </View>
  );
};

export default ExpensesChart;
