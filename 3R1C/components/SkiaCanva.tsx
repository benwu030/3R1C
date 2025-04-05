import { View, Text, Dimensions } from "react-native";
import React, { useEffect } from "react";
import { Canvas, Image, SkImage } from "@shopify/react-native-skia";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
interface SkiaCanvaProps {
  canvaImage: SkImage;
  width?: number;
  height?: number;
}
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const SkiaCanva = ({
  canvaImage,
  width = SCREEN_WIDTH,
  height = SCREEN_HEIGHT,
}: SkiaCanvaProps) => {
  //pan gesture
  const panGesture = Gesture.Pan();
  //pinch gesture
  const pinchGesture = Gesture.Pinch();
  // Combine gestures
  const combinedGestures = Gesture.Simultaneous(panGesture, pinchGesture);
  return (
    <View className="flex-1">
      <GestureDetector gesture={combinedGestures}>
        <Animated.View>
          <Canvas
            style={{
              flex: 1,
              width: width,
              height: height,
            }}
          >
            <Image
              image={canvaImage}
              width={width}
              height={height}
              fit="contain"
            />
          </Canvas>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default SkiaCanva;
