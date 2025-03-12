import { BPost } from "./b-post.model";

export interface MagazineItem{
bId:number,
imageName:string,
size: 'Full'|'HalfHeight'|'HalfWidth'|'Quarter',
b?:BPost
}

export interface MagazinePage {
    items: MagazineItem[];
}