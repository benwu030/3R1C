import { createURL, getLinkingURL } from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";
import { Platform } from 'react-native';
import { Account, Avatars, Client, Databases, OAuthProvider, Permission, Query,Role,Storage,ID } from "react-native-appwrite"
import { makeRedirectUri } from 'expo-auth-session'
import { Clothe, CLOTHES } from "@/constants/clothes";
import { ImagePickerAsset } from "expo-image-picker";
import * as FileSystem from 'expo-file-system';
import { OutfitCollection, Outfit, OutfitItem } from "@/constants/outfit";
import { config, localConfig } from "./config";
import { readLocalData, writeLocalData,ensureDirectories } from "./LocalStoreManager";
export const client = new Client();

client.setEndpoint(config.endpoint!)
.setProject(config.projectid!).setPlatform(config.platform!);


export const avatar = new Avatars(client);


export const storage = new Storage(client);
export const databases = new Databases(client)

//create a clothes document
export async function createClothe(clothe: Clothe,userID:string,imageFile:ImagePickerAsset,onLocalSave?: () => void){
    try {
        const uid = ID.unique();
        //save the image to local
        const fileExtension = imageFile.uri.split('.').pop()
        const localImageUri = `${localConfig.localClotheImagesDirectiry}${uid}.${fileExtension}`;
        try{ 
                await FileSystem.copyAsync({
                from: imageFile.uri,
                to: localImageUri
                    });
            }catch(error){
            console.error('fail to save image to local',error)
        }
        //update file path
        imageFile.uri = localImageUri;
        imageFile.fileName = `${uid}.${fileExtension}`
        clothe.localImageURL = localImageUri;
        clothe.$id = uid;
        //save data to local storage
        const existingData = await readLocalData<Clothe>(localConfig.localClotheJsonUri);
        await writeLocalData(localConfig.localClotheJsonUri, [...existingData, clothe]);
        //close the modal when saved 
        onLocalSave?.();
        //upload to appwrite
        clothe.$id = null
        const uploadImageResponse = await uploadImage(imageFile,uid)
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

export async function uploadImage(file:ImagePickerAsset,uid:string){
   try{
    const response = await storage.createFile(
        config.clothesImgStorageId!,
        uid, // Auto-generate ID
        {
            
            name: file.fileName!,
            type: file.type!,
            size: file.fileSize!,
            uri: file.uri},
            
        
    );
    console.log(response,'from uploadImage');

    return response
   
   } catch(error){
       console.error(error)
       return null
   }
}
const account = new Account(client);

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
    console.log('reading clothes from online storage (getAllClothes) ');
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
            await writeLocalData(localConfig.localClotheJsonUri, [...localClothes, ...clothes]);
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
            await writeLocalData(localConfig.localClotheJsonUri, [...localClothes,...clothes]);
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



//login and logout functions
export async function login (){
    try{
         // Create a deep link that works across Expo environments
        // Ensure localhost is used for the hostname to validation error for success/failure URLs
        const deepLink = new URL(makeRedirectUri({preferLocalhost: true}));
        if (!deepLink.hostname) {
            deepLink.hostname = 'localhost';
        }
        
        // console.log(deepLink)
        const scheme = `${deepLink.protocol}//`;
        const loginUrl = await account.createOAuth2Token(
            OAuthProvider.Google,
            `${deepLink}`,//success
            `${deepLink}`,//failure
        );
        if(!loginUrl) throw new Error('failed to create response from loginURL')
            
           
        const browserResult = await openAuthSessionAsync(loginUrl.toString(), scheme);
        console.log(browserResult)
        if (browserResult.type !== 'success') throw new Error('Failed to login (Google)');
        //extract credentails from the OAUTH redirect URL
        const url =new URL(browserResult.url)
        const secret = url.searchParams.get('secret')?.toString()
        const userID = url.searchParams.get('userId')?.toString()
        if(!secret || !userID) throw new Error('failed to find secret/userID')
            const session  = await account.createSession(userID,secret)
        if(!session) throw new Error('fail to create session')
        
        return true
    }catch (error){
        console.error(error);
        return false
    }
}

export async function logout(){
    try{
        await account.deleteSession('current')
        return true
    }catch(error){
        console.error(error);
        return false
    }
}

export async function getUser(){
    try{

        try {
            await ensureDirectories();
        } catch (error) {
            console.error('Error checking/creating directory:', error);
        }


        const response = await account.get()
        if(response.$id){
            const userAvatar = avatar.getInitials(response.name)

            return {
                ...response,
                avatar: userAvatar.toString(),
            }
        }
        // console.log(response)
        return response
    }catch(err){
      
     
       console.log(err);
     return null;
    }
}
