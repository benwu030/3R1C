import { Category } from './category';
import { ImageSource } from 'expo-image';
export interface Clothe{
    $id: string;
    title: string;
    price: number;
    image: ImageSource;
    remark: string;
    mainCategory: Category;
    subCategories: Category[];
    colors: string;
    purchaseDate: Date;
    createdAt: Date;
}

export type CLOTHES = Clothe[];