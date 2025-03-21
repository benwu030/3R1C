import { View, Text } from "react-native";
import React from "react";
import TryOnCustomButton from "./TryOnCustomButton";
import icons from "@/constants/icons";

const TryOnImagePicker = () => {
  return (
    <View>
      <View>
        <Text className="font-S-Regular text-gray-700">Model</Text>
        <View className="flex-row justify-center  items-center gap-20 mt-5">
          <TryOnCustomButton imageUri={icons.image} title="Image" />
          <TryOnCustomButton imageUri={icons.camera} title="Camera" />
        </View>
      </View>
      <View>
        <Text className="font-S-Regular text-gray-700">Garment</Text>
        <View className="flex-row justify-center  items-center gap-20 mt-5">
          <TryOnCustomButton imageUri={icons.image} title="Image" />
          <TryOnCustomButton imageUri={icons.camera} title="Camera" />
          <TryOnCustomButton imageUri={icons.closet} title="Closet" />
        </View>
      </View>
    </View>
  );
};

export default TryOnImagePicker;
