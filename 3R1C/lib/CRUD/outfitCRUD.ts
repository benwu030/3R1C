import { ID, Permission, Query, Role } from 'react-native-appwrite';
import { Outfit, OutfitCollection } from '@/constants/outfit';
import { config, localConfig } from '../config';
import { databases, storage, uploadImage } from '../AppWrite';
import { readLocalData, writeLocalData,saveImageLocally } from '../LocalStoreManager';
import { Image } from 'expo-image';
import { ImagePickerAsset } from 'expo-image-picker';
// Create Outfit
export async function createOutfit(outfit: Outfit, onLocalSave?: () => void) {
    try {
        const uid = ID.unique();
        outfit.$id = uid;

        // Save locally first
        const localOutfits = await readLocalData<Outfit>(localConfig.localOutfitJsonUri);
        await writeLocalData(localConfig.localOutfitJsonUri, [...localOutfits, outfit]);
        
        // Trigger callback after local save
        onLocalSave?.();

        // Save to remote
        const response = await databases.createDocument(
            config.databaseId!,
            config.outfitCollectionId!,
            uid,
            outfit,
            [
                Permission.read(Role.user(outfit.userid)),
                Permission.update(Role.user(outfit.userid)),
                Permission.delete(Role.user(outfit.userid))
            ]
        );

        return response;
    } catch (error) {
        console.error('Failed to create outfit:', error);
        return null;
    }
}

// Create Collection
export async function createOutfitCollection(collection: OutfitCollection,previewImage:ImagePickerAsset,onLocalSave?: () => void) {
    try {
        const uid = ID.unique();
        collection.$id = uid;
        // Save locally first
    
        const localCollections = await readLocalData<OutfitCollection>(localConfig.localOutfitCollectionsJsonUri);

        //copy preview image to local storage
        if (collection.previewImageURL) {
             const newPath = await saveImageLocally(localConfig.localOutfitCollectionPreviewsDirectiry,collection.previewImageURL, uid);
            // Update file path
            collection.previewImageURL = newPath;
            console.log('newPath',newPath)
        }

   
       
        await writeLocalData(localConfig.localOutfitCollectionsJsonUri, [...localCollections, collection]);
        
        // Trigger callback after local save
        onLocalSave?.();
        
        // Save to remote
        collection.$id = null;
        const response = await databases.createDocument(
            config.databaseId!,
            config.outfitCollection_CollectionId!,
            uid,
            collection,
            [
                Permission.read(Role.user(collection.userid)),
                Permission.update(Role.user(collection.userid)),
                Permission.delete(Role.user(collection.userid))
            ]
        );
        //upload image to storage
        if (collection.previewImageURL) {
           
           uploadImage(previewImage,uid,config.outfitCollectionImgStorageId!)
        }
        return response;
    } catch (error) {
        console.error('Failed to create collection:', error);
        return null;
    }
}
function mapDocumentsToOutfitCollection(documents: any[]): OutfitCollection[] {
   
    return documents.map(doc => ({
        $id: doc.$id,
        userid: doc.userid,
        title: doc.title,
        description: doc.description,
        previewImageURL: doc.previewImageURL,
        dayToWear: doc.dayToWear,
        createdAt: new Date(doc.$createdAt),
       
    }));
}
//get outfit collections
export async function getOutfitCollections(): Promise<OutfitCollection[]> {
    try {
        // Try local first
        const localCollections = await readLocalData<OutfitCollection>(localConfig.localOutfitCollectionsJsonUri);
        if (localCollections.length > 0) {
            return localCollections;
        }

        // Fetch from remote
        const response = await databases.listDocuments(
            config.databaseId!,
            config.outfitCollection_CollectionId!,
            []
        );

        const collections = mapDocumentsToOutfitCollection(response.documents);
        await writeLocalData(localConfig.localOutfitCollectionsJsonUri, collections);
        
        return collections;
    } catch (error) {
        console.error('Failed to get collections:', error);
        return [];
    }
}
// Update outfit items positions
export async function updateOutfitItemPositions(
    outfitId: string,
    items: OutfitItem[],
    onLocalUpdate?: () => void
) {
    try {
        // Update locally first
        const localOutfits = await readLocalData<Outfit>(localConfig.localOutfitJsonUri);
        const updatedOutfits = localOutfits.map(outfit => {
            if (outfit.$id === outfitId) {
                return { ...outfit, items };
            }
            return outfit;
        });
        
        await writeLocalData(localConfig.localOutfitJsonUri, updatedOutfits);
        onLocalUpdate?.();

        // Update remote
        await databases.updateDocument(
            config.databaseId!,
            config.outfitsCollectionId!,
            outfitId,
            { items }
        );

        return true;
    } catch (error) {
        console.error('Failed to update outfit positions:', error);
        return false;
    }
}

// Get outfits by collection
export async function getOutfitsByCollection(collectionId: string): Promise<Outfit[]> {
    try {
        // Try local first
        const localOutfits = await readLocalData<Outfit>(localConfig.localOutfitJsonUri);
        if (localOutfits.length > 0) {
            return localOutfits.filter(outfit => 
                outfit.collections?.includes(collectionId)
            );
        }

        // Fetch from remote
        const response = await databases.listDocuments(
            config.databaseId!,
            config.outfitCollection_CollectionId!,
            [Query.equal('collections', [collectionId])]
        );

        const outfits = response.documents as Outfit[];
        await writeLocalData(localConfig.localOutfitJsonUri, outfits);
        
        return outfits;
    } catch (error) {
        console.error('Failed to get outfits:', error);
        return [];
    }
}