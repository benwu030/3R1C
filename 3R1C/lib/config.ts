import * as FileSystem from 'expo-file-system';
export const config = {
    platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM,
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOIINT,
    projectid: process.env.EXPO_PUBLIC_APPWRITE_ID,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    clothesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_CLOTHES_COLLECTION_ID,
    clothesImgStorageId: process.env.EXPO_PUBLIC_APPWRITE_CLOTHES_STORAGE_ID,
    
}

export const localConfig = {
    localClotheJsonUri :`${FileSystem.documentDirectory}clotheData/clothe.json`,
    localClotheDirectory :`${FileSystem.documentDirectory}clotheData/`,
    localClotheImagesDirectiry :`${FileSystem.documentDirectory}clotheData/Images/`,
    localOutfitDirectory :`${FileSystem.documentDirectory}outfitData/`,
    localOutfitJsonUri: `${FileSystem.documentDirectory}outfitData/outfit.json`,
    localOutfitCollectionsJsonUri: `${FileSystem.documentDirectory}outfitData/outfitCollection.json`,

}