import { ExecutionMethod, Functions, ID } from "react-native-appwrite";
import { CallAppWriteFunction } from "../AppWrite";
import * as FileSystem from 'expo-file-system';
import { config, localConfig } from "../config";
import { Account } from 'react-native-appwrite';
import { client,account } from '../AppWrite'; 
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

//idmvton input type
export interface IdmVtonInput {
  inputs:{
    garment_image: string;
    human_image: string;
    mask_image?: string;
    garment_description?: string;
    auto_mask?: boolean;
    auto_crop?: boolean;
    denoise_steps: number;
    seed: number;
    OpenPoseCategory: OpenPoseCategoryType;
  }
}

//yolo input type
export interface YoloInput {
  inputs: string;
  org_img: string;
}
//yolo output type
export interface YoloOutput{
  image: string;
  category:string;
  error?:string;
}
// Define the allowed values for OpenPoseCategory
export type OpenPoseCategoryType = "dress" | "upper_body" | "lower_body";

//Define the API config
// Define the API configuration
interface ApiConfig {
  endpoint: string;
  apiKey?: string;
  headers?: Record<string, string>;
}

// Generic uploader function
export const GenericUploader = async <TInput, TResponse>(
  apiConfig: ApiConfig,
  input: TInput
): Promise<TResponse | null> => {
  if (!apiConfig.endpoint) {
    console.error("API endpoint is not configured");
    return null;
  }

  try {

    // Prepare headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...apiConfig.headers,
    };

    if (apiConfig.apiKey) {
      headers["Authorization"] = `Bearer ${apiConfig.apiKey}`;
    }

    // Make the API request
    const response = await fetch(apiConfig.endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(input),
    });

    // Handle the response
    if (response.ok) {
      const responseData: TResponse = await response.json();
      return responseData;
    } else {
      console.error(`Server responded with status: ${response.status}`);
      // const errorText = await response.text();
      // console.error("Response text:", errorText);
      return null;
    }
  } catch (error) {
    console.error("Error during API request:", error);
    throw error;
  }
};
//helper functio to resize the image and convert to base64
const resizeImage = async (uri: string, width: number, height: number,format?:SaveFormat): Promise<string> => {
  const context = ImageManipulator.manipulate(uri);
        context.resize({ width, height});
        const image = await context.renderAsync();
        const resizedResult = await image.saveAsync({
          format: format??SaveFormat.JPEG,
          base64: true,
        });
        return resizedResult.base64??"";
};
// Allocate pipeline
export const IdmVtonImageUploader = async(garmentImageURL:string,modelImageURL:string,maskImageUri:string,garmentDescription:string="A white T-shirt",OpenPoseCategory:OpenPoseCategoryType = "upper_body"): Promise<string | null> =>{
    if (!garmentImageURL || !modelImageURL) {
        return null;
      }
      
      try {
        

        const garmentImage = await resizeImage(garmentImageURL, 768, 1024);

        const modelImage = await resizeImage(modelImageURL, 768, 1024);

        const modelMaskImage = maskImageUri ? await resizeImage(maskImageUri, 768, 1024,SaveFormat.PNG) : "";
        // Prepare the input payload
    const payload: IdmVtonInput = {
      inputs: {
      garment_image: garmentImage,
      human_image: modelImage,
      garment_description: garmentDescription,
      OpenPoseCategory,
      mask_image: modelMaskImage,
      auto_mask: !modelMaskImage,
      auto_crop: !modelMaskImage,
      denoise_steps: 15,
      seed: 24,
      }
    };
        // Send the payload to your function
        
    const response = await GenericUploader<IdmVtonInput, { output: string }>(
      {
        endpoint: config.tryonEndpoint || '',
        apiKey: config.huggingFaceApiKey || '',
      },
      payload
    );
        // Handle the successful response
        if (response?.output) {
    
          // Save the base64 image to a file
          const fileUri = FileSystem.documentDirectory+localConfig.localTryOnResultImagesDirectory + `IdmVtonResult-${ID.unique()}.png`;
          await FileSystem.writeAsStringAsync(fileUri, response.output, {
            encoding: FileSystem.EncodingType.Base64,
          });
    
          return fileUri;
        } else {
          console.error("No output image found in response");
          return null;
        }
      } catch (error) {
        console.error("Error in TryOnImageUploader:", error);
        return null;
      }
}
// Allocate pipeline
export const RemoveBackgroundImageUploader= async(garmentImageURL:string):Promise<YoloOutput> =>{
    if(garmentImageURL==='') return {image: "", category: "", error: "gartment image not found"};
    try {
        const garmentImage = await resizeImage(garmentImageURL, 768, 1024);
        const payload = {
          inputs:"",
          org_img: garmentImage,
         }

        // Send the payload to your function
        const response = await GenericUploader<YoloInput,YoloOutput>(
          {
            endpoint: config.yoloEndpoint || '',
            apiKey: config.huggingFaceApiKey || '',
          },
          payload
        );
        if(response?.image){
          // Save the base64 image to a file
            const fileUri = FileSystem.cacheDirectory + `RemoveBackground-${ID.unique()}.png`;
            await FileSystem.writeAsStringAsync(fileUri, response.image, {
            encoding: FileSystem.EncodingType.Base64,
            });
            
            
            if(response.category){
                const category = response.category
                .replace(/_/g, " ")
                .replace(/\b\w/g, char => char.toUpperCase())
                .replace(/\bShirt\b/i, "Top")
                .replace(/\bSleeved\b/i, "Sleeve")
                .trim();
              return {image:fileUri,category:category};

            }
            return {image:fileUri,category:""}; // Return empty category if not found
        }
        if(response?.error){
          console.error("Error in YOLO response:", response.error);
          return {image: "", category: "", error: response.error ?? "failed"};
        }
        
        // Prepare the input payload
      } catch (error) {
        console.error("Error in RemoveBackgroundImageUploader:", error);
        return { image: "", category: "", error: "An unexpected error occurred" };
      }

      // Default return in case no response or error occurs
      return { image: "", category: "", error: "Unknown error" };
}