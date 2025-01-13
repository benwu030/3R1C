import { Stack } from "expo-router";
import "./global.css";
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";
import { cssInterop } from "nativewind";
import { Image } from "expo-image";
cssInterop(Image, { className: "style" });
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontLoaded, error] = useFonts({
    'Signifier-Bold': require('../assets/fonts/Signifier-Bold.otf'),
    'Signifier-BoldItalic': require('../assets/fonts/Signifier-BoldItalic.otf'),
    'Signifier-ExtraLight': require('../assets/fonts/Signifier-Extralight.otf'),
    'Signifier-ExtraLightItalic': require('../assets/fonts/Signifier-ExtralightItalic.otf'),
    'Signifier-Light': require('../assets/fonts/Signifier-Light.otf'),
    'Signifier-LightItalic': require('../assets/fonts/Signifier-LightItalic.otf'),
    'Signifier-Medium': require('../assets/fonts/Signifier-Medium.otf'),
    'Signifier-MediumItalic': require('../assets/fonts/Signifier-MediumItalic.otf'),
    'Signifier-Regular': require('../assets/fonts/Signifier-Regular.otf'),
    'Signifier-RegularItalic': require('../assets/fonts/Signifier-RegularItalic.otf'),
    'Signifier-Thin': require('../assets/fonts/Signifier-Thin.otf'),
    'Signifier-ThinItalic': require('../assets/fonts/Signifier-ThinItalic.otf'),

  });

  useEffect(() => {
    if (fontLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontLoaded]);

  if (!fontLoaded) {
    return null;
  }
  return <Stack />;
}
