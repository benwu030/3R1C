import {
  View,
  Text,
  Button,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Image } from "expo-image";

const Result = ({ isLoading, generatedImageUri, onGenerate }: any) => {
  return (
    <SafeAreaView>
      <View className="mt-5">
        <Text className="font-S-Regular text-gray-700">Result</Text>
        {isLoading ? (
          <View className="flex-col items-center justify-center bg-white-dark aspect-[3/4] rounded-lg">
            <ActivityIndicator
              className="text-beige-darker mt-[16rem]"
              size="large"
            />
            <Text className="font-S-Regular text-gray-700 mt-2">
              Generating Try-On Image...
            </Text>
          </View>
        ) : generatedImageUri ? (
          <Image
            source={generatedImageUri}
            className=" aspect-[3/4] rounded-lg"
            contentFit="contain"
          />
        ) : (
          <View className="flex-col items-center justify-center bg-white-dark aspect-[3/4] rounded-lg">
            <Text className="font-S-Regular text-gray-700">
              Upload image to see result
            </Text>
            <Button title="Generate" onPress={onGenerate}></Button>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Result;
