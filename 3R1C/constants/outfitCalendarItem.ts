export interface OutfitCalendarItem {
    $id: string;
    userid: string;
    outfitids: string[];
    date: Date;
    remark?: string;
    createdAt?: Date;
}