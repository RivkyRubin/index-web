import { NgClass, NgFor, NgStyle } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { input } from '@angular/core';
import { Category, PositionedCategory } from '../../models/category.model';
import { Router } from '@angular/router';



@Component({
  selector: 'app-categories-box',
  templateUrl: './categories-box.component.html',
  styleUrls: ['./categories-box.component.scss'],
  imports:[NgFor,NgClass,NgStyle]
})
export class CategoriesBoxComponent { 
  
  private router = inject(Router);

  readonly categories = input<Category[]>();
  positionedCategories: PositionedCategory[] = [];

  constructor() {
    // React to changes in categories
    effect(() => {
      if (this.categories()) {
        this.positionCategories();
      }
    });
  }

  positionCategories() {
    if (!this.categories()) return; // Ensure data is available

    const placedPositions: { left: number; top: number; size: number }[] = [];
    const maxAttempts = 10; // Limit retries for placement
if(this.categories())
    this.positionedCategories = this.categories()!.map(category => {
      let attempts = 0;
      let position;

      do {
        position = this.getRandomPosition(category.size || 1);
        attempts++;
      } while (this.checkOverlap(position, category.size || 1, placedPositions) && attempts < maxAttempts);

      placedPositions.push({ ...position, size: category.size || 1 });

      return {
        ...category,
        left: position.left,
        top: position.top
      };
    });
  }

  getRandomPosition(size: number) {
    const maxLeft = 80 - size * 5; // Adjust based on size
    const maxTop = 80 - size * 5;
    return {
      left: Math.random() * maxLeft,
      top: Math.random() * maxTop
    };
  }

  checkOverlap(position: { left: number; top: number }, size: number, placedPositions: { left: number; top: number; size: number }[]) {
    const buffer = 5; // Extra space to avoid close placements
    return placedPositions.some(existing =>
      Math.abs(existing.left - position.left) < size * buffer &&
      Math.abs(existing.top - position.top) < size * buffer
    );
  }
  
  navigateToCategory(id:number)
  {
this.router.navigate(['/category',id]);
  }
}