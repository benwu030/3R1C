import { View, Text, SafeAreaView, TouchableOpacity,Alert } from "react-native";
import { useCallback, useEffect, useState } from "react";
import CustomHeader from "@/components/CustomHeader";
import { FlatList } from "react-native-gesture-handler";
import ClothesCard from "@/components/ClothesCard";
import { useAppwrite } from "@/lib/useAppWrite";
import {
  getAllClothes,
  getAllClothesWithQuery,
  getClothesWithFilter,
} from "@/lib/CRUD/clotheCRUD";
import { ActivityIndicator } from "react-native";
import { router, useFocusEffect } from "expo-router";
import ExpensesChart from "@/components/ExpensesChart";
import { createLineChartData, getExpenses } from "@/lib/ExpenseUtil";
import { Image } from "expo-image";
import icons from "@/constants/icons";
import { createSpendingLimit, getSpendingLimit } from "@/lib/CRUD/spendingLimitCRUD";

type TimePeriod = "week" | "month" | "year";
const calcRemainingBudget = (
  totalExpenses: number,
  spendingLimit: number
) => {
  const remainingBudget = spendingLimit - totalExpenses;
  return remainingBudget;
}
const SpendingLimit = () => {
  const {
    data: clothes,
    loading,
    refetch,
  } = useAppwrite({
    fn: (params: Record<string, string | number>) =>
      getAllClothesWithQuery({
        attribute: params.attribute as string,
        method: params.method as string,
      }),
    params: { attribute: "purchasedate", method: "orderDesc" },
  });
  const {data: remoteSpendingLimit,loading:loadingSpendingLimit,refetch:refetchSpendingLimit} = useAppwrite({fn:getSpendingLimit})
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [lineChartData, setLineChartData] = useState<
    { label: string; value: number }[]
  >([]);
  const [activePeriod, setActivePeriod] = useState<TimePeriod>("week");
  const [currentDisplayDate, setCurrentDisplayDate] = useState(new Date());
  const [spendingLimit, setSpendingLimit] = useState(remoteSpendingLimit?.monthlySpendingLimit);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const getDisplayDate = (date: Date) => {
    return date.toLocaleString("default", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCardPressed = (id: string) => {
    router.push(`/details/${id}`);
  };
  const handlePeriodChange = (period: TimePeriod) => {
    setActivePeriod(period);
    if (clothes) {
      setLineChartData(createLineChartData(clothes, period));
    }
  };
  useEffect(() => {
    if (clothes) {
      setTotalExpenses(getExpenses(clothes, activePeriod, new Date()));
      setMonthlyExpenses(getExpenses(clothes, "month", new Date()));
      setLineChartData(createLineChartData(clothes, activePeriod));
    }
  }, [clothes, activePeriod]);
  useEffect(() => {
    const remainingBudget = calcRemainingBudget(
      monthlyExpenses,
      remoteSpendingLimit?.monthlySpendingLimit ??0)
    if (remainingBudget < 0) {
      Alert.alert(
        "Spending Limit Reached",
        `You have reached or exceeded your spending limit.\n\nMonthly Expenses: HKD ${monthlyExpenses}\nSpending Limit: HKD ${remoteSpendingLimit?.monthlySpendingLimit ??0}`
      );
    }
  }, [monthlyExpenses, remoteSpendingLimit]);
  useFocusEffect(
    useCallback(() => {
      refetch();
      refetchSpendingLimit();
    }, [])
  );
  const handleSetLimit = () => {
    // Alert.prompt is only available on iOS.
    Alert.prompt(
      "Set Spending Limit (Monthly)",
      "Enter your spending limit in HKD.",
      (text) => {
        const limit = Number(text);
        if (!isNaN(limit) && limit > 0) {
          createSpendingLimit(limit).then((result) => {
            if (result) {
              Alert.alert("Success", "Spending limit set successfully.");
              refetchSpendingLimit();
              refetch();
            }
          });
        } else {
          Alert.alert("Invalid Limit", "Please enter a valid number greater than 0.");
        }
      },
      "plain-text"
    );
  };
  // Button component for time period selection
  const PeriodButton = ({
    period,
    label,
  }: {
    period: TimePeriod;
    label: string;
  }) => (
    <TouchableOpacity
      onPress={() => handlePeriodChange(period)}
      className={`flex-1 py-2 rounded-full mx-1 ${
        activePeriod === period ? "bg-brick " : ""
      }`}
    >
      <Text
        className={`text-center font-S-Regular text-xs ${
          activePeriod === period ? "text-white" : "text-beige-darker"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView className="bg-sand-dark flex-1">
      {loading ? (
        <ActivityIndicator
          className="text-beige-darker mt-[16rem]"
          size="large"
        />
      ) : (
        <FlatList
          data={clothes?.slice(0, 5)}
          renderItem={({ item }: { item: any }) => (
            <View className="w-full px-5" key={item.$id}>
              <ClothesCard
                cardType="horizontal"
                item={item}
                onPress={() => handleCardPressed(item.$id!)}
              />
            </View>
          )}
          numColumns={1}
          contentContainerClassName="pb-20"
          showsVerticalScrollIndicator={false}
          horizontal={false}
          ListHeaderComponent={() => (
            <View className="">
              <CustomHeader title="Expense Tracker" showBackButton={false} rightComponent={
                (<TouchableOpacity onPress={handleSetLimit} >
                  <Image source={icons.edit} className="size-5" tintColor={"#a5998d"}/>
                </TouchableOpacity>)
              } />
              <View className="px-7 flex-1">
                <View className="bg-sand-darker rounded-xl my-2 p-5 shadow-md ">
                  <View className=" items-center ">
                    <Text className="font-S-Bold text-2xl text-yellow-900">
                      {getDisplayDate(currentDisplayDate)}
                    </Text>
                  </View>
                  <View className="flex-row mb-3 mt-1">
                    <PeriodButton period="week" label="Week" />
                    <PeriodButton period="month" label="Month" />
                    <PeriodButton period="year" label="Year" />
                  </View>
                  <ExpensesChart data={lineChartData} title="Expenses" />
                </View>
                <Text className="font-S-Light text-gray-500 text-sm">
                  Total Expenses
                </Text>

                <View className="bg-brick rounded-xl p-6 shadow-md">
                  <View className="flex-row  items-center justify-between">
                    <Text className="font-S-Medium text-white text-xl">
                      HKD
                    </Text>
                    <Text className="font-S-Regular text-white text-4xl">
                      ${totalExpenses}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-end">
                    <Text className="font-S-Light text-white text-xs text-end">
                      this {activePeriod}
                    </Text>
                  </View>
                </View>
                <Text className="font-S-Light text-gray-500 text-sm">
                  Remaining Budget (Spending Limit: ${remoteSpendingLimit?.monthlySpendingLimit ??0})
                </Text>

                <View className="bg-beige-darker rounded-xl p-6 shadow-md">
                  <View className="flex-row  items-center justify-between">
                    <Text className="font-S-Medium text-white text-xl">
                      HKD
                    </Text>
                    <Text className="font-S-Regular text-white text-4xl">
                      ${calcRemainingBudget(
                        monthlyExpenses,
                        remoteSpendingLimit?.monthlySpendingLimit ??0)}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-end">
                    <Text className="font-S-Light text-white text-xs text-end">
                      this month
                    </Text>
                  </View>
                </View>
                <Text className="font-S-Light text-gray-500 text-sm py-1">
                  Recent Purchases
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default SpendingLimit;
