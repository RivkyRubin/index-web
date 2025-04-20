export interface Category {
    id: number;
    name: string;
    value:string;
    parentId?: number | null;
    size?:number;//like 1,2,3,4
    usedCategory?:boolean;
    details?:string
  }
  
  export interface PositionedCategory extends Category {
    left: number;
    top: number;
  }