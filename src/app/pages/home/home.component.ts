import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../../shared/primeng.module';
import { ImageService } from '../../core/services/image.service';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PrimeNgModule],
  providers: [MessageService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  selectedFile: File | null = null;
  uploading = false;

  constructor(
    private imageService: ImageService,
    private messageService: MessageService
  ) {}

  onFileSelect(event: any) {
    if (event.files && event.files.length > 0) {
      this.selectedFile = event.files[0];
    }
  }

  uploadImage() {
    if (!this.selectedFile) return;

    this.uploading = true;
    this.imageService.uploadImage(this.selectedFile, 'Usuario').subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Imagen subida correctamente'
        });
        this.selectedFile = null;
        this.uploading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al subir la imagen'
        });
        console.error('Error:', error);
        this.uploading = false;
      }
    });
  }

  clearSelection(fileUpload: FileUpload) {
    this.selectedFile = null;
    fileUpload.clear();
  }
} 