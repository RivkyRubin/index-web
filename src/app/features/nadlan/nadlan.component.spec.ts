import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NadlanComponent } from './nadlan.component';

describe('NadlanComponent', () => {
  let component: NadlanComponent;
  let fixture: ComponentFixture<NadlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NadlanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NadlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
