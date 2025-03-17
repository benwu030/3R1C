import { View, Text, SafeAreaView } from "react-native";
import { useEffect, useState } from "react";
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
import { router } from "expo-router";
import ExpensesChart from "@/components/ExpensesChart";
import { createLineChartData, getExpenses } from "@/lib/ExpenseUtil";
const SpendingLimit = () => {
  const { data: clothes, loading } = useAppwrite({
    fn: (params: Record<string, string | number>) =>
      getAllClothesWithQuery({
        attribute: params.attribute as string,
        method: params.method as string,
      }),
    params: { attribute: "purchasedate", method: "orderDesc" },
  });
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [lineChartData, setLineChartData] = useState<
    { label: string; value: number }[]
  >([]);
  const handleCardPressed = (id: string) => {
    console.log("card pressed", id);
    router.push(`/details/${id}`);
  };
  useEffect(() => {
    if (clothes) {
      setTotalExpenses(getExpenses(clothes));
      setLineChartData(createLineChartData(clothes, "week"));
    }
  }, [clothes]);
  return (
    <SafeAreaView className="bg-sand-dark flex-1">
      <CustomHeader title="Expense Tracker" showBackButton={false} />
      <View className="px-5 flex-1">
        <Text className="font-S-Light text-gray-500 text-sm">
          Total Expenses
        </Text>

        <View className="bg-brick rounded-xl p-7 shadow-md">
          <View className="flex-row  items-center justify-between">
            <Text className="font-S-Medium text-white text-xl">HKD</Text>
            <Text className="font-S-Regular text-white text-5xl">
              {totalExpenses}
            </Text>
          </View>
          <View className="flex-row items-center justify-end">
            <Text className="font-S-Light text-white text-xs text-end">
              per Day
            </Text>
          </View>
        </View>

        <View className="bg-sand-darker rounded-xl my-2 p-7 shadow-md">
          <ExpensesChart data={lineChartData} />
        </View>

        <View className="flex-1">
          <Text className="font-S-Light text-gray-500 text-sm py-1">
            Recent Purchases
          </Text>
          {loading ? (
            <ActivityIndicator
              className="text-beige-darker mt-[16rem]"
              size="large"
            />
          ) : (
            <FlatList
              data={clothes?.slice(0, 3)}
              renderItem={({ item }: { item: any }) => (
                <View className="w-full" key={item.$id}>
                  <ClothesCard
                    cardType="horizontal"
                    item={item}
                    onPress={() => handleCardPressed(item.$id!)}
                  />
                </View>
              )}
              numColumns={1}
              contentContainerClassName=""
              showsVerticalScrollIndicator={false}
              horizontal={false}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SpendingLimit;
