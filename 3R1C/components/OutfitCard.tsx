import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Outfit } from "@/constants/outfit";
import { Image } from "expo-image";
import { cssInterop } from "nativewind";

cssInterop(Image, { className: "style" });

interface OutfitProps {
  item: Outfit;
  onPress?: () => void;
  isSelectMode?: boolean;
  isSelected?: boolean;
}
const OutfitCard = ({
  item: { title, previewImageURL, $id },
  isSelectMode,
  isSelected,
  onPress,
}: OutfitProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-1 relative ${isSelected ? "opacity-50" : ""}`}
    >
      {/* Existing card content */}
      {isSelectMode && (
        <View
          className={`absolute top-1 left-1 z-50  rounded-full p-1 w-5 h-5 rounded-full border-2 border-beige 
            ${isSelected ? "bg-beige-darker" : "bg-transparent"}`}
        />
      )}
      <View className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
        {previewImageURL ? (
          <Image
            source={{ uri: previewImageURL }}
            className="w-full h-full"
            contentFit="cover"
            cachePolicy={"none"}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-400">無相片</Text>
          </View>
        )}
      </View>
      <Text className="mt-2 font-S-Medium text-center">{title}</Text>
    </TouchableOpacity>
  );
};

export default OutfitCard;
