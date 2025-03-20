import { useState } from "react";
import { Button, Image, View, TouchableOpacity } from "react-native";
import { ImagePickerAsset, launchImageLibraryAsync } from "expo-image-picker";
export default function CustomImagePicker({
  imageFile,
  setImageFile,
}: {
  imageFile: ImagePickerAsset | null;
  setImageFile: (image: ImagePickerAsset | null) => void;
}) {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [4, 5],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageFile(result.assets[0]);
      console.log(result.assets[0], "from image picker");
    }
  };

  return !image ? (
    <View className="flex-col items-center justify-center bg-grey aspect-[4/5]">
      <Button title="Pick an image from camera roll" onPress={pickImage} />
    </View>
  ) : (
    <TouchableOpacity onPress={pickImage}>
      <Image
        source={{ uri: image }}
        style={{ width: "100%", aspectRatio: 5 / 4 }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}
