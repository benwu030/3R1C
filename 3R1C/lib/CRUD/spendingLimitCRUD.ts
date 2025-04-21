import * as FileSystem from 'expo-file-system';
import { config, localConfig } from "../config";
import { readLocalData, writeLocalData,saveImageLocally } from "../LocalStoreManager";
import {storage,databases,uploadImage} from '../AppWrite'
import { SpendingLimit } from '@/constants/spending';
import { Permission, Query, Role } from 'react-native-appwrite';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';



export const getSpendingLimitLocally = async (): Promise<SpendingLimit | null> => {
    try {
        const spendingLimit = await readLocalData<SpendingLimit>(localConfig.spendingLimitJsonUri);
        return spendingLimit?.[0]?? null;
    } catch (error) {
        console.error('Error reading spending limit data:', error);
        return null;
    }
}

export const writeSpendingLimitLocally = async (spendingLimit: number) => {
    try {
        const data = [{ monthlySpendingLimit: spendingLimit }];
        await writeLocalData(localConfig.spendingLimitJsonUri, data);
    } catch (error) {
        console.error('Error writing spending limit data:', error);
    }
}
const mapDocumentsToSpendingLimit = (documents: any[]): SpendingLimit[] => {
    return documents.map((doc) => ({
        monthlySpendingLimit: doc.monthlySpendingLimit,
    }));
}
export const getSpendingLimit = async (): Promise<SpendingLimit | null> => {
    try {
        const localSpendingLimit = await getSpendingLimitLocally();
        if (localSpendingLimit) {
            return localSpendingLimit;
        }
        // Fetch the spending limit from Appwrite
        const spendingLimit = await databases.listDocuments(
            config.databaseId!,
            config.spendingLimitCollectionId!,
            [Query.orderDesc('$createdAt')],
        );
        if (spendingLimit.documents.length === 0) {
            return null; // No spending limit found
        }
        // Map the documents to the SpendingLimit interface
        const mappedSpendingLimit = mapDocumentsToSpendingLimit(spendingLimit.documents);
        // Save the spending limit locally
        await writeSpendingLimitLocally(mappedSpendingLimit[0].monthlySpendingLimit);
        return mappedSpendingLimit[0];
    } catch (error) {
        console.error('Error fetching spending limit data:', error);
        return null;
    }
}
export const createSpendingLimit = async (spendingLimit: number) => {
    try {
        const spendingLimitData = {
            monthlySpendingLimit: spendingLimit
        };
        const response = await databases.createDocument(
            config.databaseId!,
            config.spendingLimitCollectionId!,
            'unique()',
            spendingLimitData
        );
        // Save the spending limit locally
        await writeSpendingLimitLocally(spendingLimit);
        return response;
    } catch (error) {
        console.error('Error creating spending limit:', error);
        return null;
    }
}

