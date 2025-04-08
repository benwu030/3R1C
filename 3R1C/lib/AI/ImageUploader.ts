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
    console.log("Starting API request...");

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
      console.log("Received successful response from API");
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
        console.log("Invalid image URLs");
        return null;
      }
      
      try {
        console.log('Starting try-on process...');
        // Log debugging information for image dimensions
        const garmentImageInfo = await FileSystem.getInfoAsync(garmentImageURL);
        const modelImageInfo = await FileSystem.getInfoAsync(modelImageURL);
        const maskImageInfo = maskImageUri ? await FileSystem.getInfoAsync(maskImageUri) : null;
        
        console.log("Garment Image Info:", garmentImageInfo);
        console.log("Model Image Info:", modelImageInfo);
        if (maskImageInfo) {
          console.log("Mask Image Info:", maskImageInfo);
        } else {
          console.log("No mask image provided.");
        }

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
        console.log('Sending payload to function...');
        
    const response = await GenericUploader<IdmVtonInput, { output: string }>(
      {
        endpoint: config.tryonEndpoint || '',
        apiKey: config.huggingFaceApiKey || '',
      },
      payload
    );
        // Handle the successful response
        if (response?.output) {
          console.log("Received output image from IDM-VTON");
    
          // Save the base64 image to a file
          const fileUri = localConfig.localTryOnResultImagesDirectory + `IdmVtonResult-${ID.unique()}.png`;
          await FileSystem.writeAsStringAsync(fileUri, response.output, {
            encoding: FileSystem.EncodingType.Base64,
          });
    
          console.log("Try-on result saved to:", fileUri);
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
export const RemoveBackgroundImageUploader = async(garmentImageURL:string)=>{
    if(garmentImageURL==='') return;
    try {
        // const response = await FileSystem.uploadAsync(`https://huggingface.co/briaai/RMBG-1.4/remove_background`, imageURL, {
        //   fieldName: 'file',
        //   httpMethod: 'POST',
        //   uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        // });
        // console.log(JSON.stringify(response, null, 4));
       
        // console.log(result.data);
        // const response = await CallAppWriteFunction(
        //   '67e8283b00122a08e389', 
        //   payload, 
        //   false, 
        //   '/tryon', 
        //   ExecutionMethod.POST
        // );

        // First get the JWT token for the current user
        // const jwt = await account.createJWT();
        //   console.log('JWT:', jwt);
        // Now make the fetch request with the JWT
        // const response = await fetch('http://192.168.68.106:3000/tryon/idmVTON', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: payload,
        // });
      } catch (error) {
        console.log(error);
      }
}