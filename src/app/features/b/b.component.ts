import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data/data.service';
import { NgStyle } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-b',
  imports: [NgStyle],
  templateUrl: './b.component.html',
  styleUrl: './b.component.scss'
})
export class BComponent {
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);
  readonly imagesUrl = signal<string>(environment.imagesUrl);

  // Signal for category ID from route params
  bId = computed(() => Number(this.route.snapshot.paramMap.get('id')));

  b = computed(
    () =>
      this.dataService.bs().find((c) => c.id === this.bId()) ||
      null
  );
}
