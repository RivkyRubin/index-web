import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, resource, signal, Signal } from '@angular/core';
import { Category } from '../../shared/models/category.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  categories = signal<Category[]>([]);

  http=inject(HttpClient);
  private jsonUrl = 'data/';
  constructor() {
    this.loadCategories();
  }

  private async loadCategories() {
    try {
      const response = await fetch('data/categories.json');
      const data = await response.json();
      this.categories.set(data); // Store the categories in a signal
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

}