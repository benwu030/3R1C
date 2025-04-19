import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  TextInput,
  Platform,
  Linking,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import TryOnCustomButton from "@/components/TryOnCustomButton";
import icons from "@/constants/icons";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  IdmVtonImageUploader,
  OpenPoseCategoryType,
} from "@/lib/AI/ImageUploader";
import CustomHeader from "@/components/CustomHeader";
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import { checkAbsoultePath } from "@/lib/LocalStoreManager";
const tryonImageHeight = 1024;
const tryonImageWidth = 768;
const PickGarment = ({}: any) => {
  const params = useLocalSearchParams<{
    garmentImageFromClosetUri?: string;
    garmentImageFromClosetTitle?: string;
    modelImageUri?: string;
    modelMaskImageUri?: string;
    autoMask?: string;
    openPose?: string;
  }>();
  const [garmentDescription, setGarmentDescription] = useState<string | null>(
    null
  );
  const [garmentImage, setGarmentImage] = useState<string | null>(null);
  const [generatedImageUri, setGeneratedImageUri] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setGarmentImage(params.garmentImageFromClosetUri ?? null);
    setGarmentDescription(params.garmentImageFromClosetTitle ?? null);
  }, [params.garmentImageFromClosetUri, params.garmentImageFromClosetTitle]);
  const selectFromCloset = () => {
    router.push({
      pathname: "../TryOnCloset",
    });
  };
  const [cameraPermissionStatus, requestPermission] = useCameraPermissions();
  const pickImageFromGallery = async () => {
    let result = await launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      //resize the image to the VITON dataset size
      const context = ImageManipulator.manipulate(result.assets[0].uri);
      context.resize({ width: tryonImageWidth, height: tryonImageHeight });
      const image = await context.renderAsync();
      const resizedResult = await image.saveAsync({
        format: SaveFormat.PNG,
      });
      setGarmentImage(resizedResult.uri);
      router.setParams({garmentImageFromClosetUri:resizedResult.uri});
    }
  };
  const pickImageFromCamera = async () => {
    if (cameraPermissionStatus?.status !== PermissionStatus.GRANTED) {
      if (!cameraPermissionStatus?.canAskAgain) {
        Alert.alert(
          "Camera Permission Required",
          "Please enable camera access in your device settings to use this feature.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => {
                if (Platform.OS === "ios") {
                  Linking.openURL("app-settings:");
                } else {
                  Linking.openSettings();
                }
              },
            },
          ]
        );
      }
      requestPermission();
      return;
    }
    let result = await launchCameraAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      const context = ImageManipulator.manipulate(result.assets[0].uri);
      context.resize({ width: tryonImageWidth, height: tryonImageHeight });
      const image = await context.renderAsync();
      const resizedResult = await image.saveAsync({
        format: SaveFormat.PNG,
      });
      setGarmentImage(resizedResult.uri);
      router.setParams({garmentImageFromClosetUri:resizedResult.uri});

    }
  };
  const GarmentButtons = () => (
    <View className="flex-row justify-center items-center gap-20 mt-5">
      <TryOnCustomButton
        imageUri={icons.image}
        title="Image"
        onPress={pickImageFromGallery}
      />
      <TryOnCustomButton imageUri={icons.camera} title="Camera" onPress={pickImageFromCamera} />
      <TryOnCustomButton
        imageUri={icons.closet}
        title="Closet"
        onPress={selectFromCloset}
      />
    </View>
  );
  const generateImage = async () => {
    setIsLoading(true);
    const generatedUri = await IdmVtonImageUploader(
      garmentImage ? checkAbsoultePath(garmentImage) : "",
      params.modelImageUri ?? "",
      params.modelMaskImageUri ?? "",
      garmentDescription ?? "",
      (params.openPose as OpenPoseCategoryType) ?? "upper_body"
    );
    setIsLoading(false);
    if (generatedUri === null) {
      Alert.alert(
        "Error",
        "Failed to generate image.\n Please try again later."
      );
      return;
    }
    setGeneratedImageUri(generatedUri ?? "");
  };
  const returnToHome = () => {
    router.setParams({
      garmentImageFromClosetUri: "",
      garmentImageFromClosetTitle: "",
      modelImageUri: "",
      modelMaskImageUri: "",
      autoMask: "",
      openPose: "",
    });
    router.replace("/(root)/(tabs)/TryOn/TryOnHome");
  };
  const navigateToViewImagePage = (imageUri: string) => {
    router.push({
      pathname: "/(root)/Utils/[imageURL]",
      params: { imageURL: imageUri },
    });
  };
  return (
    <SafeAreaView>
      <CustomHeader title="Garment" />
      <ScrollView contentContainerClassName=" pb-[30em]">
        <View className="px-5">
          {isLoading ? (
          <ActivityIndicator className="text-beige-darker" size="large" />
        ) : (
            <>
              <Text className="font-S-Regular text-gray-700">
                Select clothes you want to try
              </Text>
              {garmentImage ? (
                <View>
                  <Image
                    source={checkAbsoultePath(garmentImage)}
                    className="aspect-[3/4] rounded-lg"
                    contentFit="contain"
                  />
                  <GarmentButtons />
                  <View className="my-3 mt-5">
                    <Text className="font-S-Regular text-gray-700">
                      Describe the garment* (e.g. color, pattern, style)
                    </Text>
                    <TextInput
                      
                      placeholder={garmentDescription ?? ""}
                      placeholderTextColor={"#776E65"}
                      className="font-S-RegularItalic border-b border-gray-300 text-2xl "
                      onChangeText={setGarmentDescription}
                    />
                  </View>
                  <TouchableOpacity
                    className="py-2.5 px-4 bg-green-darker rounded my-2"
                    onPress={generateImage}
                  >
                    <Text className="text-white font-S-Medium">Generate</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <GarmentButtons />
              )}
              {generatedImageUri && (
                <TouchableOpacity
                  onPress={() => navigateToViewImagePage(generatedImageUri)}
                >
                  <Text className="font-S-Regular text-gray-700">
                    Generated Image
                  </Text>
                  <Image
                    source={generatedImageUri}
                    className="aspect-[3/4] rounded-lg"
                    contentFit="contain"
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                className="py-2.5 px-4 bg-green-darker rounded my-2"
                onPress={returnToHome}
              >
                <Text className="text-white font-S-Medium">
                  Return to Try On Home Page
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PickGarment;
