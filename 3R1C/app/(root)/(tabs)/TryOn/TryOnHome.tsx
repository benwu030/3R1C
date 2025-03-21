import { View, Text, SafeAreaView, Button, Platform } from "react-native";
import { useState } from "react";
import CustomHeader from "@/components/CustomHeader";
import { ScrollView } from "react-native-gesture-handler";
import TryOnCustomButton from "@/components/TryOnCustomButton";
import {
  useCameraPermissions,
  PermissionStatus,
  launchCameraAsync,
  launchImageLibraryAsync,
} from "expo-image-picker";

import icons from "@/constants/icons";
import { Alert, Linking } from "react-native";
const TryOnHome = () => {
  const [modelImage, setModelImage] = useState<string | null>(null);
  const [garmentImage, setGarmentImage] = useState<string | null>(null);
  const [cameraPermissionStatus, requestPermission] = useCameraPermissions();

  const pickImageFromGallery = async (type: "model" | "garment") => {
    // No permissions request is necessary for launching the image library
    let result = await launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      if (type === "model") {
        setModelImage(result.assets[0].uri);
      } else {
        setGarmentImage(result.assets[0].uri);
      }
      console.log(result.assets[0], `from try on ${type} image picker`);
    }
  };

  const pickImageFromCamera = async (type: "model" | "garment") => {
    console.log(cameraPermissionStatus, "camera permission status");
    if (cameraPermissionStatus?.status !== PermissionStatus.GRANTED) {
      if (!cameraPermissionStatus?.canAskAgain) {
        // If the user denied the permission and if the permission can't be asked again
        // navigate them to settings

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
      if (type === "model") {
        setModelImage(result.assets[0].uri);
      } else {
        setGarmentImage(result.assets[0].uri);
      }
      console.log(result.assets[0], `from try on ${type} image picker`);
    }
  };

  return (
    <SafeAreaView className="bg-sand-dark flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="px-5"
        contentContainerClassName="pb-20"
      >
        <CustomHeader title="Try On" showBackButton={false} />
        <View>
          <View>
            <Text className="font-S-Regular text-gray-700">Model</Text>
            <View className="flex-row justify-center  items-center gap-20 mt-5">
              <TryOnCustomButton
                imageUri={icons.image}
                title="Image"
                onPress={() => pickImageFromGallery("model")}
              />
              <TryOnCustomButton
                imageUri={icons.camera}
                title="Camera"
                onPress={() => pickImageFromCamera("model")}
              />
            </View>
          </View>
          <View className="mt-2">
            <Text className="font-S-Regular text-gray-700">Clothes</Text>
            <View className="flex-row justify-center  items-center gap-20 mt-5">
              <TryOnCustomButton
                imageUri={icons.image}
                title="Image"
                onPress={() => pickImageFromGallery("garment")}
              />
              <TryOnCustomButton
                imageUri={icons.camera}
                title="Camera"
                onPress={() => pickImageFromCamera("garment")}
              />
              <TryOnCustomButton imageUri={icons.closet} title="Closet" />
            </View>
          </View>
        </View>
        <View className="mt-5">
          <Text className="font-S-Regular text-gray-700">Result</Text>
          <View className="flex-col items-center justify-center bg-white-dark aspect-[4/5] rounded-lg">
            <Text className="font-S-Regular text-gray-700">
              Upload image to see result
            </Text>
            <Button title="Generate"></Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TryOnHome;
