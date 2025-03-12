import { Component, inject, input, resource } from '@angular/core';
import { FlipbookComponent } from '../../shared/ui/flipbook/flipbook.component';
import { MagazineItem } from '../../shared/models/magazine-item.model';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'app-magazine',
  imports: [FlipbookComponent],
  templateUrl: './magazine.component.html',
  styleUrl: './magazine.component.scss'
})
export class MagazineComponent {
  dataService=inject(DataService);
items = resource<MagazineItem[], string>({
 // request: () => this.query(),
  loader: async ({ request, abortSignal }) => {
    //const response = await fetch(`${API_URL}/search?q=${request}`, {
    const response = await fetch(`data/magazine-items.json`, {
        signal: abortSignal,
    });

    if (!response.ok) throw new Error("שגיאה בטעינת קטגוריות!");
    //return (await response.json());
    const data: MagazineItem[] = await response.json();

    return data.map(item => ({
      ...item,
      b: this.dataService.getBById(item.bId)(), // Call the signal to extract value
    }));



  },
});}
