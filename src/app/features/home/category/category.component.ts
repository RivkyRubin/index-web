import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../services/data/data.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-category',
  imports: [NgIf],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent {
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);

  // Signal for category ID from route params
  categoryId = computed(() => Number(this.route.snapshot.paramMap.get('id')));

  category = computed(() =>
    this.dataService.categories().find((c) => c.id === this.categoryId()) || null
  );
}
