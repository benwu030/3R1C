import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { Clothe } from "@/constants/clothes";
import { Category } from "@/constants/category";

interface ItemBarProps {
  clothes: Clothe[];
  loading: boolean;
  onSelectItem: (clothe: Clothe) => void;
  onClose: () => void;
}

const ClotheItemBar = ({
  clothes,
  loading,
  onSelectItem,
  onClose,
}: ItemBarProps) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  // Filter clothes by category
  const filteredClothes = selectedCategory
    ? clothes.filter((clothe) => clothe.maincategory === selectedCategory)
    : clothes;

  // Get unique categories
  const categories = Array.from(
    new Set(clothes.map((clothe) => clothe.maincategory))
  );

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl max-h-72">
      <View className="flex-row justify-between items-center p-3 border-b border-gray-200">
        <Text className="font-S-Bold text-base">Select clothing item</Text>
        <TouchableOpacity onPress={onClose}>
          <Text className="font-S-Medium">Close</Text>
        </TouchableOpacity>
      </View>

      {/* Category selection */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="p-2 border-b border-gray-100"
      >
        <TouchableOpacity
          onPress={() => setSelectedCategory(null)}
          className={`px-3 py-1 mx-1 rounded-full ${!selectedCategory ? "bg-black" : "bg-gray-200"}`}
        >
          <Text
            className={`${!selectedCategory ? "text-white" : "text-black"} font-S-Regular`}
          >
            All
          </Text>
        </TouchableOpacity>

        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            className={`px-3 py-1 mx-1 rounded-full ${selectedCategory === category ? "bg-black" : "bg-gray-200"}`}
          >
            <Text
              className={`${selectedCategory === category ? "text-white" : "text-black"} font-S-Regular`}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Clothing items */}
      {loading ? (
        <View className="flex-1 justify-center items-center p-4">
          <ActivityIndicator size="large" color="#000000" />
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="p-2"
        >
          {filteredClothes.length === 0 ? (
            <View className="flex-1 justify-center items-center p-4">
              <Text className="text-gray-500 font-S-Regular">
                No items found
              </Text>
            </View>
          ) : (
            filteredClothes.map((clothe) => (
              <TouchableOpacity
                key={clothe.$id}
                onPress={() => onSelectItem(clothe)}
                className="mr-4 items-center"
              >
                <View className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                  <Image
                    source={{ uri: clothe.localImageURL }}
                    className="w-full h-full"
                    contentFit="contain"
                  />
                </View>
                <Text
                  className="text-xs mt-1 font-S-Regular text-center"
                  numberOfLines={1}
                >
                  {clothe.title}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default ClotheItemBar;
