import React, { useEffect, useCallback, useMemo } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  clamp,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { cssInterop } from "nativewind";
import icons from "@/constants/icons";
import { OutfitItem } from "@/constants/outfit";

cssInterop(Image, { className: "style" });

type Position = OutfitItem["position"];

interface DraggableClothingProps {
  imageUri: string;
  instanceId: string;
  initialPosition?: Position;
  onPositionChange?: (position: Position) => void;
  onRemoveItem?: () => void;
  boardDimensions: { width: number; height: number };
}
const ITEM_SIZE = { width: 150, height: 150 };
const DraggableClothing = ({
  imageUri,
  instanceId,
  initialPosition,
  onPositionChange,
  onRemoveItem,
  boardDimensions,
}: DraggableClothingProps) => {
  const prevPos = useSharedValue(
    initialPosition ?? {
      x: boardDimensions.width / 2,
      y: boardDimensions.height / 2,
      z: 0,
      scale: 1,
      rotation: 0,
    }
  );
  const isSelected = useSharedValue(false);
  const isEditing = useSharedValue(false);
  const currentPos = useSharedValue(prevPos.value);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: currentPos.value.x },
        { translateY: currentPos.value.y },
        { scale: currentPos.value.scale },
        { rotate: `${currentPos.value.rotation}rad` },
      ],
      zIndex: currentPos.value.z,
      elevation: currentPos.value.z,
      borderColor: "black",
      borderWidth: isSelected.value ? 1 : 0,
    };
  });

  const pan = React.useMemo(() => {
    return Gesture.Pan()
      .onStart(() => {
        isSelected.value = true;
        isEditing.value = false;
      })
      .onUpdate((e) => {
        currentPos.value = {
          ...currentPos.value,
          x: clamp(
            e.translationX + prevPos.value.x,
            0,
            boardDimensions.width - ITEM_SIZE.width
          ),
          y: clamp(
            e.translationY + prevPos.value.y,
            0,
            boardDimensions.height - ITEM_SIZE.height
          ),
        };
      })
      .onEnd(() => {
        isSelected.value = false;
        prevPos.value = currentPos.value;
        if (onPositionChange) {
          runOnJS(onPositionChange)(currentPos.value);
        }
      });
  }, [currentPos, prevPos, boardDimensions]);

  const rotate = React.useMemo(() => {
    return Gesture.Rotation()
      .onBegin(() => {
        isEditing.value = false;
        isSelected.value = true;
      })
      .onUpdate((e) => {
        currentPos.value = {
          ...currentPos.value,
          rotation: prevPos.value.rotation + e.rotation,
        };
      })
      .onStart(() => {
        isSelected.value = false;
        prevPos.value = currentPos.value;
        if (onPositionChange) {
          runOnJS(onPositionChange)(currentPos.value);
        }
      });
  }, [currentPos, prevPos]);

  const pinch = React.useMemo(() => {
    return Gesture.Pinch()
      .onBegin(() => {
        isSelected.value = true;
        isEditing.value = false;
      })
      .onUpdate((e) => {
        currentPos.value = {
          ...currentPos.value,
          scale: prevPos.value.scale * e.scale,
        };
      })
      .onEnd(() => {
        isSelected.value = false;
        prevPos.value = currentPos.value;
        if (onPositionChange) {
          runOnJS(onPositionChange)(currentPos.value);
        }
      });
  }, [currentPos, prevPos]);

  const tap = React.useMemo(() => {
    return Gesture.LongPress()
      .minDuration(200)
      .onEnd((e, success) => {
        if (success) {
          isEditing.value = !isEditing.value;
          isSelected.value = !isSelected.value;
        }
      });
  }, []);
  const moveGestures = Gesture.Simultaneous(pan, rotate, pinch);
  const gestures = Gesture.Exclusive(tap, moveGestures);
  const toggleRemoveButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: isEditing.value ? 1 : 0,
      zIndex: currentPos.value.z + 1,
    };
  });
  const handleZChange = useCallback(
    (delta: number) => {
      const newZ = Math.max(0, currentPos.value.z + delta);
      currentPos.value = {
        ...currentPos.value,
        z: newZ,
      };
      prevPos.value = currentPos.value;
      onPositionChange?.(currentPos.value);
    },
    [currentPos, prevPos, onPositionChange]
  );
  return (
    <GestureDetector gesture={gestures}>
      <Animated.View style={[animatedStyles, styles.item]}>
        <Animated.View style={[toggleRemoveButtonStyle]}>
          {/* Remove button */}
          <View className="flex-row-reverse absolute -top-4 -right-4 gap-2 ">
            <TouchableOpacity onPress={onRemoveItem}>
              <View className="bg-grey rounded-full p-1.5 shadow-sm">
                <Image source={icons.plus} className="size-4 rotate-45" />
              </View>
            </TouchableOpacity>
            {/* Z-index change buttons */}
            <TouchableOpacity onPress={() => handleZChange(1)}>
              <View className="bg-grey rounded-full p-1.5 shadow-sm">
                <Image source={icons.plus} className="size-4" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleZChange(-1)}>
              <View className="bg-grey rounded-full p-1.5 shadow-sm">
                <Image source={icons.minus} className="size-4" />
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Image
          source={{ uri: imageUri }}
          className="w-full h-full"
          contentFit="contain"
        />
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  item: {
    position: "absolute",
    width: ITEM_SIZE.width,
    height: ITEM_SIZE.height,
    padding: 5,
  },
});

export default DraggableClothing;
