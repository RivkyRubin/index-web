import { Component, resource, signal } from '@angular/core';
import { NgStyle } from '@angular/common';
import { GalleryItemComponent } from '../../shared/ui/gallery-item/gallery-item.component';
import { BPostComponent } from '../../shared/ui/b-post/b-post.component';
import { BPost } from '../../shared/models/b-post.model';
import { GalleryItem } from '../../shared/models/gallery-item.model';
import { Category } from '../../shared/models/category.model';
import { CategoriesBoxComponent } from '../../shared/ui/categories-box/categories-box.component';

@Component({
  selector: 'app-home',
  imports: [BPostComponent,GalleryItemComponent,CategoriesBoxComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
bs=signal<BPost[]>(bs);
galleryItems=signal<GalleryItem[]>(galleryItems);
query = signal<string>("");

categories = resource<Category[], string>({
  request: () => this.query(),
  loader: async ({ request, abortSignal }) => {
    //const response = await fetch(`${API_URL}/search?q=${request}`, {
    const response = await fetch(`data/categories.json`, {
        signal: abortSignal,
    });

    if (!response.ok) throw new Error("שגיאה בטעינת קטגוריות!");
    return (await response.json());
  },
});
navigateToB()
{
  window.open('https://b.rama-d.co.il', '_blank');

}

search(event: Event) {
  const { value } = event.target as HTMLInputElement;
  this.query.set(value);
}
}



const bs:BPost[] =[
  {
    id:1,
    name:'Melange',
    description:'בגדי ילדים באיכות מעולה',
    categories:['בגדי ילדים'],
    logoSrc:'https://www.kidichic.co.il/wp-content/uploads/2023/09/MLNG-logo_horizontally-copy.pdf-1-1-01-01.png',
    imgSrc:'https://scontent.ftlv19-1.fna.fbcdn.net/v/t1.6435-9/151530774_3527897410655304_191568329395846382_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=SHWVeT3frNoQ7kNvgHi5XDu&_nc_oc=AdjRup2XVTBktB-L7q6y-M1d54H-FMuuEo-11NZzULFYBkgBBNMmPNNEgoVbrH1EfWL-fkyoKIWd3KxcKuZLwna6&_nc_zt=23&_nc_ht=scontent.ftlv19-1.fna&_nc_gid=AT97-prSnnwA5NKpnQK5toa&oh=00_AYDQk9pacv4Wq-Gntmn_Ncw2Vs3cvf5ghSj5yywCGCxj9w&oe=67D94CBA'
  },
  {
    id:2,
    name:'פאפיה',
    description:'נעלי ילדים לכל הגילאים',
    categories:['נעלי ילדים'],
    logoSrc:'https://www.clicko.co.il/wp-content/uploads/2023/04/%D7%A6%D7%95%D7%A8-%D7%A7%D7%A9%D7%A8-%D7%A9%D7%99%D7%A8%D7%95%D7%AA-%D7%9C%D7%A7%D7%95%D7%97%D7%95%D7%AA-%D7%A4%D7%A4%D7%90%D7%99%D7%94-768x768.jpg',
    imgSrc:'https://www.babymania-il.com/cdn/shop/files/S7d58ccbe50ff439fbbb4fe41794712c23_800x.webp?v=1723983893'
  },
  {
    id:3,
    name:'Melange',
    description:'בגדי ילדים באיכות מעולה',
    categories:['בגדי ילדים'],
    logoSrc:'https://www.kidichic.co.il/wp-content/uploads/2023/09/MLNG-logo_horizontally-copy.pdf-1-1-01-01.png',
    imgSrc:'https://chanystern.com/wp-content/uploads/2020/02/D38A9827-1.jpg'
  },
  {
    id:4,
    name:'פאפיה',
    description:'נעלי ילדים לכל הגילאים',
    categories:['נעלי ילדים'],
    logoSrc:'https://www.clicko.co.il/wp-content/uploads/2023/04/%D7%A6%D7%95%D7%A8-%D7%A7%D7%A9%D7%A8-%D7%A9%D7%99%D7%A8%D7%95%D7%AA-%D7%9C%D7%A7%D7%95%D7%97%D7%95%D7%AA-%D7%A4%D7%A4%D7%90%D7%99%D7%94-768x768.jpg',
    imgSrc:'https://www.babymania-il.com/cdn/shop/files/S7d58ccbe50ff439fbbb4fe41794712c23_800x.webp?v=1723983893'
  },
  {
    id:5,
    name:'Melange',
    description:'בגדי ילדים באיכות מעולה',
    categories:['בגדי ילדים'],
    logoSrc:'https://www.kidichic.co.il/wp-content/uploads/2023/09/MLNG-logo_horizontally-copy.pdf-1-1-01-01.png',
    imgSrc:'https://scontent.ftlv19-1.fna.fbcdn.net/v/t1.6435-9/151530774_3527897410655304_191568329395846382_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=SHWVeT3frNoQ7kNvgHi5XDu&_nc_oc=AdjRup2XVTBktB-L7q6y-M1d54H-FMuuEo-11NZzULFYBkgBBNMmPNNEgoVbrH1EfWL-fkyoKIWd3KxcKuZLwna6&_nc_zt=23&_nc_ht=scontent.ftlv19-1.fna&_nc_gid=AT97-prSnnwA5NKpnQK5toa&oh=00_AYDQk9pacv4Wq-Gntmn_Ncw2Vs3cvf5ghSj5yywCGCxj9w&oe=67D94CBA'
  },
  {
    id:6,
    name:'פאפיה',
    description:'נעלי ילדים לכל הגילאים',
    categories:['נעלי ילדים'],
    logoSrc:'https://www.clicko.co.il/wp-content/uploads/2023/04/%D7%A6%D7%95%D7%A8-%D7%A7%D7%A9%D7%A8-%D7%A9%D7%99%D7%A8%D7%95%D7%AA-%D7%9C%D7%A7%D7%95%D7%97%D7%95%D7%AA-%D7%A4%D7%A4%D7%90%D7%99%D7%94-768x768.jpg',
    imgSrc:'https://www.babymania-il.com/cdn/shop/files/S7d58ccbe50ff439fbbb4fe41794712c23_800x.webp?v=1723983893'
  }
];

const galleryItems:GalleryItem[] =[
  {
    name:'Melange',
    imgSrc:'https://scontent.ftlv19-1.fna.fbcdn.net/v/t1.6435-9/151530774_3527897410655304_191568329395846382_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=SHWVeT3frNoQ7kNvgHi5XDu&_nc_oc=AdjRup2XVTBktB-L7q6y-M1d54H-FMuuEo-11NZzULFYBkgBBNMmPNNEgoVbrH1EfWL-fkyoKIWd3KxcKuZLwna6&_nc_zt=23&_nc_ht=scontent.ftlv19-1.fna&_nc_gid=AT97-prSnnwA5NKpnQK5toa&oh=00_AYDQk9pacv4Wq-Gntmn_Ncw2Vs3cvf5ghSj5yywCGCxj9w&oe=67D94CBA'
  },
  {
    name:'פאפיה',
    imgSrc:'https://www.babymania-il.com/cdn/shop/files/S7d58ccbe50ff439fbbb4fe41794712c23_800x.webp?v=1723983893'
  },
  {
    name:'Melange',
    imgSrc:'https://chanystern.com/wp-content/uploads/2020/02/D38A9827-1.jpg'
  },
  {
    name:'פאפיה',
    imgSrc:'https://www.babymania-il.com/cdn/shop/files/S7d58ccbe50ff439fbbb4fe41794712c23_800x.webp?v=1723983893'
  },
  {
    name:'Melange',
    imgSrc:'https://scontent.ftlv19-1.fna.fbcdn.net/v/t1.6435-9/151530774_3527897410655304_191568329395846382_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=SHWVeT3frNoQ7kNvgHi5XDu&_nc_oc=AdjRup2XVTBktB-L7q6y-M1d54H-FMuuEo-11NZzULFYBkgBBNMmPNNEgoVbrH1EfWL-fkyoKIWd3KxcKuZLwna6&_nc_zt=23&_nc_ht=scontent.ftlv19-1.fna&_nc_gid=AT97-prSnnwA5NKpnQK5toa&oh=00_AYDQk9pacv4Wq-Gntmn_Ncw2Vs3cvf5ghSj5yywCGCxj9w&oe=67D94CBA'
  },
  {
    name:'פאפיה',
    imgSrc:'https://www.babymania-il.com/cdn/shop/files/S7d58ccbe50ff439fbbb4fe41794712c23_800x.webp?v=1723983893'
  },
  {
    name:'Melange',
    imgSrc:'https://scontent.ftlv19-1.fna.fbcdn.net/v/t1.6435-9/151530774_3527897410655304_191568329395846382_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=SHWVeT3frNoQ7kNvgHi5XDu&_nc_oc=AdjRup2XVTBktB-L7q6y-M1d54H-FMuuEo-11NZzULFYBkgBBNMmPNNEgoVbrH1EfWL-fkyoKIWd3KxcKuZLwna6&_nc_zt=23&_nc_ht=scontent.ftlv19-1.fna&_nc_gid=AT97-prSnnwA5NKpnQK5toa&oh=00_AYDQk9pacv4Wq-Gntmn_Ncw2Vs3cvf5ghSj5yywCGCxj9w&oe=67D94CBA'
  },
  {
    name:'פאפיה',
    imgSrc:'https://www.babymania-il.com/cdn/shop/files/S7d58ccbe50ff439fbbb4fe41794712c23_800x.webp?v=1723983893'
  },
  
];
