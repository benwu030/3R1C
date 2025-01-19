import { Category } from './category';
import { ImageSource } from 'expo-image';
import { ImagePickerAsset } from 'expo-image-picker';
export interface Clothe{
    $id?: string| null;
    userid: string;
    title: string;
    price: number;
    imageFile?: ImagePickerAsset;
    image: string;
    remark: string;
    maincategory: Category;
    subcategories: Category[];
    colors: string;
    purchasedate: Date;
    createdAt?: Date;
}

export type CLOTHES = Clothe[];