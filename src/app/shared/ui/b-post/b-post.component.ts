import { Component, input } from '@angular/core';
import { NgStyle } from '@angular/common';
import { BPost } from '../../models/b-post.model';

@Component({
  selector: 'app-b-post',
  imports: [NgStyle],
  templateUrl: './b-post.component.html',
  styleUrl: './b-post.component.scss'
})
export class BPostComponent {
  readonly b = input<BPost>();


}
