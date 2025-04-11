
import * as FileSystem from 'expo-file-system';
import {localConfig} from './config'
import { Outfit, OutfitCollection } from '../constants/outfit';

export const ensureDirectories = async () => {
    const dirs = [
        localConfig.localClotheDirectory,
        localConfig.localClotheImagesDirectiry,
        localConfig.localOutfitDirectory,
        localConfig.localOutfitPreviewsDirectiry,
        localConfig.localOutfitCollectionPreviewsDirectiry,
        localConfig.localTryOnDirectory,
        localConfig.localTryOnBodyImagesDirectory,
        localConfig.localTryOnResultImagesDirectory,
    ];

    for (const dir of dirs) {
        const localDir = FileSystem.documentDirectory + dir;
        const dirInfo = await FileSystem.getInfoAsync(localDir);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(localDir, { intermediates: true });
        }
    }
};
export const ensureFiles = async () => {
    const files = [
        //clothes
        localConfig.localClotheJsonUri,

        //outfit
        localConfig.localOutfitJsonUri,
        localConfig.localOutfitCollectionsJsonUri,
        localConfig.localOutfitCollectionRelationshipJsonUri,
        //outfit relation
        localConfig.localOutfitCollectionRelationshipJsonUri
    ];

    for (const file of files) {
        const localFile = file;
        const fileInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + localFile);
        if (!fileInfo.exists) {
            await writeLocalData(localFile, []);
        }
    }
};
//read relative path
export const readLocalData = async <T>(path: string): Promise<T[]> => {
    try {
        const content = await FileSystem.readAsStringAsync(FileSystem.documentDirectory+path);
        //may add error handling here
        return JSON.parse(content);
    } catch (err){
        console.error('Error reading local data:', err);
        return [];
    }
};
//write relative path
export const writeLocalData = async <T>(path: string, data: T[]) => {
    try {
        await FileSystem.writeAsStringAsync(FileSystem.documentDirectory+path, JSON.stringify(data));
    } catch (err) {
        console.error('Error writing local data:', err);
        throw err;
    }
};
export const writeLocalDataWithDuplicateCheck = async <T extends { $id?:string|null }>(path: string, newItems: T | T[]) => {
    try {
        const existingData = await readLocalData<T>(path);
        const itemsToAdd = Array.isArray(newItems) ? newItems : [newItems];
        
        // Filter out items that already exist in the data
        const nonDuplicates = itemsToAdd.filter(newItem => 
            !existingData.some(item => item.$id === newItem.$id)
        );
        
        if (nonDuplicates.length > 0) {
            // Only add non-duplicate items
            await writeLocalData(path, [...existingData, ...nonDuplicates]);
            return nonDuplicates; // Return items that were added
        } else {
            return []; // No items added
        }
    } catch (err) {
        console.error('Error writing data with duplicate check:', err);
        throw err;
    }
};
export const saveImageLocally = async (path:string,imageUri: string, id: string,prefix:string='') => {
    const fileExtension = imageUri.split('.').pop();
    const localImageUri = `${path}${prefix}${id}.${fileExtension}`;
    console.log('Saving image locally:', localImageUri);

     try {
            await FileSystem.copyAsync({
                from: imageUri,
                to: `${FileSystem.documentDirectory}${localImageUri}`
            });
            return localImageUri;
            } catch (error) {
            console.error('Failed to save image locally:', error);
    }
}
export const deleteImageLocally = async (imageUri: string) => {
    try {
        const localImageUri = `${FileSystem.documentDirectory}${imageUri}`;
         const fileInfo = await FileSystem.getInfoAsync(localImageUri);
        if (!fileInfo.exists) {
            return;
        }
        await FileSystem.deleteAsync(localImageUri, { idempotent: true });
    } catch (error) {
        console.error('Failed to delete image locally:', error);
    }
}
export const saveOutfitLocally = async (outfit: Outfit) => {
    const outfits = await readLocalData<Outfit>(localConfig.localOutfitJsonUri);
    await writeLocalData(localConfig.localOutfitJsonUri, [...outfits, outfit]);
};

export const saveOutfitCollectionLocally = async (collection: OutfitCollection) => {
    const collections = await readLocalData<OutfitCollection>(localConfig.localOutfitCollectionsJsonUri);
    await writeLocalData(localConfig.localOutfitCollectionsJsonUri, [...collections, collection]);
};

export const checkAbsoultePath =  (path: string) => {
    if (!path.startsWith('file://')) {
        return FileSystem.documentDirectory + path;
    }

    return path;
}   