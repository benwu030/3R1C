import { createURL, getLinkingURL } from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";
import { Account, Avatars, Client, Databases, OAuthProvider, Query } from "react-native-appwrite"
import { makeRedirectUri } from 'expo-auth-session'
import { CLOTHES } from "@/constants/clothes";
export const config = {
    platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM,
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOIINT,
    projectid: process.env.EXPO_PUBLIC_APPWRITE_ID,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    clothesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_CLOTHES_COLLECTION_ID,
}

export const client = new Client();

client.setEndpoint(config.endpoint!)
.setProject(config.projectid!).setPlatform(config.platform!);


export const avatar = new Avatars(client);
const account = new Account(client);




export const databases = new Databases(client)
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
            

        const browserResult = await openAuthSessionAsync(loginUrl.toString(),scheme) 
        if (browserResult.type !== 'success' ) throw new Error('failed to login(google)')

        //extract credentails from the OAUTH redirect URL
        const url = new URL(browserResult.url)
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
        const response = await account.get()
        if(response.$id){
            const userAvatar = avatar.getInitials(response.name)

            return {
                ...response,
                avatar: userAvatar.toString(),
            }
        }
        return response
    }catch(err){
        console.log(err)
        return null
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
            title: doc.title,
            price: doc.price,
            image: doc.image,
            remark: doc.remark,
            createdAt: new Date(doc.$createdAt),
            category: doc.category,
            mainCategory: doc.mainCategory,
            subCategories: doc.subCategories,
            colors: doc.colors,
            purchaseDate: doc.purchaseDate
        })) as CLOTHES
    } catch (error) {
        console.log(error)
        return []
    }
}

export async function getClothesWithFilter({query,filter,limit}:{query?:string,filter?:string,limit?:number}): Promise<CLOTHES> {
    try {
        const buildQuery = [Query.orderDesc('$createdAt')]
        if(filter && filter !=='All') buildQuery.push(Query.equal('maincategory',filter))
        const result = await databases.listDocuments(
            config.databaseId!,
            config.clothesCollectionId!,
            buildQuery
        )
        return result.documents.map(doc => ({
            $id: doc.$id,
            title: doc.title,
            price: doc.price,
            image: doc.image,
            remark: doc.remark,
            createdAt: new Date(doc.$createdAt),
            category: doc.category,
            mainCategory: doc.mainCategory,
            subCategories: doc.subCategories,
            colors: doc.colors,
            purchaseDate: doc.purchaseDate
        })) as CLOTHES
    } catch (error) {
        console.log(error)
        return []
    }
}
// export async function getProperties({filter,query,limit}:{filter:string,query:string,limit?:number}){
//     try {
//         const buildQuery = [Query.orderDesc('$createdAt')]
//         if(filter && filter !=='All') buildQuery.push(Query.equal('type',filter))
//         if(query) buildQuery.push(Query.or([Query.search('name',query),Query.search('address',query),Query.search('type',query)]))
//         if(limit)buildQuery.push(Query.limit(limit))

//             const result = await databases.listDocuments(
//                 config.databaseId!,
//                 config.propertiesCollectionId!,
//                 buildQuery
//             )
//             return result.documents
//     } catch (error) {
//         console.log(error)
//         return []
//     }
// }

// export async function getPropertyById({ id }: { id: string }) {
//     try {
//       const result = await databases.getDocument(
//         config.databaseId!,
//         config.propertiesCollectionId!,
//         id,
//       );
//       return result;
//     } catch (error) {
//       console.error(error);
//       return null;
//     }
//   }