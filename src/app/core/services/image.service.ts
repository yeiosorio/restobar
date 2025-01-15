import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ImageData, ImageResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = `${environment.apiUrl}/api/images`;

  constructor(private http: HttpClient) {}

  uploadImage(file: File, userName: string): Observable<ImageResponse> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('userName', userName);

    return this.http.post<ImageResponse>(`${this.apiUrl}/upload`, formData);
  }

  getImagesByDateRange(startDate: Date, endDate: Date): Observable<ImageData[]> {
    return this.http.get<ImageData[]>(`${this.apiUrl}/by-date-range`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
  }

  getImagesPerHour(startDate: Date, endDate: Date): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/stats/hourly`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
  }
} 