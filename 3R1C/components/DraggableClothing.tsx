import React from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Dimensions, StyleSheet } from "react-native";

import { Image } from "expo-image";
import { cssInterop } from "nativewind";
cssInterop(Image, { className: "style" });
interface Position {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

interface DraggableClothingProps {
  imageUri: string;
  initialPosition?: Position;
}

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

const { width, height } = Dimensions.get("screen");
console.log(width, height);
const DraggableClothing = ({
  imageUri,
  initialPosition,
}: DraggableClothingProps) => {
  const translationX = useSharedValue(initialPosition?.x ?? width / 2);
  const translationY = useSharedValue(initialPosition?.y ?? height / 2);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);
  const scale = useSharedValue(initialPosition?.scale ?? 1);
  const startScale = useSharedValue(0);
  const rotationAngle = useSharedValue(initialPosition?.rotation ?? 0);
  const startAngle = useSharedValue(0);
  const selected = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value },
      { translateY: translationY.value },
      { scale: scale.value },
      { rotate: `${rotationAngle.value}rad` },
    ],
    borderWidth: selected.value,
  }));

  const rotation = Gesture.Rotation()
    .onStart(() => {
      startAngle.value = rotationAngle.value;
    })
    .onUpdate((event) => {
      rotationAngle.value = startAngle.value + event.rotation;
      selected.value = 1;
    })
    .onEnd(() => {
      selected.value = 0;
    });

  const pinch = Gesture.Pinch()
    .onStart(() => {
      startScale.value = scale.value;
    })
    .onUpdate((event) => {
      scale.value = clamp(
        startScale.value * event.scale,
        0.5,
        Math.min(width / 100, height / 100)
      );
      selected.value = 1;
    })
    .onEnd(() => {
      selected.value = 0;
    })
    .runOnJS(true);

  const pan = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
    })
    .onUpdate((event) => {
      const maxTranslateX = width;
      const maxTranslateY = height;

      translationX.value = clamp(
        prevTranslationX.value + event.translationX,
        0,
        maxTranslateX
      );
      translationY.value = clamp(
        prevTranslationY.value + event.translationY,
        0,
        maxTranslateY
      );
      selected.value = 1;
    })
    .onEnd(() => {
      selected.value = 0;
    })
    .runOnJS(true);
  const composed = Gesture.Simultaneous(pan, pinch, rotation);
  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[animatedStyles, styles.box]}>
        <Image source={imageUri} className="w-full h-full" />
      </Animated.View>
    </GestureDetector>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: 200,
    height: 200,
    borderColor: "black",
    padding: 10,
  },
});
export default DraggableClothing;
