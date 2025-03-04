import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BPostComponent } from './b-post.component';

describe('BPostComponent', () => {
  let component: BPostComponent;
  let fixture: ComponentFixture<BPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BPostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
