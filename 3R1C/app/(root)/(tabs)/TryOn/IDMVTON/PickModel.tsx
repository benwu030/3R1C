import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
  Linking,
  ScrollView,
} from "react-native";
import { Image, useImage } from "expo-image";
import Checkbox from "expo-checkbox";
import TryOnCustomButton from "@/components/TryOnCustomButton";
import icons from "@/constants/icons";
import CustomHeader from "@/components/CustomHeader";

import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  launchImageLibraryAsync,
  useCameraPermissions,
  PermissionStatus,
  launchCameraAsync,
} from "expo-image-picker";
import {
  FlipType,
  ImageManipulator,
  SaveFormat,
  useImageManipulator,
} from "expo-image-manipulator";
import ImageCropper from "react-native-image-crop-picker";
const tryonImageHeight = 1024;
const tryonImageWidth = 768;
const PickModel = () => {
  const params = useLocalSearchParams<{
    modelMaskImageUri: string;
  }>();
  const [modelImage, setModelImage] = useState<string | null>(null);
  const [modelImageDimensions, setModelImageDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });
  const [autoMask, setAutoMask] = useState(false);
  const [modelMaskImage, setModelMaskImage] = useState<string | null>(null);
  useEffect(() => {
    if (params.modelMaskImageUri) {
      setModelMaskImage(params.modelMaskImageUri);
    }
  }, [params.modelMaskImageUri]);
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
      setModelImage(resizedResult.uri);
      setModelImageDimensions({
        width: image.width,
        height: image.height,
      });
    }
  };

  const cleanupImages = () => {
    ImageCropper.clean()
      .then(() => {
        console.log("removed tmp images from tmp directory");
      })
      .catch((e) => console.log(e));
  };
  const navigateToGarmentPicker = () => {
    //check if everything is set
    router.push({
      pathname: "/(root)/(tabs)/TryOn/IDMVTON/PickGarment",
      params: {
        modelImageUri: modelImage,
        modelMaskImageUri: modelMaskImage,
      },
    });
  };
  const cropImage = async (imagePath: string) => {
    ImageCropper.openCropper({
      mediaType: "photo",
      width: tryonImageWidth,
      height: tryonImageHeight,
      path: imagePath,
    }).then((image) => {
      setModelImage(image.path);
      setModelImageDimensions({
        width: image.width,
        height: image.height,
      });
    });
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
      setModelImage(resizedResult.uri);
      setModelImageDimensions({
        width: image.width,
        height: image.height,
      });
    }
  };

  const navigateToImageEditor = () => {
    // Navigate to the image editor screen with the selected model image
    console.log("Navigating to ImageEditorSkia with imageUri:", modelImage);
    router.push({
      pathname: "/(root)/Utils/ImageEditorSkia",
      params: {
        imageUri: modelImage,
        imageWidth: modelImageDimensions.width,
        imageHeight: modelImageDimensions.height,
        outputWidth: tryonImageWidth,
        outputHeight: tryonImageHeight,
      },
    });
  };
  const ModelButtons = () => (
    <View className="flex-row justify-center items-center gap-20 mt-5">
      <TryOnCustomButton
        imageUri={icons.image}
        title="Image"
        onPress={pickImageFromGallery}
      />
      <TryOnCustomButton
        imageUri={icons.camera}
        title="Camera"
        onPress={pickImageFromCamera}
      />
    </View>
  );

  return (
    <SafeAreaView>
      <CustomHeader title="Model" />
      <ScrollView>
        <View className="px-5">
          <Text className="font-S-Regular text-gray-700">
            Choose a picture of yourself
          </Text>
          {modelImage ? (
            <View>
              <TouchableOpacity onPress={() => cropImage(modelImage)}>
                <Image
                  source={modelImage}
                  className="aspect-[3/4] rounded-lg"
                  contentFit="contain"
                />
              </TouchableOpacity>
              <ModelButtons />
              <TouchableOpacity
                className="py-2.5 px-4 bg-green-darker rounded my-2"
                onPress={navigateToImageEditor}
              >
                <Text className="text-white font-S-Medium">
                  Create A Mask(Optional)
                </Text>
              </TouchableOpacity>
              {modelMaskImage && (
                <Image
                  source={modelMaskImage}
                  className="aspect-[3/4] rounded-lg"
                  contentFit="contain"
                />
              )}
              <TouchableOpacity
                className="py-2.5 px-4 bg-green-darker rounded my-2"
                onPress={navigateToGarmentPicker}
              >
                <Text className="text-white font-S-Medium">Continue</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ModelButtons />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PickModel;
