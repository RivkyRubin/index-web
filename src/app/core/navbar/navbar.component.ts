import { NgClass } from '@angular/common';
import { Component, computed, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink,RouterLinkActive,NgClass],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  router = inject(Router);
  isHomePage = signal(false);
  sharedService=inject(SharedService);  
  @ViewChild('navbarNav', { static: false }) navbarNav!: ElementRef;
  @ViewChild('navbarToggler') navbarToggler!: ElementRef;
  
  constructor() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isHomePage.set(this.router.url === '/'||this.router.url === '/soon'||this.router.url==='/home');
      }
    });
  }

  isMobile=computed(()=>this.sharedService.isMobile());
  
  onMenuItemClicked() 
  {
if(this.sharedService.isMobile())
{
  //const navbar = this.navbarNav.nativeElement;
  // if (navbar.classList.contains('show')) {
  //   navbar.classList.remove('show');
  // }
  this.navbarToggler.nativeElement.click();
}
  }
  
}
