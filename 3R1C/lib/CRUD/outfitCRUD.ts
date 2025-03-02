import { ID, Permission, Query, Role } from 'react-native-appwrite';
import { Outfit, OutfitCollection,OutfitCollectionRelation } from '@/constants/outfit';
import { config, localConfig } from '../config';
import { databases, storage, uploadImage } from '../AppWrite';
import { readLocalData, writeLocalData,saveImageLocally, writeLocalDataWithDuplicateCheck } from '../LocalStoreManager';
import { Image } from 'expo-image';
import { ImagePickerAsset } from 'expo-image-picker';
// Create Outfit
export async function createOutfit(outfit: Outfit, outfitCollectionId?: string, onLocalSave?: () => void) {
    try {
        const uid = ID.unique();
        let relation: OutfitCollectionRelation | null = null;
        outfit.$id = uid;
        
        // Save locally first
        const localOutfits = await readLocalData<Outfit>(localConfig.localOutfitJsonUri);
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
        console.log('getOutfitsByCollection',collectionId)
        // Try local first
        const localRelations = await readLocalData<OutfitCollectionRelation>(
            localConfig.localOutfitCollectionRelationshipJsonUri
        );
        if (localRelations.length > 0) {
            const outfitIds = localRelations
                .filter(rel => rel.outfitCollectionId === collectionId)
                .map(rel => rel.outfitId);

            if (outfitIds.length > 0) {
                // Get all outfits and filter by IDs
                const localOutfits = await readLocalData<Outfit>(localConfig.localOutfitJsonUri);
                return localOutfits.filter(outfit => outfitIds.includes(outfit.$id!));
            }
        }

        // Fetch from remote
        const relationship = await databases.listDocuments(
            config.databaseId!,
            config.outftiCollectionRelationshipId!,
            [Query.equal('outfitCollectionId', collectionId)]
        );
        //get the outfits ids
        const remoteOutfitIds = relationship.documents.map(doc => doc.outfitId);
        //Fetch the outfits
        const outfits = [];
        for (const id of remoteOutfitIds) {
            try {
                const outfit = await databases.getDocument(
                    config.databaseId!,
                    config.outfitCollectionId!,
                    id
                );
                outfits.push(outfit);
            } catch (e) {
                console.log(`Outfit ${id} not found`);
            }
        }
        
        const mappedOutfits = mapDocumentsToOutfit(outfits);

        // Update local data
        await writeLocalDataWithDuplicateCheck(localConfig.localOutfitJsonUri, mappedOutfits);
        await writeLocalData(
            localConfig.localOutfitCollectionRelationshipJsonUri, 
            mapDocumentsToRelationship(relationship.documents)
        );
        return mappedOutfits
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