import { View, Platform, Alert, Linking, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useState } from "react";
import TryOnCustomButton from "@/components/TryOnCustomButton";
import {
  ImagePickerAsset,
  useCameraPermissions,
  PermissionStatus,
  launchCameraAsync,
  launchImageLibraryAsync,
} from "expo-image-picker";
import icons from "@/constants/icons";

export default function CustomImagePicker({
  imageFile,
  setImageFile,
  imageSizeClassName = "aspect-[4/5]",
}: {
  imageFile: ImagePickerAsset | null;
  setImageFile: (image: ImagePickerAsset | null) => void;
  imageSizeClassName?: string;
}) {
  const [image, setImage] = useState<string | null>(null);
  const [cameraPermissionStatus, requestPermission] = useCameraPermissions();
  const pickImageFromGallery = async () => {
    // No permissions request is necessary for launching the image library
    let result = await launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageFile(result.assets[0]);
    }
  };

  const pickImageFromCamera = async () => {
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
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageFile(result.assets[0]);
    }
  };

  const removeBackground = async () => {
    //called the trained ai model to remove the background
    // await ImageUploader(image ?? "");
    console.log("remove background");
  };
  return !image ? (
    <View
      className={`flex-row gap-20
     items-center justify-center bg-grey ${imageSizeClassName}`}
    >
      <TryOnCustomButton
        imageUri={icons.image}
        title="Image"
        onPress={() => pickImageFromGallery()}
      />
      <TryOnCustomButton
        imageUri={icons.camera}
        title="Camera"
        onPress={() => pickImageFromCamera()}
      />
    </View>
  ) : (
    <View className={`${imageSizeClassName} relative`}>
      <TouchableOpacity onPress={() => pickImageFromGallery()}>
        <Image source={image} className="w-full h-full" contentFit="contain" />
      </TouchableOpacity>
      <View className="absolute top-2 right-2 flex-row gap-2 ">
        <TryOnCustomButton
          imageUri={icons.image}
          title=""
          onPress={() => pickImageFromGallery()}
        />
        <TryOnCustomButton
          imageUri={icons.camera}
          title=""
          onPress={() => pickImageFromCamera()}
        />
        <TryOnCustomButton
          imageUri={icons.scissor}
          title=""
          onPress={() => removeBackground()}
        />
      </View>
    </View>
  );
}
