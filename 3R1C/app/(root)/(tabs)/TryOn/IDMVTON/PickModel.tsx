import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
  Linking,
} from "react-native";
import { Image } from "expo-image";
import Checkbox from "expo-checkbox";
import TryOnCustomButton from "@/components/TryOnCustomButton";
import icons from "@/constants/icons";
import CustomHeader from "@/components/CustomHeader";

import { useState } from "react";
import { router } from "expo-router";
import {
  launchImageLibraryAsync,
  useCameraPermissions,
  PermissionStatus,
  launchCameraAsync,
} from "expo-image-picker";

import ImageCropper from "react-native-image-crop-picker";

const PickModel = () => {
  const [modelImage, setModelImage] = useState<string | null>(null);
  const [modelImageDimensions, setModelImageDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });
  const [autoMask, setAutoMask] = useState(false);
  const [cameraPermissionStatus, requestPermission] = useCameraPermissions();
  const pickImageFromGallery = async () => {
    let result = await launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      setModelImage(result.assets[0].uri);
      setModelImageDimensions({
        width: result.assets[0].width,
        height: result.assets[0].height,
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
  const cropImage = async (imagePath: string) => {
    ImageCropper.openCropper({
      mediaType: "photo",
      width: 768,
      height: 1024,
      path: imagePath,
    }).then((image) => {
      console.log(image);
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
      allowsEditing: true,
    });

    if (!result.canceled) {
      setModelImage(result.assets[0].uri);
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
                contentFit="cover"
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
            <TouchableOpacity
              className="py-2.5 px-4 bg-green-darker rounded my-2"
              onPress={cleanupImages}
            >
              <Text className="text-white font-S-Medium">Continue</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ModelButtons />
        )}
      </View>
    </SafeAreaView>
  );
};

export default PickModel;
