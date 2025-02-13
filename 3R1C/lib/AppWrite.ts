import { createURL, getLinkingURL } from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";
import { Platform } from 'react-native';
import { Account, Avatars, Client, Databases, OAuthProvider, Permission, Query,Role,Storage,ID } from "react-native-appwrite"
import { makeRedirectUri } from 'expo-auth-session'
import { Clothe, CLOTHES } from "@/constants/clothes";
import { ImagePickerAsset } from "expo-image-picker";
import * as FileSystem from 'expo-file-system';
export const config = {
    platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM,
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOIINT,
    projectid: process.env.EXPO_PUBLIC_APPWRITE_ID,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    clothesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_CLOTHES_COLLECTION_ID,
    clothesImgStorageId: process.env.EXPO_PUBLIC_APPWRITE_CLOTHES_STORAGE_ID,
    localClotheJsonUri :`${FileSystem.documentDirectory}clotheData/clothe.json`,
    localClotheImagesDirectiry :`${FileSystem.documentDirectory}clotheData/Images/`,

}

export const client = new Client();

client.setEndpoint(config.endpoint!)
.setProject(config.projectid!).setPlatform(config.platform!);


export const avatar = new Avatars(client);


export const storage = new Storage(client);
export const databases = new Databases(client)

export async function createClothe(clothe: Clothe,userID:string,imageFile:ImagePickerAsset){
    try {
        let existingData = [];
        const fileUri = config.localClotheJsonUri;
        const uid = ID.unique();

        try {
            const existingContent = await FileSystem.readAsStringAsync(fileUri);
            existingData = JSON.parse(existingContent);
        } catch (error) {
            // File doesn't exist yet or is empty, start with empty array
            existingData = [];

        }

        //save the image to local
        const fileExtension = imageFile.uri.split('.').pop()
        const localImageUri = `${config.localClotheImagesDirectiry}${uid}.${fileExtension}`;

       try{ 
            await FileSystem.copyAsync({
            from: imageFile.uri,
            to: localImageUri
                });
        }catch(error){
        console.error(error)
    }
       imageFile.uri = localImageUri;
       imageFile.fileName = `${uid}.${fileExtension}`
        clothe.image = localImageUri;
        clothe.$id = uid;
        existingData.push(clothe);
        const jsonData = JSON.stringify(existingData);

        // console.log(jsonData);
        
        await FileSystem.writeAsStringAsync(fileUri, jsonData, {
            encoding: FileSystem.EncodingType.UTF8
        });
        clothe.$id = null
        const uploadImageResponse = await uploadImage(imageFile)
        clothe.imagefileid = uploadImageResponse!.$id;
        if(!uploadImageResponse) throw new Error('failed to upload image')
        const response = await databases.createDocument(
            config.databaseId!,
            config.clothesCollectionId!,
            uid, // Auto-generate ID
            clothe,
            [Permission.read(Role.user(userID)), Permission.delete(Role.user(userID)), Permission.update(Role.user(userID))]
        );
        return response;
    } catch (error) {
        console.error(error);
        //delete the uploaded image if the clothe creation fails
        
        return null;
    }
}

export async function uploadImage(file:ImagePickerAsset){
   try{
    const response = await storage.createFile(
        config.clothesImgStorageId!,
        ID.unique(), // Auto-generate ID
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


export async function getAllClothes(): Promise<CLOTHES> {
   
   // Try to read from local storage first
   let existingData = [];
   const fileUri = config.localClotheJsonUri;
   try {
    const existingContent = await FileSystem.readAsStringAsync(fileUri);
    existingData = JSON.parse(existingContent);
    console.log('search from local storage (getAllClothes) ')

    }   
    catch (error) {
        //fail to read from local storage, read from Appwrite
        try {
            const result = await databases.listDocuments(
                config.databaseId!,
                config.clothesCollectionId!,
                [Query.orderAsc('$createdAt')]
            )
            console.log('search from online storage (getAllClothes) ')
            //store the data in the local storage
            const jsonData = JSON.stringify(result.documents);
            await FileSystem.writeAsStringAsync(fileUri, jsonData, {
                encoding: FileSystem.EncodingType.UTF8
            });

            return result.documents.map(doc => ({
                $id: doc.$id,
                userid: doc.userid,
                title: doc.title,
                price: doc.price,
                image: doc.image,
                imagefileid: doc.imagefileid,
                remark: doc.remark,
                createdAt: new Date(doc.$createdAt),
                category: doc.category,
                maincategory: doc.maincategory,
                subcategories: doc.subcategories,
                colors: doc.colors,
                purchasedate: doc.purchasedate
            })) as CLOTHES
        }
        catch(error){
            console.log(error)
        }
    
}
    if (existingData.length > 0) {
        return existingData;
    }
        return []
    
}

export async function getClothesWithFilter({query,mainCategoryfilter,limit}:{query?:string,mainCategoryfilter:string,limit?:number}): Promise<CLOTHES> {
    try {

        // Try to read from local storage first
        let existingData = [];
        const fileUri = config.localClotheJsonUri;

        try {
            const existingContent = await FileSystem.readAsStringAsync(fileUri);
            existingData = JSON.parse(existingContent);
            if (mainCategoryfilter && mainCategoryfilter !== 'All') {
                existingData = existingData.filter((item: Clothe) => item.maincategory === mainCategoryfilter);
            }
            console.log('search from local storage (getClothesWithFilter) ',mainCategoryfilter)

        } catch (error) {
            // If local storage read fails,read from Appwrite
            const buildQuery = [Query.orderDesc('$createdAt')]
            console.log('search from online storage (getClothesWithFilter) ',mainCategoryfilter)

            if(mainCategoryfilter && mainCategoryfilter !=='All') buildQuery.push(Query.equal('maincategory',mainCategoryfilter))
            const result = await databases.listDocuments(
                config.databaseId!,
                config.clothesCollectionId!,
                buildQuery
            )
               //store the data in the local storage
               const jsonData = JSON.stringify(result.documents.map(doc => ({
                $id: doc.$id,
                userid: doc.userid,
                title: doc.title,
                price: doc.price,
                image: doc.image,
                imagefileid: doc.imagefileid,
                remark: doc.remark,
                createdAt: new Date(doc.$createdAt),
                category: doc.category,
                maincategory: doc.maincategory,
                subcategories: doc.subcategories,
                colors: doc.colors,
                purchasedate: doc.purchasedate
            })))
               await FileSystem.writeAsStringAsync(fileUri, jsonData, {
                   encoding: FileSystem.EncodingType.UTF8
               });
            return result.documents.map(doc => ({
                $id: doc.$id,
                userid: doc.userid,
                title: doc.title,
                price: doc.price,
                image: doc.image,
                imagefileid: doc.imagefileid,
                remark: doc.remark,
                createdAt: new Date(doc.$createdAt),
                category: doc.category,
                maincategory: doc.maincategory,
                subcategories: doc.subcategories,
                colors: doc.colors,
                purchasedate: doc.purchasedate
            })) as CLOTHES
        }

        if (existingData.length > 0) {
            return existingData;
        }
        return [];


    } catch (error) {
        console.log(error)
        return []
    }
}

export async function getClotheById({ id }: { id: string }) {

    let existingData = [];
    const fileUri = config.localClotheJsonUri;

    try {
        //search for the clothe in the local storage
        const existingContent = await FileSystem.readAsStringAsync(fileUri);
        existingData = JSON.parse(existingContent);
        console.log('search from local storage (getClotheById) ',id)
        return existingData.find((clothe: Clothe) => clothe.$id === id);

    } catch (error) {
    try {
        console.log('search from online storage (getClotheById) ',id)

      const result = await databases.getDocument(
        config.databaseId!,
        config.clothesCollectionId!,
        id,
      );
    return {
        $id: result.$id,
        userid: result.userid,
        title: result.title,
        price: result.price,
        image: result.image,
        imagefileid: result.imagefileid,
        remark: result.remark,
        createdAt: new Date(result.$createdAt),
        category: result.category,
        maincategory: result.maincategory,
        subcategories: result.subcategories,
        colors: result.colors,
        purchasedate: result.purchasedate
    } as Clothe
    } catch (error) {
      console.error(error);
      return null;
    }
}
  }

  export async function deleteClotheById({ id }: { id: string },imagefileid:string) {
    try {
        // First, try to delete from local storage
        let existingData = [];
        const fileUri = config.localClotheJsonUri;
        try {
            const existingContent = await FileSystem.readAsStringAsync(fileUri);
            existingData = JSON.parse(existingContent);
            existingData = existingData.filter((clothe: Clothe) => clothe.$id !== id);
            await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(existingData));
            
            // Also delete the local image file
            const imageToDelete = existingData.find((clothe: Clothe) => clothe.$id === id)?.image;
            if (imageToDelete) {
                await FileSystem.deleteAsync(imageToDelete, { idempotent: true });
            }
        } catch (error) {
            console.error('Error updating local storage:', error);
        }
        const result2 = await deleteImageById({fileId:imagefileid});

      const result = await databases.deleteDocument(
        config.databaseId!,
        config.clothesCollectionId!,
        id,
      );
    return result && result2;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  export async function deleteImageById({ fileId }: { fileId: string }) {
    try {
      const result = await storage.deleteFile(
        config.clothesImgStorageId!,
        fileId,
      );
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }



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
            //create a directory to store the clothe data
            const dirInfo = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}clotheData`);
            if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}clotheData`, { intermediates: true });
            }
            //create a directory to store the clothe images
            const dirInfo2 = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}clotheData/Images`);
            if (!dirInfo2.exists) {
            await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}clotheData/Images`, { intermediates: true });
            }
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