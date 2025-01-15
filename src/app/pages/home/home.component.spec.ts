import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { ImageService } from '../../core/services/image.service';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PrimeNgModule } from '../../shared/primeng.module';
import { FileUpload } from 'primeng/fileupload';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let imageService: jasmine.SpyObj<ImageService>;
  let messageService: jasmine.SpyObj<MessageService>;

  const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
  const mockUploadResponse = {
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

  beforeEach(async () => {
    const imageSpy = jasmine.createSpyObj('ImageService', ['uploadImage']);
    const messageSpy = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        PrimeNgModule,
        HomeComponent
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
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle file selection', () => {
    const event = {
      files: [mockFile]
    };

    component.onFileSelect(event);
    expect(component.selectedFile).toBe(mockFile);
  });

  it('should upload image successfully', fakeAsync(() => {
    // Setup
    imageService.uploadImage.and.returnValue(of(mockUploadResponse));
    component.selectedFile = mockFile;

    // Execute
    component.uploadImage();
    tick();

    // Verify
    expect(imageService.uploadImage).toHaveBeenCalledWith(mockFile, 'Usuario');
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Imagen subida correctamente'
    });
    expect(component.selectedFile).toBeNull();
    expect(component.uploading).toBeFalse();
  }));

  it('should handle upload error', fakeAsync(() => {
    // Setup
    imageService.uploadImage.and.returnValue(throwError(() => new Error('Upload failed')));
    component.selectedFile = mockFile;

    // Execute
    component.uploadImage();
    tick();

    // Verify
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Error al subir la imagen'
    });
    expect(component.uploading).toBeFalse();
  }));

  it('should not upload if no file is selected', () => {
    // Setup
    component.selectedFile = null;

    // Execute
    component.uploadImage();

    // Verify
    expect(imageService.uploadImage).not.toHaveBeenCalled();
  });

  it('should clear file selection', () => {
    // Setup
    const mockFileUpload = {
      clear: jasmine.createSpy('clear')
    } as unknown as FileUpload;
    component.selectedFile = mockFile;

    // Execute
    component.clearSelection(mockFileUpload);

    // Verify
    expect(component.selectedFile).toBeNull();
    expect(mockFileUpload.clear).toHaveBeenCalled();
  });
}); 