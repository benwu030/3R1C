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

import * as ImagePicker from "react-native-image-picker";
const PickModel = () => {
  const [modelImage, setModelImage] = useState<string | null>(null);
  const [autoMask, setAutoMask] = useState(false);
  const [cameraPermissionStatus, requestPermission] = useCameraPermissions();
  // const pickImageFromGallery = async () => {
  //   let result = await launchImageLibraryAsync({
  //     mediaTypes: ["images"],
  //     allowsEditing: true,
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     setModelImage(result.assets[0].uri);
  //   }
  // };
  const pickImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibrary({
      mediaType: "photo",
      quality: 1,
    });

    if (!result.didCancel) {
      setModelImage(result.assets?.[0]?.uri ?? null);
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
      allowsEditing: true,
    });

    if (!result.canceled) {
      setModelImage(result.assets[0].uri);
    }
  };

  const navigateToImageEditor = () => {
    // Navigate to the image editor screen with the selected model image
    router.push({
      pathname: "/(root)/Utils/ImageEditorSkia",
      params: { imageUri: modelImage },
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
            <TouchableOpacity onPress={navigateToImageEditor}>
              <Image
                source={modelImage}
                className="aspect-[3/4] rounded-lg"
                contentFit="cover"
              />
            </TouchableOpacity>
            <ModelButtons />
            <View className="flex-row justify-center items-center ">
              <Checkbox
                value={autoMask}
                onValueChange={() => setAutoMask(!autoMask)}
                color={autoMask ? "#4630EB" : undefined}
              />
              <Text className="font-S-Regular text-gray-700">Auto Mask?</Text>
            </View>
          </View>
        ) : (
          <ModelButtons />
        )}
      </View>
    </SafeAreaView>
  );
};

export default PickModel;
