import { Component, inject, input, signal } from '@angular/core';
import { NgStyle } from '@angular/common';
import { BPost } from '../../models/b-post.model';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-b-post',
  imports: [NgStyle],
  templateUrl: './b-post.component.html',
  styleUrl: './b-post.component.scss'
})
export class BPostComponent {
  private router = inject(Router);
  readonly b = input<BPost>();
  readonly imagesUrl = signal<string>(environment.imagesUrl);
  navigateToB(id:number)
  {
this.router.navigate(['/b',id]);
  }
}
