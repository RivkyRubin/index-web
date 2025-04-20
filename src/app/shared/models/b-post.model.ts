import { OpeningHour } from "./opening-hour.model";

export interface BPost{
    id:number,
    name:string,
    value:string,
    categories?:number[],
    slogan?:string,
    description?:string,
    address?:string,
    hours?:OpeningHour[],
    email?:string,
    phone?:string,
    phone2?:string,
    whatsapp?:string,
    website?:string,
    showInHomePage?:boolean,
    hasLogo?:boolean,
    hasImage?:boolean,
    hasBigImage?:boolean,
    hideBusiness?:boolean
}