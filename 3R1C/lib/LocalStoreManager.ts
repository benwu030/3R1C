
import * as FileSystem from 'expo-file-system';
import {localConfig} from './config'
import { Outfit, OutfitCollection } from '../constants/outfit';

export const ensureDirectories = async () => {
    const dirs = [
        localConfig.localClotheDirectory,
        localConfig.localClotheImagesDirectiry,
        localConfig.localOutfitDirectory
    ];

    for (const dir of dirs) {
        const dirInfo = await FileSystem.getInfoAsync(dir);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
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
        await ensureDirectories();
        await FileSystem.writeAsStringAsync(path, JSON.stringify(data));
    } catch (err) {
        console.error('Error writing local data:', err);
        throw err;
    }
};

// 本地存儲函數
export const saveOutfitLocally = async (outfit: Outfit) => {
    const outfits = await readLocalData<Outfit>(localConfig.localOutfitJsonUri);
    await writeLocalData(localConfig.localOutfitJsonUri, [...outfits, outfit]);
};

export const saveOutfitCollectionLocally = async (collection: OutfitCollection) => {
    const collections = await readLocalData<OutfitCollection>(localConfig.localOutfitCollectionsJsonUri);
    await writeLocalData(localConfig.localOutfitCollectionsJsonUri, [...collections, collection]);
};

