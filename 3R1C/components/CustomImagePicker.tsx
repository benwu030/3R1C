import { useState } from 'react';
import { Button, Image, View, StyleSheet } from 'react-native';
import {ImagePickerAsset,launchImageLibraryAsync} from 'expo-image-picker';
export default function CustomImagePicker({imageFile, setImageFile}: {imageFile: ImagePickerAsset| null, setImageFile: (image: ImagePickerAsset | null) => void}) {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });


    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageFile(result.assets[0]);
      console.log(result.assets[0],'from image picker');

    }
  };

  return (
    <View className='flex-col items-center justify-center'> 
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} className='w-full aspect-[4/3]' resizeMode='contain'/>}
    </View>
  );
}


