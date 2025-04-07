import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import CustomHeader from "@/components/CustomHeader";
import {
  Skia,
  Canvas,
  SkImage,
  Circle,
  Image,
} from "@shopify/react-native-skia";
import { router, useLocalSearchParams } from "expo-router";
import SkiaCanva, { SkiaCanvaRef } from "@/components/SkiaCanva";
import { useSharedValue } from "react-native-reanimated";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import { parse } from "@babel/core";

const ImageEditorSkia = () => {
  const params = useLocalSearchParams<{
    imageUri: string;
    imageWidth: string;
    imageHeight: string;
    outputWidth: string;
    outputHeight: string;
  }>();
  const outputAspectRatio =
    parseInt(params.outputWidth) / parseInt(params.outputHeight);
  const imageUri = params.imageUri;
  const [image, setImage] = useState<SkImage | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const toggleDrawingMode = () => {
    setIsDrawing((prev) => !prev);
  };
  useEffect(() => {
    if (imageUri) {
      Skia.Data.fromURI("file://" + imageUri).then((data) => {
        const skImage = Skia.Image.MakeImageFromEncoded(data);
        setImage(skImage);
      });
    }
    console.log("Image URI:", imageUri);
  }, [imageUri]);

  const skiaCanvaRef = useRef<SkiaCanvaRef>(null); // Ref for SkiaCanva

  const handleSave = async () => {
    console.log("Saving image...");
    if (skiaCanvaRef.current) {
      //reset the view
      // skiaCanvaRef.current.resetCanvaView();
      const snapshot = await skiaCanvaRef.current.captureSnapshot();
      if (snapshot) {
        console.log("Canvas Snapshot captured:", snapshot.getImageInfo());
        const base64Image = snapshot.encodeToBase64();
        const manipulatedImage = ImageManipulator.manipulate(
          `data:image/png;base64,${base64Image}`
        );
        manipulatedImage.resize({
          width: parseInt(params.outputWidth),
          height: parseInt(params.outputHeight),
        });
        const image = await manipulatedImage.renderAsync();
        const Result = await image.saveAsync({
          format: SaveFormat.PNG,
        });

        console.log("Manipulated Image URI:", Result);
        router.back();
        router.setParams({ modelMaskImageUri: Result.uri });
        // Process or save the snapshot as needed
      } else {
        console.log("No snapshot available");
      }
    }
  };
  const handleReset = () => {
    if (skiaCanvaRef.current) {
      skiaCanvaRef.current.resetEverything();
    }
  };
  return (
    <SafeAreaView className="flex-1">
      <CustomHeader
        title="Preprocessing"
        rightComponent={
          <TouchableOpacity className="" onPress={handleReset}>
            <Text className="font-S-Medium">Reset</Text>
          </TouchableOpacity>
        }
      />
      {image && (
        <SkiaCanva
          ref={skiaCanvaRef}
          canvaImage={image}
          imageWidth={parseInt(params.outputWidth)}
          imageHeight={parseInt(params.outputHeight)}
          isDrawing={isDrawing}
        />
      )}

      <View>
        <TouchableOpacity
          className={`py-2.5 px-4 rounded ${isDrawing ? "bg-[#ff4444]" : "bg-green-darker"} my-2`}
          onPress={toggleDrawingMode}
        >
          <Text className="text-white font-S-Medium">
            {isDrawing ? "Exit" : "Draw"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`py-2.5 px-4 rounded my-2 bg-green-darker `}
          onPress={handleSave}
        >
          <Text className="text-white font-S-Medium">Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ImageEditorSkia;
