import { createURL, getLinkingURL } from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";
import { Platform } from 'react-native';
import { Account, Avatars, Client, Databases, OAuthProvider, Permission, Query,Role,Storage,ID, Functions, ExecutionMethod } from "react-native-appwrite"
import { makeRedirectUri } from 'expo-auth-session'
import { Clothe, CLOTHES } from "@/constants/clothes";
import { ImagePickerAsset } from "expo-image-picker";
import * as FileSystem from 'expo-file-system';
import { OutfitCollection, Outfit, OutfitItem } from "@/constants/outfit";
import { config, localConfig } from "./config";
import { ensureFiles,ensureDirectories } from "./LocalStoreManager";
export const client = new Client();

client.setEndpoint(config.endpoint!)
.setProject(config.projectid!).setPlatform(config.platform!);


export const avatar = new Avatars(client);


export const storage = new Storage(client);
export const databases = new Databases(client)
export const account = new Account(client);
//upload image to bucket
export async function uploadImage(file:ImagePickerAsset,uid:string,bucketId:string){
   try{
    const response = await storage.createFile(
        bucketId,
        uid, // Auto-generate ID
        {
            
            name: file.fileName??uid,
            type: file.type??'image',
            size: file.fileSize??0,
            uri: file.uri},
            
        
    );

    return response
   
   } catch(error){
       console.error(error)
       return null
   }
}

//delete image from bucket
export async function deleteImage(bucketId:string, fileId:string){
    try{
        const response = await storage.deleteFile(bucketId,fileId)
        return response
    }catch(error){
        console.error(error)
        return null
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
        
        const scheme = `${deepLink.protocol}//`;
        const loginUrl = await account.createOAuth2Token(
            OAuthProvider.Google,
            `${deepLink}`,//success
            `${deepLink}`,//failure
        );
        if(!loginUrl) throw new Error('failed to create response from loginURL')
            
           
        const browserResult = await openAuthSessionAsync(loginUrl.toString(), scheme);
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
            await ensureFiles();
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

//appwrite functions for clothes
export async function CallAppWriteFunction(functionId:string, body?:string, async?:boolean, path?:string, method?:ExecutionMethod, headers?:any){
    const functionCLient = client.setPlatform('')
    const functions = new Functions(functionCLient);
    try{
        console.log('Calling function:', functionId);
        const response = await functions.createExecution(
            functionId,
            body,
            async,
            path,
            method,
            headers
        )
        return response
    }catch(error){
        console.error(error)
        return null
    }
}
