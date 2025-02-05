import { Category } from './category';
import { ImageSource } from 'expo-image';
import { ImagePickerAsset } from 'expo-image-picker';
export interface Clothe{
    $id?: string| null;
    userid: string;
    title: string;
    price: number;
    imageFile?: ImagePickerAsset;
    imagefileid?: string; // this is the id of the image file in the appwrite storage
    image: string; // this is the local url of the image file
    remark?: string;
    maincategory: Category;
    subcategories?: Category[];
    colors?: string;
    purchasedate?: Date;
    createdAt?: Date;
}

export type CLOTHES = Clothe[];