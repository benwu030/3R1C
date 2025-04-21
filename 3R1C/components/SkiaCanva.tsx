import { View, Text, Dimensions } from "react-native";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Skia,
  Canvas,
  Image,
  Matrix4,
  SkImage,
  Path,
  Group,
  SkPath,
  useCanvasRef,
  PaintStyle,
  StrokeCap,
  StrokeJoin,
} from "@shopify/react-native-skia";
import { useSharedValue } from "react-native-reanimated";
import { SkiaGestureHandler } from "./SkiaGestureHandler";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
interface SkiaCanvaProps {
  canvaImage: SkImage;
  width?: number;
  height?: number;
  imageWidth?: number;
  imageHeight?: number;
  isDrawing?: boolean;
}
export interface SkiaCanvaRef {
  captureSnapshot: () => Promise<SkImage | null>; // Method to capture the snapshot
  resetCanvaView: () => void; // Method to reset the canvas view
  resetEverything: () => void; // Method to reset everything
  capturePathsOnly: () => Promise<SkImage | null>; // Method to capture paths only
}
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const SkiaCanva = forwardRef<SkiaCanvaRef, SkiaCanvaProps>(
  (
    {
      canvaImage,
      width = SCREEN_WIDTH,
      height = SCREEN_HEIGHT,
      imageWidth = SCREEN_WIDTH,
      imageHeight = SCREEN_HEIGHT,
      isDrawing = false,
    },
    ref
  ) => {
    const modelImageMatrix = useSharedValue(Matrix4());
    const [path, setPath] = useState(() => Skia.Path.Make());
    const canvasRef = useCanvasRef(); // Create a ref for the Canvas

    const handlePathUpdate = (updateFn: (currentPath: SkPath) => void) => {
      setPath((prevPath) => {
        const newPath = Skia.Path.Make();
        newPath.addPath(prevPath);
        updateFn(newPath);
        return newPath;
      });
    };
    // Expose the captureSnapshot method via the ref
    // useImperativeHandle(ref, () => ({
    //   captureSnapshot: async () => {
    //     modelImageMatrix.value = Matrix4();
    //     await new Promise((resolve) => setTimeout(resolve, 200));

    //     if (canvasRef.current) {
    //       return canvasRef.current.makeImageSnapshot();
    //     }
    //     return null;
    //   },
    //   resetCanvaView: () => {
    //     modelImageMatrix.value = Matrix4();
    //   },
    //   resetEverything: () => {
    //     modelImageMatrix.value = Matrix4();
    //     setPath(Skia.Path.Make());
    //   },
    // }));
    const aspectRatio = imageWidth / imageHeight;

    useImperativeHandle(ref, () => ({
      captureSnapshot: async () => {
        modelImageMatrix.value = Matrix4();
        await new Promise((resolve) => setTimeout(resolve, 200));

        if (canvasRef.current) {
          return canvasRef.current.makeImageSnapshot();
        }
        return null;
      },
      capturePathsOnly: async () => {
        modelImageMatrix.value = Matrix4();
        await new Promise((resolve) => setTimeout(resolve, 200));
        // Create a new Skia Canvas for paths only
        const surface = Skia.Surface.Make(width, width / aspectRatio);
        const canvas = surface?.getCanvas();

        if (canvas) {
          // Clear the canvas
          canvas.clear(Skia.Color("#000000"));

          // Draw the path
          const paint = Skia.Paint();
          paint.setColor(Skia.Color("#ffffff"));
          paint.setStyle(PaintStyle.Stroke);
          paint.setStrokeWidth(10);
          paint.setStrokeCap(StrokeCap.Round);
          paint.setStrokeJoin(StrokeJoin.Round);

          canvas.drawPath(path, paint);

          // Capture the snapshot
          if (surface) {
            const snapshot = surface.makeImageSnapshot();
            return snapshot;
          }
          return null;
        }

        return null;
      },
      resetCanvaView: () => {
        modelImageMatrix.value = Matrix4();
      },
      resetEverything: () => {
        modelImageMatrix.value = Matrix4();
        setPath(Skia.Path.Make());
      },
    }));

    return (
      <View className="bg-black">
        <Canvas
          style={{
            width: width,
            height: width / aspectRatio,
          }}
          ref={canvasRef}
        >
          <Group matrix={modelImageMatrix}>
            <Image
              image={canvaImage}
              width={width}
              height={width / aspectRatio}
              fit="contain"
            />
            <Path
              path={path}
              color="#000000"
              style="stroke"
              strokeWidth={10}
              strokeCap="round"
              strokeJoin="round"
            />
          </Group>
        </Canvas>
        <SkiaGestureHandler
          enabledGestures={["pan", "pinch", "draw"]}
          matrix={modelImageMatrix}
          dimensions={{
            x: 0,
            y: 0,
            width: width,
            height: width / aspectRatio,
          }}
          label="Model Image"
          isActive={true}
          onPathUpdate={handlePathUpdate}
          isDrawing={isDrawing}
        />
      </View>
    );
  }
);

export default SkiaCanva;
