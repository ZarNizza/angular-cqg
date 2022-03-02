import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiboComponent } from './fibo.component';

describe('FiboComponent', () => {
  let component: FiboComponent;
  let fixture: ComponentFixture<FiboComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiboComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
