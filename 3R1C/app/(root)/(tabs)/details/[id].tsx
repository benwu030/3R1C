import {
  View,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { deleteClotheById, getClotheById } from "@/lib/CRUD/clotheCRUD";
import { useAppwrite } from "@/lib/useAppWrite";
import { ActivityIndicator } from "react-native";
import LoadingScreen from "@/components/LoadingScreen";
import { Image } from "expo-image";
import icons from "@/constants/icons";
import { usePathname } from "expo-router";
import { Alert } from "react-native";

const ClotheDetailsScreen = () => {
  const path = usePathname();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: clothe,
    loading,
    refetch,
  } = useAppwrite({ fn: getClotheById, params: { id: id } });
  useEffect(() => {
    refetch();
    if (!clothe && !loading) router.back();
  }, [id]);

  const handleDelteClothe = () => {
    Alert.alert(
      "Delete Confirmation",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            // Add delete logic here
            const result = await deleteClotheById(clothe!.$id!, clothe!.$id!);
            if (!result) {
              Alert.alert("Error", "Failed to delete item");
              router.back();

              return;
            }
            Alert.alert("Success", "Item deleted successfully");
            router.back();
          },
          style: "destructive",
        },
      ]
    );
  };

  if (loading) return <LoadingScreen />;

  return (
    <SafeAreaView className="px-5 bg-sand-dark h-screen">
      {/* header */}

      <View className="flex-row justify-between items-center py-5">
        <TouchableOpacity onPress={() => router.back()} className="basis-1/3">
          <Image source={icons.rightArrow} className="size-10 rotate-180" />
        </TouchableOpacity>
        <View className="flex-row basis-1/3">
          <Text
            className={`text-${clothe!.title.length > 12 ? "2xl" : "3xl"} font-S-Regular text-center`}
          >
            {clothe!.title}
          </Text>
        </View>
        <View className="flex-row basis-1/3 justify-end items-center">
          <TouchableOpacity>
            <Image
              source={icons.edit}
              className="size-6 mx-2"
              tintColor={"black"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelteClothe}>
            <Image
              source={icons.deleteIcon}
              className="size-6 mx-2"
              tintColor={"black"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* image */}
      <Image
        source={clothe!.localImageURL}
        className="w-full h-[32rem] bg-white"
        contentFit="contain"
      />
      <Text className="text-2xl font-S-Regular mt-5">${clothe!.price}</Text>
      <Text className="text-lg font-S-Medium mt-2">
        Purchased on{" "}
        {clothe!.purchasedate
          ? new Date(clothe!.purchasedate).toLocaleDateString("default")
          : ""}
      </Text>
      <Text className="text-lg font-S-Medium mt-2">
        Category: {clothe!.maincategory}
      </Text>
      <Text className="text-lg font-S-Medium mt-2">SubCategories:</Text>
      <View className="flex-row flex-wrap">
        {clothe?.subcategories?.map((element: string) => (
          <Text key={element} className="text-lg font-S-Medium mr-2">
            {element}
          </Text>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default ClotheDetailsScreen;
