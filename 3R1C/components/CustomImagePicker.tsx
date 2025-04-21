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
import ImageCropper from "react-native-image-crop-picker";
import { RemoveBackgroundImageUploader } from "@/lib/AI/ImageUploader";
import { router, useLocalSearchParams } from "expo-router";

const tryonImageHeight = 1024;
const tryonImageWidth = 768;
export default function CustomImagePicker({
  imageFileUri,
  setImageFileUri,
  imageSizeClassName = "aspect-[4/5]",
}: {
  imageFileUri: string | null;
  setImageFileUri: (image: string | null) => void;
  imageSizeClassName?: string;
}) {
  const [image, setImage] = useState<string | null>(null);
  const [cameraPermissionStatus, requestPermission] = useCameraPermissions();
  const cropImage = async (imagePath: string) => {
    ImageCropper.openCropper({
      mediaType: "photo",
      width: tryonImageWidth,
      height: tryonImageHeight,
      path: imagePath,
    }).then((image) => {
      setImage(image.path);
    });
  };
  const pickImageFromGallery = async () => {
    // No permissions request is necessary for launching the image library
    let result = await launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageFileUri(result.assets[0].uri);
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
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageFileUri(result.assets[0].uri);
    }
  };

  const removeBackgroundBtn = async () => {
    //called the trained ai model to remove the background
    // await ImageUploader(image ?? "");
    try {
      const result = await RemoveBackgroundImageUploader(image ?? "");
      if (result?.image) {
        setImage(result.image);
        setImageFileUri(result.image);
        if (result.category) {
          router.setParams({ mainCategoryfilter: result.category });
        }
      }
    } catch (err) {
      console.error("Error in remove background", err);
    }
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
      <TouchableOpacity onPress={() => cropImage(image)}>
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
          onPress={() => removeBackgroundBtn()}
        />
      </View>
    </View>
  );
}
