import { Component, inject, input, signal } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { BPost } from '../../models/b-post.model';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-b-post',
  imports: [NgStyle, NgClass],
  templateUrl: './b-post.component.html',
  styleUrl: './b-post.component.scss',
})
export class BPostComponent {
  private router = inject(Router);
  private sharedService = inject(SharedService);
  readonly b = input<BPost>();
  readonly imagesUrl = signal<string>(environment.imagesUrl);
  navigateToB(id: number) {
    this.router.navigate(['/b', id]);
  }

  get getLogo(): string {
    if (this.b()) return this.sharedService.getLogo(this.b()!);
    return '';
  }

  get getImage(): string {
    if (this.b()) return this.sharedService.getImage(this.b()!);
    return '';
  }
}
