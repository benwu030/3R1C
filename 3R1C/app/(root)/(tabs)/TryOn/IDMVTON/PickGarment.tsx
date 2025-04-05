import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { Image } from "expo-image";
import TryOnCustomButton from "@/components/TryOnCustomButton";
import icons from "@/constants/icons";

const PickGarment = ({
  garmentImage,
  onPickImage,
  onPickCamera,
  onSelectCloset,
}: any) => {
  const GarmentButtons = () => (
    <View className="flex-row justify-center items-center gap-20 mt-5">
      <TryOnCustomButton
        imageUri={icons.image}
        title="Image"
        onPress={onPickImage}
      />
      <TryOnCustomButton
        imageUri={icons.camera}
        title="Camera"
        onPress={onPickCamera}
      />
      <TryOnCustomButton
        imageUri={icons.closet}
        title="Closet"
        onPress={onSelectCloset}
      />
    </View>
  );

  return (
    <SafeAreaView>
      <View className="mt-2">
        <Text className="font-S-Regular text-gray-700">Clothes</Text>
        {garmentImage ? (
          <View>
            <Image
              source={garmentImage}
              className="aspect-[3/4] rounded-lg"
              contentFit="contain"
            />
            <GarmentButtons />
          </View>
        ) : (
          <GarmentButtons />
        )}
      </View>
    </SafeAreaView>
  );
};

export default PickGarment;
