import { Clothe } from "./clothes";

export interface Outfit {
    $id?: string | null;
    userid: string;
    title: string;
    previewImage: string;
    remark?: string;
    category?: string;
    items: OutfitItem[];
    createdAt?: Date;
}
export interface OutfitItem{
    item: Clothe
    position: {
        x: number;
        y: number;
        scale: number;
        rotation: number;
    }
}