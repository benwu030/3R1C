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
}

export const localConfig = {
    localClotheJsonUri :`${FileSystem.documentDirectory}clotheData/clothe.json`,
    localClotheDirectory :`${FileSystem.documentDirectory}clotheData/`,
    localClotheImagesDirectiry :`${FileSystem.documentDirectory}clotheData/Images/`,
    //outfit
    localOutfitDirectory :`${FileSystem.documentDirectory}outfitData/`,
    localOutfitJsonUri: `${FileSystem.documentDirectory}outfitData/outfit.json`,
    localOutfitPreviewsDirectiry :`${FileSystem.documentDirectory}outfitData/OutfitPreviews/`,
    //outfit collection
    localOutfitCollectionsJsonUri: `${FileSystem.documentDirectory}outfitData/outfitCollection.json`,
    localOutfitCollectionPreviewsDirectiry :`${FileSystem.documentDirectory}outfitData/OutfitCollectionPreviews/`,

    //outfti collection relationship
    localOutfitCollectionRelationshipJsonUri: `${FileSystem.documentDirectory}outfitData/outfitCollectionRelationship.json`,
}