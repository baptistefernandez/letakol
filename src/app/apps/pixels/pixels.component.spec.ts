import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PixelsComponent } from './pixels.component';

describe('PixelsComponent', () => {
  let component: PixelsComponent;
  let fixture: ComponentFixture<PixelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PixelsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PixelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
