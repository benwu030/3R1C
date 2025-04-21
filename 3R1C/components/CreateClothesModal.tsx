import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { createClothe } from "@/lib/CRUD/clotheCRUD";
import { Category } from "@/constants/category";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import CustomImagePicker from "./CustomImagePicker";
import { MainCategoriesFilter, SubCategoriesFilter } from "./CategoriesFilter";
import { CATEGORIES, SEASONS } from "@/constants/data";
import CircularHue from "./CircularHue";

const CreateClothesModal = ({ userID }: { userID: string }) => {
  const params = useLocalSearchParams<{
    mainCategoryfilter?: string;
    subCategoryfilter?: string;
  }>();
  const categories = CATEGORIES.filter((category) => category !== "All");
  const subCategories = SEASONS;
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [remark, setRemark] = useState("");
  const [brand, setBrand] = useState("");
  const [imageFileUri, setImageFileUri] = useState<string | null>(null);

  const [color, setColor] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const handleSubmit = async () => {
    if (!imageFileUri) {
      Alert.alert("Error", "Please select an image");
      return;
    }
    const mainCategoryfilter = params.mainCategoryfilter as Category;
    const subCategoryfilter = params.subCategoryfilter
      ? params.subCategoryfilter.split(",")
      : [];
    if (!title || !price || !mainCategoryfilter) {
      Alert.alert("Error", "Please fill all the required fields");
      return;
    }
    const newClothe = {
      userid: userID,
      title,
      price: parseFloat(price),
      remark,
      brand,
      maincategory: mainCategoryfilter,
      subcategories: subCategoryfilter,
      maincolor: color,
      purchasedate: purchaseDate,
      localImageURL: imageFileUri,
    };

    try {
      const result = await createClothe(newClothe, userID, imageFileUri, () => {
        Alert.alert("Success", "Clothe stored locally");
        router.back();
      });

      if (!result) {
        Alert.alert("Fail", "Failed to store clothe remotelly");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to store clothe locally");
      console.error("Failed to store clothe locally", error);
    }
  };

  return (
    <ScrollView
      contentContainerClassName="pb-32 bg-white"
      showsHorizontalScrollIndicator={true}
    >
      <View className="p-5 flex-col">
        <CustomImagePicker
          imageFileUri={imageFileUri}
          setImageFileUri={setImageFileUri}
        />
        <Text className="font-S-RegularItalic text-sm ">Title*</Text>
        <TextInput
          placeholder="Enter a name"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor={"#776E65"}
          className="font-S-RegularItalic border-b border-gray-300 mb-4 text-2xl "
        />
        <Text className="font-S-RegularItalic text-sm ">Purchased Price*</Text>

        <TextInput
          placeholder="Enter price"
          value={price}
          onChangeText={setPrice}
          placeholderTextColor={"#776E65"}
          keyboardType="numeric"
          className="font-S-RegularItalic border-b border-gray-300 mb-4 text-2xl"
        />
        <Text className="font-S-RegularItalic text-sm ">Brand</Text>

        <TextInput
          placeholder="Enter a brand name"
          value={brand}
          onChangeText={setBrand}
          placeholderTextColor={"#776E65"}
          className="font-S-RegularItalic border-b border-gray-300 mb-4 text-2xl"
        />
        <Text className="font-S-RegularItalic text-sm ">Remark</Text>

        <TextInput
          placeholder="Enter remark"
          value={remark}
          onChangeText={setRemark}
          placeholderTextColor={"#776E65"}
          className="font-S-RegularItalic border-b border-gray-300 mb-4 text-xl"
          multiline={true}
          numberOfLines={4}
        />
        <Text className="font-S-RegularItalic text-lg mb-1">
          Main Category*
        </Text>
        <MainCategoriesFilter Categories={categories} />
        <Text className="font-S-RegularItalic text-lg my-2">
          Sub Categories
        </Text>
        <SubCategoriesFilter Categories={subCategories} />

        <View className="mb-6 mt-4">
          <Text className="font-S-RegularItalic text-lg mb-1">
            Select a Color
          </Text>
          <CircularHue setColor={setColor} />
        </View>

        <View className="flex-col items-begin">
          <Text className="font-S-RegularItalic text-lg mb-1">
            Select Purchase Date
          </Text>
          <View className="ml-[-8]">
            <DateTimePicker
              value={purchaseDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(!showDatePicker);
                if (selectedDate) {
                  setPurchaseDate(selectedDate);
                }
              }}
            />
          </View>
        </View>

        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

export default CreateClothesModal;
