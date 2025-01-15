import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ImageService } from './image.service';
import { environment } from '../../../environments/environment';
import { ImageData, ImageResponse } from '../models';

describe('ImageService', () => {
  let service: ImageService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/images`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ImageService]
    });
    service = TestBed.inject(ImageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should upload image', () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const mockResponse: ImageResponse = {
      message: 'Imagen procesada y guardada exitosamente',
      data: {
        id: '1',
        fileName: 'test.png',
        url: 'http://test.png',
        uploadDate: '2024-02-20T10:00:00',
        userName: 'Test User',
        originalName: 'test.jpg'
      }
    };

    service.uploadImage(mockFile, 'Test User').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/upload`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should get images by date range', () => {
    const startDate = new Date('2024-02-20');
    const endDate = new Date('2024-02-21');
    const mockImages: ImageData[] = [{
      id: '1',
      fileName: 'test.png',
      url: 'http://test.png',
      uploadDate: '2024-02-20T10:00:00',
      userName: 'Test User',
      originalName: 'test.jpg'
    }];

    service.getImagesByDateRange(startDate, endDate).subscribe(images => {
      expect(images).toEqual(mockImages);
    });

    const req = httpMock.expectOne(request => 
      request.url === `${apiUrl}/by-date-range` &&
      request.method === 'GET' &&
      request.params.get('startDate') === startDate.toISOString() &&
      request.params.get('endDate') === endDate.toISOString()
    );
    req.flush(mockImages);
  });

  it('should get images per hour', () => {
    const startDate = new Date('2024-02-20');
    const endDate = new Date('2024-02-21');
    const mockHourlyData = new Array(24).fill(0).map((_, i) => i % 2);

    service.getImagesPerHour(startDate, endDate).subscribe(data => {
      expect(data).toEqual(mockHourlyData);
    });

    const req = httpMock.expectOne(request => 
      request.url === `${apiUrl}/stats/hourly` &&
      request.method === 'GET' &&
      request.params.get('startDate') === startDate.toISOString() &&
      request.params.get('endDate') === endDate.toISOString()
    );
    req.flush(mockHourlyData);
  });
}); 