//modified from https://github.com/wcandillon/can-it-be-done-in-react-native/blob/master/bonuses/sticker-app/src/GestureHandler.tsx
import type { SkPath, SkRect } from "@shopify/react-native-skia";
import {
  Matrix4,
  multiply4,
  rotateZ,
  scale,
  translate,
  convertToColumnMajor,
  convertToAffineMatrix,
  matrixVecMul4,
  // Removed 'invert' as it is not exported
} from "@shopify/react-native-skia";
import React from "react";
import { Platform } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureType,
} from "react-native-gesture-handler";
import type { SharedValue } from "react-native-reanimated";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

interface GestureHandlerProps {
  matrix: SharedValue<Matrix4>;
  dimensions: SkRect;
  debug?: boolean;
  label: string;
  enabledGestures: Array<"pan" | "rotate" | "pinch" | "draw">;
  isActive: boolean;
  isDrawing?: boolean;
  onPathUpdate?: (updateFn: (currentPath: SkPath) => void) => void; // New prop
}

export const SkiaGestureHandler = ({
  matrix,
  dimensions,
  debug,
  label,
  enabledGestures,
  isActive,
  isDrawing = false,
  onPathUpdate,
}: GestureHandlerProps) => {
  const { x, y, width, height } = dimensions;
  const origin = useSharedValue({ x: 0, y: 0 });
  const offset = useSharedValue(Matrix4());

  const pan = Gesture.Pan()
    .enabled(!isDrawing)
    .onChange((e) => {
      matrix.value = multiply4(translate(e.changeX, e.changeY), matrix.value);
    });

  const rotate = Gesture.Rotation()
    .enabled(!isDrawing)
    .onBegin((e) => {
      origin.value = { x: e.anchorX, y: e.anchorY };
      offset.value = matrix.value;
    })
    .onChange((e) => {
      matrix.value = multiply4(offset.value, rotateZ(e.rotation, origin.value));
    });

  const pinch = Gesture.Pinch()
    .enabled(!isDrawing)
    .onBegin((e) => {
      origin.value = { x: e.focalX, y: e.focalY };
      offset.value = matrix.value;
    })
    .onChange((e) => {
      matrix.value = multiply4(
        offset.value,
        scale(e.scale, e.scale, 1, origin.value)
      );
    });

  const draw = Gesture.Pan()
    .enabled(isDrawing)
    .onBegin((e) => {
      // Reverse the transformation to get the original coordinates
      const canvasX = (e.x - matrix.value[3]) / matrix.value[0];
      const canvasY = (e.y - matrix.value[7]) / matrix.value[5];

     

      if (onPathUpdate) {
        onPathUpdate((currentPath) => {
          currentPath.moveTo(canvasX, canvasY);
        });
      }
    })
    .onUpdate((e) => {
      // Reverse the transformation to get the original coordinates
      const canvasX = (e.x - matrix.value[3]) / matrix.value[0];
      const canvasY = (e.y - matrix.value[7]) / matrix.value[5];

      

      if (onPathUpdate) {
        onPathUpdate((currentPath) => {
          currentPath.lineTo(canvasX, canvasY);
        });
      }
    })
    .runOnJS(true);

  const style = useAnimatedStyle(() => {
    const m4 = convertToColumnMajor(matrix.value);
    return {
      position: "absolute",
      left: x,
      top: y,
      width,
      height,
      backgroundColor: debug ? "rgba(100, 200, 300, 0.4)" : "transparent",
      transform: [
        { translateX: -width / 2 },
        { translateY: -height / 2 },
        {
          matrix:
            Platform.OS === "web"
              ? convertToAffineMatrix(m4)
              : (m4 as unknown as number[]),
        },
        { translateX: width / 2 },
        { translateY: height / 2 },
      ],
    };
  });

  const gesture = Gesture.Simultaneous(
    ...enabledGestures.map((g) => {
      switch (g) {
        case "pan":
          return pan;
        case "rotate":
          return rotate;
        case "pinch":
          return pinch;
        case "draw":
          return draw;
        default:
          return Gesture.Race();
      }
    })
  );

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={style}
        accessible={true}
        accessibilityLabel={label}
      />
    </GestureDetector>
  );
};
