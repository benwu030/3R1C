import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Image } from "expo-image";
import { Clothe } from "@/constants/clothes";
import { colorScheme, cssInterop } from "nativewind";
import { refetchClotheImage } from "@/lib/CRUD/clotheCRUD";

cssInterop(Image, { className: "style" });

interface Props {
  item: Clothe;
  onPress?: () => void;
}
const ClothesCard = ({
  item: { localImageURL, title, price, purchasedate, $id },
  onPress,
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
          onError={handleImageError}
          className="w-full h-60"
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
};

export default ClothesCard;
