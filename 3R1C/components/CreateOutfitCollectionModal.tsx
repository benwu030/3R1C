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
      contentContainerClassName="pb-32 bg-white"
      showsHorizontalScrollIndicator={true}
    >
      <View className="p-5 flex-col">
        <CustomImagePicker imageFile={imageFile} setImageFile={setImageFile} />

        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          className="font-S-RegularItalic border-b border-gray-300 mb-4 text-2xl py-2"
        />
        <TextInput
          placeholder="description"
          value={description}
          onChangeText={setDescription}
          keyboardType="numeric"
          className="font-S-RegularItalic border-b border-gray-300 mb-4 text-2xl py-2"
        />

        <View className="flex-col items-begin">
          <Text className="font-S-RegularItalic text-lg mb-1">
            Select Purchase Date
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
