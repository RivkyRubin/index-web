import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullScreenImageComponent } from './full-screen-image.component';

describe('FullScreenImageComponent', () => {
  let component: FullScreenImageComponent;
  let fixture: ComponentFixture<FullScreenImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullScreenImageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullScreenImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
