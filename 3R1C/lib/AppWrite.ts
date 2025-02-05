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
    clothesImgStorageId: process.env.EXPO_PUBLIC_APPWRITE_CLOTHES_STORAGE_ID
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
        const fileUri = `${FileSystem.documentDirectory}clotheData/clothe.json`;
        const uid = ID.unique();

        clothe.$id = uid;
        try {
            const existingContent = await FileSystem.readAsStringAsync(fileUri);
            existingData = JSON.parse(existingContent);
        } catch (error) {
            // File doesn't exist yet or is empty, start with empty array
            existingData = [];

        }

        //save the image to local
        const localImageUri = `${FileSystem.documentDirectory}clotheData/Images/${clothe.$id}.jpg`;
       try{ await FileSystem.copyAsync({
        from: imageFile.uri,
        to: localImageUri
    });}catch(error){
        console.error(error)
    }
       
        clothe.image = localImageUri;
   
        existingData.push(clothe);

        const jsonData = JSON.stringify(existingData);

        // console.log(jsonData);
        
        await FileSystem.writeAsStringAsync(fileUri, jsonData, {
            encoding: FileSystem.EncodingType.UTF8
        });

        const uploadImageResponse = await uploadImage(imageFile!)
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
        // if (Platform.OS === 'web') {
        //     window.location.href = loginUrl.toString();
        //     return new Promise((resolve, reject) => {
        //         window.addEventListener('message', async (event) => {
        //             if (event.origin !== window.location.origin) return;
        //             const { url } = event.data;
        //             if (url) {
        //                 try {
        //                     const urlObj = new URL(url);
        //                     const secret = urlObj.searchParams.get('secret')?.toString();
        //                     const userID = urlObj.searchParams.get('userId')?.toString();

        //                     if (!secret || !userID) throw new Error('Failed to find secret/userID');
        //                     const session = await account.createSession(userID, secret);
        //                     if (!session) throw new Error('Failed to create session');
        //                     resolve(true);
        //                 } catch (error) {
        //                     console.error(error);
        //                     reject(false);
        //                 }
        //             }
        //         });
        //     });
        // } else {
        //     const browserResult = await openAuthSessionAsync(loginUrl.toString(), scheme);
        //     if (browserResult.type !== 'success') throw new Error('Failed to login (Google)');

        //     // Extract credentials from the OAuth redirect URL
        //     const url = new URL(browserResult.url);
        //     const secret = url.searchParams.get('secret')?.toString();
        //     const userID = url.searchParams.get('userId')?.toString();

        //     if (!secret || !userID) throw new Error('Failed to find secret/userID');
        //     const session = await account.createSession(userID, secret);
        //     if (!session) throw new Error('Failed to create session');
        //     return true;
        // }
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
            const dirInfo = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}clotheData`);
            if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}clotheData`, { intermediates: true });
            }

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

export async function getAllClothes(): Promise<CLOTHES> {
    try {
        const result = await databases.listDocuments(
            config.databaseId!,
            config.clothesCollectionId!,
            [Query.orderAsc('$createdAt')]
        )
        return result.documents.map(doc => ({
            $id: doc.$id,
            userid: doc.userid,
            title: doc.title,
            price: doc.price,
            image: doc.image,
            remark: doc.remark,
            createdAt: new Date(doc.$createdAt),
            category: doc.category,
            maincategory: doc.maincategory,
            subcategories: doc.subcategories,
            colors: doc.colors,
            purchasedate: doc.purchasedate
        })) as CLOTHES
    } catch (error) {
        console.log(error)
        return []
    }
}

export async function getClothesWithFilter({query,mainCategoryfilter,limit}:{query?:string,mainCategoryfilter:string,limit?:number}): Promise<CLOTHES> {
    try {

        // Try to read from local storage first
        let existingData = [];
        const fileUri = `${FileSystem.documentDirectory}clotheData/clothe.json`;

        try {
            const existingContent = await FileSystem.readAsStringAsync(fileUri);
            existingData = JSON.parse(existingContent);
        } catch (error) {
            // If local storage read fails,read from Appwrite
            const buildQuery = [Query.orderDesc('$createdAt')]
            if(mainCategoryfilter && mainCategoryfilter !=='All') buildQuery.push(Query.equal('maincategory',mainCategoryfilter))
            const result = await databases.listDocuments(
                config.databaseId!,
                config.clothesCollectionId!,
                buildQuery
            )
            return result.documents.map(doc => ({
                $id: doc.$id,
                userid: doc.userid,
                title: doc.title,
                price: doc.price,
                image: doc.image,
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
    const fileUri = `${FileSystem.documentDirectory}clotheData/clothe.json`;

    try {
        const existingContent = await FileSystem.readAsStringAsync(fileUri);
        existingData = JSON.parse(existingContent);
        return existingData.find((clothe: Clothe) => clothe.$id === id);
    } catch (error) {
    try {

      const result = await databases.getDocument(
        config.databaseId!,
        config.clothesCollectionId!,
        id,
      );
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
}
  }

  export async function deleteClotheById({ id }: { id: string },imagefileid:string) {
    try {
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