import { Category } from './category';
import { ImageSource } from 'expo-image';
import { ImagePickerAsset } from 'expo-image-picker';
export interface Clothe{
    $id?: string| null; //remote image $id will be the same as $id
    userid: string;
    title: string;
    price: number;
    localImageURL: string; // this is the local url of the image file
    remark?: string;
    maincategory: Category;
    subcategories?: string[];
    brand?: string;
    maincolor: string;
    subcolors?: string[];
    purchasedate?: Date;
    createdAt?: Date;
}

export type CLOTHES = Clothe[];