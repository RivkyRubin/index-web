export interface BPost{
    id:number,
    name:string,
    value:string,
    imgSrc:string,
    logoSrc:string,
    categoryId:number,
    categories:string[],
    description?:string,
}