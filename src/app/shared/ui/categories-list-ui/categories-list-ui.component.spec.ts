import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesListUiComponent } from './categories-list-ui.component';

describe('CategoriesListUiComponent', () => {
  let component: CategoriesListUiComponent;
  let fixture: ComponentFixture<CategoriesListUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesListUiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesListUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
