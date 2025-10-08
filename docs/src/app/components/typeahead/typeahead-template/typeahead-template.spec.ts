import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeaheadTemplate } from './typeahead-template';

describe('TypeaheadTemplate', () => {
  let component: TypeaheadTemplate;
  let fixture: ComponentFixture<TypeaheadTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeaheadTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeaheadTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
