import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimeNgModule } from '../../shared/primeng.module';
import { ImageService } from '../../core/services/image.service';
import { MessageService } from 'primeng/api';
import { ImageData, ChartData, ChartOptions } from '../../core/models';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimeNgModule],
  providers: [MessageService],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  images: ImageData[] = [];
  chartData!: ChartData;
  chartOptions!: ChartOptions;
  dateRange: Date[] = [];
  loading: boolean = false;

  constructor(
    private imageService: ImageService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.initChartData();
  }

  onDateSelect(event: any) {
    if (this.dateRange.length === 2) {
      this.loading = true;
      const [startDate, endDate] = this.getAdjustedDateRange();
      
      // Obtener imágenes
      this.imageService.getImagesByDateRange(startDate, endDate).subscribe({
        next: (images) => {
          this.images = images.map(img => ({
            ...img,
            uploadDate: new Date(img.uploadDate).toLocaleString()
          }));
          this.loading = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al obtener las imágenes'
          });
          console.error('Error:', error);
          this.loading = false;
        }
      });

      // Obtener estadísticas
      this.imageService.getImagesPerHour(startDate, endDate).subscribe({
        next: (hourlyData) => {
          this.updateChartData(hourlyData);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al obtener las estadísticas'
          });
          console.error('Error:', error);
        }
      });
    }
  }

  private getAdjustedDateRange(): [Date, Date] {
    const [start, end] = this.dateRange;
    
    // Establecer inicio del día (00:00:00) para la fecha inicial
    const startDate = new Date(start);
    startDate.setHours(0, 0, 0, 0);
    
    // Establecer fin del día (23:59:59) para la fecha final
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);
    
    return [startDate, endDate];
  }

  private initChartData() {
    const hours = Array.from({length: 24}, (_, i) => `${i.toString().padStart(2, '0')}:00`);
    
    this.chartData = {
      labels: hours,
      datasets: [
        {
          label: 'Imágenes Procesadas',
          data: new Array(24).fill(0),
          backgroundColor: '#42A5F5'
        }
      ]
    };

    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        }
      }
    };
  }

  private updateChartData(hourlyData: number[]) {
    this.chartData = {
      ...this.chartData,
      datasets: [
        {
          ...this.chartData.datasets[0],
          data: hourlyData
        }
      ]
    };
  }
} 