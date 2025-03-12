import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, resource, signal, Signal } from '@angular/core';
import { Category } from '../../shared/models/category.model';
import { BPost } from '../../shared/models/b-post.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  categories = signal<Category[]>([]);
  bs = signal<BPost[]>([]);

  http=inject(HttpClient);
  private jsonUrl = 'data/';
  constructor() {
    this.loadCategories();
    this.loadBs();
  
  }

  private async loadCategories() {
    try {
      const response = await fetch(environment.filesUrl+'data/categories.json');
      const data = await response.json();
      this.categories.set(data); // Store the categories in a signal
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  private async loadBs() {
    try {
      const response = await fetch(environment.filesUrl+'data/bs.json');
      const data = await response.json();
      this.bs.set(data); // Store the categories in a signal
    } catch (error) {
      console.error('Error loading bs:', error);
    }
  }

  getBById(id: number): Signal<BPost | undefined> {
    return computed(() => this.bs().find(b => b.id === id));
  }
  
  getCategoryById(id: number): Signal<Category | undefined> {
    return computed(() => this.categories().find(c => c.id === id));
  }

}