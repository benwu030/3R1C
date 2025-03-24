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
        const response = await databases.updateDocument(
            config.databaseId!,
            config.clothesCollectionId!,
            id,
            clothe
        );
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
        return localClothes;
    }
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
 function sortClothes(clothes: CLOTHES, sortByText: string): CLOTHES {
    const [sortBy, sortOrder] = sortByText.split('_');
    
    // Sort the clothes based on the selected criteria
    let sortedClothes = [...clothes];
  
    if (sortBy === 'price') {
        sortedClothes.sort((a, b) => {
            return sortOrder === 'asc' ? (a.price || 0) - (b.price || 0) : (b.price || 0) - (a.price || 0);
        });
    } else if (sortBy === 'createdate') {
        sortedClothes.sort((a, b) => {
            
            const aDate = a.createdAt ? (new Date(a.createdAt)).getTime() : 0;
            const bDate = b.createdAt ? (new Date(b.createdAt)).getTime() : 0;
            return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
        });
    } else if (sortBy === 'title') {
        sortedClothes.sort((a, b) => {
            const aTitle = a.title || '';
            const bTitle = b.title || '';
            return sortOrder === 'asc' ? aTitle.localeCompare(bTitle) : bTitle.localeCompare(aTitle);
        });
    }else if (sortBy === 'purchasedate') {
        sortedClothes.sort((a, b) => {
            const aDate = a.purchasedate ? (new Date(a.purchasedate)).getTime() : 0;
            const bDate = b.purchasedate ? (new Date(b.purchasedate)).getTime() : 0;
            return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
        });
    }
    
    return sortedClothes;
 }
function filterClothes(clothes: CLOTHES, category="All",searchText?:string,sortByText="createdate_asc",id?:string): CLOTHES {
    if (id) return clothes.filter(item => item.$id === id);
    
    let filteredClothes = clothes;
    
    if (category && category !== 'All') {
        filteredClothes = filteredClothes.filter(item => item.maincategory === category);
    }
    
    if (searchText && searchText.trim() !== '') {
        const searchLower = searchText.toLowerCase().trim();
        filteredClothes = filteredClothes.filter(item => 
            item.title?.toLowerCase().includes(searchLower) ||
            item.remark?.toLowerCase().includes(searchLower) ||
            item.maincategory?.toLowerCase().includes(searchLower) ||
            item.subcategories?.some(sub => sub.toLowerCase().includes(searchLower))
        );
    }

    //sort the clothes by sortByText
    filteredClothes = sortClothes(filteredClothes, sortByText);
    return filteredClothes;
}

export async function getClothesWithFilter({searchText,mainCategoryfilter,sortByText}:{searchText?:string,mainCategoryfilter:string,sortByText?:string}): Promise<CLOTHES> {
    
        // Try to read from local storage first
        try {

            const localClothes = await readLocalData<Clothe>(localConfig.localClotheJsonUri);
            if(localClothes.length > 0) {
                return filterClothes(localClothes, mainCategoryfilter, searchText,sortByText);
            }
            const buildQuery = [Query.orderDesc('$createdAt')]
            //fetch all data again
            const result = await databases.listDocuments(
                config.databaseId!,
                config.clothesCollectionId!,
                buildQuery
            )
            const clothes = mapDocumentsToClothes(result.documents);
            //store the data in the local storage
            await writeLocalData(localConfig.localClotheJsonUri, [...localClothes, ...clothes]);
            return filterClothes(clothes, mainCategoryfilter, searchText,sortByText);
        } catch (error) {
            console.error('Error getClothesWithFilter', error);
            return [];
        }
}

export async function getClotheById({ id }: { id: string }):Promise<Clothe|null> {



    try {
        const localClothes = await readLocalData<Clothe>(localConfig.localClotheJsonUri);
            if(localClothes.length > 0) {
                const foundClothe = localClothes.find(item => item.$id === id);
                return foundClothe || null;;
            }
            const result = await databases.getDocument(
                config.databaseId!,
                config.clothesCollectionId!,
                id,
              );
            const clothes = mapDocumentsToClothes(result.documents);
            return clothes.find(item => item.$id === id) || null;

              
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
            if((await FileSystem.getInfoAsync(clotheToDelete.localImageURL)).exists)
            await FileSystem.deleteAsync(clotheToDelete.localImageURL, { idempotent: true });
        }

        //update local data
        const updatedClothes = clothes.filter(clothe => clothe.$id !== id);
        await writeLocalData(localConfig.localClotheJsonUri, [...updatedClothes]);
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
