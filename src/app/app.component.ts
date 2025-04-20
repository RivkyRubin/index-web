import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from './core/footer/footer.component';
import { NavbarComponent } from './core/navbar/navbar.component';
import {GoogleTagManagerService} from 'angular-google-tag-manager'
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule,NavbarComponent,FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'רמה ד';
  isMobile=signal<boolean>(false);
  router = inject(Router);
  gtmService=inject(GoogleTagManagerService)
  constructor( ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.gtmService.pushTag({
          event: 'pageView',
          pagePath: event.urlAfterRedirects
        });
      }
    });
  }
}
