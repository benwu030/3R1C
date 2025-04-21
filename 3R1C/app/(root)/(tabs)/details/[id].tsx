import {
  View,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  deleteClotheById,
  getClotheById,
  updateClotheImage,
} from "@/lib/CRUD/clotheCRUD";
import { useAppwrite } from "@/lib/useAppWrite";
import { ActivityIndicator } from "react-native";
import LoadingScreen from "@/components/LoadingScreen";
import { Image } from "expo-image";
import icons from "@/constants/icons";
import { usePathname } from "expo-router";
import { Alert } from "react-native";
import { checkAbsoultePath } from "@/lib/LocalStoreManager";
import { ScrollView } from "react-native-gesture-handler";
import ImageCropper from "react-native-image-crop-picker";
import { useGlobalContext } from "@/lib/globalProvider";
import { launchImageLibraryAsync } from "expo-image-picker";

const ClotheDetailsScreen = () => {
  const path = usePathname();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: clothe,
    loading,
    refetch,
  } = useAppwrite({ fn: getClotheById, params: { id: id } });
  const [absClotheImage, setAbsClotheImage] = useState(
    checkAbsoultePath(clothe?.localImageURL ?? "")
  );
  const { user } = useGlobalContext();
  useEffect(() => {
    refetch();
    if (!clothe && !loading) router.back();
  }, [id]);
  useEffect(() => {
    if (!clothe && !loading) {
      router.back();
      return;
    }
    setAbsClotheImage(checkAbsoultePath(clothe?.localImageURL ?? ""));
  }, [clothe, loading]);
  const [isEdit, setIsEdit] = useState(false);
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
  useEffect(() => {}, []);
  const toggleEdit = () => {
    setIsEdit(!isEdit);
  };

  const editImage = async () => {
    try {
      let result = await launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 1,
      });

      if (!result.canceled) {
        await updateClotheImage(id, user?.$id!, result.assets[0].uri);
        setAbsClotheImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error updating image:", error);
    }
  };

  if (loading) return <LoadingScreen />;
  return (
    <SafeAreaView className="px-5 bg-sand-dark flex-1">
      {/* header */}
      <ScrollView contentContainerClassName="pb-20">
        <View className="flex-row justify-between items-center py-5 bg-beige rounded-t-lg">
          <TouchableOpacity
            onPress={() => {
              router.back();
              toggleEdit();
            }}
            className="basis-1/3"
          >
            <Image
              source={icons.rightArrow}
              className="size-10 rotate-180"
              tintColor={"#b17457"}
            />
          </TouchableOpacity>
          <View className="flex-row basis-1/3">
            <Text
              className={`text-${clothe!.title.length > 10 ? "2xl" : "3xl"} font-S-Medium text-center text-white`}
            >
              {clothe!.title}
            </Text>
          </View>
          <View className="flex-row basis-1/3 justify-end items-center">
            <TouchableOpacity onPress={toggleEdit}>
              <Image
                source={icons.edit}
                className="size-6 mx-2"
                tintColor={isEdit ? "red" : "#b17457"}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelteClothe}>
              <Image
                source={icons.deleteIcon}
                className="size-6 mx-2"
                tintColor={"#b17457"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* image */}
        {isEdit ? (
          <TouchableOpacity onPress={editImage}>
            <Image
              source={absClotheImage}
              className="w-full h-[32rem] bg-oat rounded-b-lg"
              contentFit="contain"
            />
          </TouchableOpacity>
        ) : (
          <Image
            source={absClotheImage}
            className="w-full h-[32rem] bg-oat rounded-b-lg"
            contentFit="contain"
          />
        )}

        <View className=" mt-2 px-2">
          <View className="flex-row justify-start items-center mt-2 gap-20">
            <View className="flex-col items-start  mt-2  ">
              <Text className="font-S-RegularItalic text-lg ">
                Purchased Price
              </Text>
              <Text className="font-S-RegularItalic text-2xl ">
                ${clothe!.price}
              </Text>
            </View>
            <View className="flex-col items-start mt-2 ">
              <Text className="font-S-RegularItalic text-lg">Purchased on</Text>
              <Text className="font-S-RegularItalic text-xl">
                {" "}
                {clothe!.purchasedate
                  ? new Date(clothe!.purchasedate).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : ""}
              </Text>
            </View>
          </View>
          <View className="flex-col items-start mt-2 ">
            <Text className="font-S-RegularItalic text-lg">Brand: </Text>
            <Text className="font-S-RegularItalic text-2xl">
              {clothe!.brand ?? ""}
            </Text>
          </View>
          <View className="flex-row justify-start items-center mt-2 gap-20">
            <View className="flex-col  items-start  ">
              <Text className="font-S-RegularItalic text-lg">
                Main Category:
              </Text>
              <Text className="font-S-RegularItalic text-lg">
                {clothe!.maincategory}
              </Text>
            </View>
            <View className="flex-col items-start ">
              <Text className="font-S-RegularItalic text-lg">
                Sub Categories:
              </Text>
              <View className="flex-row flex-wrap">
                {clothe?.subcategories?.map((element: string) => (
                  <Text
                    key={element}
                    className="font-S-RegularItalic text-lg mr-2"
                  >
                    {element}
                  </Text>
                ))}
              </View>
            </View>
          </View>
          <View className="flex-col  items-start  ">
            <Text className="font-S-RegularItalic text-lg">Remark:</Text>
            <Text className="font-S-RegularItalic text-lg border-2 border-oat rounded-lg w-full">
              {clothe!.remark ?? ""}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ClotheDetailsScreen;
