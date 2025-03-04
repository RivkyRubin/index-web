import { Component, input } from '@angular/core';
import { NgStyle } from '@angular/common';
import { GalleryItem } from '../../models/gallery-item.model';

@Component({
  selector: 'app-gallery-item',
  imports: [NgStyle],
  templateUrl: './gallery-item.component.html',
  styleUrl: './gallery-item.component.scss'
})
export class GalleryItemComponent {
  readonly item = input<GalleryItem>();

}
