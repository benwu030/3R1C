import * as FileSystem from 'expo-file-system';
export const config = {
    platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM,
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOIINT,
    projectid: process.env.EXPO_PUBLIC_APPWRITE_ID,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    clothesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_CLOTHES_COLLECTION_ID,
    clothesImgStorageId: process.env.EXPO_PUBLIC_APPWRITE_CLOTHES_STORAGE_ID,
    outfitCollectionId: process.env.EXPO_PUBLIC_APPWRITE_OUTFIT_COLLECTION_ID,
    outfitCollectionImgStorageId: process.env.EXPO_PUBLIC_APPWRITE_OUTFIT_STORAGE_ID,
    outfitCollection_CollectionId: process.env.EXPO_PUBLIC_APPWRITE_OUTFITCOLLECTION_COLLECTION_ID,
    outftiCollectionRelationshipId: process.env.EXPO_PUBLIC_APPWRITE_OUTFITCOLLECTION_RELATIONSHIP_COLLECTION_ID,
    previewStorageId: process.env.EXPO_PUBLIC_APPWRITE_PREVIEW_STORAGE_ID,
    huggingFaceApiKey: process.env.EXPO_PUBLIC_HUGGINGFACE_API_KEY,
    tryonEndpoint: process.env.EXPO_PUBLIC_IDMVTON_ENDPOINT,
    yoloEndpoint: process.env.EXPO_PUBLIC_YOLO_ENDPOINT,
}

export const localConfig = {
    localClotheJsonUri :`clotheData/clothe.json`,
    localClotheDirectory :`clotheData/`,
    localClotheImagesDirectiry :`clotheData/Images/`,
    //outfit
    localOutfitDirectory :`outfitData/`,
    localOutfitJsonUri: `outfitData/outfit.json`,
    localOutfitPreviewsDirectiry :`outfitData/OutfitPreviews/`,
    //outfit collection
    localOutfitCollectionsJsonUri: `outfitData/outfitCollection.json`,
    localOutfitCollectionPreviewsDirectiry :`outfitData/OutfitCollectionPreviews/`,

    //outfti collection relationship
    localOutfitCollectionRelationshipJsonUri: `outfitData/outfitCollectionRelationship.json`,
    //TryOn Directory
    localTryOnDirectory :`tryonData/`,
    localTryOnBodyImagesDirectory :`tryonData/BodyImages/`,
    localTryOnResultImagesDirectory :`tryonData/ResultImages/`,
}