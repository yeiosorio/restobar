import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { StatisticsComponent } from './statistics.component';
import { ImageService } from '../../core/services/image.service';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { PrimeNgModule } from '../../shared/primeng.module';

describe('StatisticsComponent', () => {
  let component: StatisticsComponent;
  let fixture: ComponentFixture<StatisticsComponent>;
  let imageService: jasmine.SpyObj<ImageService>;
  let messageService: jasmine.SpyObj<MessageService>;

  const mockImages = [
    {
      id: '1',
      fileName: 'test1.png',
      url: 'http://test1.png',
      uploadDate: '2024-02-20T10:00:00',
      userName: 'Test User',
      originalName: 'test1.jpg'
    }
  ];

  const mockHourlyData = new Array(24).fill(0).map((_, i) => i % 2);

  beforeEach(async () => {
    const imageSpy = jasmine.createSpyObj('ImageService', ['getImagesByDateRange', 'getImagesPerHour']);
    const messageSpy = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        FormsModule,
        PrimeNgModule,
        StatisticsComponent
      ],
      providers: [
        { provide: ImageService, useValue: imageSpy },
        { provide: MessageService, useValue: messageSpy }
      ]
    }).compileComponents();

    imageService = TestBed.inject(ImageService) as jasmine.SpyObj<ImageService>;
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize chart data on ngOnInit', () => {
    component.ngOnInit();
    expect(component.chartData).toBeDefined();
    expect(component.chartData.labels.length).toBe(24);
    expect(component.chartData.datasets[0].data.length).toBe(24);
  });

  it('should load images and statistics when date range is selected', fakeAsync(() => {
    // Mock service responses
    imageService.getImagesByDateRange.and.returnValue(of(mockImages));
    imageService.getImagesPerHour.and.returnValue(of(mockHourlyData));

    // Set date range
    const startDate = new Date('2024-02-20');
    const endDate = new Date('2024-02-21');
    component.dateRange = [startDate, endDate];

    // Trigger date selection
    component.onDateSelect({});
    tick();

    // Verify service calls
    expect(imageService.getImagesByDateRange).toHaveBeenCalled();
    expect(imageService.getImagesPerHour).toHaveBeenCalled();

    // Verify data is loaded
    expect(component.images.length).toBe(1);
    expect(component.chartData.datasets[0].data).toEqual(mockHourlyData);
  }));

  it('should show error message when image loading fails', fakeAsync(() => {
    // Mock service error
    imageService.getImagesByDateRange.and.returnValue(throwError(() => new Error('Test error')));
    imageService.getImagesPerHour.and.returnValue(of(mockHourlyData));

    // Set date range and trigger selection
    component.dateRange = [new Date(), new Date()];
    component.onDateSelect({});
    tick();

    // Verify error handling
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Error al obtener las imágenes'
    });
  }));

  it('should adjust date range to include full days', () => {
    const startDate = new Date('2024-02-20T10:30:00');
    const endDate = new Date('2024-02-21T15:45:00');
    component.dateRange = [startDate, endDate];

    const [adjustedStart, adjustedEnd] = component['getAdjustedDateRange']();

    expect(adjustedStart.getHours()).toBe(0);
    expect(adjustedStart.getMinutes()).toBe(0);
    expect(adjustedEnd.getHours()).toBe(23);
    expect(adjustedEnd.getMinutes()).toBe(59);
  });
}); 