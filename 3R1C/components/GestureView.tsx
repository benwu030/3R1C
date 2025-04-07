import {
  Matrix4,
  multiply4,
  rotateZ,
  scale,
  translate,
  convertToColumnMajor,
  convertToAffineMatrix,
} from "@shopify/react-native-skia";
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Dimensions, Platform } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import type { SharedValue } from "react-native-reanimated";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { View } from "react-native";
interface GestureHandlerProps {
  debug?: boolean;
  enabledGestures: Array<"pan" | "rotate" | "pinch" | "draw">;
  isActive: boolean;
}
const { width, height } = Dimensions.get("window");
export const GestureView = ({
  debug,
  enabledGestures,
  isActive,
  children,
}: PropsWithChildren<GestureHandlerProps>) => {
  const matrix = useSharedValue(Matrix4());
  const origin = useSharedValue({ x: 0, y: 0 });
  const offset = useSharedValue(Matrix4());
  const [viewOffset, setViewOffset] = useState({ x: 0, y: 0, width, height });

  const pan = Gesture.Pan()
    .enabled(isActive)
    .onChange((e) => {
      matrix.value = multiply4(translate(e.changeX, e.changeY), matrix.value);
    });

  const rotate = Gesture.Rotation()
    .enabled(isActive)
    .onBegin((e) => {
      origin.value = {
        x: e.anchorX - viewOffset.x,
        y: e.anchorY - viewOffset.y,
      };
      offset.value = matrix.value;
    })
    .onChange((e) => {
      matrix.value = multiply4(offset.value, rotateZ(e.rotation));
    });

  const pinch = Gesture.Pinch()
    .enabled(isActive)
    .onBegin((e) => {
      origin.value = { x: e.focalX - viewOffset.x, y: e.focalY - viewOffset.y };
      offset.value = matrix.value;
    })
    .onChange((e) => {
      matrix.value = multiply4(
        offset.value,
        scale(e.scale, e.scale, 1, origin.value)
      );
    });

  const style = useAnimatedStyle(() => {
    const m4 = convertToColumnMajor(matrix.value);
    return {
      backgroundColor: debug ? "rgba(100, 200, 300, 0.4)" : "transparent",
      transform: [
        {
          matrix:
            Platform.OS === "web"
              ? convertToAffineMatrix(m4)
              : (m4 as unknown as number[]),
        },
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
        default:
          return Gesture.Race();
      }
    })
  );

  return (
    <View
      className="overflow-hidden"
      onLayout={(event) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        setViewOffset({ x, y, width, height });
      }}
    >
      <GestureDetector gesture={gesture}>
        <Animated.View style={style}>{children}</Animated.View>
      </GestureDetector>
    </View>
  );
};
