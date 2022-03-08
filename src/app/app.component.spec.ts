import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture!: ComponentFixture<AppComponent>;
  const app = fixture.componentInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should create the AG Grid table', () => {
    const aga = app.agGridAngular;
    expect(aga).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.toolbar #title')?.textContent).toEqual(
      'CQG-Angular'
    );
  });

  it('should render AG Grid table and it has header with cell label Name', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(
      compiled.querySelector('.ag-header-cell-label')?.textContent
    ).toContain('Name');
  });
});
