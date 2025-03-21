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
}
const ClothesCard = ({
  item: { localImageURL, title, price, purchasedate, $id },
  onPress,
  cardType = "vertical",
}: Props) => {
  const [localImageURLState, setLocalImageURLState] = useState({
    uri: localImageURL,
  });
  const [isRefetching, setIsRefetching] = useState(false);
  const handleImageError = async () => {
    if (isRefetching || !$id) return;

    setIsRefetching(true);
    const newPath = await refetchClotheImage(localImageURL, $id, () => {
      console.log("Image refetched locally");
    });
    console.log("newPath", newPath);

    if (newPath) {
      setLocalImageURLState({ uri: `${newPath}?timestamp=${Date.now()}` });
    }
    setIsRefetching(false);
  };
  const card = () => {
    if (cardType === "vertical") {
      return (
        <TouchableOpacity onPress={onPress} className="flex-1  relative">
          <View className="flex-col items-center justify-center mt-2">
            <View className="flex-row items-center absolute px-2 top-5 right-5 bg-stone-300 p-1 rounded-full z-50">
              <Text className="text-xs font-S-Bold text-zinc-600 ml-1">
                ${price}
              </Text>
            </View>

            <Image
              key={localImageURLState.uri}
              source={localImageURLState}
              className="w-full h-60"
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
