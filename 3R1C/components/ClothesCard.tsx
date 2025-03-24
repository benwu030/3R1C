import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Image } from "expo-image";
import { Clothe } from "@/constants/clothes";
import { colorScheme, cssInterop } from "nativewind";
import { refetchClotheImage } from "@/lib/CRUD/clotheCRUD";

cssInterop(Image, { className: "style" });

interface Props {
  item: Clothe;
  cardType?: "horizontal" | "vertical";
  onPress?: () => void;
  isSelectMode?: boolean;
  isSelected?: boolean;
}
const ClothesCard = ({
  item: { localImageURL, title, price, purchasedate, $id, brand },
  cardType = "vertical",
  onPress,
  isSelectMode,
  isSelected,
}: Props) => {
  const [localImageURLState, setLocalImageURLState] = useState({
    uri: localImageURL,
  });
  const [isRefetching, setIsRefetching] = useState(false);
  const handleImageError = async () => {
    if (isRefetching || !$id) return;

    setIsRefetching(true);
    const newPath = await refetchClotheImage(localImageURL, $id, () => {});

    if (newPath) {
      setLocalImageURLState({ uri: `${newPath}?timestamp=${Date.now()}` });
    }
    setIsRefetching(false);
  };
  const card = () => {
    if (cardType === "vertical") {
      return (
        <TouchableOpacity
          onPress={onPress}
          className={`flex-1  relative${isSelected ? "opacity-50" : ""}`}
        >
          {isSelectMode && (
            <View
              className={`absolute top-3 left-1 z-50  rounded-full p-1 w-5 h-5 rounded-full border-2 border-beige 
              ${isSelected ? "bg-beige-darker" : "bg-transparent"}`}
            />
          )}

          <View className="flex-col items-center justify-center mt-2">
            <View className="flex-row items-center absolute px-2 top-4 -right-2 bg-stone-300 p-1 rounded-full z-50">
              <Text className="text-xs font-S-Bold text-zinc-600 ">
                ${price}
              </Text>
            </View>
            {brand && (
              <View className="flex-row items-center absolute px-2 -top-2 -right-2 bg-beige-dark p-1 rounded-full z-50">
                <Text className="font-S-Regular text-sand text-xs">
                  Brand - {brand}
                </Text>
              </View>
            )}

            <Image
              key={localImageURLState.uri}
              source={localImageURLState}
              className={`w-full h-60 ${isSelected ? "opacity-60" : ""} rounded-xl`}
              onError={handleImageError}
            />

            <View className="flex-col items-center justify-center mt-2">
              <Text className="font-S-Regular text-black text-xl">{title}</Text>

              <Text className="font-S-Medium text-beige-darker text-sm">
                {purchasedate?.toString().split("T")[0] ?? ""}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={onPress} className="flex-1 relative">
          <View className="flex-row items-center justify-start mt-2">
            <Image
              key={localImageURLState.uri}
              source={localImageURLState}
              className="w-[7rem] h-[9rem]"
            />

            <View className="flex-col items-start justify-start ml-3 py-5">
              <Text className="font-S-Light text-gray-900 text-2xl ">
                {title}
              </Text>
              <Text className="font-S-Light text-brick-light text-lg ">
                ${price}
              </Text>
              <Text className="font-S-ExtraLight text-gray-700 text-xs">
                {purchasedate?.toString().split("T")[0] ?? ""}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  };
  return <>{card()}</>;
};

export default ClothesCard;
