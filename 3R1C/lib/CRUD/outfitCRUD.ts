import { ID, Permission, Query, Role } from 'react-native-appwrite';
import { Outfit, OutfitCollection,OutfitCollectionRelation } from '@/constants/outfit';
import { config, localConfig } from '../config';
import { databases, deleteImage, storage, uploadImage } from '../AppWrite';
import { readLocalData, writeLocalData,saveImageLocally, writeLocalDataWithDuplicateCheck, deleteImageLocally } from '../LocalStoreManager';
import { Image } from 'expo-image';
import { ImagePickerAsset } from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
// Create Outfit
export async function createOutfit(outfit: Outfit, outfitCollectionId?: string, onLocalSave?: () => void) {
    try {
        const uid = ID.unique();
        let relation: OutfitCollectionRelation | null = null;
        outfit.$id = uid;
        let previewImageName;
        // Save locally first
        const localOutfits = await readLocalData<Outfit>(localConfig.localOutfitJsonUri);
        if (outfit.previewImageURL) {
            previewImageName = await saveImageLocally(localConfig.localOutfitPreviewsDirectiry, outfit.previewImageURL, uid,"Outfit-Preview-");
            outfit.previewImageURL = previewImageName
            previewImageName = `Outfit-Preview-${uid}.${previewImageName?.split('.').pop()}`;
        }
        await writeLocalData(localConfig.localOutfitJsonUri, [...localOutfits, outfit]);
        
        // Create relationship locally first if outfitCollectionId was provided

        if (outfitCollectionId) {
            relation = {
                $id: ID.unique(),
                outfitId: uid,
                outfitCollectionId: outfitCollectionId,
                userId: outfit.userid
            };
            
            await addOutfitToCollectionLocal(relation);
        }
        
        // Trigger callback after local save
        onLocalSave?.();

        // Save to remote
        if (outfit.previewImageURL) {
            const fileInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + outfit.previewImageURL);
            if (fileInfo.exists) {
           
            await uploadImage(FileSystem.documentDirectory + outfit.previewImageURL, uid, config.previewStorageId!);
            }
        }
const { $id, ...outfitWithoutId } = outfit;
const outfitForRemote = {
    ...outfitWithoutId,
    // previewImageURL: `https://fra.cloud.appwrite.io/v1/storage/buckets/${config.previewStorageId}/files/${uid}/preview?project=${config.projectid}`,
    items: JSON.stringify(outfitWithoutId.items) // Stringify the items array
};
        const response = await databases.createDocument(
            config.databaseId!,
            config.outfitCollectionId!,
            uid,
            outfitForRemote,
            [
            Permission.read(Role.user(outfit.userid)),
            Permission.update(Role.user(outfit.userid)),
            Permission.delete(Role.user(outfit.userid))
            ]
        );
        
        // Create relationship remotely if outfitCollectionId was provided
        if (outfitCollectionId && relation) {

            await addOutfitToCollectionRemote(
               relation,
               relation.$id ?? ID.unique(),
                outfit.userid
            );
        }

        return response;
    } catch (error) {
        console.error('Failed to create outfit:', error);
        return null;
    }
}

export async function refetchOutfitImage(imageURL:string,id:string){
    try {
        const fileExtension = imageURL.split('.').pop();
        const localPath = `${localConfig.localOutfitPreviewsDirectiry}${id}.${fileExtension}`;
        const result = await storage.getFileDownload(config.previewStorageId!, id);
        const downloadResult = await FileSystem.downloadAsync(
            result.href,
            FileSystem.documentDirectory+localPath
        );
        if (downloadResult.status !== 200) {
            throw new Error(`Failed to download image: ${downloadResult.status}`);
        }
        //update the local data 
        const existingData = await readLocalData<Outfit>(localConfig.localOutfitJsonUri);
        const updatedData = existingData.map(item => {
            if(item.$id === id) {
                item.previewImageURL = localPath;
            }
            
            return item;
        });
        await writeLocalData(localConfig.localOutfitJsonUri, updatedData);
        let outfit = existingData.find(item => item.$id === id);
        if (outfit) {
            delete outfit.createdAt;
        }
        //update remote data
        const response = await databases.updateDocument(
            config.databaseId!,
            config.outfitCollectionId!,
            id,
            outfit
        );
        return localPath
    } catch (error) {
        console.error('Failed to fetch remote image:', error);
    }
}
// Local operation
async function addOutfitToCollectionLocal(relation: OutfitCollectionRelation) {
    const localRelations = await readLocalData<OutfitCollectionRelation>(
        localConfig.localOutfitCollectionRelationshipJsonUri
    );
    
    // Check if relation already exists
    const relationExists = localRelations.some(
        rel => rel.outfitId === relation.outfitId && rel.outfitCollectionId === relation.outfitCollectionId
    );
    
    if (!relationExists) {
        await writeLocalData(
            localConfig.localOutfitCollectionRelationshipJsonUri, 
            [...localRelations, relation]
        );
    }
}

// Remote operation
async function addOutfitToCollectionRemote(relation: OutfitCollectionRelation, uid: string, userId: string) {
    relation.$id = null;
    return await databases.createDocument(
        config.databaseId!,
        config.outftiCollectionRelationshipId!,
        uid,
        relation,
        [
            Permission.read(Role.user(userId)),
            Permission.update(Role.user(userId)),
            Permission.delete(Role.user(userId))
        ]
    );
}
// Create Collection
export async function createOutfitCollection(collection: OutfitCollection,previewImageUri:string,onLocalSave?: () => void) {
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
           
           uploadImage(previewImageUri,uid,config.outfitCollectionImgStorageId!)
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
//get outfit collections by date
export async function getOutfitCollectionsByDate(date: Date): Promise<OutfitCollection[]> {
    try {

        const localCollections = await readLocalData<OutfitCollection>(localConfig.localOutfitCollectionsJsonUri);
        if (localCollections.length > 0) {
            const collections = localCollections.filter(collection => {
                return collection.dayToWear?.some(day => {
                const dayDate = new Date(day);
                return dayDate.getFullYear() === date.getFullYear() &&
                       dayDate.getMonth() === date.getMonth() &&
                       dayDate.getDate() === date.getDate();
                });
            });
        return collections;
        }
        // Fetch from remote
        const response = await databases.listDocuments(
            config.databaseId!,
            config.outfitCollection_CollectionId!,
            []
        );

        const collections = mapDocumentsToOutfitCollection(response.documents);
        await writeLocalData(localConfig.localOutfitCollectionsJsonUri, collections);

        return collections.filter(collection => {
            return collection.dayToWear?.some(day => {
                const dayDate = new Date(day);
                return dayDate.getFullYear() === date.getFullYear() &&
                       dayDate.getMonth() === date.getMonth() &&
                       dayDate.getDate() === date.getDate();
            });
        });
        
    } catch (error) {
        console.error('Failed to get collections by date:', error);
        return [];
    }
}
//get all outfits from Local
export async function getAllOutfitFromLocal(): Promise<Outfit[]> {
    try {
        const localOutfits = await readLocalData<Outfit>(localConfig.localOutfitJsonUri);
        return localOutfits;
    } catch (error) {
        console.error('Failed to get all outfits:', error);
        return [];
    }
}
//get all outfits from Remote
export async function getAllOutfitFromRemote(): Promise<Outfit[]> {
    try{
        const response = await databases.listDocuments(
            config.databaseId!,
            config.outfitCollectionId!,
            []
        );
        const outfits = mapDocumentsToOutfit(response.documents);
        return outfits;
    }catch(error){
        console.error('Failed to get all outfits:', error);
        return [];
    }
}

//get all outfits
export async function getAllOutfits(): Promise<Outfit[]> {
    try {
        const localOutfits = await readLocalData<Outfit>(localConfig.localOutfitJsonUri);
        if(localOutfits.length > 0){
            return localOutfits;
        }
        // Fetch from remote and update local
        const remoteOutfits = await getAllOutfitFromRemote();
        await writeLocalData(localConfig.localOutfitJsonUri, remoteOutfits);
        return remoteOutfits;
    }
    catch (error) {
        console.error('Failed to get all outfits:', error);
        return [];
    }
}
// Update outfit items positions
export async function updateOutfit(outfit: Outfit, onLocalUpdate?: () => void) {
    try {
        if (!outfit.$id) {
            throw new Error('Outfit ID is required for update');
        }
        
        // Update locally first
        const localOutfits = await readLocalData<Outfit>(localConfig.localOutfitJsonUri);
        let previewImageName;
        const updatedOutfits = await Promise.all(localOutfits.map(async item => {
            if (item.$id === outfit.$id) {
                if (outfit.previewImageURL) {
                    previewImageName = await saveImageLocally(localConfig.localOutfitPreviewsDirectiry, outfit.previewImageURL, outfit.$id!,"Outfit-Preview-");
                    outfit.previewImageURL = previewImageName
                    previewImageName = `Outfit-Preview-${outfit.$id}.${previewImageName?.split('.').pop()}`;
                }
                return { ...item, ...outfit };
            }
            return item;
        }));
       
        
        await writeLocalData(localConfig.localOutfitJsonUri, updatedOutfits);
        onLocalUpdate?.();
        
        // Update remote
        const { $id, ...outfitWithoutId } = outfit;
        const outfitForRemote = {
            ...outfitWithoutId,
            // previewImageURL: `https://fra.cloud.appwrite.io/v1/storage/buckets/${config.previewStorageId}/files/${outfit.$id}/preview?project=${config.projectid}`,

            items: JSON.stringify(outfitWithoutId.items) // Stringify the items array
            }
    
        // Save to remote
        if (outfit.previewImageURL) {
      
            const fileInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + outfit.previewImageURL);
                if (fileInfo.exists) {
           
         
             await deleteImage(config.previewStorageId!, outfit.$id);
            await uploadImage(FileSystem.documentDirectory + outfit.previewImageURL, outfit.$id, config.previewStorageId!);
            }

        }
        
   
        await databases.updateDocument(
            config.databaseId!,
            config.outfitCollectionId!,
            $id,
            outfitForRemote
        );
        
        return true;
    } catch (error) {
        console.error('Failed to update outfit:', error);
        return false;
    }
}

export async function getOutfitById(outfitId: string,isNewOutfit:boolean): Promise<Outfit | null> {
    if(isNewOutfit){
        return null;
    }
    try {
        // Try local first
        const localOutfits = await readLocalData<Outfit>(localConfig.localOutfitJsonUri);
        const outfit = localOutfits.find(o => o.$id === outfitId);
        if (outfit) {
            const items = typeof outfit.items === "string" ? JSON.parse(outfit.items) : outfit.items;
            outfit.items = items;
            return outfit;
        }
        
        // Fetch from remote
        const response = await databases.getDocument(
            config.databaseId!,
            config.outfitCollectionId!,
            outfitId
        );
        
        const mappedOutfit: Outfit = {
            $id: response.$id,
            userid: response.userid,
            title: response.title,
            previewImageURL: response.previewImageURL,
            remark: response.remark,
            outfitCollectionIds: response.outfitCollectionIds,
            items: JSON.parse(response.items),
            createdAt: new Date(response.$createdAt),
        };
        // Update local storage
        await writeLocalDataWithDuplicateCheck(localConfig.localOutfitJsonUri, [mappedOutfit]);
        
        return mappedOutfit;
    } catch (error) {
        console.error('Failed to get outfit:', error);
        return null;
    }
}
function mapDocumentsToOutfit(documents: any[]): Outfit[] {
   
    return documents.map(doc => ({
        $id: doc.$id,
        userid: doc.userid,
        title: doc.title,
        previewImageURL: doc.previewImageURL,
        remark: doc.remark,
        outfitCollectionIds: doc.outfitCollectionIds,
        items: doc.items,
        createdAt: new Date(doc.$createdAt),
       
    }));
}
// Get outfits by collection
export async function getOutfitsByCollection(collectionId: string): Promise<Outfit[]> {
    try {
        // Try local first
        const localRelations = await readLocalData<OutfitCollectionRelation>(
            localConfig.localOutfitCollectionRelationshipJsonUri
        );
        const localOutfits = await readLocalData<Outfit>(localConfig.localOutfitJsonUri);
        if(localRelations.length <= 0){
         //TODO Refetch from remote
        }
        if(localOutfits.length <= 0){
            //TODO Refetch from remote
        }
     
        const relationship = localRelations.filter(rel => rel.outfitCollectionId === collectionId);
        if (relationship.length > 0) {
            // Get all outfits and filter by IDs
            const remoteOutfitIds = relationship.map(rel => rel.outfitId);
            if (remoteOutfitIds.length > 0) {
                return localOutfits.filter(outfit => remoteOutfitIds.includes(outfit.$id!));
            }        
        }

        return []
    } catch (error) {
        console.error('Failed to get outfits:', error);
        return [];
    }
}

function mapDocumentsToRelationship(documents: any[]): OutfitCollectionRelation[] {
    return documents.map(doc => ({
        $id: doc.$id,
        outfitId: doc.outfitId,
        outfitCollectionId: doc.outfitCollectionId,
        userId: doc.userId
    }));
}

//delete outfit by id
export async function deleteOutfitById(outfitId: string) {
    try {
        // Delete locally first
        const localOutfits = await readLocalData<Outfit>(localConfig.localOutfitJsonUri);
        const updatedOutfits = localOutfits.filter(outfit => outfit.$id !== outfitId);
        await writeLocalData(localConfig.localOutfitJsonUri, updatedOutfits);
        // Remove relationship
        const localRelations = await readLocalData<OutfitCollectionRelation>(
            localConfig.localOutfitCollectionRelationshipJsonUri
        );
        const updatedRelations = localRelations.filter(rel => rel.outfitId !== outfitId);
        await writeLocalData(localConfig.localOutfitCollectionRelationshipJsonUri, updatedRelations);
        //delete local preview image
        let previewImageURL = localOutfits.find(outfit => outfit.$id === outfitId)?.previewImageURL;
        if (previewImageURL) {
            await deleteImageLocally(previewImageURL);
        }
        // Delete  outfit from remote
        await databases.deleteDocument(
            config.databaseId!,
            config.outfitCollectionId!,
            outfitId
        );
        //delete relationship from remote
        await databases.deleteDocument(
            config.databaseId!,
            config.outftiCollectionRelationshipId!,
            outfitId
        );
        //delete the image from storage
        await deleteImage(config.previewStorageId!, outfitId);

        return true;
    } catch (error) {
        console.error('Failed to delete outfit:', error);
        return false;
    }
}
// Delete outfit from collection
export async function deleteOutfitsFromCollection(outfitIds: string[], collectionId: string, onLocalUpdate?: () => void) {
    try {
        // Delete locally first
        const localRelations = await readLocalData<OutfitCollectionRelation>(
            localConfig.localOutfitCollectionRelationshipJsonUri
        );
        //delete relationship
        const updatedRelations = localRelations.filter(
            rel => !(outfitIds.includes(rel.outfitId) && rel.outfitCollectionId === collectionId)
        );
        
        await writeLocalData(
            localConfig.localOutfitCollectionRelationshipJsonUri,
            updatedRelations
        );
        onLocalUpdate?.();
        // Delete from remote
        for (const outfitId of outfitIds) {
            const relationships = await databases.listDocuments(
            config.databaseId!,
            config.outftiCollectionRelationshipId!,
            [
                Query.equal('outfitId', outfitId),
                Query.equal('outfitCollectionId', collectionId)
            ]
            );

            for (const doc of relationships.documents) {
            await databases.deleteDocument(
                config.databaseId!,
                config.outftiCollectionRelationshipId!,
                doc.$id
            );
            }
        }
        return true;
    } catch (error) {
        console.error('Failed to delete outfit from collection:', error);
        return false;
    }
}

//delete outfit collections
export async function deleteLocalOutfitCollection(collectionId: string) {
    try {
        // Delete locally first
        const localCollections = await readLocalData<OutfitCollection>(localConfig.localOutfitCollectionsJsonUri);
        const updatedCollections = localCollections.filter(collection => collection.$id !== collectionId);
        await writeLocalData(localConfig.localOutfitCollectionsJsonUri, updatedCollections);
        //Remove relationship
        const localRelations = await readLocalData<OutfitCollectionRelation>(
            localConfig.localOutfitCollectionRelationshipJsonUri
        );
        const updatedRelations = localRelations.filter(rel => rel.outfitCollectionId !== collectionId);
        await writeLocalData(localConfig.localOutfitCollectionRelationshipJsonUri, updatedRelations);
        //remove the local outfitcollection image
        let previewImageURL = localCollections.find(collection => collection.$id === collectionId)?.previewImageURL;
        if (previewImageURL) {
            await deleteImageLocally(previewImageURL);
        }
        return true;
    } catch (error) {
        console.error('Failed to delete collection:', error);
        return false;
    }
}
export async function deleteRemoteOutfitCollection(collectionId: string) {
    try {
        // Delete outfits collection from collection
        await databases.deleteDocument(
            config.databaseId!,
            config.outfitCollection_CollectionId!,
            collectionId
        )
        // Delete all related realtionships
        const relationships = await databases.listDocuments(
            config.databaseId!,
            config.outftiCollectionRelationshipId!,
            [
                Query.equal('outfitCollectionId', collectionId)
            ]
            );
            for (const doc of relationships.documents) {
                await databases.deleteDocument(
                    config.databaseId!,
                    config.outfitCollection_CollectionId!,
                    doc.$id
                )
            }
       //delete the image from storage
       await deleteImage(config.outfitCollectionImgStorageId!,collectionId)
        return true;
    } catch (error) {
        console.error('Failed to delete collection:', error);
        return false;
    }
}

//delete outfit collection
export async function deleteOutfitCollection(collectionId: string) {
    try {
        const localDelete = await deleteLocalOutfitCollection(collectionId);
        const remoteDelete = await deleteRemoteOutfitCollection(collectionId);
        return localDelete && remoteDelete;
    } catch (error) {
        console.error('Failed to delete collection:', error);
        return false;
    }
}