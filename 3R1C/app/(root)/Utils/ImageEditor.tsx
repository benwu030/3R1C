import React, { useState, useRef, useEffect } from "react";
import { View, Image, Dimensions, TouchableOpacity, Text } from "react-native";
import {
  GestureHandlerRootView,
  State,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withSpring,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "@/components/CustomHeader";
import ViewShot from "react-native-view-shot";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const ImageEditor = () => {
  const params = useLocalSearchParams<{ imageUri: string }>();
  const [imageUri, setimageUri] = useState(params.imageUri as string);
  // State to store image dimensions
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  // const context = useImageManipulator(imageUri);
  // Animation values
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const lastScale = useSharedValue(1);
  const lastTranslateX = useSharedValue(0);
  const lastTranslateY = useSharedValue(0);

  // Drawing state
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [isDrawing, setIsDrawing] = useState(false);
  // Cropping state
  const [isCropping, setIsCropping] = useState(false);
  // Refs
  const imageRef = useRef<Image>(null);
  const croppingBoxRef = useRef<Animated.View>(null);
  // Create pan gesture handler
  const panGesture = Gesture.Pan()
    .enabled(!isDrawing)
    .onStart(() => {
      lastTranslateX.value = translateX.value;
      lastTranslateY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = lastTranslateX.value + event.translationX;
      translateY.value = lastTranslateY.value + event.translationY;
    })
    .onEnd(() => {
      // Add spring animation for smooth end of pan
      translateX.value = withSpring(translateX.value);
      translateY.value = withSpring(translateY.value);
    });

  // Create pinch gesture handler
  const pinchGesture = Gesture.Pinch()
    .enabled(!isDrawing)
    .onStart(() => {
      lastScale.value = scale.value;
    })
    .onUpdate((event) => {
      scale.value = Math.max(0.5, Math.min(lastScale.value * event.scale, 3));
    })
    .onEnd(() => {
      // Add spring animation for smooth end of pinch
      scale.value = withSpring(scale.value);
    });

  // Combine gestures
  const combinedGestures = Gesture.Simultaneous(panGesture, pinchGesture);

  // Animated styles for the image container
  const croppingBoxAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  // Drawing handlers
  const startDrawing = (x: number, y: number) => {
    if (isDrawing) {
      setCurrentPath(`M${x},${y}`);
    }
  };

  const addToPath = (x: number, y: number) => {
    if (isDrawing && currentPath) {
      setCurrentPath((prev) => `${prev} L${x},${y}`);
    }
  };

  const endDrawing = () => {
    if (isDrawing && currentPath) {
      setPaths((prev) => [...prev, currentPath]);
      setCurrentPath("");
    }
  };

  const handleDrawingTouch = (event: any) => {
    if (!isDrawing) return;

    const { locationX, locationY } = event.nativeEvent;

    if (event.nativeEvent.state === State.BEGAN) {
      startDrawing(locationX, locationY);
    } else if (event.nativeEvent.state === State.ACTIVE) {
      addToPath(locationX, locationY);
    } else if (event.nativeEvent.state === State.END) {
      endDrawing();
    }
  };

  // Toggle drawing mode
  const toggleDrawingMode = () => {
    setIsDrawing(!isDrawing);
  };
  // Toggle cropping mode
  const toggleCroppingMode = () => {};
  // Reset all drawings
  const resetDrawings = () => {
    setPaths([]);
    setCurrentPath("");
    setimageUri(params.imageUri as string);
    scale.value = 1;
    translateX.value = 0;
    translateY.value = 0;
    lastScale.value = 1;
    lastTranslateX.value = 0;
    lastTranslateY.value = 0;
  };

  // Handle cancel navigation
  const handleCancel = () => {
    router.back();
  };

  // Handle save navigation
  const handleSave = async () => {
    const croppedImageUri = await cropImage();
    const svgImageUri = await captureSvg();
    // Save the cropped image
    router.back();
    router.setParams({
      modelImageUri: croppedImageUri,
      modelMaskUri: svgImageUri,
    });

    // You might want to implement a way to return the result
  };
  const viewShotRef = useRef<ViewShot>(null);
  const svgShotRef = useRef<ViewShot>(null);
  //
  // crop the image
  const cropImage = async () => {
    if (!viewShotRef.current) return null;

    try {
      if (viewShotRef.current.capture) {
        return await viewShotRef.current.capture();
      }
      return null;
    } catch (error) {
      console.error("Failed to capture preview:", error);
      return null;
    }
  };
  //capture the svg
  const captureSvg = async () => {
    if (!svgShotRef.current) return null;

    try {
      if (svgShotRef.current.capture) {
        return await svgShotRef.current.capture();
      }
      return null;
    } catch (error) {
      console.error("Failed to capture SVG:", error);
      return null;
    }
  };
  return (
    <SafeAreaView className="bg-sand-dark flex-1">
      <CustomHeader
        title="Preprocessing"
        rightComponent={
          <TouchableOpacity className="" onPress={resetDrawings}>
            <Text className="font-S-Medium">Reset</Text>
          </TouchableOpacity>
        }
      />
      <GestureHandlerRootView className="">
        <GestureDetector gesture={combinedGestures}>
          <View className="flex-1 overflow-hidden relative">
            {/* ViewShot for capturing the image */}
            <Animated.View
              ref={croppingBoxRef}
              className={` w-full h-full`}
              style={croppingBoxAnimatedStyle}
            >
              <ViewShot
                ref={viewShotRef}
                style={{
                  position: "absolute",

                  width: "100%",
                  height: "100%",
                }}
              >
                {/* Image to be captured */}
                <Image
                  source={{ uri: imageUri }}
                  className="absolute top-0 left-0 w-full h-full"
                  resizeMode="cover"
                />
              </ViewShot>

              {/* ViewShot for capturing the SVG */}
              <ViewShot ref={svgShotRef} style={{ flex: 1 }}>
                <Svg
                  className=" absolute w-full h-full bg-black"
                  onTouchStart={
                    isDrawing
                      ? (e) =>
                          handleDrawingTouch({
                            ...e,
                            nativeEvent: {
                              ...e.nativeEvent,
                              state: State.BEGAN,
                            },
                          })
                      : undefined
                  }
                  onTouchMove={
                    isDrawing
                      ? (e) =>
                          handleDrawingTouch({
                            ...e,
                            nativeEvent: {
                              ...e.nativeEvent,
                              state: State.ACTIVE,
                            },
                          })
                      : undefined
                  }
                  onTouchEnd={
                    isDrawing
                      ? (e) =>
                          handleDrawingTouch({
                            ...e,
                            nativeEvent: { ...e.nativeEvent, state: State.END },
                          })
                      : undefined
                  }
                >
                  {/* Render all paths */}
                  {paths.map((path, index) => (
                    <Path
                      key={index}
                      d={path}
                      stroke="rgba(250, 38, 38, 0.8)"
                      strokeWidth={10}
                      fill="transparent"
                    />
                  ))}
                  {/* Render the current path */}
                  {currentPath ? (
                    <Path
                      d={currentPath}
                      stroke="rgba(250, 38, 38, 0.8)"
                      strokeWidth={10}
                      fill="transparent"
                    />
                  ) : null}
                </Svg>
              </ViewShot>
            </Animated.View>
          </View>
        </GestureDetector>
        <View className="flex-row justify-around items-center py-4">
          <TouchableOpacity
            className={`py-2.5 px-4 rounded ${isDrawing ? "bg-[#ff4444]" : "bg-green-darker"} `}
            onPress={toggleDrawingMode}
          >
            <Text className="text-white font-S-Medium">
              {isDrawing ? "Exit" : "Draw"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="py-2.5 px-4 bg-green-darker rounded"
            onPress={handleSave}
          >
            <Text className="text-white font-S-Medium">Continue</Text>
          </TouchableOpacity>
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default ImageEditor;
