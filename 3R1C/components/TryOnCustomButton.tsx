import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "expo-image";
interface TryOnCustomButtonProps {
  imageUri: string;
  title: string;
  onPress?: () => void;
}
const TryOnCustomButton = ({
  imageUri,
  title,
  onPress,
}: TryOnCustomButtonProps) => {
  return (
    <TouchableOpacity className="flex-col" onPress={onPress}>
      <View className="size-12 rounded-full bg-beige-darker  items-center justify-center">
        <View className="size-11 bg-sand-dark rounded-full items-center justify-center">
          <Image
            source={imageUri}
            tintColor="black"
            className="size-5"
            contentFit="cover"
          />
        </View>
      </View>
      <Text className="text-center mt-2 font-S-Regular text-gray-700 text-xs">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default TryOnCustomButton;
