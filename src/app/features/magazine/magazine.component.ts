import { Component, computed, effect, inject, input, signal, ViewChild } from '@angular/core';
import { FlipbookComponent } from '../../shared/ui/flipbook/flipbook.component';
import { MagazineItem } from '../../shared/models/magazine-item.model';
import { DataService } from '../../services/data/data.service';
import { NgFor, NgIf } from '@angular/common';
import { SharedService } from '../../services/shared.service';
import { BPost } from '../../shared/models/b-post.model';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { environment } from '../../../environments/environment';
import { RouterLink } from '@angular/router';
import { BPostComponent } from '../../shared/ui/b-post/b-post.component';

interface MarkerInfo extends google.maps.MarkerOptions {
  business: BPost;
  position: google.maps.LatLngLiteral;
}

@Component({
  selector: 'app-magazine',
  standalone: true,
  imports: [NgIf, NgFor, GoogleMap, MapMarker, MapInfoWindow,RouterLink,BPostComponent],
  templateUrl: './magazine.component.html',
  styleUrl: './magazine.component.scss'
})
export class MagazineComponent {
  @ViewChild(GoogleMap) map!: GoogleMap;
  @ViewChild(MapInfoWindow) mapInfoWindow!: MapInfoWindow;
  
  dataService = inject(DataService);
  sharedService = inject(SharedService);

  apiLoaded = signal<boolean>(false);
  markers = signal<MarkerInfo[]>([]);
  center = signal<google.maps.LatLngLiteral>({lat: 0, lng: 0});
  zoom = signal<number>(10);
  selectedBusiness = signal<BPost | null>(null);
  
  options: google.maps.MapOptions = {
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    zoomControl: true,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [
          { visibility: 'off' }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'labels',
        stylers: [
          { visibility: 'off' }
        ]
      }
    ]
  };

  bs = computed(() => {
    return this.dataService.bs();
  });

  constructor() {
    // Load Maps API when component initializes
    this.loadApi().then(() => {
      this.apiLoaded.set(true);
      this.setupMarkers();
    });

    // Create an effect to update markers when businesses change
    effect(() => {
      const businesses = this.bs();
      if (businesses.length > 0 && this.apiLoaded()) {
        this.setupMarkers();
      }
    });
  }

  setupMarkers() {
    if (!window.google || !window.google.maps) return;
    
    const geocoder = new google.maps.Geocoder();
    const tempMarkers: MarkerInfo[] = [];
    let processedCount = 0;
    
    // Process each business
    this.bs().forEach(business => {
      if (business.address) {
        geocoder.geocode({ address: business.address+' בית שמש' }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const position = {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng()
            };
            
            // Create marker with custom icon if the business has a logo
            const marker: MarkerInfo = {
              position,
              business,
              icon: this.createMarkerIcon(business)
            };
            
            tempMarkers.push(marker);
            
            // Set center to first business location
            if (tempMarkers.length === 1) {
              this.center.set(position);
            }
          }
          
          // Check if all businesses have been processed
          processedCount++;
          if (processedCount === this.bs().length) {
            this.markers.set(tempMarkers);
            this.adjustMapView();
          }
        });
      } else {
        processedCount++;
      }
    });
  }
  
  createMarkerIcon(business: BPost): google.maps.Icon | null {
    if (business.hasLogo) {
      const logoUrl = this.getLogo(business);
      return {
        url: logoUrl,
        scaledSize: new google.maps.Size(90, 30), // Width: 90px, Height: 30px
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(45, 15) // Center anchor point (half of width, half of height)
        };
    }
    return null; // Will use default marker
  }
  
  adjustMapView() {
    if (this.markers().length === 0) return;
    
    if (this.markers().length === 1) {
      this.center.set(this.markers()[0].position);
      this.zoom.set(15);
      return;
    }
    
    // Create bounds that include all markers
    const bounds = new google.maps.LatLngBounds();
    this.markers().forEach(marker => {
      bounds.extend(marker.position);
    });
    
    // Fit map to show all markers
    if (this.map && this.map.googleMap) {
      this.map.googleMap.fitBounds(bounds);
      // Adjust zoom if too zoomed in
      const listener = google.maps.event.addListener(this.map.googleMap, 'idle', () => {
        if (this.map.googleMap && this.map!.googleMap!.getZoom()! > 16) {
          this.map.googleMap.setZoom(16);
        }
        google.maps.event.removeListener(listener);
      });
    }
  }
  
  openInfoWindow(marker: MapMarker, business: BPost) {
    this.selectedBusiness.set(business);
    this.mapInfoWindow.open(marker);
  }

  getLogo(b: BPost): string {
    return this.sharedService.getLogo(b);
  }

  getImage(b: BPost): string {
    return this.sharedService.getImage(b);
  }

  getBigImage(b: BPost): string {
    return this.sharedService.getBigImage(b);
  }

  private readonly API_URL = 'https://maps.googleapis.com/maps/api/js';
  private promise: Promise<void> | null = null;

  loadApi(): Promise<void> {
    if (this.promise) {
      return this.promise;
    }

    this.promise = new Promise<void>((resolve) => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `${this.API_URL}?key=${environment.googleMapsApiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        resolve();
      };
      document.body.appendChild(script);
    });

    return this.promise;
  }
}