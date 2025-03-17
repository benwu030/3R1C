import { Account,Permission, Query,Role,ID } from "react-native-appwrite"
import { Clothe, CLOTHES } from "@/constants/clothes";
import { ImagePickerAsset } from "expo-image-picker";
import * as FileSystem from 'expo-file-system';
import { config, localConfig } from "../config";
import { readLocalData, writeLocalData,saveImageLocally } from "../LocalStoreManager";
import {storage,databases,uploadImage} from '../AppWrite'
//create a clothes document
export async function createClothe(clothe: Clothe,userID:string,imageFile:ImagePickerAsset,onLocalSave?: () => void){
    try {
        const uid = ID.unique();
        //save the image to local
        const fileExtension = imageFile.uri.split('.').pop();
        const localImageUri = await saveImageLocally(localConfig.localClotheImagesDirectiry,imageFile.uri,uid)
        //update file path
        clothe.localImageURL = localImageUri??'';
        clothe.$id = uid;
        //save data to local storage
        const existingData = await readLocalData<Clothe>(localConfig.localClotheJsonUri);
        await writeLocalData(localConfig.localClotheJsonUri, [...existingData, clothe]);
        //close the modal when saved 
        onLocalSave?.();
        //upload to appwrite
        clothe.$id = null
        
        const fileInfo = await FileSystem.getInfoAsync(localImageUri??'');
        if (!fileInfo.exists) {
            throw new Error('Local image file not found');
        }
        
        
        const uploadImageResponse = await uploadImage(imageFile,uid,config.clothesImgStorageId!)    
        if(!uploadImageResponse) throw new Error('failed to upload image')
        const response = await databases.createDocument(
            config.databaseId!,
            config.clothesCollectionId!,
            uid, // Auto-generate ID
            clothe,
            [Permission.read(Role.user(userID)), 
            Permission.delete(Role.user(userID)), 
            Permission.update(Role.user(userID))]
        );
        return response;
    } catch (error) {
        console.error('fail to create clothes',error);
        //delete the uploaded image if the clothe creation fails
        
        return null;
    }
}


export async function refetchClotheImage(imageURL:string,id:string,onLocalSave?: () => void){
    console.log('refetching image')
    try {
        const fileExtension = imageURL.split('.').pop();
        const localPath = `${localConfig.localClotheImagesDirectiry}${id}.${fileExtension}`;
        const result = await storage.getFileDownload(config.clothesImgStorageId!, id);
        const downloadResult = await FileSystem.downloadAsync(
            result.href,
            localPath
        );

        if (downloadResult.status !== 200) {
            throw new Error(`Failed to download image: ${downloadResult.status}`);
        }
        //update the local data 
        const existingData = await readLocalData<Clothe>(localConfig.localClotheJsonUri);
        const updatedData = existingData.map(item => {
            if(item.$id === id) {
                item.localImageURL = localPath;
            }
            return item;
        });
        await writeLocalData(localConfig.localClotheJsonUri, updatedData);
        let clothe = existingData.find(item => item.$id === id);
        if (clothe) {
            delete clothe.createdAt;
        }
        onLocalSave?.();
        //update remote data
        await databases.updateDocument(
            config.databaseId!,
            config.clothesCollectionId!,
            id,
            clothe
                );
        console.log('image refetched')
        return localPath
    } catch (error) {
        console.error('Failed to fetch remote image:', error);
    }
}
function mapDocumentsToClothes(documents: any[]): CLOTHES {
   
    return documents.map(doc => ({
        $id: doc.$id,
        userid: doc.userid,
        title: doc.title,
        price: doc.price,
        localImageURL: doc.localImageURL,
        remark: doc.remark,
        createdAt: new Date(doc.$createdAt),
        category: doc.category,
        maincategory: doc.maincategory,
        subcategories: doc.subcategories,
        maincolor: doc.maincolor,
        subcolors: doc.subcolors,
        purchasedate: doc.purchasedate
    }));
}
export async function getAllClothes(): Promise<CLOTHES> {
   
   try {
    const localClothes = await readLocalData<Clothe>(localConfig.localClotheJsonUri);
    if(localClothes.length > 0) {
        console.log('reading clothes locally (getAllClothes) ');
        return localClothes;
    }
    // console.log('reading clothes from online storage (getAllClothes) ');
    const result = await databases.listDocuments(
        config.databaseId!,
        config.clothesCollectionId!,
        [Query.orderAsc('$createdAt')]
    )
    const clothes = mapDocumentsToClothes(result.documents);
    //save to local
    await writeLocalData(localConfig.localClotheJsonUri, clothes);
    return clothes;
    }   
    catch (error) {
        console.error('fail to getclothesAll',error);
        return []
    }
}
export async function getAllClothesWithQuery(query:{attribute:string,method:string}): Promise<CLOTHES> {
   
    try {
     const localClothes = await readLocalData<Clothe>(localConfig.localClotheJsonUri);
     if(localClothes.length > 0) {
        //  console.log('reading clothes locally (getAllClothesWithQuery) ');
        //  console.log('query',query)
         if(query.attribute && query.method){
            if(query.method === 'orderAsc') {
                localClothes.sort((a,b) => {
                    const aValue = a[query.attribute as keyof Clothe];
                    const bValue = b[query.attribute as keyof Clothe];
                    
                    // Handle date values (createdAt or purchasedate)
                    if (query.attribute === 'createdAt' || query.attribute === 'purchasedate') {
                        const aDate = aValue instanceof Date ? aValue : Array.isArray(aValue) ? new Date(0) : new Date(aValue || 0);
                        const bDate = bValue instanceof Date ? bValue : Array.isArray(bValue) ? new Date(0) : new Date(bValue || 0);
                        return aDate.getTime() - bDate.getTime();
                    }
                    
                    // Handle regular string/number comparisons
                    const aCompare = aValue ?? '';
                    const bCompare = bValue ?? '';
                    return aCompare > bCompare ? 1 : -1;
                });
            }
            if(query.method === 'orderDesc') {
                localClothes.sort((a,b) => {
                    const aValue = a[query.attribute as keyof Clothe];
                    const bValue = b[query.attribute as keyof Clothe];
                    
                    // Handle date values (createdAt or purchasedate)
                    if (query.attribute === 'createdAt' || query.attribute === 'purchaseDate') {
                        const aDate = aValue instanceof Date ? aValue : Array.isArray(aValue) ? new Date(0) : new Date(aValue || 0);
                        const bDate = bValue instanceof Date ? bValue : Array.isArray(bValue) ? new Date(0) : new Date(bValue || 0);
                        return aDate.getTime() - bDate.getTime();
                    }
                    
                    // Handle regular string/number comparisons
                    const aCompare = aValue ?? '';
                    const bCompare = bValue ?? '';
                    return aCompare < bCompare ? 1 : -1;
            });
        }
         }
         return localClothes;
     }
    //  console.log('reading clothes from online storage (getAllClothesWithQuery) ');
     const result = await databases.listDocuments(
         config.databaseId!,
         config.clothesCollectionId!,
         [query.method === 'orderAsc' ? Query.orderAsc(query.attribute) : Query.orderDesc(query.attribute)]
     )
     const clothes = mapDocumentsToClothes(result.documents);
     return clothes;
     }   
     catch (error) {
         console.error('fail to getclothesAll',error);
         return []
     }
 }
function filterClothes(clothes: CLOTHES, category?: string,id?:string): CLOTHES {
    if(category){
        if (category === 'All') return clothes;
        return clothes.filter(item => item.maincategory === category);
    }
    if(id) return clothes.filter(item => item.$id === id);
    return clothes;
}

export async function getClothesWithFilter({query,mainCategoryfilter,limit}:{query?:string,mainCategoryfilter:string,limit?:number}): Promise<CLOTHES> {
    
        // Try to read from local storage first
        try {
            const localClothes = await readLocalData<Clothe>(localConfig.localClotheJsonUri);
            if(localClothes.length > 0) {
                console.log('reading clothes locally (getClothesWithFilter) ');
                return filterClothes(localClothes, mainCategoryfilter);;
            }
            console.log('search from remote storage (getClothesWithFilter) ',mainCategoryfilter)
            const buildQuery = [Query.orderDesc('$createdAt')]
            if(mainCategoryfilter && mainCategoryfilter !=='All') 
                buildQuery.push(Query.equal('maincategory',mainCategoryfilter))
            const result = await databases.listDocuments(
                config.databaseId!,
                config.clothesCollectionId!,
                buildQuery
            )
            const clothes = mapDocumentsToClothes(result.documents);
            //store the data in the local storage
            // await writeLocalData(localConfig.localClotheJsonUri, [...localClothes, ...clothes]);
            return filterClothes(clothes, mainCategoryfilter);
        } catch (error) {
            console.error('Error getClothesWithFilter', error);
            return [];
        }
}

export async function getClotheById({ id }: { id: string }):Promise<Clothe|null> {



    try {
        const localClothes = await readLocalData<Clothe>(localConfig.localClotheJsonUri);
            if(localClothes.length > 0) {
                console.log('reading clothes locally (getClotheById) ');
                return filterClothes(localClothes, undefined, id)[0] || null;;
            }
            console.log('search from remote storage (getClotheById) ',id)
            const result = await databases.getDocument(
                config.databaseId!,
                config.clothesCollectionId!,
                id,
              );
            const clothes = mapDocumentsToClothes(result.documents);
            // await writeLocalData(localConfig.localClotheJsonUri, [...localClothes,...clothes]);
            return filterClothes(clothes, id)[0] || null;

              
    } catch (error) {
        console.error('Error getClotheById', error);
        return null;
    }
  }
const deleteLocalClothe = async (id: string): Promise<boolean> => {
    try {
        const clothes = await readLocalData<Clothe>(localConfig.localClotheJsonUri);
        const clotheToDelete = clothes.find(clothe => clothe.$id === id);
        
        if (!clotheToDelete) return false;

        // delete image file locally
        if (clotheToDelete.localImageURL) {
            await FileSystem.deleteAsync(clotheToDelete.localImageURL, { idempotent: true });
        }

        //update local data
        const updatedClothes = clothes.filter(clothe => clothe.$id !== id);
        await writeLocalData(localConfig.localClotheJsonUri, updatedClothes);
        
        return true;
    } catch (error) {
        console.error('delete clothe locally failed:', error);
        return false;
    }
};

const deleteRemoteClothe = async (id: string, imageId: string): Promise<boolean> => {
    try {
        const [imageResult, documentResult] = await Promise.all([
            storage.deleteFile(config.clothesImgStorageId!, imageId),
            databases.deleteDocument(config.databaseId!, config.clothesCollectionId!, id)
        ]);
        
        return !!imageResult && !!documentResult;
    } catch (error) {
        console.error('delete clothe remotelly failed:', error);
        return false;
    }
};

export async function deleteClotheById(id: string, imageId: string): Promise<boolean> {
    try {
        const [localResult, remoteResult] = await Promise.all([
            deleteLocalClothe(id),
            deleteRemoteClothe(id, imageId)
        ]);

        return localResult && remoteResult;
    } catch (error) {
        console.error('delete clothe failed:', error);
        return false;
    }
}
