import { Clothe } from "./clothes";

export interface OutfitCollection {
    $id?: string | null;
    userid: string;
    title: string;
    description?: string;
    previewImageURL?: string;
    outfitIds?: string[]; // related Outfits
    dayToWear?: Date[];
    createdAt?: Date;
}
export interface Outfit {
    $id?: string | null;
    userid: string;
    title: string;
    previewImageURL?: string;
    remark?: string;
    outfitCollectionIds?: string[];
    items: OutfitItem[];
    createdAt?: Date;
}
export interface OutfitItem{
    clotheID: string;
    position: {
        x: number;
        y: number;
        scale: number;
        rotation: number;
    }
}

//Outfit will have many OutfitItems, each OutfitItem will have a clotheID and a position
//OutfitCollection will have many Outfits
//calendar view will show OutfitCollections
