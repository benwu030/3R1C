import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
interface OutfitPreviewProps {
  date: Date;
  outfitImage?: string; // 搭配的截圖
  clothes?: Array<{
    id: string;
    image: string;
    position: {
      x: number;
      y: number;
      scale: number;
      rotation: number;
    };
  }>;
}

const CalendarItem = ({ date, outfitImage, clothes }: OutfitPreviewProps) => {
  return (
    <View className="flex-1 bg-white rounded-lg m-4 p-4 shadow-md h-full">
      <Text className="font-S-Bold text-xl mb-2">
        {date.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/OutfitPlanning/Collections")}
      >
        {outfitImage ? (
          <Image
            source={outfitImage}
            className="w-full h-40 rounded-lg"
            contentFit="contain"
          />
        ) : (
          <View className="w-full h-40 bg-gray-100 rounded-lg items-center justify-center">
            <Text className="font-S-Regular text-gray-400">尚未建立搭配</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CalendarItem;
