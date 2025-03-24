import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import CustomImagePicker from "./CustomImagePicker";
import { ImagePickerAsset } from "expo-image-picker";
import { createOutfitCollection } from "@/lib/CRUD/outfitCRUD";
const CreateOutfitCollectionModal = ({ userID }: { userID: string }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<ImagePickerAsset | null>(null);
  const [dayToWear, setDayToWear] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const handleSubmit = async () => {
    if (!imageFile) {
      Alert.alert("Error", "Please select an image");
      return;
    }

    if (!title || !dayToWear) {
      Alert.alert("Error", "Please fill all the required fields");
      return;
    }
    const newCollection = {
      userid: userID,
      title,
      description,
      previewImageURL: imageFile.uri,
      dayToWear: [dayToWear],
    };

    try {
      const result = await createOutfitCollection(
        newCollection,
        imageFile,
        () => {
          Alert.alert("Success", "Clothe stored locally");
          router.back();
        }
      );

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
      contentContainerClassName="pb-32 bg-white flex-1"
      showsHorizontalScrollIndicator={true}
    >
      <View className="p-5 flex-col">
        <CustomImagePicker
          imageFile={imageFile}
          setImageFile={setImageFile}
          imageSizeClassName="h-[15rem]"
        />

        <TextInput
          placeholder="Title*"
          placeholderTextColor={"#776E65"}
          value={title}
          onChangeText={setTitle}
          className="font-S-RegularItalic border-b border-gray-300 mb-4 text-2xl py-2"
        />
        <TextInput
          placeholder="Description"
          placeholderTextColor={"#776E65"}
          value={description}
          onChangeText={setDescription}
          className="font-S-RegularItalic border-b border-gray-300 mb-4 text-2xl py-2"
        />

        <View className="flex-col items-begin">
          <Text className="font-S-RegularItalic text-lg mb-1">
            Select Day to Wear
          </Text>
          <View className="ml-[-8]">
            <DateTimePicker
              value={dayToWear}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(!showDatePicker);
                if (selectedDate) {
                  setDayToWear(selectedDate);
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

export default CreateOutfitCollectionModal;
