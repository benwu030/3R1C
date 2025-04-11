import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "expo-image";
import icons from "@/constants/icons";
import { OutfitCollection } from "@/constants/outfit";
import { checkAbsoultePath } from "@/lib/LocalStoreManager";

interface OutfitCollectionProps {
  item: OutfitCollection;
  onPress?: () => void;
  isSelectMode?: boolean;
  isSelected?: boolean;
}

const OutfitCollectionCard = ({
  item: { title, previewImageURL, dayToWear, $id },
  isSelectMode,
  isSelected,
  onPress,
}: OutfitCollectionProps) => {
  // Find the date closest to today from the dayToWear array (if it exists)
  const today = new Date();
  const absolutePath = checkAbsoultePath(previewImageURL??"");
  let minDiff = Infinity;
  let closestDate = null;

  if (dayToWear && dayToWear.length > 0) {
    closestDate = dayToWear[0];
    dayToWear.forEach((date) => {
      date = new Date(date);
      const diff = Math.abs(date.getTime() - today.getTime());
      if (diff < minDiff) {
        minDiff = diff;
        closestDate = date;
      }
    });
  }

  let displayDate = closestDate?.toLocaleDateString("default", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
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
      {displayDate && (
        <View className="flex-row items-center absolute px-2 -top-2 -right-2 bg-stone-300 p-1 rounded-full z-50">
          <Text className="text-xs font-S-Bold text-zinc-600 ml-1">
            {displayDate}
          </Text>
        </View>
      )}
      <View className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
        {previewImageURL ? (
          <Image
            source={{ uri: absolutePath }}
            className="w-full h-full"
            contentFit="cover"
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-400">Photo Not Availiabe</Text>
          </View>
        )}
      </View>
      <Text className="mt-2 font-S-Medium text-center">{title}</Text>
    </TouchableOpacity>
  );
};

export default OutfitCollectionCard;
