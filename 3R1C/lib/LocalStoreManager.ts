
import * as FileSystem from 'expo-file-system';
import {localConfig} from './config'
import { Outfit, OutfitCollection } from '../constants/outfit';

export const ensureDirectories = async () => {
    const dirs = [
        localConfig.localClotheDirectory,
        localConfig.localClotheImagesDirectiry,
        localConfig.localOutfitDirectory,
        localConfig.localOutfitPreviewsDirectiry,
        localConfig.localOutfitCollectionPreviewsDirectiry

    ];

    for (const dir of dirs) {
        const dirInfo = await FileSystem.getInfoAsync(dir);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
        }
    }
};
export const ensureFiles = async () => {
    const files = [
        localConfig.localOutfitJsonUri,
        localConfig.localOutfitCollectionsJsonUri,
        localConfig.localOutfitCollectionRelationshipJsonUri
    ];

    for (const file of files) {
        const fileInfo = await FileSystem.getInfoAsync(file);
        if (!fileInfo.exists) {
            await writeLocalData(file, []);
        }
    }
};
export const readLocalData = async <T>(path: string): Promise<T[]> => {
    try {
        const content = await FileSystem.readAsStringAsync(path);
        //may add error handling here
        return JSON.parse(content);
    } catch (err){
        console.error('Error reading local data:', err);
        return [];
    }
};

export const writeLocalData = async <T>(path: string, data: T[]) => {
    try {
        await FileSystem.writeAsStringAsync(path, JSON.stringify(data));
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
            console.log(`No new items to add to ${path}`);
            return []; // No items added
        }
    } catch (err) {
        console.error('Error writing data with duplicate check:', err);
        throw err;
    }
};
export const saveImageLocally = async (path:string,imageUri: string, id: string) => {
    const fileExtension = imageUri.split('.').pop();
    const localImageUri = `${path}${id}.${fileExtension}`;
     try {
            await FileSystem.copyAsync({
                from: imageUri,
                to: localImageUri
            });
            return localImageUri;
            } catch (error) {
            console.error('Failed to save image locally:', error);
    }
}
// 本地存儲函數
export const saveOutfitLocally = async (outfit: Outfit) => {
    const outfits = await readLocalData<Outfit>(localConfig.localOutfitJsonUri);
    await writeLocalData(localConfig.localOutfitJsonUri, [...outfits, outfit]);
};

export const saveOutfitCollectionLocally = async (collection: OutfitCollection) => {
    const collections = await readLocalData<OutfitCollection>(localConfig.localOutfitCollectionsJsonUri);
    await writeLocalData(localConfig.localOutfitCollectionsJsonUri, [...collections, collection]);
};

