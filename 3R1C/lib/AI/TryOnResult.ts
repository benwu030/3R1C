import * as FileSystem from "expo-file-system";
import { config, localConfig } from "../config";
export const fetchAllTryOnResults = async (): Promise<string[]> => {
    // fetch all pictures from the directory
    const result = await FileSystem.readDirectoryAsync(
      FileSystem.documentDirectory+localConfig.localTryOnResultImagesDirectory
    );
    if (result.length > 0) {
      const images = 
        result.map((image) => {
          return localConfig.localTryOnResultImagesDirectory + image;
        })
    
    return images.slice(-5);
    }
    else {
          console.error("No images found");
          return [];
        }
    };