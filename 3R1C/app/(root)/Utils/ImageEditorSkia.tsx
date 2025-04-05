import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import CustomHeader from "@/components/CustomHeader";
import {
  Skia,
  Canvas,
  SkImage,
  Circle,
  Image,
} from "@shopify/react-native-skia";
import { useLocalSearchParams } from "expo-router";
import SkiaCanva from "@/components/SkiaCanva";
const ImageEditorSkia = () => {
  const params = useLocalSearchParams<{ imageUri: string }>();
  const imageUri = params.imageUri;
  const [image, setImage] = useState<SkImage | null>(null);
  const [canvaDimensions, setCanvaDimensions] = useState({
    width: 0,
    height: 0,
  });
  useEffect(() => {
    if (imageUri) {
      Skia.Data.fromURI(imageUri).then((data) => {
        const skImage = Skia.Image.MakeImageFromEncoded(data);
        console.log("Skia Image:", skImage);
        setImage(skImage);
      });
    }
    console.log("Image URI:", imageUri);
  }, [imageUri]);
  const handleCanvaLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setCanvaDimensions({ width, height });
  };
  return (
    <SafeAreaView className="flex-1">
      <CustomHeader
        title="Preprocessing"
        rightComponent={
          <TouchableOpacity className="" onPress={() => {}}>
            <Text className="font-S-Medium">Reset</Text>
          </TouchableOpacity>
        }
      />
      <View className="flex-1 bg-black" onLayout={handleCanvaLayout}>
        {image && (
          <SkiaCanva
            canvaImage={image}
            width={canvaDimensions.width}
            height={canvaDimensions.height}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ImageEditorSkia;
