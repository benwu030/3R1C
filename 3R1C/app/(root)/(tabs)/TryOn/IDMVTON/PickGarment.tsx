import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import TryOnCustomButton from "@/components/TryOnCustomButton";
import icons from "@/constants/icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { IdmVtonImageUploader } from "@/lib/AI/ImageUploader";

const PickGarment = ({}: any) => {
  const params = useLocalSearchParams<{
    garmentImageFromClosetUri?: string;
    garmentImageFromClosetTitle?: string;
    modelImageUri?: string;
    modelMaskImageUri?: string;
  }>();

  const [garmentImage, setGarmentImage] = useState<string | null>(null);
  const [generatedImageUri, setGeneratedImageUri] = useState<string | null>(
    null
  );
  useEffect(() => {
    if (params.garmentImageFromClosetUri) {
      setGarmentImage(params.garmentImageFromClosetUri);
    }
  }, [params.garmentImageFromClosetUri]);
  const selectFromCloset = () => {
    router.push({
      pathname: "../TryOnCloset",
    });
  };
  const GarmentButtons = () => (
    <View className="flex-row justify-center items-center gap-20 mt-5">
      <TryOnCustomButton imageUri={icons.image} title="Image" />
      <TryOnCustomButton imageUri={icons.camera} title="Camera" />
      <TryOnCustomButton
        imageUri={icons.closet}
        title="Closet"
        onPress={selectFromCloset}
      />
    </View>
  );
  const generateImage = async () => {
    // if (!state.modelImage || !state.garmentImage) {
    //   Alert.alert("Please select both model and garment images");
    //   return;
    // }
    // if (!state.autoMask && !state.modelMaskImage) {
    //   Alert.alert("Please create a mask image by clicking the model image");
    //   return;
    // }
    // dispatch({ type: "SET_IS_LOADING", payload: true });
    // const generatedUri = await IdmVtonImageUploader(
    //   state.garmentImage,
    //   state.modelImage,
    //   state.idmVtonPrompt,
    //   state.idmVtonMaskArea,
    //   state.modelMaskImage
    // );
    const generatedUri = await IdmVtonImageUploader(
      garmentImage ?? "",
      params.modelImageUri ?? "",
      "",
      "upper_body",
      params.modelMaskImageUri ?? ""
    );
    console.log("Mask URI:", params.modelMaskImageUri);
    // dispatch({ type: "SET_IS_LOADING", payload: false });
    if (generatedUri === null) {
      Alert.alert(
        "Error",
        "Failed to generate image.\n Please try again later."
      );
      return;
    }
    setGeneratedImageUri(generatedUri ?? "");
  };

  return (
    <SafeAreaView>
      <ScrollView>
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
              <TouchableOpacity
                className="py-2.5 px-4 bg-green-darker rounded my-2"
                onPress={generateImage}
              >
                <Text className="text-white font-S-Medium">Continue</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <GarmentButtons />
          )}
        </View>
        {generatedImageUri && (
          <View>
            <Text className="font-S-Regular text-gray-700">
              Generated Image
            </Text>
            <Image
              source={generatedImageUri}
              className="aspect-[3/4] rounded-lg"
              contentFit="contain"
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PickGarment;
