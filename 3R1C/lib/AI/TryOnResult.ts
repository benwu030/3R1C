import * as FileSystem from "expo-file-system";
import { config, localConfig } from "../config";
export const fetchAllTryOnResults = async (): Promise<string[]> => {
    // fetch all pictures from the directory
    const result = await FileSystem.readDirectoryAsync(
      localConfig.localTryOnResultImagesDirectory
    );
    // console.log("TryOn Results:", result);
    if (result.length > 0) {
      const images = 
        result.map((image) => {
          return localConfig.localTryOnResultImagesDirectory + image;
        })
    //   console.log("Fetched images:", images);
      return images;
    }
    else {
          console.log("No images found");
          return [];
        }
    };